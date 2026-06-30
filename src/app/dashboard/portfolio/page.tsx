"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Construction } from "lucide-react";

export default function PortfolioPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-1 flex items-center gap-2">
          <Briefcase className="w-6 h-6 text-green-600" />
          求职档案
        </h1>
        <p className="text-slate-500 text-sm">
          构建可信求职档案，区块链背书的职业履历
        </p>
      </div>

      <Card className="border-dashed border-2">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <Construction className="w-16 h-16 text-slate-300 mb-4" />
          <h2 className="text-xl font-semibold text-slate-700 mb-2">功能开发中</h2>
          <p className="text-slate-500 text-center max-w-md mb-4">
            求职档案模块将支持：区块链验证的实习经历、项目经验、技能认证，
            帮助您构建可信的职业履历。
          </p>
          <Badge variant="outline" className="text-green-600 border-green-200">
            即将上线
          </Badge>
        </CardContent>
      </Card>
    </div>
  );
}
