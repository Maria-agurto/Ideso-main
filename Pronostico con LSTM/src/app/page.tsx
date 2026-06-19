"use client";

import { useState, useEffect, useMemo } from "react";
import { MetricsPanel } from "@/components/dashboard/MetricsPanel";
import { ModelConfig } from "@/components/dashboard/ModelConfig";
import { RegressionChart } from "@/components/dashboard/RegressionChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { generateMockData, getModelMetrics } from "@/lib/mock-data";
import { predictionHorizonInsight } from "@/ai/flows/prediction-horizon-insight-flow";
import { analyzeModelPerformance } from "@/ai/flows/model-performance-analysis-flow";
import { Sparkles, BrainCircuit, Calendar, TrendingUp, ShieldAlert, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

const TICKERS = ["AAPL", "BTC-USD", "ETH-USD", "MSFT", "NVDA"];
const PERIODS = ["3M", "6M", "1A", "2A"];
const HORIZONS = [7, 14, 30, 60];

export default function PredictorDashboard() {
  const [ticker, setTicker] = useState("AAPL");
  const [period, setPeriod] = useState("1A");
  const [horizon, setHorizon] = useState(30);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [horizonInsight, setHorizonInsight] = useState<string>("");
  const [performanceAnalysis, setPerformanceAnalysis] = useState<any>(null);

  const data = useMemo(() => generateMockData(ticker, horizon), [ticker, horizon]);
  const metrics = useMemo(() => getModelMetrics(ticker), [ticker]);

  // Fetch AI Insights when ticker or horizon changes
  useEffect(() => {
    async function fetchInsights() {
      setIsAiLoading(true);
      try {
        const [insight, analysis] = await Promise.all([
          predictionHorizonInsight({ assetTicker: ticker, currentHorizon: horizon }),
          analyzeModelPerformance(metrics)
        ]);
        setHorizonInsight(insight.explanation);
        setPerformanceAnalysis(analysis);
      } catch (err) {
        console.error("AI Insight Error:", err);
      } finally {
        setIsAiLoading(false);
      }
    }
    fetchInsights();
  }, [ticker, horizon, metrics]);

  return (
    <div className="min-h-screen p-4 md:p-8 space-y-8 bg-background max-w-[1600px] mx-auto animate-in fade-in duration-700">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline text-primary flex items-center gap-3">
            <BrainCircuit className="h-8 w-8 text-accent" />
            InverPulse Predictor
          </h1>
          <p className="text-muted-foreground text-sm font-medium mt-1">
            LSTM Neural Network | Deep Regression Engine v2.4
          </p>
        </div>

        <div className="flex items-center gap-4 bg-white p-2 rounded-xl shadow-sm border">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-muted-foreground ml-1">Asset</span>
            <Select value={ticker} onValueChange={setTicker}>
              <SelectTrigger className="w-[140px] border-none shadow-none focus:ring-0 font-headline font-semibold">
                <SelectValue placeholder="Select Ticker" />
              </SelectTrigger>
              <SelectContent>
                {TICKERS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="w-px h-10 bg-border" />
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-muted-foreground ml-1">Period</span>
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-[100px] border-none shadow-none focus:ring-0 font-headline font-semibold">
                <SelectValue placeholder="Period" />
              </SelectTrigger>
              <SelectContent>
                {PERIODS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>

      {/* Metrics Row */}
      <section>
        <MetricsPanel metrics={metrics} />
      </section>

      {/* Main Visualization Section */}
      <section className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <RegressionChart data={data} ticker={ticker} />
          
          {/* Horizon Control Slider Area */}
          <Card className="border-border bg-white shadow-sm overflow-hidden">
            <div className="bg-muted/30 p-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                <span className="text-sm font-headline font-bold uppercase tracking-wide">Prediction Horizon Adjustment</span>
              </div>
              <Badge variant="secondary" className="font-headline text-primary bg-primary/10">
                {horizon} Days Target
              </Badge>
            </div>
            <CardContent className="p-8 space-y-8">
              <div className="px-4">
                <Slider 
                  defaultValue={[30]} 
                  max={60} 
                  min={7} 
                  step={null} 
                  onValueChange={(val) => setHorizon(val[0])}
                  className="cursor-pointer"
                />
                <div className="flex justify-between mt-4 text-[10px] font-bold text-muted-foreground uppercase">
                  <span>7 Days</span>
                  <span>14 Days</span>
                  <span>30 Days</span>
                  <span>60 Days</span>
                </div>
              </div>
              
              <div className="bg-primary/5 rounded-lg p-5 border border-primary/10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Sparkles className="h-20 w-20 text-primary" />
                </div>
                <div className="flex items-start gap-4">
                  <div className="mt-1 p-2 bg-white rounded-full shadow-sm">
                    <Sparkles className="h-5 w-5 text-accent animate-pulse" />
                  </div>
                  <div className="space-y-2 relative z-10">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                      GenAI Horizon Impact Analysis
                      {isAiLoading && <span className="animate-bounce">...</span>}
                    </h4>
                    <p className="text-sm text-foreground/80 leading-relaxed max-w-3xl">
                      {isAiLoading ? "Processing market volatility variables and neural confidence levels..." : horizonInsight || "Select a horizon to generate AI prediction insight."}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Configuration & AI Stability Analysis */}
        <aside className="space-y-6">
          <ModelConfig />
          
          {/* Performance Analysis Sidebar Card */}
          <Card className="border-border bg-white shadow-sm">
            <CardHeader className="py-4 border-b bg-rose-50/50">
              <CardTitle className="text-sm font-headline uppercase tracking-widest text-rose-700 flex items-center gap-2">
                <ShieldAlert className="h-4 w-4" />
                Model Stability Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              {isAiLoading ? (
                <div className="space-y-4 py-4">
                  <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
                  <div className="h-20 bg-muted animate-pulse rounded" />
                </div>
              ) : performanceAnalysis ? (
                <>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">Overall Suitability</span>
                    <div className="flex items-center gap-2">
                      <div className={`h-2.5 w-2.5 rounded-full ${
                        performanceAnalysis.suitability === 'Highly Suitable' ? 'bg-emerald-500' :
                        performanceAnalysis.suitability === 'Moderately Suitable' ? 'bg-amber-500' : 'bg-rose-500'
                      }`} />
                      <span className="text-sm font-bold font-headline">{performanceAnalysis.suitability}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">Actionable Recommendations</span>
                    <ScrollArea className="h-[250px] pr-4">
                      <ul className="space-y-3">
                        {performanceAnalysis.actionable_recommendations.map((rec: string, i: number) => (
                          <li key={i} className="flex gap-2 text-xs leading-snug">
                            <ArrowRight className="h-3 w-3 mt-0.5 shrink-0 text-accent" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </ScrollArea>
                  </div>
                </>
              ) : (
                <p className="text-xs text-muted-foreground italic">Waiting for telemetry data interpretation...</p>
              )}
            </CardContent>
          </Card>
        </aside>
      </section>

      {/* Footer Branding */}
      <footer className="pt-8 border-t flex items-center justify-between text-muted-foreground">
        <div className="text-xs font-medium">
          Powered by <span className="font-headline font-bold text-primary">InverPulse™</span> Decision Support Systems
        </div>
        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1"><TrendingUp className="h-3 w-3" /> Real-time Feed</span>
          <span className="flex items-center gap-1"><ShieldAlert className="h-3 w-3" /> SEC Compliance Ready</span>
        </div>
      </footer>
    </div>
  );
}
