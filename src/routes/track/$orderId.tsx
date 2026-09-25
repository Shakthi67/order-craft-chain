import { createFileRoute, notFound } from "@tanstack/react-router";
import { Factory } from "lucide-react";
import { getOrder, STAGES, stageIndex } from "@/lib/demo-data";
import { formatDate } from "../index";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/track/$orderId")({
  loader: ({ params }) => {
    const order = getOrder(params.orderId);
    if (!order) throw notFound();
    return order;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `Track ${loaderData?.id ?? "order"} — ForgeWorks` },
      { name: "description", content: "Live status of your manufacturing order." },
      { property: "og:title", content: `Track ${loaderData?.id ?? "order"} — ForgeWorks` },
      { property: "og:description", content: "Live status of your manufacturing order." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: TrackOrder,
});

function TrackOrder() {
  const order = Route.useLoaderData();
  const current = stageIndex(order.stage);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="h-1.5 hazard-stripes" />
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-6 py-4">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Factory className="h-5 w-5" />
          </span>
          <div>
            <p className="font-display text-lg font-bold leading-tight">ForgeWorks Mfg.</p>
            <p className="text-xs text-muted-foreground">Client order tracking</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-10">
        <p className="font-mono text-sm font-semibold text-muted-foreground">{order.id}</p>
        <h1 className="mt-1 font-display text-3xl font-bold">{order.part}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {order.quantity} units · placed {formatDate(order.placedDate)} · expected {formatDate(order.dueDate)}
        </p>

        <div className="mt-6 rounded-lg border border-border bg-card p-5">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Overall progress</span>
            <span className="font-mono font-semibold">{order.progress}%</span>
          </div>
          <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${order.progress}%` }} />
          </div>
        </div>

        <ol className="mt-8 space-y-4">
          {STAGES.map((stage, i) => {
            const done = i < current;
            const active = i === current;
            return (
              <li
                key={stage.key}
                className={cn(
                  "flex items-center gap-4 rounded-lg border p-4",
                  active ? "border-primary bg-card shadow-sm" : "border-border bg-card",
                  !done && !active && "opacity-50"
                )}
              >
                <span
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-mono text-sm font-bold",
                    done || active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  )}
                >
                  {i + 1}
                </span>
                <div>
                  <p className="font-display font-semibold">{stage.label}</p>
                  <p className="text-xs text-muted-foreground">{stage.description}</p>
                </div>
                {active && (
                  <span className="ml-auto rounded-full bg-primary px-2.5 py-0.5 text-xs font-semibold text-primary-foreground">
                    Current stage
                  </span>
                )}
                {done && <span className="ml-auto text-xs font-medium text-success">Complete</span>}
              </li>
            );
          })}
        </ol>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          Questions about this order? Contact your ForgeWorks account manager.
        </p>
      </main>
    </div>
  );
}
