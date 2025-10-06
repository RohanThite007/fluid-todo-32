import { CheckCircle2, Circle, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

type TodoStatsProps = {
  total: number;
  active: number;
  completed: number;
};

export function TodoStats({ total, active, completed }: TodoStatsProps) {
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="grid grid-cols-3 gap-4 mb-6 animate-fade-in">
      <div className="bg-card rounded-xl p-4 border border-border hover:shadow-md transition-all">
        <div className="flex items-center gap-2 mb-2">
          <Circle className="w-4 h-4 text-primary" />
          <span className="text-sm text-muted-foreground">Active</span>
        </div>
        <p className="text-2xl font-bold text-foreground">{active}</p>
      </div>

      <div className="bg-card rounded-xl p-4 border border-border hover:shadow-md transition-all">
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle2 className="w-4 h-4 text-success" />
          <span className="text-sm text-muted-foreground">Completed</span>
        </div>
        <p className="text-2xl font-bold text-foreground">{completed}</p>
      </div>

      <div className="bg-card rounded-xl p-4 border border-border hover:shadow-md transition-all">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="w-4 h-4 text-primary" />
          <span className="text-sm text-muted-foreground">Progress</span>
        </div>
        <p className="text-2xl font-bold text-foreground">{completionRate}%</p>
      </div>

      {/* Progress bar */}
      <div className="col-span-3 bg-secondary rounded-full h-2 overflow-hidden">
        <div
          className={cn(
            "h-full bg-gradient-to-r from-primary to-primary-glow transition-all duration-500 ease-out",
            completionRate === 100 && "animate-pulse"
          )}
          style={{ width: `${completionRate}%` }}
        />
      </div>
    </div>
  );
}
