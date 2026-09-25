import { cn } from "@/lib/utils";
import type { Material, Order } from "@/lib/demo-data";

const stageStyles: Record<string, string> = {
  order_received: "bg-secondary text-secondary-foreground",
  material_sourcing: "bg-warning text-warning-foreground",
  in_production: "bg-primary text-primary-foreground",
  quality_check: "bg-accent text-accent-foreground",
  delivered: "bg-success text-success-foreground",
};

const stageLabels: Record<string, string> = {
  order_received: "Order Received",
  material_sourcing: "Sourcing Materials",
  in_production: "In Production",
  quality_check: "Quality Check",
  delivered: "Delivered",
};

export function OrderStageBadge({ stage }: { stage: Order["stage"] }) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold", stageStyles[stage])}>
      {stageLabels[stage]}
    </span>
  );
}

const materialStatusStyles: Record<Material["status"], string> = {
  allocated: "bg-secondary text-secondary-foreground",
  requested: "bg-warning text-warning-foreground",
  in_transit: "bg-primary text-primary-foreground",
  received: "bg-success text-success-foreground",
};

const materialStatusLabels: Record<Material["status"], string> = {
  allocated: "Allocated from stock",
  requested: "Requested",
  in_transit: "In transit",
  received: "Received",
};

export function MaterialStatusBadge({ status }: { status: Material["status"] }) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium", materialStatusStyles[status])}>
      {materialStatusLabels[status]}
    </span>
  );
}
