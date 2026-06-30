"use client";

import { useState } from "react";
import { mockAIPlanningResult, schools } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Brain, School, Calendar, Sparkles } from "lucide-react";

export default function PlanningPage() {
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    // Simulate AI processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setShowResult(true);
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-1 flex items-center gap-2">
          <Brain className="w-6 h-6 text-blue-600" />
          AI 升学规划
        </h1>
        <p className="text-slate-500 text-sm">
          基于院校要求和您的背景，智能生成个性化升学方案
        </p>
      </div>

      {/* School Info Cards */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        {schools.map((school) => (
          <Card key={school.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <School className="w-4 h-4 text-blue-600" />
                <CardTitle className="text-sm">{school.name}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <Badge variant="outline" className="mb-2">{school.region}</Badge>
              <p className="text-xs text-slate-500">
                DSE: {school.requirements.dse.minimum_score}
              </p>
              <p className="text-xs text-slate-500">
                面试: {school.requirements.interview.format}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Generate Button */}
      {!showResult && (
        <div className="text-center py-8">
          <Button
            size="lg"
            onClick={handleGenerate}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 gap-2"
          >
            <Sparkles className="w-5 h-5" />
            {loading ? "AI 分析中..." : "生成我的升学规划"}
          </Button>
          {loading && (
            <p className="text-sm text-slate-500 mt-3 animate-pulse">
              正在分析院校要求、匹配您的背景...
            </p>
          )}
        </div>
      )}

      {/* AI Result */}
      {showResult && (
        <div className="space-y-6">
          <Card className="border-blue-200 bg-blue-50/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                AI 规划结果
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700 mb-4">{mockAIPlanningResult.summary}</p>

              <div className="space-y-4">
                {mockAIPlanningResult.recommendations.map((rec, i) => (
                  <div key={i} className="bg-white rounded-lg p-4 border">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-slate-900">{rec.school}</h3>
                      <Badge className={
                        rec.matchScore >= 80 ? "bg-green-100 text-green-800" :
                        rec.matchScore >= 70 ? "bg-amber-100 text-amber-800" :
                        "bg-slate-100 text-slate-800"
                      }>
                        匹配度 {rec.matchScore}%
                      </Badge>
                    </div>
                    <p className="text-sm text-blue-700 font-medium mb-1">{rec.program}</p>
                    <p className="text-sm text-slate-600">{rec.reason}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="w-5 h-5 text-amber-600" />
                申请时间线
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockAIPlanningResult.timeline.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                    <span className="text-sm font-medium text-slate-700 w-28 shrink-0">
                      {item.month}
                    </span>
                    <span className="text-sm text-slate-600">{item.task}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
