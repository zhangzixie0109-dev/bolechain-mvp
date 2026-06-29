-- ============================================================
-- BoleChain MVP Schema + RLS + Seed Data
-- ============================================================

-- 1. users 表（扩展 auth.users）
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  role TEXT NOT NULL CHECK (role IN ('student', 'parent', 'counselor')),
  linked_student_id TEXT,
  invite_code TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. schools 表
CREATE TABLE IF NOT EXISTS public.schools (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  region TEXT NOT NULL,
  requirements JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. applications 表
CREATE TABLE IF NOT EXISTS public.applications (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL,
  target_school_id TEXT REFERENCES public.schools(id),
  status TEXT NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. credentials 表
CREATE TABLE IF NOT EXISTS public.credentials (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL,
  doc_type TEXT NOT NULL,
  doc_hash TEXT,
  issuer_did TEXT,
  anchored_tx_placeholder TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- RLS Policies
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credentials ENABLE ROW LEVEL SECURITY;

-- users: 用户只能读写自己的记录
CREATE POLICY "Users can read own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- schools: 所有已认证用户可读
CREATE POLICY "Authenticated users can read schools"
  ON public.schools FOR SELECT
  TO authenticated
  USING (true);

-- applications: student 只能读写自己的
CREATE POLICY "Students can read own applications"
  ON public.applications FOR SELECT
  USING (student_id = auth.uid()::text);

CREATE POLICY "Students can insert own applications"
  ON public.applications FOR INSERT
  WITH CHECK (student_id = auth.uid()::text);

CREATE POLICY "Students can update own applications"
  ON public.applications FOR UPDATE
  USING (student_id = auth.uid()::text);

-- applications: parent 通过 linked_student_id 只读
CREATE POLICY "Parents can read linked student applications"
  ON public.applications FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
        AND users.role = 'parent'
        AND users.linked_student_id = applications.student_id
    )
  );

-- credentials: student 只能读写自己的
CREATE POLICY "Students can read own credentials"
  ON public.credentials FOR SELECT
  USING (student_id = auth.uid()::text);

CREATE POLICY "Students can insert own credentials"
  ON public.credentials FOR INSERT
  WITH CHECK (student_id = auth.uid()::text);

CREATE POLICY "Students can update own credentials"
  ON public.credentials FOR UPDATE
  USING (student_id = auth.uid()::text);

-- credentials: parent 通过 linked_student_id 只读
CREATE POLICY "Parents can read linked student credentials"
  ON public.credentials FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
        AND users.role = 'parent'
        AND users.linked_student_id = credentials.student_id
    )
  );

-- credentials: counselor 只能写 issuer_did = self 的
CREATE POLICY "Counselors can insert credentials they issue"
  ON public.credentials FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
        AND users.role = 'counselor'
    )
    AND issuer_did = auth.uid()::text
  );

CREATE POLICY "Counselors can update credentials they issued"
  ON public.credentials FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
        AND users.role = 'counselor'
    )
    AND issuer_did = auth.uid()::text
  );

-- ============================================================
-- Seed Data: 3 schools
-- ============================================================

INSERT INTO public.schools (id, name, region, requirements) VALUES
(
  '1719000000001',
  '香港大学 (HKU)',
  '香港',
  '{
    "dse": {
      "minimum_score": "33/35 (Best 5)",
      "core_subjects": ["中文 4+", "英文 5+", "数学 4+", "通识 4+"],
      "elective_preference": ["物理", "化学", "经济"]
    },
    "alevel": {
      "minimum": "AAA-A*A*A",
      "preferred_subjects": ["Mathematics", "Further Maths", "Sciences"]
    },
    "interview": {
      "format": "小组面试 + 个人面试",
      "language": "英文为主",
      "duration": "20-30分钟",
      "focus": ["批判性思维", "沟通能力", "学科热情"]
    },
    "admission_preference": ["学术成绩优异", "课外活动丰富", "领导力经验", "社会服务"]
  }'::jsonb
),
(
  '1719000000002',
  '香港中文大学 (CUHK)',
  '香港',
  '{
    "dse": {
      "minimum_score": "30/35 (Best 5)",
      "core_subjects": ["中文 4+", "英文 4+", "数学 4+", "通识 3+"],
      "elective_preference": ["生物", "化学", "历史"]
    },
    "alevel": {
      "minimum": "AAB-AAA",
      "preferred_subjects": ["Sciences", "Humanities"]
    },
    "interview": {
      "format": "个人面试",
      "language": "粤语/普通话/英文",
      "duration": "15-20分钟",
      "focus": ["学术兴趣", "个人发展规划", "社会关怀"]
    },
    "admission_preference": ["学术潜力", "全人发展", "书院文化契合"]
  }'::jsonb
),
(
  '1719000000003',
  '新加坡国立大学 (NUS)',
  '新加坡',
  '{
    "alevel": {
      "minimum": "AAA-A*A*A*",
      "preferred_subjects": ["Mathematics", "Sciences", "Economics"]
    },
    "dse": {
      "minimum_score": "34/35 (Best 5)",
      "core_subjects": ["英文 5*+", "数学 5*+"],
      "note": "DSE 申请者需额外提供 SAT/AP 成绩"
    },
    "interview": {
      "format": "线上面试 + 笔试（部分专业）",
      "language": "英文",
      "duration": "30分钟",
      "focus": ["分析能力", "跨文化适应力", "职业规划"]
    },
    "admission_preference": ["顶尖学术成绩", "国际竞赛获奖", "研究经历", "创业/创新项目"]
  }'::jsonb
);
