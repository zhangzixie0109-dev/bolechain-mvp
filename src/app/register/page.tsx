"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { login, generateInviteCode, type Role } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { GraduationCap, Users, Building2 } from "lucide-react";

const COUNSELOR_CODE = "BOLE2026";

const roleConfig: Record<Role, { icon: typeof GraduationCap; title: string; titleEn: string; description: string }> = {
  student: {
    icon: GraduationCap,
    title: "学生",
    titleEn: "Student",
    description: "申请港澳/新加坡院校",
  },
  parent: {
    icon: Users,
    title: "家长",
    titleEn: "Parent",
    description: "关注孩子升学进度",
  },
  counselor: {
    icon: Building2,
    title: "升学顾问",
    titleEn: "Counselor",
    description: "管理学生材料认证",
  },
};

function RegisterContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [email, setEmail] = useState("");
  const [counselorCode, setCounselorCode] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const role = searchParams.get("role") as Role | null;
    if (role && roleConfig[role]) {
      setSelectedRole(role);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) {
      toast.error("请先选择角色");
      return;
    }

    if (!email) {
      toast.error("请填写邮箱");
      return;
    }

    // Counselor code validation
    if (selectedRole === "counselor" && counselorCode !== COUNSELOR_CODE) {
      toast.error("机构码错误，请联系管理员获取");
      return;
    }

    setLoading(true);

    // Simulate a brief delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const generatedInviteCode = selectedRole === "student" ? generateInviteCode() : undefined;

    // Save to localStorage
    login({
      email,
      role: selectedRole,
      inviteCode: generatedInviteCode,
      linkedStudentId: selectedRole === "parent" && inviteCode ? inviteCode : undefined,
    });

    toast.success("登录成功！");
    if (generatedInviteCode) {
      toast.info(`您的邀请码：${generatedInviteCode}（请发送给家长绑定）`);
    }

    setLoading(false);
    router.push("/dashboard");
  };

  // Dynamic page title based on selected role
  const pageTitle = selectedRole
    ? `${roleConfig[selectedRole].title}登录`
    : "进入 BoleChain";

  const pageSubtitle = selectedRole
    ? roleConfig[selectedRole].description
    : "选择您的角色开始使用";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Header - shows role-specific title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            {pageTitle}
          </h1>
          <p className="text-blue-200">
            {pageSubtitle}
          </p>
        </div>

        {/* Role Selection */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {(Object.keys(roleConfig) as Role[]).map((role) => {
            const config = roleConfig[role];
            const Icon = config.icon;
            return (
              <button
                key={role}
                type="button"
                onClick={() => setSelectedRole(role)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  selectedRole === role
                    ? "border-amber-400 bg-white/10 scale-105"
                    : "border-white/20 bg-white/5 hover:border-white/40"
                }`}
              >
                <Icon
                  className={`w-8 h-8 mx-auto mb-2 ${
                    selectedRole === role ? "text-amber-400" : "text-white/70"
                  }`}
                />
                <p className="text-white text-sm font-medium">{config.title}</p>
                <p className="text-white/50 text-xs">{config.titleEn}</p>
              </button>
            );
          })}
        </div>

        {/* Form */}
        <Card className="bg-white/10 border-white/20 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-white">
              {selectedRole ? `${roleConfig[selectedRole].title}快速登录` : "快速登录"}
            </CardTitle>
            <CardDescription className="text-blue-200">
              {selectedRole && (
                <Badge variant="secondary" className="mt-1">
                  {roleConfig[selectedRole].title}
                </Badge>
              )}
              <span className="block mt-2 text-xs">演示版本：输入邮箱即可体验</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">
                  邮箱
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white/10 border-white/30 text-white placeholder:text-white/40"
                />
              </div>

              {/* Counselor code field - NOT using required attr, validation in JS */}
              {selectedRole === "counselor" && (
                <div className="space-y-2">
                  <Label htmlFor="counselorCode" className="text-white">
                    机构码
                  </Label>
                  <Input
                    id="counselorCode"
                    type="text"
                    placeholder="请输入机构授权码（提示：BOLE2026）"
                    value={counselorCode}
                    onChange={(e) => setCounselorCode(e.target.value)}
                    className="bg-white/10 border-white/30 text-white placeholder:text-white/40"
                  />
                  <p className="text-xs text-amber-300/70">
                    演示提示：机构码为 BOLE2026
                  </p>
                </div>
              )}

              {/* Parent invite code field */}
              {selectedRole === "parent" && (
                <div className="space-y-2">
                  <Label htmlFor="inviteCode" className="text-white">
                    学生邀请码（可选）
                  </Label>
                  <Input
                    id="inviteCode"
                    type="text"
                    placeholder="输入学生分享的6位邀请码"
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value)}
                    className="bg-white/10 border-white/30 text-white placeholder:text-white/40"
                  />
                  <p className="text-xs text-blue-300">
                    登录后也可以在设置中绑定
                  </p>
                </div>
              )}

              <Button
                type="submit"
                disabled={loading || !selectedRole}
                className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold"
              >
                {loading ? "处理中..." : "进入系统"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Back to home */}
        <div className="text-center mt-4">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="text-white/60 hover:text-white text-sm"
          >
            ← 返回首页
          </button>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
          <p className="text-white">加载中...</p>
        </div>
      }
    >
      <RegisterContent />
    </Suspense>
  );
}
