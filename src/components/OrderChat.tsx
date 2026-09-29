import { useEffect, useRef, useState } from "react";
import { MessageSquare, Send } from "lucide-react";
import type { Order } from "@/lib/demo-data";
import { cn } from "@/lib/utils";

interface ChatMessage {
  id: string;
  author: string;
  text: string;
  time: string;
}

interface Channel {
  key: string;
  label: string;
  other: string; // the other party's name
}

const MANUFACTURER = "ForgeWorks";

export function channelsFor(order: Order): Channel[] {
  const suppliers = Array.from(
    new Set(order.materials.filter((m) => m.supplier).map((m) => m.supplier as string)),
  );
  return [
    { key: "client", label: `Client · ${order.client}`, other: order.client },
    ...suppliers.map((s) => ({ key: `supplier:${s}`, label: `Supplier · ${s}`, other: s })),
  ];
}

function seed(order: Order, ch: Channel): ChatMessage[] {
  if (ch.key === "client") {
    return [
      { id: "s1", author: ch.other, text: `Hi, any update on ${order.id}?`, time: "Sep 25, 10:12" },
      { id: "s2", author: MANUFACTURER, text: "Yes — work is on track for the expected date. We'll keep you posted here.", time: "Sep 25, 10:40" },
    ];
  }
  return [
    { id: "s1", author: MANUFACTURER, text: `Please confirm the delivery date for ${order.id}.`, time: "Sep 24, 15:02" },
    { id: "s2", author: ch.other, text: "Confirmed, dispatching as per the agreed deadline.", time: "Sep 24, 16:30" },
  ];
}

const storeKey = (orderId: string, ch: string) => `chat:${orderId}:${ch}`;

export function OrderChat({
  order,
  mode,
  supplier,
}: {
  order: Order;
  /** manufacturer sees all channels; client/supplier only see their own */
  mode: "manufacturer" | "client" | "supplier";
  supplier?: string;
}) {
  const all = channelsFor(order);
  const channels =
    mode === "client"
      ? all.filter((c) => c.key === "client")
      : mode === "supplier"
        ? all.filter((c) => c.key === `supplier:${supplier}`)
        : all;
  const [active, setActive] = useState(channels[0]!.key);
  const channel = (channels.find((c) => c.key === active) ?? channels[0])!;
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");
  // Manufacturer page can switch who is typing (demo of the other side)
  const [speaker, setSpeaker] = useState<string>(mode === "client" ? order.client : mode === "supplier" ? supplier! : MANUFACTURER);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const raw = localStorage.getItem(storeKey(order.id, channel.key));
    setMessages(raw ? JSON.parse(raw) : seed(order, channel));
    if (mode === "manufacturer") setSpeaker(MANUFACTURER);
  }, [order, channel.key, mode]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "nearest" });
  }, [messages]);

  const me = mode === "client" ? order.client : mode === "supplier" ? supplier! : speaker;

  function send(e: React.FormEvent) {
    e.preventDefault();
    const t = text.trim();
    if (!t) return;
    const msg: ChatMessage = {
      id: crypto.randomUUID(),
      author: me,
      text: t,
      time: new Date().toLocaleString("en-IN", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }),
    };
    const next = [...messages, msg];
    setMessages(next);
    localStorage.setItem(storeKey(order.id, channel.key), JSON.stringify(next));
    setText("");
  }

  return (
    <section className="rounded-lg border border-border bg-card">
      <div className="flex items-center gap-2 border-b border-border p-4">
        <MessageSquare className="h-4 w-4 text-muted-foreground" />
        <h2 className="font-display font-bold">Messages</h2>
        <span className="text-xs text-muted-foreground">
          {mode !== "manufacturer" ? "Chat with ForgeWorks about this order" : "Talk to the client or suppliers on this order"}
        </span>
      </div>

      {channels.length > 1 && (
        <div className="flex flex-wrap gap-1 border-b border-border p-2">
          {channels.map((c) => (
            <button
              key={c.key}
              type="button"
              onClick={() => setActive(c.key)}
              className={cn(
                "rounded-md px-3 py-1.5 text-xs font-medium",
                c.key === channel.key ? "bg-secondary text-secondary-foreground" : "text-muted-foreground hover:bg-muted",
              )}
            >
              {c.label}
            </button>
          ))}
        </div>
      )}

      <div className="h-72 space-y-3 overflow-y-auto p-4">
        {messages.map((m) => {
          const mine = m.author === me;
          return (
            <div key={m.id} className={cn("flex flex-col", mine ? "items-end" : "items-start")}>
              <div
                className={cn(
                  "max-w-[80%] rounded-lg px-3 py-2 text-sm",
                  mine ? "bg-primary text-primary-foreground" : "bg-muted text-foreground",
                )}
              >
                {m.text}
              </div>
              <span className="mt-1 text-[11px] text-muted-foreground">
                {m.author} · {m.time}
              </span>
            </div>
          );
        })}
        <div ref={endRef} />
      </div>

      <form onSubmit={send} className="flex flex-wrap items-center gap-2 border-t border-border p-3">
        {mode === "manufacturer" && (
          <select
            value={speaker}
            onChange={(e) => setSpeaker(e.target.value)}
            className="rounded-md border border-border bg-background px-2 py-2 text-xs"
            aria-label="Send as"
          >
            <option value={MANUFACTURER}>As {MANUFACTURER}</option>
            <option value={channel.other}>As {channel.other} (demo)</option>
          </select>
        )}
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={`Message ${me === channel.other ? MANUFACTURER : channel.other}…`}
          className="min-w-0 flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
        <button
          type="submit"
          className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
        >
          <Send className="h-4 w-4" /> Send
        </button>
      </form>
    </section>
  );
}
