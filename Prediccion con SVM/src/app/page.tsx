"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  ScatterChart, 
  Scatter, 
  ZAxis, 
  Cell,
  ReferenceLine
} from 'recharts';
import { 
  Brain, 
  ChevronDown, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Info, 
  BarChart3, 
  Activity,
  ArrowRight,
  Target
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  generateSimulationData, 
  getModelMetrics, 
  CONFUSION_MATRIX, 
  TICKERS, 
  PricePoint, 
  SignalClass 
} from '@/lib/simulation-data';
import { aiExplanationForSVMSignal } from '@/ai/flows/ai-explanation-for-svm-signal-flow';

export default function InvestAIPredict() {
  const [selectedTicker, setSelectedTicker] = useState(TICKERS[0]);
  const [data, setData] = useState<PricePoint[]>([]);
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);

  useEffect(() => {
    const simulation = generateSimulationData(selectedTicker);
    setData(simulation);
    setAiExplanation(null);
  }, [selectedTicker]);

  const currentSignal = useMemo(() => {
    if (data.length === 0) return null;
    return data[data.length - 1];
  }, [data]);

  const metrics = useMemo(() => getModelMetrics(), []);

  const handleGetExplanation = async () => {
    if (!currentSignal) return;
    setLoadingAI(true);
    try {
      const result = await aiExplanationForSVMSignal({
        ticker: selectedTicker,
        currentPrediction: currentSignal.prediction,
        historicalPrices: data.slice(-60).map(p => ({ date: p.date, price: p.price }))
      });
      setAiExplanation(result.explanation);
    } catch (error) {
      console.error("AI flow error", error);
    } finally {
      setLoadingAI(false);
    }
  };

  const getSignalColor = (signal: SignalClass) => {
    switch (signal) {
      case 'BUY': return '#26A69A';
      case 'SELL': return '#EF5350';
      case 'HOLD': return '#FFA726';
    }
  };

  const getSignalIcon = (signal: SignalClass) => {
    switch (signal) {
      case 'BUY': return <TrendingUp className="h-6 w-6" />;
      case 'SELL': return <TrendingDown className="h-6 w-6" />;
      case 'HOLD': return <Minus className="h-6 w-6" />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Navigation Header */}
      <header className="border-b bg-white z-10 sticky top-0 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-primary p-2 rounded-lg">
            <Brain className="text-white h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold font-headline text-primary tracking-tight">InvestAI <span className="text-accent">Predict</span></h1>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">SVC Decision Support System</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Select value={selectedTicker} onValueChange={setSelectedTicker}>
            <SelectTrigger className="w-[140px] font-semibold border-2">
              <SelectValue placeholder="Select Ticker" />
            </SelectTrigger>
            <SelectContent>
              {TICKERS.map(t => (
                <SelectItem key={t} value={t} className="font-medium">{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="h-8 w-px bg-border hidden sm:block"></div>
          <Button variant="ghost" size="sm" className="hidden sm:flex gap-2">
            <Activity className="h-4 w-4" />
            System Status: <span className="text-green-600 font-bold">LIVE</span>
          </Button>
        </div>
      </header>

      <main className="flex-1 p-6 md:p-10 space-y-8 max-w-7xl mx-auto w-full">
        {/* Signal Semaphore Hero */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <Card className="md:col-span-4 border-2 shadow-lg overflow-hidden flex flex-col">
            <CardHeader className="bg-primary text-white border-b-0 pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-sm font-semibold uppercase tracking-wider opacity-80">Current Prediction</CardTitle>
                <Badge variant="secondary" className="bg-accent text-white font-bold border-0">SVM RBF Kernel</Badge>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col items-center justify-center p-8 gap-4 text-center">
              <div className="text-4xl font-black text-primary tracking-tighter">{selectedTicker}</div>
              <div className="text-sm text-muted-foreground font-medium">{currentSignal?.date}</div>
              
              <div 
                className="w-32 h-32 rounded-full flex items-center justify-center transition-all duration-500 shadow-xl border-8"
                style={{ 
                  backgroundColor: `${getSignalColor(currentSignal?.prediction || 'HOLD')}15`,
                  borderColor: getSignalColor(currentSignal?.prediction || 'HOLD'),
                  color: getSignalColor(currentSignal?.prediction || 'HOLD')
                }}
              >
                {getSignalIcon(currentSignal?.prediction || 'HOLD')}
              </div>
              
              <div className="space-y-1">
                <div 
                  className="text-3xl font-black uppercase tracking-tight"
                  style={{ color: getSignalColor(currentSignal?.prediction || 'HOLD') }}
                >
                  {currentSignal?.prediction === 'BUY' ? 'COMPRAR' : currentSignal?.prediction === 'SELL' ? 'VENDER' : 'MANTENER'}
                </div>
                <div className="text-sm font-medium text-muted-foreground italic">Target Confidence: 84.5%</div>
              </div>
            </CardContent>
            <div className="p-4 bg-muted/50 border-t flex items-center justify-between text-xs font-semibold px-6">
              <span className="flex items-center gap-1.5"><Info className="h-3 w-3" /> C=1.0, Gamma='scale'</span>
              <span className="text-primary">60-day Window</span>
            </div>
          </Card>

          {/* AI Reasoning Section */}
          <Card className="md:col-span-8 border-2 shadow-sm flex flex-col bg-slate-50/50">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2 text-primary">
                <Brain className="h-5 w-5" />
                <CardTitle className="text-lg">Predictive Intelligence Reasoning</CardTitle>
              </div>
              <CardDescription>Generative analysis based on high-dimensional price hyperplane classification.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-4">
              <div className="bg-white rounded-xl border-2 border-dashed p-6 min-h-[160px] flex items-center justify-center relative overflow-hidden">
                {!aiExplanation && !loadingAI && (
                  <div className="text-center space-y-3 z-10">
                    <p className="text-muted-foreground font-medium">Request a natural language summary of the SVM signal logic.</p>
                    <Button onClick={handleGetExplanation} className="bg-primary hover:bg-primary/90">
                      Generate AI Insight <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                )}
                
                {loadingAI && (
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-10 w-10 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
                    <p className="font-semibold text-primary animate-pulse">Analyzing price volatility patterns...</p>
                  </div>
                )}

                {aiExplanation && (
                  <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <p className="text-primary font-medium leading-relaxed italic border-l-4 border-accent pl-4">
                      "{aiExplanation}"
                    </p>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Volatility', value: 'High', color: 'text-orange-500' },
                  { label: 'Trend Strength', value: 'Moderate', color: 'text-blue-500' },
                  { label: 'Hyperplane Dist', value: '2.44σ', color: 'text-primary' },
                ].map((stat, idx) => (
                  <div key={idx} className="bg-white p-3 rounded-lg border flex flex-col items-center">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground">{stat.label}</span>
                    <span className={`text-sm font-black ${stat.color}`}>{stat.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Historical Trend Visualization */}
        <Card className="border-2 shadow-lg overflow-hidden">
          <CardHeader className="bg-white border-b px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-headline flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  SVM Historical Trend Mapping
                </CardTitle>
                <CardDescription>60-day window classification visualized over 180 trading days.</CardDescription>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#26A69A]"></div>
                  <span className="text-xs font-bold">BUY</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#EF5350]"></div>
                  <span className="text-xs font-bold">SELL</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#FFA726]"></div>
                  <span className="text-xs font-bold">HOLD</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-10 pb-6 px-4">
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 10, fontWeight: 'bold' }} 
                    axisLine={false}
                    tickLine={false}
                    dy={10}
                    minTickGap={30}
                  />
                  <YAxis 
                    domain={['auto', 'auto']} 
                    tick={{ fontSize: 10, fontWeight: 'bold' }}
                    axisLine={false}
                    tickLine={false}
                    dx={-10}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    labelClassName="font-bold text-primary"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="price" 
                    stroke="#1F3864" 
                    strokeWidth={3} 
                    dot={(props) => {
                      const { cx, cy, payload } = props;
                      const size = 30;
                      if (payload.prediction === 'BUY') {
                        return <path d={`M${cx},${cy-8} L${cx-6},${cy+4} L${cx+6},${cy+4} Z`} fill="#26A69A" stroke="#fff" strokeWidth={1} />;
                      }
                      if (payload.prediction === 'SELL') {
                        return <path d={`M${cx},${cy+8} L${cx-6},${cy-4} L${cx+6},${cy-4} Z`} fill="#EF5350" stroke="#fff" strokeWidth={1} />;
                      }
                      return <circle cx={cx} cy={cy} r={3} fill="#FFA726" stroke="#fff" strokeWidth={1} />;
                    }}
                    activeDot={{ r: 8, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Model Diagnostics Suite */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <Card className="md:col-span-7 border-2 shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Classification Diagnostics</CardTitle>
              </div>
              <CardDescription>Precision and Recall performance across decision boundaries.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="p-4 bg-primary text-white rounded-xl shadow-md flex flex-col items-center text-center">
                  <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">Accuracy</span>
                  <span className="text-2xl font-black">{metrics.accuracy}%</span>
                </div>
                <div className="p-4 bg-accent text-white rounded-xl shadow-md flex flex-col items-center text-center">
                  <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">Weighted F1</span>
                  <span className="text-2xl font-black">{metrics.f1Score}</span>
                </div>
                <div className="p-4 bg-slate-100 border-2 rounded-xl flex flex-col items-center text-center">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Support</span>
                  <span className="text-2xl font-black text-primary">1,240</span>
                </div>
              </div>
              
              <div className="space-y-6">
                {(['BUY', 'SELL', 'HOLD'] as SignalClass[]).map(cls => (
                  <div key={cls} className="space-y-2">
                    <div className="flex justify-between items-center text-sm font-bold">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getSignalColor(cls) }}></div>
                        <span className="text-primary">{cls}</span>
                      </div>
                      <div className="flex gap-4">
                        <span className="text-muted-foreground">Precision: <span className="text-primary">{(metrics.precision[cls] * 100).toFixed(0)}%</span></span>
                        <span className="text-muted-foreground">Recall: <span className="text-primary">{(metrics.recall[cls] * 100).toFixed(0)}%</span></span>
                      </div>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden flex">
                      <div 
                        className="h-full transition-all duration-1000" 
                        style={{ width: `${metrics.precision[cls] * 100}%`, backgroundColor: getSignalColor(cls) }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Confusion Matrix Section */}
          <Card className="md:col-span-5 border-2 shadow-sm flex flex-col">
            <CardHeader>
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Confusion Matrix</CardTitle>
              </div>
              <CardDescription>Actual vs Predicted classification heatmap.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-center">
              <div className="grid grid-cols-4 gap-2 mb-2">
                <div></div>
                {['HOLD', 'BUY', 'SELL'].map(label => (
                  <div key={label} className="text-center text-[10px] font-black text-muted-foreground uppercase">{label} <br/>(Pred)</div>
                ))}
              </div>
              
              {CONFUSION_MATRIX.map((row, i) => (
                <div key={i} className="grid grid-cols-4 gap-2 mb-2">
                  <div className="flex items-center justify-center text-[10px] font-black text-muted-foreground uppercase text-right leading-none">
                    {['HOLD', 'BUY', 'SELL'][i]} <br/> (True)
                  </div>
                  {row.map((val, j) => {
                    // Heatmap logic
                    const opacity = Math.max(0.1, val / 60);
                    const isDiagonal = i === j;
                    return (
                      <div 
                        key={j} 
                        className={`aspect-square flex items-center justify-center rounded-lg font-black text-lg transition-all duration-500 border-2 ${isDiagonal ? 'border-accent' : 'border-transparent'}`}
                        style={{ 
                          backgroundColor: `rgba(31, 56, 100, ${opacity})`,
                          color: opacity > 0.5 ? 'white' : '#1F3864'
                        }}
                      >
                        {val}
                      </div>
                    );
                  })}
                </div>
              ))}
              
              <div className="mt-4 p-3 bg-muted/30 rounded-lg text-[10px] font-medium text-muted-foreground leading-relaxed">
                The matrix shows a high concentration on the diagonal axis, indicating the SVM model effectively separates the normalized price windows with the RBF kernel.
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="border-t py-8 bg-slate-50 mt-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-medium text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-1.5 rounded-md">
              <Brain className="h-4 w-4 text-primary" />
            </div>
            <span>© 2024 InvestAI Quant Systems. Institutional Grade Prediction Engine.</span>
          </div>
          <div className="flex gap-8">
            <a href="#" className="hover:text-primary transition-colors">Documentation</a>
            <a href="#" className="hover:text-primary transition-colors">API Docs</a>
            <a href="#" className="hover:text-primary transition-colors">Security</a>
          </div>
        </div>
      </footer>
    </div>
  );
}