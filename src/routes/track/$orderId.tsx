import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Factory, ArrowLeft, CheckCircle2, Clock, Circle, Mail } from "lucide-react";
import { getOrder, daysUntil } from "@/lib/demo-data";
import { formatDate } from "../index";

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

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-4">
      <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-lg font-bold">{value}</p>
    </div>
  );
}

function TrackOrder() {
  const order = Route.useLoaderData();
  const daysLeft = daysUntil(order.dueDate);
  const ready = order.partItems.filter((p) => p.status === "ready").length;

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
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to dashboard
        </Link>

        <div className="mt-6 overflow-hidden rounded-xl border border-border bg-card">
          <div className="bg-secondary p-6 text-secondary-foreground">
            <p className="font-mono text-sm font-semibold opacity-80">{order.id} · {order.client}</p>
            <h1 className="mt-1 font-display text-3xl font-bold">{order.part}</h1>
            <p className="mt-2 text-sm opacity-80">{order.quantity} units</p>
          </div>
          <div className="grid grid-cols-3 divide-x divide-border text-center">
            <Info label="Placed" value={formatDate(order.placedDate)} />
            <Info label="Expected" value={formatDate(order.dueDate)} />
            <Info
              label={order.stage === "delivered" ? "Status" : "Time left"}
              value={order.stage === "delivered" ? "Delivered" : daysLeft >= 0 ? `${daysLeft} days` : "Delayed"}
            />
          </div>
        </div>

        <section className="mt-6 rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold">Components of your order</h2>
            <span className="font-mono text-xs text-muted-foreground">{ready}/{order.partItems.length} ready</span>
          </div>
          <ul className="mt-3 space-y-2">
            {order.partItems.map((p) => (
              <li key={p.id} className="flex items-center gap-3 rounded-md border border-border px-3 py-2.5 text-sm">
                {p.status === "ready" ? (
                  <CheckCircle2 className="h-5 w-5 text-success" />
                ) : p.status === "in_progress" ? (
                  <Clock className="h-5 w-5 text-primary" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground" />
                )}
                <span className="flex-1 font-medium">{p.name}</span>
                <span className="text-xs text-muted-foreground">
                  {p.status === "ready" ? "Ready" : p.status === "in_progress" ? "In progress" : "Scheduled"}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-5">
          <div>
            <p className="font-display font-bold">Questions about this order?</p>
            <p className="text-xs text-muted-foreground">Your ForgeWorks account manager is here to help.</p>
          </div>
          <a href="mailto:support@forgeworks.example" className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90">
            <Mail className="h-4 w-4" /> Contact us
          </a>
        </section>
      </main>
    </div>
  );
}
