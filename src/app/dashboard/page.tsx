"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUser, type UserProfile } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, FileCheck, Briefcase } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const profile = getUser();
    if (!profile) {
      router.push("/register");
      return;
    }
    setUser(profile);
  }, [router]);

  if (!mounted || !user) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-slate-500">加载中...</p>
      </div>
    );
  }

  const roleLabels: Record<string, string> = {
    student: "学生",
    parent: "家长",
    counselor: "升学顾问",
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          欢迎使用 BoleChain 伯乐智信
        </h1>
        <p className="text-slate-600">
          您好，{user.email}
          <Badge className="ml-2" variant="secondary">
            {roleLabels[user.role] || user.role}
          </Badge>
        </p>
        {user.inviteCode && (
          <p className="text-sm text-slate-500 mt-2">
            您的邀请码：
            <code className="bg-slate-200 px-2 py-0.5 rounded font-mono">
              {user.inviteCode}
            </code>
            （分享给家长绑定）
          </p>
        )}
      </div>

      {/* Feature Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="border-dashed border-2 border-slate-200 hover:border-blue-300 transition-colors cursor-pointer"
              onClick={() => router.push("/dashboard/planning")}>
          <CardHeader>
            <div className="p-3 rounded-lg bg-blue-50 w-fit">
              <Brain className="w-6 h-6 text-blue-600" />
            </div>
            <CardTitle className="text-lg">AI 升学规划</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-500 text-sm mb-3">
              智能分析您的背景，匹配最优院校和申请策略
            </p>
            <Badge variant="outline" className="text-blue-600 border-blue-200">
              点击体验
            </Badge>
          </CardContent>
        </Card>

        <Card className="border-dashed border-2 border-slate-200 hover:border-amber-300 transition-colors cursor-pointer"
              onClick={() => router.push("/dashboard/credentials")}>
          <CardHeader>
            <div className="p-3 rounded-lg bg-amber-50 w-fit">
              <FileCheck className="w-6 h-6 text-amber-600" />
            </div>
            <CardTitle className="text-lg">材料库</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-500 text-sm mb-3">
              上传材料，区块链认证，一键生成可验证凭证
            </p>
            <Badge variant="outline" className="text-amber-600 border-amber-200">
              点击体验
            </Badge>
          </CardContent>
        </Card>

        <Card className="border-dashed border-2 border-slate-200 hover:border-green-300 transition-colors cursor-pointer"
              onClick={() => router.push("/dashboard/portfolio")}>
          <CardHeader>
            <div className="p-3 rounded-lg bg-green-50 w-fit">
              <Briefcase className="w-6 h-6 text-green-600" />
            </div>
            <CardTitle className="text-lg">求职档案</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-500 text-sm mb-3">
              构建可信求职档案，区块链背书的职业履历
            </p>
            <Badge variant="outline" className="text-green-600 border-green-200">
              即将上线
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Placeholder Notice */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
        <p className="text-blue-800 text-sm text-center">
          这是 BoleChain MVP 演示版本，所有数据存储在浏览器本地，刷新后保留。
        </p>
      </div>
    </div>
  );
}
