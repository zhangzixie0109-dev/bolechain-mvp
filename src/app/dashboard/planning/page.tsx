"use client";

import { useState } from "react";
import { getUser } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Brain, Plus, Trash2, Sparkles } from "lucide-react";

const TARGET_SCHOOLS = [
  "香港大学 (HKU)",
  "香港中文大学 (CUHK)",
  "香港科技大学 (HKUST)",
  "香港理工大学 (PolyU)",
  "香港城市大学 (CityU)",
  "香港浸会大学 (HKBU)",
  "岭南大学 (LU)",
  "香港教育大学 (EdUHK)",
  "香港都会大学 (HKMU)",
  "新加坡国立大学 (NUS)",
  "南洋理工大学 (NTU)",
];

interface SubjectScore {
  subject: string;
  score: string;
}

const mockThreeYearPlan = {
  G9: {
    title: "高一（G9）— 基础夯实期",
    items: [
      "选课建议：确保数学、英语、物理/化学为核心科目，选修经济学或商业",
      "GPA 目标：保持 3.8+ / A 等级以上",
      "语言准备：开始 IELTS/TOEFL 基础训练，目标词汇量 6000+",
      "竞赛规划：报名 AMC 10（数学）、BPA（商业）或 FBLA 商赛",
      "课外活动：加入学生会/辩论社，开始积累领导力经历",
      "暑假任务：参加一个学术夏校（推荐港大/NUS 线上项目）",
    ],
  },
  G10: {
    title: "高二（G10）— 能力提升期",
    items: [
      "选课建议：增加 AP/IB HL 科目（推荐 AP Calculus + AP Economics）",
      "标化考试：首次 IELTS 模考，目标 6.5+；SAT 开始备考",
      "竞赛冲刺：AMC 12 + AIME 冲刺；参加 NUS 数学奥赛或 HKMO",
      "科研/项目：启动一个小型研究项目或创业项目（与目标专业相关）",
      "社区服务：累计 100+ 小时志愿服务",
      "暑假任务：实习或深度学术项目（推荐与港校教授联系 research attachment）",
      "推荐信：开始与 2-3 位老师建立深度关系",
    ],
  },
  G11: {
    title: "高三上（G11）— 申请准备期",
    items: [
      "标化成绩：IELTS 7.0+ / TOEFL 100+；SAT 1500+（如需）",
      "文书撰写：9月开始个人陈述（PS）初稿，10月完成修改",
      "推荐信：10月前确认推荐人并提供素材",
      "材料认证：所有成绩单、获奖证书通过 BoleChain 上链认证",
      "港大 Early Admission：11月提交（注意面试准备）",
      "NUS/NTU 申请：12月-1月提交，准备 ABA 面试",
      "面试训练：每周 1-2 次模拟面试（英文 + 粤语）",
    ],
  },
  G12: {
    title: "高三下（G12）— 冲刺决策期",
    items: [
      "跟进申请状态：1-3月等待 offer，及时补充材料",
      "CUHK/HKUST 面试：2-3月集中面试季",
      "Offer 对比决策：4月前确认 firm choice",
      "签证与住宿：5月开始办理学生签证、申请宿舍",
      "行前准备：6-7月参加 orientation、了解选课系统",
      "BoleChain 档案：导出完整的可验证学术档案",
    ],
  },
};

export default function PlanningPage() {
  const [grade, setGrade] = useState("");
  const [subjects, setSubjects] = useState<SubjectScore[]>([{ subject: "", score: "" }]);
  const [selectedSchools, setSelectedSchools] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);

  const user = getUser();
  const mockDid = `did:key:z6Mk${(user?.email || "demo").replace(/[^a-zA-Z0-9]/g, "").slice(0, 8)}...`;

  const addSubject = () => {
    setSubjects([...subjects, { subject: "", score: "" }]);
  };

  const removeSubject = (index: number) => {
    setSubjects(subjects.filter((_, i) => i !== index));
  };

  const updateSubject = (index: number, field: "subject" | "score", value: string) => {
    const updated = [...subjects];
    updated[index][field] = value;
    setSubjects(updated);
  };

  const toggleSchool = (school: string) => {
    setSelectedSchools((prev) =>
      prev.includes(school) ? prev.filter((s) => s !== school) : [...prev, school]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!grade) return;
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setShowResult(true);
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1 flex items-center gap-2">
            <Brain className="w-6 h-6 text-blue-600" />
            AI 升学规划引擎
          </h1>
          <p className="text-slate-500 text-sm">
            填写您的学术背景，AI 为您生成个性化三年升学路径
          </p>
        </div>
        <div className="text-right hidden sm:block">
          <p className="text-xs text-slate-400">您的 DID</p>
          <code className="text-xs bg-slate-100 px-2 py-1 rounded font-mono">{mockDid}</code>
        </div>
      </div>

      {/* Form */}
      {!showResult && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">填写学术背景</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Grade */}
              <div className="space-y-2">
                <Label>当前年级</Label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                  required
                >
                  <option value="">选择年级...</option>
                  <option value="G9">G9（高一）</option>
                  <option value="G10">G10（高二）</option>
                  <option value="G11">G11（高三）</option>
                </select>
              </div>

              {/* Subjects */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>各科成绩</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addSubject} className="gap-1">
                    <Plus className="w-3 h-3" /> 添加科目
                  </Button>
                </div>
                <div className="space-y-2">
                  {subjects.map((item, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <Input
                        placeholder="科目名称"
                        value={item.subject}
                        onChange={(e) => updateSubject(index, "subject", e.target.value)}
                        className="flex-1"
                      />
                      <Input
                        placeholder="分数"
                        type="number"
                        value={item.score}
                        onChange={(e) => updateSubject(index, "score", e.target.value)}
                        className="w-24"
                      />
                      {subjects.length > 1 && (
                        <Button type="button" variant="ghost" size="sm" onClick={() => removeSubject(index)}>
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Target Schools */}
              <div className="space-y-2">
                <Label>目标院校（可多选）</Label>
                <div className="flex flex-wrap gap-2">
                  {TARGET_SCHOOLS.map((school) => (
                    <button
                      key={school}
                      type="button"
                      onClick={() => toggleSchool(school)}
                      className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${
                        selectedSchools.includes(school)
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-slate-600 border-slate-200 hover:border-blue-300"
                      }`}
                    >
                      {school}
                    </button>
                  ))}
                </div>
              </div>

              <Button type="submit" disabled={loading || !grade} className="w-full bg-blue-600 hover:bg-blue-700 gap-2">
                <Sparkles className="w-4 h-4" />
                {loading ? "AI 分析中..." : "生成三年升学规划"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {loading && (
        <div className="text-center py-8">
          <p className="text-slate-500 animate-pulse">正在分析您的学术背景，匹配目标院校要求...</p>
        </div>
      )}

      {/* Result: Three Year Plan */}
      {showResult && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              您的个性化三年升学路径
            </h2>
            <Button variant="outline" size="sm" onClick={() => setShowResult(false)}>
              重新规划
            </Button>
          </div>

          {selectedSchools.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="text-sm text-slate-500">目标院校：</span>
              {selectedSchools.map((s) => (
                <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
              ))}
            </div>
          )}

          {Object.entries(mockThreeYearPlan).map(([key, section]) => (
            <Card key={key} className="border-l-4 border-l-blue-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{section.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {section.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                      {item}
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
