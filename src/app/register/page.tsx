"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { GraduationCap, Users, Building2 } from "lucide-react";

type Role = "student" | "parent" | "counselor";

const COUNSELOR_CODE = "BOLE2026";

const roleConfig = {
  student: {
    icon: GraduationCap,
    title: "学生",
    titleEn: "Student",
    description: "申请港澳/新加坡院校",
    color: "bg-blue-500",
  },
  parent: {
    icon: Users,
    title: "家长",
    titleEn: "Parent",
    description: "关注孩子升学进度",
    color: "bg-green-500",
  },
  counselor: {
    icon: Building2,
    title: "升学顾问",
    titleEn: "Counselor",
    description: "管理学生材料认证",
    color: "bg-amber-500",
  },
};

function RegisterContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [counselorCode, setCounselorCode] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(false);

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

    if (!email || !password) {
      toast.error("请填写邮箱和密码");
      return;
    }

    if (selectedRole === "counselor" && !isLogin) {
      if (counselorCode !== COUNSELOR_CODE) {
        toast.error("机构码错误，请联系管理员获取");
        return;
      }
    }

    setLoading(true);
    const supabase = createClient();

    try {
      if (isLogin) {
        // Login flow
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast.success("登录成功！");
        router.push("/dashboard");
      } else {
        // Register flow
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (error) throw error;

        if (data.user) {
          // Generate invite code for students
          const generatedInviteCode =
            selectedRole === "student"
              ? Math.random().toString(36).substring(2, 8).toUpperCase()
              : null;

          // Insert user profile
          const { error: profileError } = await supabase
            .from("users")
            .insert({
              id: data.user.id,
              role: selectedRole,
              invite_code: generatedInviteCode,
              linked_student_id:
                selectedRole === "parent" && inviteCode
                  ? inviteCode
                  : null,
            });

          if (profileError) {
            console.error("Profile insert error:", profileError);
          }

          // If parent with invite code, link to student
          if (selectedRole === "parent" && inviteCode) {
            // Find student by invite code and link
            const { data: studentData } = await supabase
              .from("users")
              .select("id")
              .eq("invite_code", inviteCode)
              .eq("role", "student")
              .single();

            if (studentData) {
              await supabase
                .from("users")
                .update({ linked_student_id: studentData.id.toString() })
                .eq("id", data.user.id);
            }
          }

          toast.success("注册成功！");
          if (generatedInviteCode) {
            toast.info(`您的邀请码：${generatedInviteCode}（请发送给家长绑定）`);
          }
          router.push("/dashboard");
        }
      }
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : "操作失败";
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            {isLogin ? "登录 BoleChain" : "注册 BoleChain"}
          </h1>
          <p className="text-blue-200">
            {isLogin ? "欢迎回来" : "选择您的角色开始使用"}
          </p>
        </div>

        {/* Role Selection */}
        {!isLogin && (
          <div className="grid grid-cols-3 gap-3 mb-6">
            {(Object.entries(roleConfig) as [Role, typeof roleConfig.student][]).map(
              ([role, config]) => {
                const Icon = config.icon;
                return (
                  <button
                    key={role}
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
              }
            )}
          </div>
        )}

        {/* Form */}
        <Card className="bg-white/10 border-white/20 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-white">
              {isLogin ? "账号登录" : "创建账号"}
            </CardTitle>
            <CardDescription className="text-blue-200">
              {selectedRole && !isLogin && (
                <Badge variant="secondary" className="mt-1">
                  {roleConfig[selectedRole].title}
                </Badge>
              )}
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

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">
                  密码
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="至少6位"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="bg-white/10 border-white/30 text-white placeholder:text-white/40"
                />
              </div>

              {/* Counselor code field */}
              {selectedRole === "counselor" && !isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="counselorCode" className="text-white">
                    机构码
                  </Label>
                  <Input
                    id="counselorCode"
                    type="text"
                    placeholder="请输入机构授权码"
                    value={counselorCode}
                    onChange={(e) => setCounselorCode(e.target.value)}
                    required
                    className="bg-white/10 border-white/30 text-white placeholder:text-white/40"
                  />
                </div>
              )}

              {/* Parent invite code field */}
              {selectedRole === "parent" && !isLogin && (
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
                    注册后也可以在设置中绑定
                  </p>
                </div>
              )}

              <Button
                type="submit"
                disabled={loading || (!isLogin && !selectedRole)}
                className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold"
              >
                {loading ? "处理中..." : isLogin ? "登录" : "注册"}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-blue-300 hover:text-white text-sm underline"
              >
                {isLogin ? "没有账号？去注册" : "已有账号？去登录"}
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Back to home */}
        <div className="text-center mt-4">
          <button
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
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <p className="text-white">加载中...</p>
      </div>
    }>
      <RegisterContent />
    </Suspense>
  );
}
