import { cn } from "@/lib/utils";
import { daysUntil } from "@/lib/demo-data";

export function DeadlineTag({ date, done }: { date: string; done?: boolean }) {
  const d = daysUntil(date);
  const label = new Date(date + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  let tone = "bg-muted text-muted-foreground";
  let text = `Due ${label} · ${d}d left`;
  if (done) {
    tone = "bg-success/15 text-success";
    text = `Due ${label} · done`;
  } else if (d < 0) {
    tone = "bg-destructive text-destructive-foreground";
    text = `Overdue ${-d}d (${label})`;
  } else if (d <= 3) {
    tone = "bg-warning text-warning-foreground";
    text = d === 0 ? `Due today` : `Due ${label} · ${d}d left`;
  }
  return <span className={cn("inline-flex rounded px-1.5 py-0.5 font-mono text-[11px] font-medium", tone)}>{text}</span>;
}
