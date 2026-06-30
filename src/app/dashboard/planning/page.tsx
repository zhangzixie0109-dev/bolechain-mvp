"use client";

import { useState, useEffect } from "react";
import { getUser } from "@/lib/auth";
import { getCredentials, type CredentialRecord, docTypeConfig } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Brain, Plus, Trash2, Sparkles, Package } from "lucide-react";

interface SubjectScore { subject: string; score: string; }
interface CompetitionEntry { name: string; level: string; year: string; }
interface InternshipEntry { company: string; role: string; duration: string; }
interface RecommendationEntry { name: string; identity: string; email: string; }

export default function PlanningPage() {
  const user = getUser();
  const [credentials, setCredentials] = useState<CredentialRecord[]>([]);
  const [subjects, setSubjects] = useState<SubjectScore[]>([{ subject: "", score: "" }]);
  const [languageScore, setLanguageScore] = useState("");
  const [languageExtra, setLanguageExtra] = useState("");
  // Optional sections
  const [showCompetition, setShowCompetition] = useState(false);
  const [showInternship, setShowInternship] = useState(false);
  const [showRecommendation, setShowRecommendation] = useState(false);
  const [showPS, setShowPS] = useState(false);
  const [competitions, setCompetitions] = useState<CompetitionEntry[]>([{ name: "", level: "", year: "" }]);
  const [internships, setInternships] = useState<InternshipEntry[]>([{ company: "", role: "", duration: "" }]);
  const [recommendations, setRecommendations] = useState<RecommendationEntry[]>([{ name: "", identity: "", email: "" }]);
  const [psTitle, setPsTitle] = useState("");
  const [psKeywords, setPsKeywords] = useState("");
  // Gaokao specific
  const [gaokaoScores, setGaokaoScores] = useState({ chinese: "", math: "", english: "", comprehensive: "", total: "" });

  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) setCredentials(getCredentials().filter(c => c.student_email === user.email));
  }, []);

  const curriculum = user?.curriculum || "other";
  const degreeLevel = user?.degreeLevel || "undergrad";
  const isGrad = degreeLevel === "grad" || degreeLevel === "phd";

  const addSubject = () => setSubjects([...subjects, { subject: "", score: "" }]);
  const removeSubject = (i: number) => setSubjects(subjects.filter((_, idx) => idx !== i));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 2000));
    setShowResult(true);
    setLoading(false);
  };

  // Generate mock plan based on degree level
  const generatePlan = () => {
    const credNames = credentials.map(c => c.file_name);
    const credRef = credNames.length > 0 ? `基于你已上链的${credNames.length}份材料（${credNames.slice(0, 3).join("、")}${credNames.length > 3 ? "等" : ""}），` : "";

    if (isGrad) {
      return [
        { title: "大一/大二 — 基础积累期", items: [`${credRef}建议保持GPA 3.5+，重点关注核心专业课`, "选修1-2门研究方法论课程", "加入教授实验室，开始接触科研", "参加学术研讨会，建立学术网络", "暑假申请 Research Attachment（港大/NUS）"] },
        { title: "大三 — 科研深入期", items: ["GPA冲刺3.7+，核心课程争取A/A+", "确定研究方向，争取发表1篇会议论文", "开始联系目标导师（建议9月前发第一封邮件）", "准备GRE/GMAT（如需）", "实习：争取一段与研究方向相关的实习经历"] },
        { title: "大四上 — 申请冲刺期", items: ["9月：完成Research Proposal初稿", "10月：确认推荐人（2-3位），提供推荐素材", "11月：提交港校申请（港大/港科大 deadline）", "12月：NUS/NTU申请提交", "所有学术材料通过BoleChain上链认证", "准备面试（学术presentation + Q&A）"] },
        { title: "大四下 — 决策期", items: ["1-3月：面试季，准备学术报告", "4月：Offer对比，确认导师和方向", "5-6月：签证、住宿、奖学金申请", "完成毕业论文，保持GPA不下滑"] },
      ];
    }
    return [
      { title: "G9（高一）— 基础夯实期", items: [`${credRef}建议确保核心科目成绩优异`, "GPA目标：保持3.8+ / A等级以上", "语言准备：开始IELTS基础训练，目标词汇量6000+", "竞赛规划：报名AMC 10/BPA商赛/FBLA", "课外活动：加入学生会/辩论社，积累领导力", "暑假：参加港大/NUS线上学术夏校"] },
      { title: "G10（高二）— 能力提升期", items: ["增加高阶课程（AP/IB HL/A2）", "首次IELTS模考目标6.5+；SAT开始备考", "竞赛冲刺：AMC 12 + AIME / 学科奥赛", "启动研究项目或创业项目", "累计100+小时社区服务", "暑假：实习或research attachment", ...(credentials.some(c => c.doc_type === "competition") ? ["你的竞赛证书是很好的加分项，建议在此基础上冲刺更高级别"] : [])] },
      { title: "G11（高三上）— 申请准备期", items: ["标化成绩：IELTS 7.0+ / TOEFL 100+ / SAT 1500+", "9月：个人陈述初稿", "10月：确认推荐人并提供素材", "所有成绩单、获奖证书通过BoleChain上链认证", "11月：港大Early Admission提交", "12月-1月：NUS/NTU申请提交", "每周1-2次模拟面试训练"] },
      { title: "G12（高三下）— 冲刺决策期", items: ["1-3月：跟进申请状态，补充材料", "2-3月：CUHK/HKUST面试季", "4月：确认firm choice", "5月：办理学生签证、申请宿舍", "6-7月：参加orientation", "导出完整BoleChain可验证学术档案"] },
    ];
  };

  const getScoreLabel = () => {
    switch (curriculum) {
      case "DSE": return "等级（1-5**）";
      case "A-Level": return "等级（A*-E）";
      case "IB": return "分数（1-7）";
      case "AP": return "分数（1-5）";
      default: return "分数";
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1 flex items-center gap-2">
            <Brain className="w-6 h-6 text-blue-600" /> AI 升学规划引擎
          </h1>
          <p className="text-slate-500 text-sm">填写学术背景，AI为您生成个性化升学路径</p>
        </div>
        {user?.did && <code className="text-xs bg-slate-100 px-2 py-1 rounded font-mono hidden sm:block">{user.did.slice(0, 20)}...</code>}
      </div>

      {/* Linked credentials */}
      {credentials.length > 0 && (
        <Card className="mb-4 border-green-200 bg-green-50/50">
          <CardContent className="p-4">
            <p className="text-sm font-medium text-green-800 flex items-center gap-1 mb-2"><Package className="w-4 h-4" /> 你已上链的材料（{credentials.length}份）</p>
            <div className="flex flex-wrap gap-2">
              {credentials.map(c => <Badge key={c.id} className={docTypeConfig[c.doc_type]?.color || "bg-slate-100 text-slate-800"} variant="secondary">{c.file_name}</Badge>)}
            </div>
          </CardContent>
        </Card>
      )}

      {!showResult && (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Block 1: Core Grades */}
          <Card>
            <CardHeader><CardTitle className="text-base">核心成绩（必填）</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4 text-sm text-slate-500">
                <span>学历阶段：<Badge variant="outline">{isGrad ? (degreeLevel === "phd" ? "博士" : "研究生") : "本科"}</Badge></span>
                {!isGrad && curriculum && <span>课程体系：<Badge variant="outline">{curriculum}</Badge></span>}
              </div>

              {/* Gaokao specific */}
              {curriculum === "gaokao" && !isGrad && (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                  {(["chinese", "math", "english", "comprehensive", "total"] as const).map(k => (
                    <div key={k}>
                      <Label className="text-xs">{({ chinese: "语文", math: "数学", english: "英语", comprehensive: "综合", total: "总分" })[k]}</Label>
                      <Input type="number" value={gaokaoScores[k]} onChange={e => setGaokaoScores({ ...gaokaoScores, [k]: e.target.value })} placeholder="分数" className="mt-1" />
                    </div>
                  ))}
                </div>
              )}

              {/* Other curricula */}
              {curriculum !== "gaokao" && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>科目成绩</Label>
                    <Button type="button" variant="outline" size="sm" onClick={addSubject} className="gap-1"><Plus className="w-3 h-3" /> 添加</Button>
                  </div>
                  {subjects.map((item, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <Input placeholder="科目" value={item.subject} onChange={e => { const u = [...subjects]; u[i].subject = e.target.value; setSubjects(u); }} className="flex-1" />
                      <Input placeholder={getScoreLabel()} value={item.score} onChange={e => { const u = [...subjects]; u[i].score = e.target.value; setSubjects(u); }} className="w-28" />
                      {subjects.length > 1 && <Button type="button" variant="ghost" size="sm" onClick={() => removeSubject(i)}><Trash2 className="w-4 h-4 text-red-500" /></Button>}
                    </div>
                  ))}
                  {curriculum === "IB" && (
                    <div className="flex gap-2">
                      <Input placeholder="EE 分数" className="w-32" />
                      <Input placeholder="TOK 分数" className="w-32" />
                    </div>
                  )}
                </div>
              )}

              {/* Language scores */}
              <div className="space-y-2 pt-2 border-t">
                <Label>{curriculum === "gaokao" ? "高考英语分数（必填）" : curriculum === "DSE" ? "DSE English 等级（必填）" : "IELTS 分数（必填）"}</Label>
                <Input placeholder={curriculum === "gaokao" ? "如：135" : curriculum === "DSE" ? "如：5*" : "如：7.0"} value={languageScore} onChange={e => setLanguageScore(e.target.value)} />
                <Label className="text-xs text-slate-500">{curriculum === "gaokao" || curriculum === "DSE" ? "IELTS/TOEFL（选填）" : "TOEFL（选填）"}</Label>
                <Input placeholder="选填" value={languageExtra} onChange={e => setLanguageExtra(e.target.value)} />
              </div>
            </CardContent>
          </Card>

          {/* Block 2: Optional materials */}
          <Card>
            <CardHeader><CardTitle className="text-base">附加材料（选填，让你的申请更有竞争力）</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {!showCompetition && <Button type="button" variant="outline" size="sm" onClick={() => setShowCompetition(true)} className="gap-1"><Plus className="w-3 h-3" />竞赛证书</Button>}
                {!showInternship && <Button type="button" variant="outline" size="sm" onClick={() => setShowInternship(true)} className="gap-1"><Plus className="w-3 h-3" />实习证明</Button>}
                {!showRecommendation && <Button type="button" variant="outline" size="sm" onClick={() => setShowRecommendation(true)} className="gap-1"><Plus className="w-3 h-3" />推荐信</Button>}
                {!showPS && <Button type="button" variant="outline" size="sm" onClick={() => setShowPS(true)} className="gap-1"><Plus className="w-3 h-3" />个人陈述</Button>}
              </div>

              {showCompetition && (
                <div className="border rounded-lg p-3 space-y-2">
                  <Label className="text-sm font-medium">竞赛证书</Label>
                  {competitions.map((c, i) => (
                    <div key={i} className="flex gap-2">
                      <Input placeholder="竞赛名称" value={c.name} onChange={e => { const u = [...competitions]; u[i].name = e.target.value; setCompetitions(u); }} />
                      <Input placeholder="获奖等级" value={c.level} onChange={e => { const u = [...competitions]; u[i].level = e.target.value; setCompetitions(u); }} className="w-28" />
                      <Input placeholder="年份" value={c.year} onChange={e => { const u = [...competitions]; u[i].year = e.target.value; setCompetitions(u); }} className="w-20" />
                    </div>
                  ))}
                  <Button type="button" variant="ghost" size="sm" onClick={() => setCompetitions([...competitions, { name: "", level: "", year: "" }])}>+ 添加更多</Button>
                </div>
              )}

              {showInternship && (
                <div className="border rounded-lg p-3 space-y-2">
                  <Label className="text-sm font-medium">实习证明</Label>
                  {internships.map((c, i) => (
                    <div key={i} className="flex gap-2">
                      <Input placeholder="公司名称" value={c.company} onChange={e => { const u = [...internships]; u[i].company = e.target.value; setInternships(u); }} />
                      <Input placeholder="岗位" value={c.role} onChange={e => { const u = [...internships]; u[i].role = e.target.value; setInternships(u); }} className="w-28" />
                      <Input placeholder="时长" value={c.duration} onChange={e => { const u = [...internships]; u[i].duration = e.target.value; setInternships(u); }} className="w-24" />
                    </div>
                  ))}
                  <Button type="button" variant="ghost" size="sm" onClick={() => setInternships([...internships, { company: "", role: "", duration: "" }])}>+ 添加更多</Button>
                </div>
              )}

              {showRecommendation && (
                <div className="border rounded-lg p-3 space-y-2">
                  <Label className="text-sm font-medium">推荐信</Label>
                  {recommendations.map((c, i) => (
                    <div key={i} className="flex gap-2">
                      <Input placeholder="推荐人姓名" value={c.name} onChange={e => { const u = [...recommendations]; u[i].name = e.target.value; setRecommendations(u); }} />
                      <Input placeholder="身份" value={c.identity} onChange={e => { const u = [...recommendations]; u[i].identity = e.target.value; setRecommendations(u); }} className="w-28" />
                      <Input placeholder="邮箱" value={c.email} onChange={e => { const u = [...recommendations]; u[i].email = e.target.value; setRecommendations(u); }} />
                    </div>
                  ))}
                </div>
              )}

              {showPS && (
                <div className="border rounded-lg p-3 space-y-2">
                  <Label className="text-sm font-medium">个人陈述</Label>
                  <Input placeholder="标题" value={psTitle} onChange={e => setPsTitle(e.target.value)} />
                  <Input placeholder="核心主题关键词（逗号分隔）" value={psKeywords} onChange={e => setPsKeywords(e.target.value)} />
                </div>
              )}
            </CardContent>
          </Card>

          <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 gap-2">
            <Sparkles className="w-4 h-4" /> {loading ? "AI 分析中..." : "生成升学规划"}
          </Button>
        </form>
      )}

      {/* Result */}
      {showResult && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2"><Sparkles className="w-5 h-5 text-blue-600" /> 个性化升学路径</h2>
            <Button variant="outline" size="sm" onClick={() => setShowResult(false)}>重新规划</Button>
          </div>
          {generatePlan().map((section, i) => (
            <Card key={i} className="border-l-4 border-l-blue-500">
              <CardHeader className="pb-2"><CardTitle className="text-base">{section.title}</CardTitle></CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {section.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-slate-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />{item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
