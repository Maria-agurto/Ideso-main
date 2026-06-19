"use client";

import { 
  ResponsiveContainer, 
  ComposedChart, 
  Line, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ReferenceArea 
} from "recharts";
import { DataPoint } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ChartProps {
  data: DataPoint[];
  ticker: string;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border rounded-lg shadow-xl text-xs">
        <p className="font-bold mb-1 border-b pb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center justify-between gap-4 py-0.5">
            <span className="text-muted-foreground">{entry.name}:</span>
            <span className="font-mono font-bold" style={{ color: entry.color }}>
              ${entry.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export function RegressionChart({ data, ticker }: ChartProps) {
  // Find where the forecast starts for styling
  const forecastStartIndex = data.findIndex(d => d.isForecast);
  const forecastStartDate = data[forecastStartIndex]?.date;

  return (
    <Card className="w-full border-border bg-white shadow-md">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl font-headline tracking-tight text-primary">
            {ticker} Market Regression Flow
          </CardTitle>
          <p className="text-xs text-muted-foreground">Comparative Historical vs. LSTM Neural Prediction</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-[#1F3864]" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Historical</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 border-t-2 border-dashed border-[#EF5350]" />
            <span className="text-[10px] font-bold uppercase tracking-wider">LSTM Pred</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[450px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorBand" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF5350" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#EF5350" stopOpacity={0.05}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 10 }} 
                axisLine={false}
                tickLine={false}
                minTickGap={30}
              />
              <YAxis 
                domain={['auto', 'auto']} 
                tick={{ fontSize: 10 }} 
                axisLine={false}
                tickLine={false}
                tickFormatter={(val) => `$${val.toLocaleString()}`}
              />
              <Tooltip content={<CustomTooltip />} />
              
              {/* Confidence Band Area */}
              <Area
                name="Confidence Interval"
                dataKey="upper"
                stroke="none"
                fill="url(#colorBand)"
                fillOpacity={1}
                connectNulls
              />
              <Area
                dataKey="lower"
                stroke="none"
                fill="#ffffff"
                fillOpacity={1}
                connectNulls
              />

              {/* Historical Price */}
              <Line
                name="Actual Price"
                type="monotone"
                dataKey="actual"
                stroke="#1F3864"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 4 }}
              />

              {/* Predicted Price */}
              <Line
                name="LSTM Prediction"
                type="monotone"
                dataKey="predicted"
                stroke="#EF5350"
                strokeWidth={2.5}
                strokeDasharray="5 5"
                dot={false}
                activeDot={{ r: 4 }}
              />

              {/* Forecast Highlight */}
              {forecastStartDate && (
                <ReferenceArea 
                  x1={forecastStartDate} 
                  fill="#F3F4F6" 
                  fillOpacity={0.4} 
                  label={{ position: 'top', value: 'FORECAST ZONE', fontSize: 10, fill: '#6B7280', fontWeight: 'bold' }}
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
