import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, FileCheck, Briefcase } from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let userProfile = null;
  if (user) {
    const { data } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();
    userProfile = data;
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
          {user?.email && (
            <span>
              您好，{user.email}
              {userProfile?.role && (
                <Badge className="ml-2" variant="secondary">
                  {roleLabels[userProfile.role] || userProfile.role}
                </Badge>
              )}
            </span>
          )}
        </p>
        {userProfile?.invite_code && (
          <p className="text-sm text-slate-500 mt-2">
            您的邀请码：
            <code className="bg-slate-200 px-2 py-0.5 rounded font-mono">
              {userProfile.invite_code}
            </code>
            （分享给家长绑定）
          </p>
        )}
      </div>

      {/* Feature Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="border-dashed border-2 border-slate-200">
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
              即将上线
            </Badge>
          </CardContent>
        </Card>

        <Card className="border-dashed border-2 border-slate-200">
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
              即将上线
            </Badge>
          </CardContent>
        </Card>

        <Card className="border-dashed border-2 border-slate-200">
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
          🚀 功能页面正在紧锣密鼓开发中，敬请期待！
        </p>
      </div>
    </div>
  );
}
