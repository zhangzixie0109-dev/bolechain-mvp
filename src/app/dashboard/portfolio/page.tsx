"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, CheckCircle, QrCode } from "lucide-react";

export default function PortfolioPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-1 flex items-center gap-2">
          <Briefcase className="w-6 h-6 text-green-600" /> 链上求职档案 — 即将上线
        </h1>
        <p className="text-slate-500 text-sm">区块链背书的可信职业履历，HR扫码即可验证</p>
      </div>

      {/* Mock Preview Card */}
      <Card className="bg-slate-100 border-2 border-dashed border-slate-300">
        <CardContent className="p-8">
          <div className="max-w-sm mx-auto space-y-6">
            {/* Header */}
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-blue-100 mx-auto mb-3 flex items-center justify-center">
                <span className="text-2xl">👤</span>
              </div>
              <h3 className="text-lg font-bold text-slate-800">张同学</h3>
              <p className="text-sm text-slate-500">港大金融 · 2028届</p>
            </div>

            {/* Credentials */}
            <div className="space-y-2">
              <p className="text-xs font-medium text-slate-500 uppercase">链上认证材料</p>
              <div className="space-y-1.5">
                {[
                  { type: "成绩单", hash: "a3f8b2c1...9e4d7f0a" },
                  { type: "AMC金奖", hash: "7b2e9f4d...1c8a3e5b" },
                  { type: "实习证明", hash: "e5c1d8a2...4f7b9e3c" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 bg-white rounded px-3 py-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-slate-700 flex-1">{item.type}</span>
                    <code className="text-xs text-slate-400 font-mono">{item.hash}</code>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <p className="text-center text-sm text-slate-600 bg-white rounded-lg p-3 border">
              HR 扫码即可在 10 秒内验证所有材料的真实性
            </p>

            {/* Fake QR */}
            <div className="flex justify-center">
              <div className="w-32 h-32 bg-white border-2 border-slate-200 rounded-lg flex items-center justify-center">
                <QrCode className="w-20 h-20 text-slate-300" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bottom text */}
      <div className="mt-6 text-center">
        <p className="text-sm text-slate-500">
          预计 2028 年正式上线，届时你的每一份可信材料都将伴随整个职业生涯
        </p>
        <Badge variant="outline" className="mt-3 text-green-600 border-green-200">开发中</Badge>
      </div>
    </div>
  );
}
