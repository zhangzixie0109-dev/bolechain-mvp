"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUser, type UserProfile } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, FileCheck, Briefcase, Eye } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const profile = getUser();
    if (!profile) { router.push("/register"); return; }
    setUser(profile);
  }, [router]);

  if (!mounted || !user) return <div className="flex items-center justify-center h-64"><p className="text-slate-500">加载中...</p></div>;

  const roleLabels: Record<string, string> = { student: "学生", parent: "家长" };
  const dashboardConfig: Record<string, { title: string; description: string }> = {
    student: { title: "学生工作台", description: "管理您的升学规划、材料认证和求职档案" },
    parent: { title: "家长概览", description: "查看孩子的升学进度和材料认证状态" },
  };
  const config = dashboardConfig[user.role] || dashboardConfig.student;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">{config.title}</h1>
        <p className="text-slate-600 mb-1">{config.description}</p>
        <p className="text-slate-500 text-sm">
          您好，{user.email}
          <Badge className="ml-2" variant="secondary">{roleLabels[user.role] || user.role}</Badge>
          {user.curriculum && <Badge className="ml-2" variant="outline">{user.curriculum}</Badge>}
        </p>
        {user.did && <p className="text-xs text-slate-400 mt-1 font-mono">{user.did}</p>}
      </div>

      {/* Student Dashboard */}
      {user.role === "student" && (
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="border-dashed border-2 border-slate-200 hover:border-blue-300 transition-colors cursor-pointer" onClick={() => router.push("/dashboard/planning")}>
            <CardHeader><div className="p-3 rounded-lg bg-blue-50 w-fit"><Brain className="w-6 h-6 text-blue-600" /></div><CardTitle className="text-lg">AI 升学规划</CardTitle></CardHeader>
            <CardContent><p className="text-slate-500 text-sm mb-3">智能分析您的背景，匹配最优院校和申请策略</p><Badge variant="outline" className="text-blue-600 border-blue-200">点击体验</Badge></CardContent>
          </Card>
          <Card className="border-dashed border-2 border-slate-200 hover:border-amber-300 transition-colors cursor-pointer" onClick={() => router.push("/dashboard/credentials")}>
            <CardHeader><div className="p-3 rounded-lg bg-amber-50 w-fit"><FileCheck className="w-6 h-6 text-amber-600" /></div><CardTitle className="text-lg">材料库</CardTitle></CardHeader>
            <CardContent><p className="text-slate-500 text-sm mb-3">上传材料，区块链认证，一键生成可验证凭证</p><Badge variant="outline" className="text-amber-600 border-amber-200">点击体验</Badge></CardContent>
          </Card>
          <Card className="border-dashed border-2 border-slate-200 hover:border-green-300 transition-colors cursor-pointer" onClick={() => router.push("/dashboard/portfolio")}>
            <CardHeader><div className="p-3 rounded-lg bg-green-50 w-fit"><Briefcase className="w-6 h-6 text-green-600" /></div><CardTitle className="text-lg">求职档案</CardTitle></CardHeader>
            <CardContent><p className="text-slate-500 text-sm mb-3">构建可信求职档案，区块链背书的职业履历</p><Badge variant="outline" className="text-green-600 border-green-200">即将上线</Badge></CardContent>
          </Card>
        </div>
      )}

      {/* Parent Dashboard */}
      {user.role === "parent" && (
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-2 border-green-100 hover:border-green-300 transition-colors cursor-pointer" onClick={() => router.push("/parent")}>
            <CardHeader><div className="p-3 rounded-lg bg-green-50 w-fit"><Eye className="w-6 h-6 text-green-600" /></div><CardTitle className="text-lg">家长面板</CardTitle></CardHeader>
            <CardContent><p className="text-slate-500 text-sm mb-3">查看孩子材料、专业洞察和申请倒计时</p><Badge variant="outline" className="text-green-600 border-green-200">进入查看</Badge></CardContent>
          </Card>
          <Card className="border-2 border-blue-100 hover:border-blue-300 transition-colors cursor-pointer" onClick={() => router.push("/dashboard/planning")}>
            <CardHeader><div className="p-3 rounded-lg bg-blue-50 w-fit"><Brain className="w-6 h-6 text-blue-600" /></div><CardTitle className="text-lg">升学规划进度</CardTitle></CardHeader>
            <CardContent><p className="text-slate-500 text-sm mb-3">了解孩子的升学规划方案和申请时间线</p><Badge variant="outline" className="text-blue-600 border-blue-200">查看进度</Badge></CardContent>
          </Card>
          {user.linkedChildEmail && (
            <div className="md:col-span-2 p-4 bg-green-50 rounded-lg border border-green-100">
              <p className="text-green-800 text-sm">已绑定学生邮箱：<code className="font-mono bg-green-100 px-1.5 py-0.5 rounded">{user.linkedChildEmail}</code></p>
            </div>
          )}
        </div>
      )}

      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
        <p className="text-blue-800 text-sm text-center">BoleChain MVP 演示版本，所有数据存储在浏览器本地。</p>
      </div>
    </div>
  );
}
