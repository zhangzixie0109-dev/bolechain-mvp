"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Building2, Shield, Users, FileCheck } from "lucide-react";

const mockStudents = [
  { name: "张同学", target: "港大金融", materials: 5, lastActive: "2026-06-28 14:30" },
  { name: "李同学", target: "NUS计算机", materials: 3, lastActive: "2026-06-27 09:15" },
  { name: "王同学", target: "港科大电子工程", materials: 4, lastActive: "2026-06-26 16:42" },
  { name: "陈同学", target: "NTU量化金融", materials: 2, lastActive: "2026-06-25 11:20" },
  { name: "赵同学", target: "港中文商学院", materials: 6, lastActive: "2026-06-24 08:55" },
];

export default function InstitutionPage() {
  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-1 flex items-center gap-2">
            <Building2 className="w-6 h-6 text-amber-600" /> BoleChain 机构合作后台
          </h1>
          <p className="text-slate-500 text-sm">演示版本 — 展示机构端管理能力</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <Shield className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-3xl font-bold text-slate-900">47</p>
              <p className="text-sm text-slate-500">本月验真次数</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-3xl font-bold text-slate-900">23</p>
              <p className="text-sm text-slate-500">名下学生</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <FileCheck className="w-8 h-8 text-amber-600 mx-auto mb-2" />
              <p className="text-3xl font-bold text-slate-900">156</p>
              <p className="text-sm text-slate-500">已上链材料</p>
            </CardContent>
          </Card>
        </div>

        {/* Student Table */}
        <Card className="mb-6">
          <CardHeader><CardTitle className="text-lg">学生列表</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>学生姓名</TableHead>
                  <TableHead>目标院校</TableHead>
                  <TableHead>上链材料数</TableHead>
                  <TableHead className="hidden md:table-cell">最近操作时间</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockStudents.map((s, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">{s.name}</TableCell>
                    <TableCell><Badge variant="outline">{s.target}</Badge></TableCell>
                    <TableCell><Badge className="bg-green-100 text-green-800">{s.materials}份</Badge></TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-slate-500">{s.lastActive}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* CTA */}
        <Card className="border-amber-200 bg-amber-50/30">
          <CardContent className="p-6 text-center">
            <h3 className="font-semibold text-slate-900 mb-2">接入 BoleChain API</h3>
            <p className="text-sm text-slate-600 mb-3">为您的每个学生材料盖上链上可信标，提升机构公信力</p>
            <p className="text-amber-600 font-medium">联系我们：hello@bolechain.demo</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
