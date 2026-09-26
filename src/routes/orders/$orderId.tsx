import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Warehouse, Truck, Wrench } from "lucide-react";
import { DeadlineTag } from "@/components/Deadline";
import { getOrder } from "@/lib/demo-data";
import { MaterialStatusBadge, OrderStageBadge } from "@/components/StatusBadge";
import { formatDate } from "../index";

export const Route = createFileRoute("/orders/$orderId")({
  loader: ({ params }) => {
    const order = getOrder(params.orderId);
    if (!order) throw notFound();
    return order;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.id ?? "Order"} — ForgeWorks` },
      { name: "description", content: `Order details and production status for ${loaderData?.part ?? "order"}.` },
      { property: "og:title", content: `${loaderData?.id ?? "Order"} — ForgeWorks` },
      { property: "og:description", content: `Order details and production status for ${loaderData?.part ?? "order"}.` },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: OrderDetail,
});

function OrderDetail() {
  const order = Route.useLoaderData();
  const ownStock = order.materials.filter((m) => m.source === "own_stock");
  const thirdParty = order.materials.filter((m) => m.source === "third_party");

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="h-1.5 hazard-stripes" />
        <div className="mx-auto max-w-5xl px-6 py-4">
          <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Back to dashboard
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="font-mono text-sm font-semibold text-muted-foreground">{order.id}</p>
            <h1 className="mt-1 font-display text-3xl font-bold">{order.part}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {order.client} · {order.quantity} units · due {formatDate(order.dueDate)}
            </p>
          </div>
          <OrderStageBadge stage={order.stage} />
        </div>

        <div className="mt-8">
          <div className="space-y-6">
            <section className="rounded-lg border border-border bg-card p-5">
              <div className="flex items-center gap-2">
                <Wrench className="h-4 w-4 text-muted-foreground" />
                <h2 className="font-display font-bold">Part items needed</h2>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">Components that make up this part — built in-house or requested from a third party.</p>
              <div className="mt-3 overflow-hidden rounded-md border border-border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted text-left text-xs uppercase tracking-wide text-muted-foreground">
                      <th className="px-3 py-2 font-medium">Item</th>
                      <th className="px-3 py-2 font-medium">Qty</th>
                      <th className="px-3 py-2 font-medium">Built by</th>
                      <th className="px-3 py-2 font-medium">Deadline</th>
                      <th className="px-3 py-2 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.partItems.map((p) => (
                      <tr key={p.id} className="border-t border-border">
                        <td className="px-3 py-2 font-medium">{p.name}</td>
                        <td className="px-3 py-2 text-muted-foreground">{p.quantity}</td>
                        <td className="px-3 py-2">
                          {p.builtBy === "in_house" ? (
                            <span className="rounded bg-secondary px-1.5 py-0.5 text-xs font-medium text-secondary-foreground">Own (in-house)</span>
                          ) : (
                            <span className="text-xs"><span className="rounded bg-accent px-1.5 py-0.5 font-medium text-accent-foreground">Third party</span> <span className="text-muted-foreground">{p.supplier}</span></span>
                          )}
                        </td>
                        <td className="px-3 py-2">{p.deadline ? <DeadlineTag date={p.deadline} done={p.status === "ready"} /> : <span className="text-xs text-muted-foreground">—</span>}</td>
                        <td className="px-3 py-2 text-xs capitalize">{p.status.replace("_", " ")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="rounded-lg border border-border bg-card p-5">
              <div className="flex items-center gap-2">
                <Warehouse className="h-4 w-4 text-muted-foreground" />
                <h2 className="font-display font-bold">Own raw material</h2>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">Allocated from the factory's existing stock.</p>
              <ul className="mt-3 divide-y divide-border">
                {ownStock.map((m) => (
                  <li key={m.id} className="flex items-center justify-between py-3 text-sm">
                    <div>
                      <p className="font-medium">{m.name}</p>
                      <p className="text-xs text-muted-foreground">{m.quantity}</p>
                    </div>
                    <MaterialStatusBadge status={m.status} />
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-lg border border-border bg-card p-5">
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-muted-foreground" />
                <h2 className="font-display font-bold">Third-party material</h2>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">Requested from external suppliers for this order.</p>
              <ul className="mt-3 divide-y divide-border">
                {thirdParty.map((m) => (
                  <li key={m.id} className="flex items-center justify-between py-3 text-sm">
                    <div>
                      <p className="font-medium">{m.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {m.quantity} · {m.supplier}
                      </p>
                      {m.deadline && (
                        <div className="mt-1"><DeadlineTag date={m.deadline} done={m.status === "received"} /></div>
                      )}
                    </div>
                    <MaterialStatusBadge status={m.status} />
                  </li>
                ))}
              </ul>
            </section>

            {order.notes.length > 0 && (
              <section className="rounded-lg border border-border bg-card p-5">
                <h2 className="font-display font-bold">Shop notes</h2>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                  {order.notes.map((n, i) => (
                    <li key={i}>{n}</li>
                  ))}
                </ul>
              </section>
            )}

            <Link
              to="/track/$orderId"
              params={{ orderId: order.id }}
              className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
            >
              Open client tracking view
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
