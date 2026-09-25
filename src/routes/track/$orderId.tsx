import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Factory, ArrowLeft } from "lucide-react";
import { getOrder } from "@/lib/demo-data";
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

function TrackOrder() {
  const order = Route.useLoaderData();

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

        <p className="mt-6 font-mono text-sm font-semibold text-muted-foreground">{order.id}</p>
        <h1 className="mt-1 font-display text-3xl font-bold">{order.part}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {order.quantity} units · placed {formatDate(order.placedDate)} · expected {formatDate(order.dueDate)}
        </p>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          Questions about this order? Contact your ForgeWorks account manager.
        </p>
      </main>
    </div>
  );
}
