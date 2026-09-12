import { cn } from "@/lib/utils";

interface ProgressBarProps {
  label: string;
  percentage: number;
  colorClass?: string;
  className?: string;
}

export function ProgressBar({ label, percentage, colorClass = "bg-primary", className }: ProgressBarProps) {
  return (
    <div className={cn("grid grid-cols-[130px_1fr_40px] gap-3 items-center text-sm", className)}>
      <span className="font-medium truncate">{label}</span>
      <div className="h-2.5 bg-muted rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full", colorClass)}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <b className="font-bold text-right">{percentage}%</b>
    </div>
  );
}
