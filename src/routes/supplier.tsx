import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Bell, Check, Truck } from "lucide-react";
import { SUPPLIERS, visibleOrders } from "@/lib/demo-data";
import { supplierConfirm, useDemoState } from "@/lib/store";
import { DeadlineTag } from "@/components/Deadline";
import { MaterialStatusBadge } from "@/components/StatusBadge";
import { OrderChat } from "@/components/OrderChat";
import { formatDate } from "./index";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/supplier")({
  head: () => ({
    meta: [
      { title: "Supplier Portal — ForgeWorks" },
      { name: "description", content: "Third-party suppliers confirm material requests, view orders and chat with ForgeWorks." },
      { property: "og:title", content: "Supplier Portal — ForgeWorks" },
      { property: "og:description", content: "Third-party suppliers confirm material requests, view orders and chat with ForgeWorks." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SupplierPortal,
});

function SupplierPortal() {
  const state = useDemoState();
  const [supplier, setSupplier] = useState(SUPPLIERS[0]!.name);
  const [chatOrder, setChatOrder] = useState<string | null>(null);

  const orders = visibleOrders(state.confirmed)
    .map((o) => ({ order: o, mats: o.materials.filter((m) => m.supplier === supplier) }))
    .filter((x) => x.mats.length > 0);

  const requests = orders.flatMap(({ order, mats }) =>
    mats.filter((m) => m.status === "requested" && !state.supplierConfirmed.includes(m.id)).map((m) => ({ order, m })),
  );
  const activeChat = orders.find((x) => x.order.id === chatOrder)?.order ?? orders[0]?.order;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="h-1.5 hazard-stripes" />
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Truck className="h-5 w-5" />
            </span>
            <div>
              <p className="font-display text-lg font-bold leading-tight">Supplier Portal</p>
              <p className="text-xs text-muted-foreground">Requests from ForgeWorks Mfg.</p>
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Signed in as (demo)</span>
            <select
              value={supplier}
              onChange={(e) => { setSupplier(e.target.value); setChatOrder(null); }}
              className="rounded-md border border-border bg-background px-2 py-1.5 text-sm"
            >
              {SUPPLIERS.map((s) => <option key={s.name}>{s.name}</option>)}
            </select>
          </label>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8">
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to dashboard
        </Link>

        <section className="mt-6">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            <h2 className="font-display text-xl font-bold">Requests to confirm</h2>
            {requests.length > 0 && (
              <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">{requests.length}</span>
            )}
          </div>
          <ul className="mt-4 divide-y divide-border overflow-hidden rounded-lg border border-border bg-card">
            {requests.length === 0 && <li className="p-4 text-sm text-muted-foreground">No new requests.</li>}
            {requests.map(({ order, m }) => (
              <li key={m.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
                <div>
                  <p className="text-sm font-semibold">{m.quantity} × {m.name} <span className="font-mono text-xs text-muted-foreground">{order.id}</span></p>
                  <p className="text-xs text-muted-foreground">For {order.part}</p>
                  {m.deadline && <div className="mt-1"><DeadlineTag date={m.deadline} /></div>}
                </div>
                <button onClick={() => supplierConfirm(m.id)} className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:opacity-90">
                  <Check className="h-3 w-3" /> Confirm request
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-10">
          <h2 className="font-display text-xl font-bold">My orders</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {orders.length === 0 && <p className="text-sm text-muted-foreground">No orders yet.</p>}
            {orders.map(({ order, mats }) => (
              <div key={order.id} className={cn("rounded-lg border bg-card p-4", activeChat?.id === order.id ? "border-primary" : "border-border")}>
                <div className="flex items-center justify-between">
                  <p className="font-mono text-xs font-semibold">{order.id}</p>
                  <span className="text-xs text-muted-foreground">Order due {formatDate(order.dueDate)}</span>
                </div>
                <p className="mt-1 font-display font-semibold">{order.part}</p>
                <ul className="mt-3 space-y-2">
                  {mats.map((m) => (
                    <li key={m.id} className="flex flex-wrap items-center justify-between gap-2 text-sm">
                      <span>{m.quantity} × {m.name}</span>
                      <span className="flex items-center gap-2">
                        {m.deadline && <DeadlineTag date={m.deadline} />}
                        {state.supplierConfirmed.includes(m.id)
                          ? <span className="text-xs font-medium text-success">Confirmed</span>
                          : <MaterialStatusBadge status={m.status} />}
                      </span>
                    </li>
                  ))}
                </ul>
                <button onClick={() => { setChatOrder(order.id); setTimeout(() => document.getElementById("supplier-chat")?.scrollIntoView({ behavior: "smooth", block: "start" }), 50); }} className="mt-3 text-xs font-medium hover:underline">
                  Open chat →
                </button>
              </div>
            ))}
          </div>
        </section>

        {activeChat && (
          <div id="supplier-chat" className="mt-10 scroll-mt-4">
            <p className="mb-2 font-mono text-xs text-muted-foreground">Chat · {activeChat.id}</p>
            <OrderChat key={`${supplier}-${activeChat.id}`} order={activeChat} mode="supplier" supplier={supplier} />
          </div>
        )}
      </main>
    </div>
  );
}
