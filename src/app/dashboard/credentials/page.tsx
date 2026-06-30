"use client";

import { useState, useEffect } from "react";
import { getUser } from "@/lib/auth";
import { getCredentials, saveCredentials, computeSHA256, docTypeConfig, type CredentialRecord } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { FileCheck, Upload, Shield, Hash, CheckCircle } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

export default function CredentialsPage() {
  const user = getUser();
  const [credentials, setCredentials] = useState<CredentialRecord[]>([]);
  const [showUpload, setShowUpload] = useState(false);
  const [showVerify, setShowVerify] = useState(false);
  const [showOCR, setShowOCR] = useState(false);
  const [current, setCurrent] = useState<CredentialRecord | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [docType, setDocType] = useState<CredentialRecord["doc_type"]>("other");
  const [uploading, setUploading] = useState(false);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrData, setOcrData] = useState({ gpa: "3.65", courses: [{ name: "高等数学", grade: "A" }, { name: "线性代数", grade: "A-" }, { name: "概率论", grade: "B+" }, { name: "数据结构", grade: "A" }, { name: "微观经济学", grade: "A-" }] });

  useEffect(() => { setCredentials(getCredentials()); }, []);

  const isGrad = user?.degreeLevel === "grad" || user?.degreeLevel === "phd";

  const handleUpload = async () => {
    if (!selectedFile) { toast.error("请先选择文件"); return; }
    setUploading(true);

    // If transcript + grad → show OCR mock
    if (docType === "transcript" && isGrad) {
      setOcrLoading(true);
      setShowUpload(false);
      setShowOCR(true);
      await new Promise(r => setTimeout(r, 2000));
      setOcrLoading(false);
      setUploading(false);
      return;
    }

    // Direct upload
    await doUpload();
  };

  const doUpload = async (ocrResult?: typeof ocrData) => {
    if (!selectedFile) return;
    setUploading(true);
    const hash = await computeSHA256(selectedFile);
    const cred: CredentialRecord = {
      id: crypto.randomUUID(),
      file_name: selectedFile.name,
      doc_type: docType,
      doc_hash: hash,
      issuer_did: "did:key:mock",
      uploaded_at: new Date().toISOString(),
      status: "verified",
      student_email: user?.email || "demo@bolechain.com",
      ocr_data: ocrResult,
    };
    const updated = [...credentials, cred];
    saveCredentials(updated);
    setCredentials(updated);
    setCurrent(cred);
    setShowUpload(false);
    setShowOCR(false);
    setShowVerify(true);
    setSelectedFile(null);
    setDocType("other");
    setUploading(false);
    toast.success("材料已上链认证！");
  };

  const confirmOCR = () => { doUpload(ocrData); };

  const formatTime = (iso: string) => { const d = new Date(iso); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")} ${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`; };
  const truncHash = (h: string) => `${h.slice(0,8)}...${h.slice(-8)}`;
  const verifyUrl = (id: string) => typeof window !== "undefined" ? `${window.location.origin}/verify?id=${id}` : "";

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1 flex items-center gap-2"><FileCheck className="w-6 h-6 text-amber-600" /> 材料库</h1>
          <p className="text-slate-500 text-sm">上传学历材料，系统自动计算SHA-256哈希并模拟区块链锚定</p>
        </div>
        <Button onClick={() => setShowUpload(true)} className="bg-amber-500 hover:bg-amber-600 text-slate-900 gap-2"><Upload className="w-4 h-4" /> 上传新材料</Button>
      </div>

      {/* Table */}
      <Card>
        <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Shield className="w-5 h-5 text-green-600" /> 已认证材料</CardTitle></CardHeader>
        <CardContent>
          {credentials.length === 0 ? <p className="text-slate-400 text-center py-8">暂无已认证材料</p> : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader><TableRow><TableHead>文件名</TableHead><TableHead>类型</TableHead><TableHead>状态</TableHead><TableHead className="hidden md:table-cell">Hash</TableHead><TableHead className="hidden md:table-cell">时间</TableHead><TableHead>操作</TableHead></TableRow></TableHeader>
                <TableBody>
                  {credentials.map(c => (
                    <TableRow key={c.id}>
                      <TableCell className="font-medium text-sm">{c.file_name}</TableCell>
                      <TableCell><Badge className={docTypeConfig[c.doc_type]?.color || "bg-slate-100"}>{docTypeConfig[c.doc_type]?.label || c.doc_type}</Badge></TableCell>
                      <TableCell><Badge className="bg-green-100 text-green-800">已认证</Badge></TableCell>
                      <TableCell className="hidden md:table-cell"><code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded"><Hash className="w-3 h-3 inline" /> {truncHash(c.doc_hash)}</code></TableCell>
                      <TableCell className="hidden md:table-cell text-sm text-slate-500">{formatTime(c.uploaded_at)}</TableCell>
                      <TableCell><Button variant="ghost" size="sm" onClick={() => { setCurrent(c); setShowVerify(true); }} className="text-blue-600">验真卡</Button></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upload Dialog */}
      <Dialog open={showUpload} onOpenChange={setShowUpload}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle className="flex items-center gap-2"><Upload className="w-5 h-5" /> 上传新材料</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>材料类型</Label>
              <select value={docType} onChange={e => setDocType(e.target.value as CredentialRecord["doc_type"])} className="w-full rounded-md border px-3 py-2 text-sm">
                <option value="transcript">成绩单</option>
                <option value="competition">竞赛证书</option>
                <option value="internship">实习证明</option>
                <option value="recommendation">推荐信</option>
                <option value="ps">个人陈述</option>
                <option value="language">语言成绩</option>
                <option value="other">其他</option>
              </select>
            </div>
            <div className="border-2 border-dashed rounded-lg p-6 text-center">
              <input type="file" accept=".pdf,.jpg,.png" onChange={e => setSelectedFile(e.target.files?.[0] || null)} className="hidden" id="file-up" />
              <label htmlFor="file-up" className="cursor-pointer"><Upload className="w-8 h-8 text-slate-300 mx-auto mb-2" /><p className="text-sm text-slate-600">点击选择文件</p><p className="text-xs text-slate-400">.pdf / .jpg / .png</p></label>
            </div>
            {selectedFile && <div className="bg-slate-50 rounded p-2"><p className="text-sm">{selectedFile.name} ({(selectedFile.size/1024).toFixed(1)}KB)</p></div>}
            <Button onClick={handleUpload} disabled={!selectedFile || uploading} className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900">{uploading ? "处理中..." : "上传并认证"}</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* OCR Confirmation Dialog */}
      <Dialog open={showOCR} onOpenChange={setShowOCR}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>AI 成绩识别结果</DialogTitle></DialogHeader>
          {ocrLoading ? <div className="py-8 text-center"><p className="text-slate-500 animate-pulse">AI 识别中...</p></div> : (
            <div className="space-y-4">
              <p className="text-sm text-slate-600">请确认以下识别结果（可编辑修正）：</p>
              <div className="space-y-2">
                <Label>GPA</Label>
                <Input value={ocrData.gpa} onChange={e => setOcrData({ ...ocrData, gpa: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>核心课程</Label>
                {ocrData.courses.map((c, i) => (
                  <div key={i} className="flex gap-2">
                    <Input value={c.name} onChange={e => { const u = { ...ocrData, courses: [...ocrData.courses] }; u.courses[i] = { ...u.courses[i], name: e.target.value }; setOcrData(u); }} />
                    <Input value={c.grade} onChange={e => { const u = { ...ocrData, courses: [...ocrData.courses] }; u.courses[i] = { ...u.courses[i], grade: e.target.value }; setOcrData(u); }} className="w-20" />
                  </div>
                ))}
              </div>
              <Button onClick={confirmOCR} className="w-full bg-green-600 hover:bg-green-700 text-white">确认并上链</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Verify Card Dialog */}
      <Dialog open={showVerify} onOpenChange={setShowVerify}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle className="flex items-center gap-2 text-green-700"><CheckCircle className="w-5 h-5" /> 区块链验真卡</DialogTitle></DialogHeader>
          {current && (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-3">
                <div><p className="text-xs text-slate-500">文件名</p><p className="text-sm font-medium">{current.file_name}</p></div>
                <div><p className="text-xs text-slate-500">SHA-256 Hash</p><p className="text-xs font-mono bg-white px-2 py-1 rounded border break-all">{truncHash(current.doc_hash)}</p></div>
                <div><p className="text-xs text-slate-500">签发 DID</p><p className="text-sm font-mono">{current.issuer_did}</p></div>
                <div><p className="text-xs text-slate-500">认证时间</p><p className="text-sm">{formatTime(current.uploaded_at)}</p></div>
                <Badge className="bg-green-600 text-white text-sm px-3 py-1"><CheckCircle className="w-3.5 h-3.5 mr-1" />区块链认证</Badge>
              </div>
              <div className="flex flex-col items-center py-4">
                <QRCodeSVG value={verifyUrl(current.id)} size={160} level="M" />
                <p className="text-xs text-slate-400 mt-2">扫码验证凭证真伪</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
