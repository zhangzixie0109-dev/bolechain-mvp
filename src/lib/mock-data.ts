// ============================================================
// Programs Data (hardcoded constant)
// ============================================================
export interface ProgramInfo {
  id: string;
  school: string;
  program: string;
  coreCourses: string[];
  careers: string[];
  salaryRange: string;
  requirements: Record<string, string>;
}

export const programs: ProgramInfo[] = [
  {
    id: "hku-finance",
    school: "香港大学",
    program: "金融学",
    coreCourses: ["投资学", "公司金融", "衍生品定价", "金融计量", "风险管理"],
    careers: ["投行分析师", "PE/VC投资经理", "管理咨询", "资产管理", "金融科技"],
    salaryRange: "HK$25,000-80,000/月",
    requirements: {
      dse: "5科5**",
      alevel: "3A* + IELTS 7.0",
      ib: "42+ (HL数学7)",
      ap: "5门5分 + SAT 1550+",
      gaokao: "全省前0.1% + 英语135+",
    },
  },
  {
    id: "nus-cs",
    school: "新加坡国立大学",
    program: "计算机科学",
    coreCourses: ["算法与数据结构", "人工智能", "系统架构", "计算机网络", "软件工程"],
    careers: ["科技公司工程师", "量化交易开发", "AI研究员", "产品经理", "技术创业"],
    salaryRange: "SGD 5,000-15,000/月",
    requirements: {
      alevel: "4A* + IELTS 7.5",
      ib: "43+ (HL数学7 + HL物理7)",
      ap: "5门5分 + SAT 1500+",
      gaokao: "全省前0.05% + 数学145+",
    },
  },
  {
    id: "hkust-ee",
    school: "香港科技大学",
    program: "电子工程",
    coreCourses: ["电路设计", "信号处理", "嵌入式系统", "通信原理", "VLSI设计"],
    careers: ["芯片设计工程师", "通信工程师", "硬件架构师", "物联网开发", "自动驾驶"],
    salaryRange: "HK$22,000-65,000/月",
    requirements: {
      dse: "物理5* + 化学5* + 数学5**",
      alevel: "3A* (含物理数学) + IELTS 6.5",
      ib: "38+ (HL物理+数学)",
      ap: "物理C+微积分BC 5分",
    },
  },
  {
    id: "ntu-qf",
    school: "南洋理工大学",
    program: "量化金融",
    coreCourses: ["随机过程", "C++金融编程", "风险管理", "金融工程", "机器学习在金融中的应用"],
    careers: ["对冲基金量化分析师", "高频交易开发", "风控建模", "金融衍生品交易", "Fintech"],
    salaryRange: "SGD 6,000-20,000/月",
    requirements: {
      alevel: "4A* (含数学+进阶数学) + IELTS 7.5",
      ib: "44+ (HL数学7)",
      ap: "5门5分 (含微积分BC+统计)",
      gaokao: "全省前0.1% + 数学148+",
    },
  },
];

// ============================================================
// Credential Interface
// ============================================================
export interface CredentialRecord {
  id: string;
  file_name: string;
  doc_type: "transcript" | "competition" | "internship" | "recommendation" | "ps" | "language" | "other";
  doc_hash: string;
  issuer_did: string;
  uploaded_at: string;
  status: string;
  student_email: string;
  ocr_data?: {
    gpa: string;
    courses: { name: string; grade: string }[];
  };
}

const CREDENTIALS_KEY = "bolechain_credentials";

export function getCredentials(): CredentialRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CREDENTIALS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCredentials(creds: CredentialRecord[]) {
  localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(creds));
}

export function addCredential(cred: CredentialRecord): void {
  const list = getCredentials();
  list.push(cred);
  saveCredentials(list);
}

// ============================================================
// Doc type labels and colors
// ============================================================
export const docTypeConfig: Record<string, { label: string; color: string }> = {
  transcript: { label: "成绩单", color: "bg-blue-100 text-blue-800" },
  competition: { label: "竞赛证书", color: "bg-amber-100 text-amber-800" },
  internship: { label: "实习证明", color: "bg-green-100 text-green-800" },
  recommendation: { label: "推荐信", color: "bg-purple-100 text-purple-800" },
  ps: { label: "个人陈述", color: "bg-pink-100 text-pink-800" },
  language: { label: "语言成绩", color: "bg-orange-100 text-orange-800" },
  other: { label: "其他", color: "bg-slate-100 text-slate-800" },
};

// ============================================================
// SHA-256 hash utility
// ============================================================
export async function computeSHA256(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}
