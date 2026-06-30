export interface School {
  id: string;
  name: string;
  region: string;
  requirements: {
    dse: {
      minimum_score: string;
      core_subjects: string[];
      elective_preference?: string[];
      note?: string;
    };
    alevel: {
      minimum: string;
      preferred_subjects: string[];
    };
    interview: {
      format: string;
      language: string;
      duration: string;
      focus: string[];
    };
    admission_preference: string[];
  };
}

export interface Credential {
  id: string;
  studentId: string;
  docType: string;
  docHash: string;
  issuerDid: string;
  anchoredTxPlaceholder: string;
  status: "pending" | "verified" | "rejected";
  uploadedAt: string;
}

export interface Application {
  id: string;
  studentId: string;
  targetSchoolId: string;
  status: "draft" | "submitted" | "reviewing" | "accepted" | "rejected";
  createdAt: string;
}

// ============================================================
// Hard-coded schools data
// ============================================================
export const schools: School[] = [
  {
    id: "1719000000001",
    name: "香港大学 (HKU)",
    region: "香港",
    requirements: {
      dse: {
        minimum_score: "33/35 (Best 5)",
        core_subjects: ["中文 4+", "英文 5+", "数学 4+", "通识 4+"],
        elective_preference: ["物理", "化学", "经济"],
      },
      alevel: {
        minimum: "AAA-A*A*A",
        preferred_subjects: ["Mathematics", "Further Maths", "Sciences"],
      },
      interview: {
        format: "小组面试 + 个人面试",
        language: "英文为主",
        duration: "20-30分钟",
        focus: ["批判性思维", "沟通能力", "学科热情"],
      },
      admission_preference: ["学术成绩优异", "课外活动丰富", "领导力经验", "社会服务"],
    },
  },
  {
    id: "1719000000002",
    name: "香港中文大学 (CUHK)",
    region: "香港",
    requirements: {
      dse: {
        minimum_score: "30/35 (Best 5)",
        core_subjects: ["中文 4+", "英文 4+", "数学 4+", "通识 3+"],
        elective_preference: ["生物", "化学", "历史"],
      },
      alevel: {
        minimum: "AAB-AAA",
        preferred_subjects: ["Sciences", "Humanities"],
      },
      interview: {
        format: "个人面试",
        language: "粤语/普通话/英文",
        duration: "15-20分钟",
        focus: ["学术兴趣", "个人发展规划", "社会关怀"],
      },
      admission_preference: ["学术潜力", "全人发展", "书院文化契合"],
    },
  },
  {
    id: "1719000000003",
    name: "新加坡国立大学 (NUS)",
    region: "新加坡",
    requirements: {
      dse: {
        minimum_score: "34/35 (Best 5)",
        core_subjects: ["英文 5*+", "数学 5*+"],
        note: "DSE 申请者需额外提供 SAT/AP 成绩",
      },
      alevel: {
        minimum: "AAA-A*A*A*",
        preferred_subjects: ["Mathematics", "Sciences", "Economics"],
      },
      interview: {
        format: "线上面试 + 笔试（部分专业）",
        language: "英文",
        duration: "30分钟",
        focus: ["分析能力", "跨文化适应力", "职业规划"],
      },
      admission_preference: ["顶尖学术成绩", "国际竞赛获奖", "研究经历", "创业/创新项目"],
    },
  },
];

// ============================================================
// localStorage-based credentials store
// ============================================================
const CREDENTIALS_KEY = "bolechain_credentials";
const APPLICATIONS_KEY = "bolechain_applications";

export function getCredentials(): Credential[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(CREDENTIALS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function addCredential(cred: Credential): void {
  const list = getCredentials();
  list.push(cred);
  localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(list));
}

export function getApplications(): Application[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(APPLICATIONS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function addApplication(app: Application): void {
  const list = getApplications();
  list.push(app);
  localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(list));
}

// ============================================================
// Mock AI planning output
// ============================================================
export const mockAIPlanningResult = {
  summary: "基于您的学术背景和目标，我们为您推荐以下升学路径：",
  recommendations: [
    {
      school: "香港大学 (HKU)",
      program: "工商管理学士",
      matchScore: 85,
      reason: "您的 DSE 预估成绩 (Best 5: 32) 接近 HKU 商学院要求，且您有丰富的商业竞赛经历。建议加强英文口语准备面试。",
    },
    {
      school: "香港中文大学 (CUHK)",
      program: "环球商业学",
      matchScore: 78,
      reason: "CUHK 重视全人发展，您的社区服务经历是加分项。书院制度适合希望获得 mentorship 的学生。",
    },
    {
      school: "新加坡国立大学 (NUS)",
      program: "Business Analytics",
      matchScore: 72,
      reason: "NUS 对数学能力要求高，建议补充 SAT Math 成绩。您的编程背景在 BA 专业申请中具有竞争力。",
    },
  ],
  timeline: [
    { month: "2026年7月", task: "完成个人陈述初稿" },
    { month: "2026年8月", task: "准备推荐信（2封）" },
    { month: "2026年9月", task: "提交 HKU Early Admission" },
    { month: "2026年10月", task: "NUS 申请开放，提交材料" },
    { month: "2026年11月", task: "CUHK 面试准备" },
    { month: "2026年12月", task: "模拟面试训练" },
  ],
};
