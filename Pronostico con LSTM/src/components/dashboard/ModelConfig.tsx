import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cpu, Layers, Activity, Zap } from "lucide-react";

export function ModelConfig() {
  const configs = [
    { label: "Architecture", value: "LSTM Bi-Layer", icon: Layers },
    { label: "Hidden Units", value: "64, 32", icon: Cpu },
    { label: "Dropout", value: "0.20 Rate", icon: Activity },
    { label: "Optimizer", value: "Adam (0.001)", icon: Zap },
    { label: "Dense Layers", value: "16 (ReLU), 1 (Lin)", icon: Layers },
    { label: "Batch Size", value: "32 Items", icon: Activity },
  ];

  return (
    <Card className="h-full border-border bg-white shadow-sm overflow-hidden">
      <CardHeader className="bg-primary/5 border-b py-4">
        <CardTitle className="text-sm font-headline uppercase tracking-widest text-primary flex items-center gap-2">
          <Layers className="h-4 w-4" />
          Model Configuration Insight
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-2 divide-x divide-y divide-border">
          {configs.map((config, idx) => (
            <div key={idx} className="p-4 flex flex-col gap-1">
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">
                {config.label}
              </span>
              <span className="text-sm font-semibold font-headline text-foreground flex items-center gap-2">
                <config.icon className="h-3 w-3 text-primary/40" />
                {config.value}
              </span>
            </div>
          ))}
        </div>
        <div className="p-4 bg-muted/20">
          <p className="text-[11px] text-muted-foreground leading-tight italic">
            * Trained with TensorFlow/Keras using a 60-day historical OHLCV window. Optimized for continuous USD regression.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
