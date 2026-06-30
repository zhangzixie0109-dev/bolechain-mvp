"use client";

import { useState, useEffect } from "react";
import { getCredentials, addCredential, type Credential } from "@/lib/mock-data";
import { getUser } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { FileCheck, Upload, Shield, Hash } from "lucide-react";

export default function CredentialsPage() {
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [uploading, setUploading] = useState(false);
  const [docType, setDocType] = useState("");
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    setCredentials(getCredentials());
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docType) {
      toast.error("请选择文件类型");
      return;
    }

    setUploading(true);

    // Simulate upload + hash + blockchain anchor
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const user = getUser();
    const newCred: Credential = {
      id: Date.now().toString(),
      studentId: user?.email || "demo",
      docType,
      docHash: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`,
      issuerDid: `did:bole:${Date.now().toString(36)}`,
      anchoredTxPlaceholder: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`,
      status: "verified",
      uploadedAt: new Date().toISOString(),
    };

    addCredential(newCred);
    setCredentials(getCredentials());
    setDocType("");
    setFileName("");
    setUploading(false);
    toast.success("材料已上链认证！");
  };

  const statusConfig: Record<string, { label: string; color: string }> = {
    pending: { label: "待认证", color: "bg-yellow-100 text-yellow-800" },
    verified: { label: "已认证", color: "bg-green-100 text-green-800" },
    rejected: { label: "已拒绝", color: "bg-red-100 text-red-800" },
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-1 flex items-center gap-2">
          <FileCheck className="w-6 h-6 text-amber-600" />
          材料库
        </h1>
        <p className="text-slate-500 text-sm">
          上传学历材料，系统自动计算哈希并模拟区块链锚定
        </p>
      </div>

      {/* Upload Form */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Upload className="w-5 h-5" />
            上传新材料
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpload} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="docType" className="text-sm">文件类型</Label>
              <select
                id="docType"
                value={docType}
                onChange={(e) => setDocType(e.target.value)}
                className="w-full mt-1 rounded-md border border-slate-200 px-3 py-2 text-sm"
              >
                <option value="">选择类型...</option>
                <option value="成绩单">成绩单</option>
                <option value="推荐信">推荐信</option>
                <option value="语言成绩">语言成绩 (IELTS/TOEFL)</option>
                <option value="获奖证书">获奖证书</option>
                <option value="个人陈述">个人陈述</option>
                <option value="在读证明">在读证明</option>
              </select>
            </div>
            <div className="flex-1">
              <Label htmlFor="file" className="text-sm">选择文件</Label>
              <Input
                id="file"
                type="file"
                className="mt-1"
                onChange={(e) => setFileName(e.target.files?.[0]?.name || "")}
              />
            </div>
            <div className="flex items-end">
              <Button type="submit" disabled={uploading} className="bg-amber-500 hover:bg-amber-600 text-slate-900">
                {uploading ? "上链中..." : "上传并认证"}
              </Button>
            </div>
          </form>
          {fileName && (
            <p className="text-xs text-slate-500 mt-2">已选择: {fileName}</p>
          )}
        </CardContent>
      </Card>

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
              暂无已认证材料，请上传您的第一份文件
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>类型</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead className="hidden md:table-cell">文件哈希</TableHead>
                    <TableHead className="hidden md:table-cell">上传时间</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {credentials.map((cred) => (
                    <TableRow key={cred.id}>
                      <TableCell className="font-medium">{cred.docType}</TableCell>
                      <TableCell>
                        <Badge className={statusConfig[cred.status]?.color || ""}>
                          {statusConfig[cred.status]?.label || cred.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded flex items-center gap-1">
                          <Hash className="w-3 h-3" />
                          {cred.docHash.slice(0, 10)}...{cred.docHash.slice(-6)}
                        </code>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-sm text-slate-500">
                        {new Date(cred.uploadedAt).toLocaleDateString("zh-CN")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
