"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUser, type UserProfile } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, FileCheck, Briefcase, Users, Shield, Eye } from "lucide-react";

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

  // Role-specific dashboard titles and descriptions
  const dashboardConfig: Record<string, { title: string; description: string }> = {
    student: {
      title: "学生工作台",
      description: "管理您的升学规划、材料认证和求职档案",
    },
    parent: {
      title: "家长概览",
      description: "查看孩子的升学进度和材料认证状态",
    },
    counselor: {
      title: "顾问工作台",
      description: "管理学生材料认证、签发可验证凭证",
    },
  };

  const config = dashboardConfig[user.role] || dashboardConfig.student;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Welcome Section - Role specific */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          {config.title}
        </h1>
        <p className="text-slate-600 mb-1">
          {config.description}
        </p>
        <p className="text-slate-500 text-sm">
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

      {/* Student Dashboard */}
      {user.role === "student" && (
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
      )}

      {/* Parent Dashboard */}
      {user.role === "parent" && (
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-2 border-green-100 hover:border-green-300 transition-colors cursor-pointer"
                onClick={() => router.push("/dashboard/credentials")}>
            <CardHeader>
              <div className="p-3 rounded-lg bg-green-50 w-fit">
                <Eye className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle className="text-lg">查看孩子材料</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-500 text-sm mb-3">
                查看孩子已上传的材料和区块链认证状态
              </p>
              <Badge variant="outline" className="text-green-600 border-green-200">
                只读查看
              </Badge>
            </CardContent>
          </Card>

          <Card className="border-2 border-blue-100 hover:border-blue-300 transition-colors cursor-pointer"
                onClick={() => router.push("/dashboard/planning")}>
            <CardHeader>
              <div className="p-3 rounded-lg bg-blue-50 w-fit">
                <Brain className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle className="text-lg">升学规划进度</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-500 text-sm mb-3">
                了解孩子的升学规划方案和申请时间线
              </p>
              <Badge variant="outline" className="text-blue-600 border-blue-200">
                查看进度
              </Badge>
            </CardContent>
          </Card>

          {user.linkedStudentId && (
            <div className="md:col-span-2 p-4 bg-green-50 rounded-lg border border-green-100">
              <p className="text-green-800 text-sm">
                已绑定学生邀请码：<code className="font-mono bg-green-100 px-1.5 py-0.5 rounded">{user.linkedStudentId}</code>
              </p>
            </div>
          )}
        </div>
      )}

      {/* Counselor Dashboard */}
      {user.role === "counselor" && (
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-2 border-amber-100 hover:border-amber-300 transition-colors cursor-pointer"
                onClick={() => router.push("/dashboard/credentials")}>
            <CardHeader>
              <div className="p-3 rounded-lg bg-amber-50 w-fit">
                <Shield className="w-6 h-6 text-amber-600" />
              </div>
              <CardTitle className="text-lg">材料认证</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-500 text-sm mb-3">
                审核学生材料，签发区块链可验证凭证
              </p>
              <Badge variant="outline" className="text-amber-600 border-amber-200">
                开始审核
              </Badge>
            </CardContent>
          </Card>

          <Card className="border-2 border-blue-100 hover:border-blue-300 transition-colors cursor-pointer"
                onClick={() => router.push("/dashboard/planning")}>
            <CardHeader>
              <div className="p-3 rounded-lg bg-blue-50 w-fit">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle className="text-lg">学生管理</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-500 text-sm mb-3">
                查看所管理学生的升学规划和申请状态
              </p>
              <Badge variant="outline" className="text-blue-600 border-blue-200">
                查看列表
              </Badge>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Info Notice */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
        <p className="text-blue-800 text-sm text-center">
          这是 BoleChain MVP 演示版本，所有数据存储在浏览器本地。
        </p>
      </div>
    </div>
  );
}
