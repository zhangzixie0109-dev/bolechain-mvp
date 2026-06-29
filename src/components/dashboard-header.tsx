"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LogOut } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useEffect, useState } from "react";

export function DashboardHeader() {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setEmail(user.email || null);
        const { data } = await supabase
          .from("users")
          .select("role")
          .eq("id", user.id)
          .single();
        if (data) setRole(data.role);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const roleLabels: Record<string, string> = {
    student: "学生",
    parent: "家长",
    counselor: "升学顾问",
  };

  const roleColors: Record<string, string> = {
    student: "bg-blue-100 text-blue-800",
    parent: "bg-green-100 text-green-800",
    counselor: "bg-amber-100 text-amber-800",
  };

  return (
    <header className="flex items-center justify-between border-b bg-white px-4 py-3">
      <div className="flex items-center gap-3">
        <SidebarTrigger />
        {role && (
          <Badge className={roleColors[role] || ""}>
            {roleLabels[role] || role}
          </Badge>
        )}
        {email && (
          <span className="text-sm text-slate-500 hidden sm:inline">
            {email}
          </span>
        )}
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleLogout}
        className="text-slate-600 hover:text-red-600"
      >
        <LogOut className="w-4 h-4 mr-1" />
        退出登录
      </Button>
    </header>
  );
}
