"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUser, type UserProfile } from "@/lib/auth";
import { getCredentials, programs, docTypeConfig, type CredentialRecord } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, Clock, FileCheck, AlertCircle, BookOpen, Briefcase, Target } from "lucide-react";

const deadlines = [
  { school: "港大", date: new Date(new Date().getFullYear() + 1, 0, 15), label: "港大申请截止" },
  { school: "NUS", date: new Date(new Date().getFullYear() + 1, 1, 28), label: "NUS申请截止" },
  { school: "NTU", date: new Date(new Date().getFullYear() + 1, 0, 31), label: "NTU申请截止" },
];

export default function ParentPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [childCreds, setChildCreds] = useState<CredentialRecord[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const profile = getUser();
    if (!profile) { router.push("/register"); return; }
    if (profile.role !== "parent") { router.push("/dashboard"); return; }
    setUser(profile);
    const all = getCredentials();
    const filtered = profile.linkedChildEmail ? all.filter(c => c.student_email === profile.linkedChildEmail) : all;
    setChildCreds(filtered.length > 0 ? filtered : all);
  }, [router]);

  if (!mounted || !user) return <div className="min-h-screen flex items-center justify-center"><p className="text-slate-500">加载中...</p></div>;

  const now = new Date();
  const daysTo = (d: Date) => Math.max(0, Math.ceil((d.getTime() - now.getTime()) / (1000*60*60*24)));

  // Default to HKU Finance program for insights
  const program = programs[0];
  const childCurriculum = "alevel"; // default display

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-1 flex items-center gap-2"><Users className="w-6 h-6 text-green-600" /> 家长面板</h1>
          <p className="text-slate-500 text-sm">查看孩子的升学材料和申请进度（只读）</p>
        </div>

        {/* Child Info + Countdowns */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Users className="w-4 h-4 text-blue-600" /> 绑定学生</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm font-medium">{user.linkedChildEmail || "student@example.com"}</p>
            </CardContent>
          </Card>
          {deadlines.map((dl, i) => (
            <Card key={i} className="border-amber-200 bg-amber-50/50">
              <CardHeader className="pb-1"><CardTitle className="text-sm flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-amber-600" /> {dl.label}</CardTitle></CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-amber-700">{daysTo(dl.date)} 天</p>
                <p className="text-xs text-slate-500">{dl.date.toISOString().slice(0,10)}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Credentials List */}
        <Card className="mb-6">
          <CardHeader><CardTitle className="text-lg flex items-center gap-2"><FileCheck className="w-5 h-5 text-green-600" /> 孩子的认证材料</CardTitle></CardHeader>
          <CardContent>
            {childCreds.length === 0 ? (
              <div className="text-center py-8"><AlertCircle className="w-10 h-10 text-slate-300 mx-auto mb-3" /><p className="text-slate-400">暂无已认证材料</p></div>
            ) : (
              <Table>
                <TableHeader><TableRow><TableHead>文件名</TableHead><TableHead>类型</TableHead><TableHead>状态</TableHead><TableHead className="hidden md:table-cell">时间</TableHead></TableRow></TableHeader>
                <TableBody>
                  {childCreds.map(c => (
                    <TableRow key={c.id}>
                      <TableCell className="text-sm">{c.file_name}</TableCell>
                      <TableCell><Badge className={docTypeConfig[c.doc_type]?.color || "bg-slate-100"}>{docTypeConfig[c.doc_type]?.label || c.doc_type}</Badge></TableCell>
                      <TableCell><Badge className="bg-green-100 text-green-800">已认证</Badge></TableCell>
                      <TableCell className="hidden md:table-cell text-sm text-slate-500">{new Date(c.uploaded_at).toLocaleDateString("zh-CN")}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Program Insights */}
        <Card className="mb-6">
          <CardHeader><CardTitle className="text-lg">专业洞察：{program.school} · {program.program}</CardTitle></CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3"><BookOpen className="w-4 h-4 text-blue-600" /><h4 className="font-medium text-sm">这个专业学什么</h4></div>
                <ul className="space-y-1">{program.coreCourses.map((c,i) => <li key={i} className="text-sm text-slate-600 flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-blue-400" />{c}</li>)}</ul>
              </div>
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3"><Briefcase className="w-4 h-4 text-green-600" /><h4 className="font-medium text-sm">未来就业方向</h4></div>
                <ul className="space-y-1">{program.careers.map((c,i) => <li key={i} className="text-sm text-slate-600 flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-green-400" />{c}</li>)}</ul>
                <p className="text-xs text-slate-500 mt-2 border-t pt-2">薪资范围：{program.salaryRange}</p>
              </div>
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3"><Target className="w-4 h-4 text-amber-600" /><h4 className="font-medium text-sm">申请需要什么</h4></div>
                <div className="space-y-1">
                  {Object.entries(program.requirements).map(([k,v]) => (
                    <div key={k} className={`text-sm ${k === childCurriculum ? "text-amber-800 font-medium bg-amber-50 px-2 py-1 rounded" : "text-slate-600"}`}>
                      <span className="uppercase text-xs font-mono">{k}:</span> {v}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="p-3 bg-slate-100 rounded-lg border"><p className="text-xs text-slate-500 text-center">家长面板为只读模式</p></div>
        <div className="text-center mt-4"><button onClick={() => router.push("/dashboard")} className="text-slate-500 hover:text-slate-700 text-sm">← 返回仪表盘</button></div>
      </div>
    </div>
  );
}
