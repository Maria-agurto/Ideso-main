import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricProps {
  label: string;
  value: string;
  subValue?: string;
  isPositive: boolean;
  suffix?: string;
}

const MetricCard = ({ label, value, subValue, isPositive, suffix }: MetricProps) => (
  <Card className="bg-white border-border shadow-sm">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider font-headline">
        {label}
      </CardTitle>
      {isPositive ? (
        <TrendingUp className="h-4 w-4 text-emerald-500" />
      ) : (
        <TrendingDown className="h-4 w-4 text-rose-500" />
      )}
    </CardHeader>
    <CardContent>
      <div className="flex items-baseline space-x-1">
        <div className="text-2xl font-bold font-headline">{value}</div>
        {suffix && <span className="text-sm font-medium text-muted-foreground">{suffix}</span>}
      </div>
      {subValue && (
        <p className={cn("text-xs mt-1 font-medium", isPositive ? "text-emerald-600" : "text-rose-600")}>
          {subValue}
        </p>
      )}
    </CardContent>
  </Card>
);

export function MetricsPanel({ metrics }: { metrics: any }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 w-full">
      <MetricCard 
        label="RMSE" 
        value={`$${metrics.rmse_usd}`} 
        subValue={`${metrics.rmse_percentage}% Variance`}
        isPositive={metrics.rmse_percentage < 5} 
      />
      <MetricCard 
        label="MAE" 
        value={`$${metrics.mae_usd}`} 
        subValue="Abs Error Mean"
        isPositive={true} 
      />
      <MetricCard 
        label="R-Squared" 
        value={metrics.r_squared.toString()} 
        subValue="94% Fitness"
        isPositive={metrics.r_squared > 0.9} 
      />
      <MetricCard 
        label="Dir. Accuracy" 
        value={`${metrics.directional_accuracy_percentage}%`} 
        subValue="Movement Precision"
        isPositive={metrics.directional_accuracy_percentage > 50} 
      />
    </div>
  );
}
