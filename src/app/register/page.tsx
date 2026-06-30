"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { login, generateDid, type Role, type DegreeLevel, type Curriculum } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { GraduationCap, Users } from "lucide-react";

const roleConfig: Record<Role, { icon: typeof GraduationCap; title: string; titleEn: string; description: string }> = {
  student: { icon: GraduationCap, title: "学生", titleEn: "Student", description: "申请港澳/新加坡院校" },
  parent: { icon: Users, title: "家长", titleEn: "Parent", description: "关注孩子升学进度" },
};

function RegisterContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  // Student fields
  const [degreeLevel, setDegreeLevel] = useState<DegreeLevel | "">("");
  const [curriculum, setCurriculum] = useState<Curriculum | "">("");
  const [targetGrade, setTargetGrade] = useState("");
  const [university, setUniversity] = useState("");

  // Parent fields
  const [linkedChildEmail, setLinkedChildEmail] = useState("");

  useEffect(() => {
    const role = searchParams.get("role") as Role | null;
    if (role && roleConfig[role]) setSelectedRole(role);
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole || !email) { toast.error("请填写必要信息"); return; }

    if (selectedRole === "student" && !degreeLevel) { toast.error("请选择学历阶段"); return; }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));

    login({
      email,
      role: selectedRole,
      degreeLevel: selectedRole === "student" ? (degreeLevel as DegreeLevel) : undefined,
      curriculum: selectedRole === "student" && degreeLevel === "undergrad" ? (curriculum as Curriculum) : undefined,
      targetGrade: selectedRole === "student" ? targetGrade : undefined,
      university: selectedRole === "student" && degreeLevel !== "undergrad" ? university : undefined,
      did: generateDid(),
      linkedChildEmail: selectedRole === "parent" ? linkedChildEmail : undefined,
    });

    toast.success("登录成功！");
    setLoading(false);
    router.push(selectedRole === "parent" ? "/parent" : "/dashboard");
  };

  const pageTitle = selectedRole ? `${roleConfig[selectedRole].title}登录` : "进入 BoleChain";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">{pageTitle}</h1>
          <p className="text-blue-200">选择您的角色开始使用</p>
        </div>

        {/* Role Selection */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {(Object.keys(roleConfig) as Role[]).map((role) => {
            const config = roleConfig[role];
            const Icon = config.icon;
            return (
              <button key={role} type="button" onClick={() => setSelectedRole(role)}
                className={`p-4 rounded-xl border-2 transition-all ${selectedRole === role ? "border-amber-400 bg-white/10 scale-105" : "border-white/20 bg-white/5 hover:border-white/40"}`}>
                <Icon className={`w-8 h-8 mx-auto mb-2 ${selectedRole === role ? "text-amber-400" : "text-white/70"}`} />
                <p className="text-white text-sm font-medium">{config.title}</p>
                <p className="text-white/50 text-xs">{config.titleEn}</p>
              </button>
            );
          })}
        </div>

        {/* Form */}
        <Card className="bg-white/10 border-white/20 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-white">{selectedRole ? `${roleConfig[selectedRole].title}快速登录` : "快速登录"}</CardTitle>
            <CardDescription className="text-blue-200">
              {selectedRole && <Badge variant="secondary" className="mt-1">{roleConfig[selectedRole].title}</Badge>}
              <span className="block mt-2 text-xs">演示版本：输入邮箱即可体验</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-white">邮箱</Label>
                <Input type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="bg-white/10 border-white/30 text-white placeholder:text-white/40" />
              </div>

              {/* Student fields */}
              {selectedRole === "student" && (
                <>
                  <div className="space-y-2">
                    <Label className="text-white">学历阶段</Label>
                    <select value={degreeLevel} onChange={(e) => setDegreeLevel(e.target.value as DegreeLevel)} className="w-full rounded-md border border-white/30 bg-white/10 text-white px-3 py-2 text-sm">
                      <option value="" className="text-slate-900">选择...</option>
                      <option value="undergrad" className="text-slate-900">本科申请</option>
                      <option value="grad" className="text-slate-900">研究生申请</option>
                      <option value="phd" className="text-slate-900">博士申请</option>
                    </select>
                  </div>

                  {degreeLevel === "undergrad" && (
                    <>
                      <div className="space-y-2">
                        <Label className="text-white">当前年级</Label>
                        <select value={targetGrade} onChange={(e) => setTargetGrade(e.target.value)} className="w-full rounded-md border border-white/30 bg-white/10 text-white px-3 py-2 text-sm">
                          <option value="" className="text-slate-900">选择...</option>
                          <option value="G9" className="text-slate-900">G9（高一）</option>
                          <option value="G10" className="text-slate-900">G10（高二）</option>
                          <option value="G11" className="text-slate-900">G11（高三）</option>
                          <option value="G12" className="text-slate-900">G12（高四/Gap）</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-white">课程体系</Label>
                        <select value={curriculum} onChange={(e) => setCurriculum(e.target.value as Curriculum)} className="w-full rounded-md border border-white/30 bg-white/10 text-white px-3 py-2 text-sm">
                          <option value="" className="text-slate-900">选择...</option>
                          <option value="DSE" className="text-slate-900">DSE</option>
                          <option value="A-Level" className="text-slate-900">A-Level</option>
                          <option value="IB" className="text-slate-900">IB</option>
                          <option value="AP" className="text-slate-900">AP</option>
                          <option value="gaokao" className="text-slate-900">高考</option>
                          <option value="other" className="text-slate-900">其他</option>
                        </select>
                      </div>
                    </>
                  )}

                  {(degreeLevel === "grad" || degreeLevel === "phd") && (
                    <>
                      <div className="space-y-2">
                        <Label className="text-white">当前年级</Label>
                        <select value={targetGrade} onChange={(e) => setTargetGrade(e.target.value)} className="w-full rounded-md border border-white/30 bg-white/10 text-white px-3 py-2 text-sm">
                          <option value="" className="text-slate-900">选择...</option>
                          <option value="Y1" className="text-slate-900">大一</option>
                          <option value="Y2" className="text-slate-900">大二</option>
                          <option value="Y3" className="text-slate-900">大三</option>
                          <option value="Y4" className="text-slate-900">大四</option>
                          <option value="graduated" className="text-slate-900">已毕业</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-white">就读院校</Label>
                        <Input placeholder="如：北京大学" value={university} onChange={(e) => setUniversity(e.target.value)} className="bg-white/10 border-white/30 text-white placeholder:text-white/40" />
                      </div>
                    </>
                  )}
                </>
              )}

              {/* Parent fields */}
              {selectedRole === "parent" && (
                <div className="space-y-2">
                  <Label className="text-white">绑定孩子邮箱</Label>
                  <Input type="email" placeholder="孩子的注册邮箱" value={linkedChildEmail} onChange={(e) => setLinkedChildEmail(e.target.value)} className="bg-white/10 border-white/30 text-white placeholder:text-white/40" />
                  <p className="text-xs text-blue-300">填写孩子注册时使用的邮箱以绑定</p>
                </div>
              )}

              <Button type="submit" disabled={loading || !selectedRole} className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold">
                {loading ? "处理中..." : "进入系统"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center mt-4">
          <button type="button" onClick={() => router.push("/")} className="text-white/60 hover:text-white text-sm">← 返回首页</button>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center"><p className="text-white">加载中...</p></div>}>
      <RegisterContent />
    </Suspense>
  );
}
