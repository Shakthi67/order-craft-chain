import { useState } from "react";
import { Send, Check } from "lucide-react";
import { SUPPLIERS, type Order } from "@/lib/demo-data";
import { sendRequest } from "@/lib/store";

export function SendRequestForm({ orders }: { orders: Order[] }) {
  const [orderId, setOrderId] = useState(orders[0]?.id ?? "");
  const [supplier, setSupplier] = useState(SUPPLIERS[0]!.name);
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [deadline, setDeadline] = useState("");
  const [sent, setSent] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const oid = orderId || orders[0]?.id;
    if (!oid || !name.trim() || !quantity.trim()) return;
    sendRequest({ orderId: oid, supplier, name: name.trim(), quantity: quantity.trim(), deadline: deadline || undefined });
    setSent(`Request sent to ${supplier}`);
    setName(""); setQuantity(""); setDeadline("");
    setTimeout(() => setSent(null), 3000);
  };

  const field = "w-full rounded-md border border-border bg-background px-2 py-1.5 text-sm";
  return (
    <section className="mt-10">
      <h2 className="font-display text-xl font-bold">Send request to supplier</h2>
      <p className="mt-1 text-sm text-muted-foreground">The supplier sees it in their portal and can confirm it.</p>
      <form onSubmit={submit} className="mt-4 grid gap-3 rounded-lg border border-border bg-card p-4 sm:grid-cols-2 lg:grid-cols-3">
        <label className="text-xs text-muted-foreground">Order
          <select className={field} value={orderId} onChange={(e) => setOrderId(e.target.value)}>
            {orders.map((o) => <option key={o.id} value={o.id}>{o.id} · {o.part}</option>)}
          </select>
        </label>
        <label className="text-xs text-muted-foreground">Supplier
          <select className={field} value={supplier} onChange={(e) => setSupplier(e.target.value)}>
            {SUPPLIERS.map((s) => <option key={s.name}>{s.name}</option>)}
          </select>
        </label>
        <label className="text-xs text-muted-foreground">Material
          <input className={field} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Copper bushings" required />
        </label>
        <label className="text-xs text-muted-foreground">Quantity
          <input className={field} value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="e.g. 200 pcs" required />
        </label>
        <label className="text-xs text-muted-foreground">Deadline
          <input type="date" className={field} value={deadline} onChange={(e) => setDeadline(e.target.value)} />
        </label>
        <div className="flex items-end gap-3">
          <button type="submit" className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90">
            <Send className="h-4 w-4" /> Send request
          </button>
          {sent && <span className="inline-flex items-center gap-1 text-xs font-medium text-success"><Check className="h-3 w-3" />{sent}</span>}
        </div>
      </form>
    </section>
  );
}
