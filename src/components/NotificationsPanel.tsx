import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Bell, Check, X } from "lucide-react";
import { NOTIFICATIONS, type AppNotification } from "@/lib/demo-data";
import { cn } from "@/lib/utils";

type State = "pending" | "confirmed" | "dismissed";

export function NotificationsPanel() {
  const [states, setStates] = useState<Record<string, State>>({});
  const set = (id: string, s: State) => setStates((p) => ({ ...p, [id]: s }));
  const visible = NOTIFICATIONS.filter((n) => states[n.id] !== "dismissed");
  const pending = visible.filter((n) => n.needsConfirmation && states[n.id] !== "confirmed").length;

  return (
    <section className="mt-10">
      <div className="flex items-center gap-2">
        <Bell className="h-5 w-5" />
        <h2 className="font-display text-xl font-bold">Notifications</h2>
        {pending > 0 && (
          <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">
            {pending} need confirmation
          </span>
        )}
      </div>
      <ul className="mt-4 divide-y divide-border overflow-hidden rounded-lg border border-border bg-card">
        {visible.length === 0 && <li className="p-4 text-sm text-muted-foreground">All caught up.</li>}
        {visible.map((n) => (
          <Item key={n.id} n={n} state={states[n.id] ?? "pending"} onSet={(s) => set(n.id, s)} />
        ))}
      </ul>
    </section>
  );
}

function Item({ n, state, onSet }: { n: AppNotification; state: State; onSet: (s: State) => void }) {
  const confirmed = state === "confirmed";
  return (
    <li className={cn("flex flex-wrap items-start justify-between gap-3 p-4", n.kind === "deadline" && !confirmed && "bg-destructive/5")}>
      <div className="min-w-0">
        <p className="text-sm font-semibold">
          {n.title}{" "}
          <Link to="/orders/$orderId" params={{ orderId: n.orderId }} className="font-mono text-xs text-muted-foreground hover:underline">
            {n.orderId}
          </Link>
        </p>
        <p className="text-xs text-muted-foreground">{n.detail}</p>
        <p className="mt-1 text-[11px] text-muted-foreground">{n.time}</p>
      </div>
      <div className="flex items-center gap-2">
        {n.needsConfirmation && !confirmed && (
          <button onClick={() => onSet("confirmed")} className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:opacity-90">
            <Check className="h-3 w-3" /> Confirm
          </button>
        )}
        {confirmed && <span className="inline-flex items-center gap-1 text-xs font-medium text-success"><Check className="h-3 w-3" /> Confirmed</span>}
        <button onClick={() => onSet("dismissed")} aria-label="Dismiss" className="rounded-md p-1.5 text-muted-foreground hover:bg-muted">
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </li>
  );
}
