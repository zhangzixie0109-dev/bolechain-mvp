"use client";

import { useState, useEffect } from "react";
import { getUser } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { FileCheck, Upload, Shield, Hash, CheckCircle } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

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

function saveCredentials(creds: CredentialRecord[]) {
  localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(creds));
}

function inferDocType(fileName: string): string {
  const lower = fileName.toLowerCase();
  if (lower.includes("transcript")) return "成绩单";
  if (lower.includes("award")) return "奖项";
  if (lower.includes("essay")) return "文书";
  return "证明材料";
}

async function computeSHA256(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export default function CredentialsPage() {
  const [credentials, setCredentials] = useState<CredentialRecord[]>([]);
  const [uploading, setUploading] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showVerifyCard, setShowVerifyCard] = useState(false);
  const [currentCredential, setCurrentCredential] = useState<CredentialRecord | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    setCredentials(getCredentials());
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("请先选择文件");
      return;
    }

    setUploading(true);

    try {
      const hash = await computeSHA256(selectedFile);
      const user = getUser();

      const newCred: CredentialRecord = {
        id: crypto.randomUUID(),
        doc_hash: hash,
        doc_type: inferDocType(selectedFile.name),
        file_name: selectedFile.name,
        issuer_did: "did:key:mock",
        uploaded_at: new Date().toISOString(),
        status: "verified",
        student_email: user?.email || "demo@bolechain.com",
      };

      const updated = [...credentials, newCred];
      saveCredentials(updated);
      setCredentials(updated);

      setShowUploadDialog(false);
      setSelectedFile(null);
      setCurrentCredential(newCred);
      setShowVerifyCard(true);

      toast.success("材料已上链认证！");
    } catch (err) {
      toast.error("文件处理失败，请重试");
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  };

  const truncateHash = (hash: string) => `${hash.slice(0, 8)}...${hash.slice(-8)}`;

  const getVerifyUrl = (id: string) => {
    if (typeof window === "undefined") return "";
    return `${window.location.origin}/verify?id=${id}`;
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1 flex items-center gap-2">
            <FileCheck className="w-6 h-6 text-amber-600" />
            材料库
          </h1>
          <p className="text-slate-500 text-sm">
            上传学历材料，系统自动计算 SHA-256 哈希并模拟区块链锚定
          </p>
        </div>
        <Button onClick={() => setShowUploadDialog(true)} className="bg-amber-500 hover:bg-amber-600 text-slate-900 gap-2">
          <Upload className="w-4 h-4" />
          上传新材料
        </Button>
      </div>

      {/* Credentials Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-600" />
            已认证材料
          </CardTitle>
        </CardHeader>
        <CardContent>
          {credentials.length === 0 ? (
            <p className="text-slate-400 text-center py-8">
              暂无已认证材料，点击右上角"上传新材料"开始
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>文件名</TableHead>
                    <TableHead>类型</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead className="hidden md:table-cell">Hash</TableHead>
                    <TableHead className="hidden md:table-cell">时间</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {credentials.map((cred) => (
                    <TableRow key={cred.id}>
                      <TableCell className="font-medium text-sm">{cred.file_name}</TableCell>
                      <TableCell>{cred.doc_type}</TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800">已认证</Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded flex items-center gap-1">
                          <Hash className="w-3 h-3" />
                          {truncateHash(cred.doc_hash)}
                        </code>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-sm text-slate-500">
                        {formatTime(cred.uploaded_at)}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => { setCurrentCredential(cred); setShowVerifyCard(true); }}
                          className="text-blue-600"
                        >
                          验真卡
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              上传新材料
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-slate-200 rounded-lg p-8 text-center">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="text-sm text-slate-600">点击选择 PDF 文件</p>
                <p className="text-xs text-slate-400 mt-1">支持 .pdf 格式</p>
              </label>
            </div>
            {selectedFile && (
              <div className="bg-slate-50 rounded-lg p-3">
                <p className="text-sm font-medium text-slate-700">{selectedFile.name}</p>
                <p className="text-xs text-slate-500">{(selectedFile.size / 1024).toFixed(1)} KB</p>
              </div>
            )}
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
              className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900"
            >
              {uploading ? "计算哈希并上链中..." : "上传并认证"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Verification Card Dialog */}
      <Dialog open={showVerifyCard} onOpenChange={setShowVerifyCard}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-700">
              <CheckCircle className="w-5 h-5" />
              区块链验真卡
            </DialogTitle>
          </DialogHeader>
          {currentCredential && (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-3">
                <div>
                  <p className="text-xs text-slate-500">文件名</p>
                  <p className="text-sm font-medium">{currentCredential.file_name}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">SHA-256 Hash</p>
                  <p className="text-xs font-mono bg-white px-2 py-1 rounded border break-all">
                    {truncateHash(currentCredential.doc_hash)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">签发 DID</p>
                  <p className="text-sm font-mono">{currentCredential.issuer_did}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">认证时间</p>
                  <p className="text-sm">{formatTime(currentCredential.uploaded_at)}</p>
                </div>
                <div className="pt-2">
                  <Badge className="bg-green-600 text-white text-sm px-3 py-1">
                    <CheckCircle className="w-3.5 h-3.5 mr-1" />
                    区块链认证
                  </Badge>
                </div>
              </div>

              {/* QR Code */}
              <div className="flex flex-col items-center py-4">
                <QRCodeSVG
                  value={getVerifyUrl(currentCredential.id)}
                  size={160}
                  level="M"
                />
                <p className="text-xs text-slate-400 mt-2">扫码验证凭证真伪</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
