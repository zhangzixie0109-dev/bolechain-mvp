"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUser, type UserProfile } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Users, Clock, FileCheck, AlertCircle } from "lucide-react";

interface CredentialRecord {
  id: string;
  doc_hash: string;
  doc_type: string;
  file_name: string;
  issuer_did: string;
  uploaded_at: string;
  status: string;
  student_email: string;
}

const CREDENTIALS_KEY = "bolechain_credentials";

function getCredentials(): CredentialRecord[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(CREDENTIALS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export default function ParentPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [childCredentials, setChildCredentials] = useState<CredentialRecord[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const profile = getUser();
    if (!profile) {
      router.push("/register");
      return;
    }
    if (profile.role !== "parent") {
      router.push("/dashboard");
      return;
    }
    setUser(profile);

    // Get all credentials (in MVP, show all student credentials)
    const allCreds = getCredentials();
    // Filter by linked student if available, otherwise show all
    if (profile.linkedStudentId) {
      const filtered = allCreds.filter(
        (c) => c.student_email === profile.linkedStudentId
      );
      setChildCredentials(filtered.length > 0 ? filtered : allCreds);
    } else {
      setChildCredentials(allCreds);
    }
  }, [router]);

  if (!mounted || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-500">加载中...</p>
      </div>
    );
  }

  // Calculate days until next Jan 15
  const now = new Date();
  const nextYear = now.getMonth() >= 0 && now.getDate() >= 15 && now.getMonth() >= 0
    ? now.getFullYear() + 1
    : now.getFullYear() + 1;
  const deadline = new Date(nextYear, 0, 15); // January 15
  const daysRemaining = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  // Mock child info
  const childEmail = user.linkedStudentId || "student@example.com";

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-1 flex items-center gap-2">
            <Users className="w-6 h-6 text-green-600" />
            家长面板
          </h1>
          <p className="text-slate-500 text-sm">
            查看孩子的升学材料和申请进度（只读）
          </p>
        </div>

        {/* Child Info + Countdown */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                绑定学生信息
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-700">
                学生邮箱：<span className="font-medium">{childEmail}</span>
              </p>
              {user.linkedStudentId && (
                <p className="text-xs text-slate-500 mt-1">
                  邀请码：{user.linkedStudentId}
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="border-amber-200 bg-amber-50/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600" />
                申请倒计时
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-amber-700">{daysRemaining} 天</p>
              <p className="text-sm text-amber-600 mt-1">
                距港大 {nextYear} 年截止还有 {daysRemaining} 天
              </p>
              <p className="text-xs text-slate-500 mt-1">
                截止日期：{nextYear}-01-15
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Credentials List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-green-600" />
              孩子的认证材料
            </CardTitle>
          </CardHeader>
          <CardContent>
            {childCredentials.length === 0 ? (
              <div className="text-center py-8">
                <AlertCircle className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-400">
                  暂无已认证材料
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  学生上传材料后将在此处显示
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>文件名</TableHead>
                      <TableHead>类型</TableHead>
                      <TableHead>状态</TableHead>
                      <TableHead className="hidden md:table-cell">认证时间</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {childCredentials.map((cred) => (
                      <TableRow key={cred.id}>
                        <TableCell className="font-medium text-sm">{cred.file_name}</TableCell>
                        <TableCell>{cred.doc_type}</TableCell>
                        <TableCell>
                          <Badge className={
                            cred.status === "verified"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }>
                            {cred.status === "verified" ? "已认证" : "待认证"}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-sm text-slate-500">
                          {formatTime(cred.uploaded_at)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Read-only notice */}
        <div className="mt-6 p-3 bg-slate-100 rounded-lg border border-slate-200">
          <p className="text-xs text-slate-500 text-center">
            家长面板为只读模式，如需操作请联系学生或升学顾问
          </p>
        </div>

        {/* Back */}
        <div className="text-center mt-4">
          <button
            onClick={() => router.push("/dashboard")}
            className="text-slate-500 hover:text-slate-700 text-sm"
          >
            ← 返回仪表盘
          </button>
        </div>
      </div>
    </div>
  );
}
