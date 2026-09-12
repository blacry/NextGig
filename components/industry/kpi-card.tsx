import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight, LucideIcon } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  iconClassName?: string;
  className?: string;
}

export function KpiCard({ title, value, icon: Icon, trend, iconClassName, className }: KpiCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-6">
        <div
          className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center mb-4",
            iconClassName || "bg-primary/10 text-primary"
          )}
        >
          <Icon className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h3 className="text-3xl font-bold tracking-tight">{value}</h3>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
        </div>
        {trend && (
          <div
            className={cn(
              "flex items-center gap-1 mt-4 text-xs font-semibold",
              trend.isPositive ? "text-emerald-600 dark:text-emerald-500" : "text-rose-600 dark:text-rose-500"
            )}
          >
            {trend.isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            <span>{trend.value}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
