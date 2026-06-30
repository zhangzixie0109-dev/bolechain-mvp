"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Users, ShieldAlert, Link2, Brain } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent" />
        <div className="relative max-w-6xl mx-auto px-4 pt-20 pb-16 sm:pt-32 sm:pb-24">
          <div className="text-center">
            <Badge className="mb-6 bg-amber-500/20 text-amber-300 border-amber-500/30 text-sm px-4 py-1">
              跨境升学 AI + 区块链
            </Badge>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white mb-4 tracking-tight">
              BoleChain <span className="text-amber-400">伯乐智信</span>
            </h1>
            <p className="text-xl sm:text-2xl text-blue-200 mb-2 font-light">
              AI为你识千里马，区块链为你证真金
            </p>
            <p className="text-base sm:text-lg text-blue-300/70 mb-12">
              AI identifies your potential, Blockchain verifies your credentials
            </p>
          </div>

          {/* CTA Buttons - only student and parent */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20">
            <Link href="/register?role=student">
              <Button size="lg" className="w-64 bg-blue-600 hover:bg-blue-700 text-white text-lg h-14 gap-2">
                <GraduationCap className="w-5 h-5" />
                我是学生 Student
              </Button>
            </Link>
            <Link href="/register?role=parent">
              <Button size="lg" className="w-64 bg-green-600 hover:bg-green-700 text-white text-lg h-14 gap-2">
                <Users className="w-5 h-5" />
                我是家长 Parent
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Crisis Data Section */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            学历造假危机 Credential Fraud Crisis
          </h2>
          <p className="text-blue-300/80">跨境升学材料真实性已成为全行业痛点</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-16">
          <Card className="bg-red-950/40 border-red-500/30 backdrop-blur">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-red-500/20">
                  <ShieldAlert className="w-8 h-8 text-red-400" />
                </div>
                <div>
                  <p className="text-4xl font-bold text-red-400 mb-1">数百宗</p>
                  <p className="text-white font-medium text-lg mb-2">港大拦截假学历申请</p>
                  <p className="text-red-200/70 text-sm">香港大学近年拦截数百宗使用伪造学历文件的入学申请，涉及伪造成绩单、推荐信及语言考试成绩</p>
                  <Badge variant="outline" className="mt-3 text-red-300 border-red-500/40">HKU Admissions Office</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-red-950/40 border-red-500/30 backdrop-blur">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-red-500/20">
                  <ShieldAlert className="w-8 h-8 text-red-400" />
                </div>
                <div>
                  <p className="text-4xl font-bold text-red-400 mb-1">126宗</p>
                  <p className="text-white font-medium text-lg mb-2">港警假学历案件</p>
                  <p className="text-red-200/70 text-sm">香港警方破获126宗涉及伪造学历的刑事案件，部分涉及跨境犯罪集团系统性伪造留学申请材料</p>
                  <Badge variant="outline" className="mt-3 text-red-300 border-red-500/40">Hong Kong Police Force</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Solution Section */}
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">BoleChain 解决方案</h2>
          <p className="text-blue-300/80">AI智能规划 + 区块链材料认证，双重保障升学诚信</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="bg-white/5 border-white/10 backdrop-blur hover:border-amber-500/30 transition-colors">
            <CardContent className="p-6 text-center">
              <div className="p-4 rounded-full bg-blue-500/20 w-fit mx-auto mb-4">
                <Brain className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">AI 升学规划</h3>
              <p className="text-blue-200/70 text-sm">基于院校要求和学生背景，智能匹配最优申请策略</p>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10 backdrop-blur hover:border-amber-500/30 transition-colors">
            <CardContent className="p-6 text-center">
              <div className="p-4 rounded-full bg-amber-500/20 w-fit mx-auto mb-4">
                <Link2 className="w-8 h-8 text-amber-400" />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">区块链认证</h3>
              <p className="text-blue-200/70 text-sm">材料哈希上链，不可篡改，一键验证真伪</p>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10 backdrop-blur hover:border-amber-500/30 transition-colors">
            <CardContent className="p-6 text-center">
              <div className="p-4 rounded-full bg-green-500/20 w-fit mx-auto mb-4">
                <Users className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">家校协同</h3>
              <p className="text-blue-200/70 text-sm">学生、家长实时同步，透明可追溯</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Institution Contact Section */}
      <section id="institution-contact" className="max-w-6xl mx-auto px-4 pb-12">
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-8 text-center">
            <h3 className="text-xl font-semibold text-white mb-3">院校 / 机构合作</h3>
            <p className="text-blue-200/70 mb-4">
              如需了解 B 端解决方案（批量材料认证、API 接入、白标部署），请联系我们
            </p>
            <p className="text-amber-400 font-medium">hello@bolechain.demo</p>
            <Link href="/institution" className="inline-block mt-3">
              <Button variant="outline" size="sm" className="text-white border-white/30 hover:bg-white/10">
                查看机构后台演示 →
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <button onClick={() => document.getElementById("institution-contact")?.scrollIntoView({ behavior: "smooth" })} className="text-white/50 hover:text-white/80 text-sm underline mb-3 block mx-auto">
            院校/机构合作
          </button>
          <p className="text-white/40 text-sm">© 2026 BoleChain 伯乐智信. All rights reserved.</p>
          <p className="text-white/30 text-xs mt-1">Empowering cross-border education with AI & Blockchain</p>
        </div>
      </footer>
    </div>
  );
}
