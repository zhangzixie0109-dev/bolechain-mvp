"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { getCredentials, docTypeConfig, type CredentialRecord } from "@/lib/mock-data";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Copy, Shield } from "lucide-react";
import { toast } from "sonner";

function VerifyContent() {
  const searchParams = useSearchParams();
  const [credential, setCredential] = useState<CredentialRecord | null>(null);
  const [otherCreds, setOtherCreds] = useState<CredentialRecord[]>([]);
  const [notFound, setNotFound] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const id = searchParams.get("id");
    if (!id) { setNotFound(true); return; }
    const creds = getCredentials();
    const found = creds.find(c => c.id === id);
    if (found) {
      setCredential(found);
      // Get other credentials from same student
      const others = creds.filter(c => c.student_email === found.student_email && c.id !== id).slice(0, 5);
      setOtherCreds(others);
    } else {
      setNotFound(true);
    }
  }, [searchParams]);

  const formatTime = (iso: string) => { const d = new Date(iso); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")} ${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`; };

  const copyHash = async () => {
    if (!credential) return;
    try { await navigator.clipboard.writeText(credential.doc_hash); toast.success("Hash已复制"); } catch { toast.error("复制失败"); }
  };

  if (!mounted) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><p className="text-slate-500">加载中...</p></div>;

  if (notFound) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="max-w-md w-full"><CardContent className="flex flex-col items-center py-12">
        <XCircle className="w-16 h-16 text-red-400 mb-4" />
        <h1 className="text-xl font-bold text-slate-900 mb-2">未找到该凭证</h1>
        <p className="text-slate-500 text-center text-sm">该凭证ID不存在或已过期</p>
      </CardContent></Card>
    </div>
  );

  if (!credential) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-green-50 to-slate-50 p-4">
      <Card className="max-w-md w-full border-green-200 mb-4">
        <CardContent className="py-8">
          <div className="flex flex-col items-center mb-6">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-3">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <Badge className="bg-green-600 text-white text-sm px-4 py-1"><Shield className="w-3.5 h-3.5 mr-1" />凭证已验证</Badge>
          </div>
          <div className="space-y-4 bg-slate-50 rounded-lg p-4">
            <div><p className="text-xs text-slate-500">文件名称</p><p className="text-sm font-medium">{credential.file_name}</p></div>
            <div><p className="text-xs text-slate-500">文件类型</p><Badge className={docTypeConfig[credential.doc_type]?.color || ""}>{docTypeConfig[credential.doc_type]?.label || credential.doc_type}</Badge></div>
            <div>
              <p className="text-xs text-slate-500">SHA-256 Hash</p>
              <div className="flex items-center gap-2">
                <code className="text-xs font-mono bg-white px-2 py-1 rounded border break-all flex-1">{credential.doc_hash}</code>
                <Button variant="ghost" size="sm" onClick={copyHash}><Copy className="w-3.5 h-3.5" /></Button>
              </div>
            </div>
            <div><p className="text-xs text-slate-500">签发机构</p><p className="text-sm font-mono">{credential.issuer_did}</p></div>
            <div><p className="text-xs text-slate-500">上链时间</p><p className="text-sm">{formatTime(credential.uploaded_at)}</p></div>
          </div>
          <p className="text-center text-xs text-slate-400 mt-6">由 BoleChain 智信通提供验真服务</p>
        </CardContent>
      </Card>

      {/* Other credentials from same student */}
      {otherCreds.length > 0 && (
        <Card className="max-w-md w-full">
          <CardContent className="py-4">
            <p className="text-sm font-medium text-slate-700 mb-3">该学生的其他链上凭证</p>
            <div className="space-y-2">
              {otherCreds.map(c => (
                <div key={c.id} className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                  <Badge className={`${docTypeConfig[c.doc_type]?.color || "bg-slate-100"} text-xs`}>{docTypeConfig[c.doc_type]?.label}</Badge>
                  <span className="text-slate-600 truncate">{c.file_name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-50"><p className="text-slate-500">加载中...</p></div>}>
      <VerifyContent />
    </Suspense>
  );
}
