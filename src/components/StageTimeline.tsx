import { Check } from "lucide-react";
import { STAGES, stageIndex, type OrderStage } from "@/lib/demo-data";
import { cn } from "@/lib/utils";

export function StageTimeline({ currentStage }: { currentStage: OrderStage }) {
  const current = stageIndex(currentStage);

  return (
    <ol className="space-y-0">
      {STAGES.map((stage, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={stage.key} className="relative flex gap-4 pb-8 last:pb-0">
            {i < STAGES.length - 1 && (
              <span
                className={cn(
                  "absolute left-[15px] top-8 h-[calc(100%-2rem)] w-0.5",
                  done ? "bg-primary" : "bg-border"
                )}
              />
            )}
            <span
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 font-mono text-xs font-semibold",
                done && "border-primary bg-primary text-primary-foreground",
                active && "border-primary bg-card text-foreground shadow-[0_0_0_4px_var(--color-primary)/20]",
                !done && !active && "border-border bg-muted text-muted-foreground"
              )}
            >
              {done ? <Check className="h-4 w-4" /> : i + 1}
            </span>
            <div className="pt-1">
              <p className={cn("font-display text-sm font-semibold", active ? "text-foreground" : done ? "text-foreground" : "text-muted-foreground")}>
                {stage.label}
              </p>
              <p className="text-xs text-muted-foreground">{stage.description}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
