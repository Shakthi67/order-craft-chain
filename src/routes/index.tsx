import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Factory, Package, Truck, ClipboardList } from "lucide-react";
import { ORDERS, SUPPLIERS } from "@/lib/demo-data";
import { OrderStageBadge } from "@/components/StatusBadge";
import { NotificationsPanel } from "@/components/NotificationsPanel";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ForgeWorks — Manufacturing Order Dashboard" },
      { name: "description", content: "Track client orders from material sourcing through production to delivery." },
      { property: "og:title", content: "ForgeWorks — Manufacturing Order Dashboard" },
      { property: "og:description", content: "Track client orders from material sourcing through production to delivery." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const active = ORDERS.filter((o) => o.stage !== "delivered");
  const delivered = ORDERS.filter((o) => o.stage === "delivered");
  const thirdPartyPending = ORDERS.flatMap((o) => o.materials).filter(
    (m) => m.source === "third_party" && (m.status === "requested" || m.status === "in_transit")
  ).length;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="h-1.5 hazard-stripes" />
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Factory className="h-5 w-5" />
            </span>
            <div>
              <p className="font-display text-lg font-bold leading-tight">ForgeWorks Mfg.</p>
              <p className="text-xs text-muted-foreground">Order & Production Tracker</p>
            </div>
          </div>
          <nav className="flex items-center gap-4 text-sm">
            <span className="font-medium text-foreground">Dashboard</span>
            <Link to="/track/$orderId" params={{ orderId: "ORD-1042" }} className="text-muted-foreground hover:text-foreground">
              Client view
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard icon={<ClipboardList className="h-5 w-5" />} label="Active orders" value={String(active.length)} />
          <StatCard icon={<Package className="h-5 w-5" />} label="Third-party materials pending" value={String(thirdPartyPending)} />
          <StatCard icon={<Truck className="h-5 w-5" />} label="Delivered this month" value={String(delivered.length)} />
        </div>

        <NotificationsPanel />

        <section className="mt-10">
          <h2 className="font-display text-xl font-bold">Orders</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Every client order, from receipt through sourcing, production, and delivery.
          </p>
          <div className="mt-4 overflow-hidden rounded-lg border border-border bg-card">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-4 py-3 font-medium">Order</th>
                  <th className="px-4 py-3 font-medium">Client</th>
                  <th className="px-4 py-3 font-medium">Part</th>
                  <th className="px-4 py-3 font-medium">Qty</th>
                  <th className="px-4 py-3 font-medium">Stage</th>
                  <th className="px-4 py-3 font-medium">Progress</th>
                  <th className="px-4 py-3 font-medium">Due</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {ORDERS.map((order) => (
                  <tr key={order.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                    <td className="px-4 py-3 font-mono text-xs font-semibold">{order.id}</td>
                    <td className="px-4 py-3">{order.client}</td>
                    <td className="px-4 py-3 text-muted-foreground">{order.part}</td>
                    <td className="px-4 py-3">{order.quantity}</td>
                    <td className="px-4 py-3"><OrderStageBadge stage={order.stage} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
                          <div className="h-full rounded-full bg-primary" style={{ width: `${order.progress}%` }} />
                        </div>
                        <span className="font-mono text-xs text-muted-foreground">{order.progress}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{formatDate(order.dueDate)}</td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        to="/orders/$orderId"
                        params={{ orderId: order.id }}
                        className="inline-flex items-center gap-1 text-xs font-medium text-foreground hover:underline"
                      >
                        Details <ArrowRight className="h-3 w-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="font-display text-xl font-bold">Third-party suppliers</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            External partners providing materials your own stock doesn't cover.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {SUPPLIERS.map((s) => (
              <div key={s.name} className="rounded-lg border border-border bg-card p-4">
                <p className="font-display font-semibold">{s.name}</p>
                <p className="text-xs text-muted-foreground">{s.category}</p>
                <div className="mt-3 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    {s.openRequests > 0 ? `${s.openRequests} open request${s.openRequests > 1 ? "s" : ""}` : "No open requests"}
                  </span>
                  <span className="font-mono font-medium text-success">{s.onTimeRate}% on-time</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-4 rounded-lg border border-border bg-card p-4">
      <span className="flex h-10 w-10 items-center justify-center rounded-md bg-secondary text-secondary-foreground">{icon}</span>
      <div>
        <p className="font-display text-2xl font-bold leading-none">{value}</p>
        <p className="mt-1 text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

export function formatDate(iso: string): string {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}
