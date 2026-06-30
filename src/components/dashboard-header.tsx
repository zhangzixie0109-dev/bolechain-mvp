"use client";

import { useRouter } from "next/navigation";
import { getUser, logout } from "@/lib/auth";
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
    const user = getUser();
    if (user) { setEmail(user.email); setRole(user.role); }
  }, []);

  const handleLogout = () => { logout(); router.push("/"); };

  const roleLabels: Record<string, string> = { student: "学生", parent: "家长" };
  const roleColors: Record<string, string> = { student: "bg-blue-100 text-blue-800", parent: "bg-green-100 text-green-800" };

  return (
    <header className="flex items-center justify-between border-b bg-white px-4 py-3">
      <div className="flex items-center gap-3">
        <SidebarTrigger />
        {role && <Badge className={roleColors[role] || ""}>{roleLabels[role] || role}</Badge>}
        {email && <span className="text-sm text-slate-500 hidden sm:inline">{email}</span>}
      </div>
      <Button variant="ghost" size="sm" onClick={handleLogout} className="text-slate-600 hover:text-red-600">
        <LogOut className="w-4 h-4 mr-1" /> 退出登录
      </Button>
    </header>
  );
}
