export type OrderStage =
  | "order_received"
  | "material_sourcing"
  | "in_production"
  | "quality_check"
  | "delivered";

export const STAGES: { key: OrderStage; label: string; description: string }[] = [
  { key: "order_received", label: "Order Received", description: "Client order confirmed and logged" },
  { key: "material_sourcing", label: "Material Sourcing", description: "Own stock allocated, third-party materials requested" },
  { key: "in_production", label: "In Production", description: "Part is being built on the shop floor" },
  { key: "quality_check", label: "Quality Check", description: "Final inspection before dispatch" },
  { key: "delivered", label: "Delivered", description: "Handed over to the client" },
];

export type MaterialSource = "own_stock" | "third_party";

export interface Material {
  id: string;
  name: string;
  quantity: string;
  source: MaterialSource;
  supplier?: string;
  deadline?: string; // third-party delivery deadline
  status: "allocated" | "requested" | "in_transit" | "received";
}

export interface PartItem {
  id: string;
  name: string;
  quantity: string;
  builtBy: "in_house" | "third_party";
  supplier?: string;
  deadline?: string;
  status: "pending" | "in_progress" | "ready";
}

export interface Order {
  id: string;
  client: string;
  clientContact: string;
  part: string;
  quantity: number;
  stage: OrderStage;
  progress: number;
  dueDate: string;
  placedDate: string;
  priority: "low" | "medium" | "high";
  partItems: PartItem[];
  materials: Material[];
  notes: string[];
}

export const ORDERS: Order[] = [
  {
    id: "ORD-1042",
    client: "Apex Automotive",
    clientContact: "r.mehta@apexauto.com",
    part: "Gearbox Housing Assembly",
    quantity: 250,
    stage: "in_production",
    progress: 62,
    dueDate: "2026-10-04",
    placedDate: "2026-09-18",
    priority: "high",
    partItems: [
      { id: "p1", name: "Cast housing shell", quantity: "250 pcs", builtBy: "in_house", status: "ready" },
      { id: "p2", name: "Machined end cover", quantity: "250 pcs", builtBy: "in_house", status: "in_progress" },
      { id: "p3", name: "Bearing set", quantity: "500 pcs", builtBy: "third_party", supplier: "SKF Distributors", deadline: "2026-09-24", status: "ready" },
      { id: "p4", name: "Sealing gasket kit", quantity: "250 kits", builtBy: "third_party", supplier: "SealTech Pvt Ltd", deadline: "2026-09-29", status: "in_progress" },
    ],
    materials: [
      { id: "m1", name: "Aluminium Alloy A356", quantity: "480 kg", source: "own_stock", status: "allocated" },
      { id: "m2", name: "Precision Bearings 6204Z", quantity: "500 pcs", source: "third_party", supplier: "SKF Distributors", deadline: "2026-09-24", status: "received" },
      { id: "m3", name: "Gasket Seal Kit", quantity: "250 kits", source: "third_party", supplier: "SealTech Pvt Ltd", deadline: "2026-09-29", status: "in_transit" },
      { id: "m4", name: "M8 Fasteners", quantity: "2000 pcs", source: "own_stock", status: "allocated" },
    ],
    notes: ["Client confirmed revised drawing Rev C on Sep 20", "Bearing lot inspected and cleared on Sep 23"],
  },
  {
    id: "ORD-1043",
    client: "NovaWind Energy",
    clientContact: "procurement@novawind.io",
    part: "Turbine Hub Flange",
    quantity: 40,
    stage: "material_sourcing",
    progress: 28,
    dueDate: "2026-10-15",
    placedDate: "2026-09-22",
    priority: "medium",
    partItems: [
      { id: "p5", name: "Forged flange body", quantity: "40 pcs", builtBy: "in_house", status: "pending" },
      { id: "p6", name: "Protective coating", quantity: "40 pcs", builtBy: "third_party", supplier: "ChemCoat Industries", deadline: "2026-09-25", status: "pending" },
      { id: "p7", name: "Bolt set M24", quantity: "640 pcs", builtBy: "third_party", supplier: "BoltRight Fasteners", deadline: "2026-10-01", status: "in_progress" },
    ],
    materials: [
      { id: "m5", name: "Forged Steel 42CrMo4", quantity: "1.2 t", source: "own_stock", status: "allocated" },
      { id: "m6", name: "Anti-corrosion Coating", quantity: "80 L", source: "third_party", supplier: "ChemCoat Industries", deadline: "2026-09-25", status: "requested" },
      { id: "m7", name: "High-tensile Bolts M24", quantity: "640 pcs", source: "third_party", supplier: "BoltRight Fasteners", deadline: "2026-10-01", status: "in_transit" },
    ],
    notes: ["Coating supplier quoted 5-day lead time"],
  },
  {
    id: "ORD-1041",
    client: "Meridian Rail",
    clientContact: "s.iyer@meridianrail.in",
    part: "Brake Caliper Bracket",
    quantity: 120,
    stage: "quality_check",
    progress: 85,
    dueDate: "2026-09-28",
    placedDate: "2026-09-10",
    priority: "high",
    partItems: [
      { id: "p8", name: "Cast bracket", quantity: "120 pcs", builtBy: "in_house", status: "ready" },
      { id: "p9", name: "Hydraulic seal pack", quantity: "240 pcs", builtBy: "third_party", supplier: "SealTech Pvt Ltd", deadline: "2026-09-18", status: "ready" },
    ],
    materials: [
      { id: "m8", name: "Cast Iron GG25", quantity: "900 kg", source: "own_stock", status: "allocated" },
      { id: "m9", name: "Hydraulic Seals", quantity: "240 pcs", source: "third_party", supplier: "SealTech Pvt Ltd", deadline: "2026-09-18", status: "received" },
    ],
    notes: ["Batch 1 of 2 passed inspection; batch 2 in queue"],
  },
  {
    id: "ORD-1044",
    client: "Apex Automotive",
    clientContact: "r.mehta@apexauto.com",
    part: "Drive Shaft Coupling",
    quantity: 500,
    stage: "order_received",
    progress: 8,
    dueDate: "2026-10-22",
    placedDate: "2026-09-24",
    priority: "low",
    partItems: [
      { id: "p10", name: "Turned coupling hub", quantity: "500 pcs", builtBy: "in_house", status: "pending" },
      { id: "p11", name: "Rubber damper ring", quantity: "1000 pcs", builtBy: "third_party", supplier: "PolyFlex Rubbers", deadline: "2026-10-08", status: "pending" },
    ],
    materials: [
      { id: "m10", name: "EN8 Steel Bar", quantity: "750 kg", source: "own_stock", status: "allocated" },
      { id: "m11", name: "Rubber Dampening Rings", quantity: "1000 pcs", source: "third_party", supplier: "PolyFlex Rubbers", deadline: "2026-10-08", status: "requested" },
    ],
    notes: [],
  },
  {
    id: "ORD-1039",
    client: "Harbor Marine Systems",
    clientContact: "orders@harbormarine.com",
    part: "Propeller Shaft Sleeve",
    quantity: 60,
    stage: "delivered",
    progress: 100,
    dueDate: "2026-09-20",
    placedDate: "2026-09-02",
    priority: "medium",
    partItems: [
      { id: "p12", name: "Bronze sleeve", quantity: "60 pcs", builtBy: "in_house", status: "ready" },
      { id: "p13", name: "Epoxy lining", quantity: "60 pcs", builtBy: "third_party", supplier: "ChemCoat Industries", deadline: "2026-09-10", status: "ready" },
    ],
    materials: [
      { id: "m12", name: "Bronze C93200", quantity: "300 kg", source: "own_stock", status: "allocated" },
      { id: "m13", name: "Marine-grade Epoxy", quantity: "25 L", source: "third_party", supplier: "ChemCoat Industries", deadline: "2026-09-10", status: "received" },
    ],
    notes: ["Delivered Sep 19, signed off by client QA"],
  },
];

export const SUPPLIERS = [
  { name: "SKF Distributors", category: "Bearings & rotary parts", openRequests: 0, onTimeRate: 98 },
  { name: "SealTech Pvt Ltd", category: "Seals & gaskets", openRequests: 1, onTimeRate: 94 },
  { name: "ChemCoat Industries", category: "Coatings & chemicals", openRequests: 1, onTimeRate: 91 },
  { name: "BoltRight Fasteners", category: "Fasteners", openRequests: 1, onTimeRate: 96 },
  { name: "PolyFlex Rubbers", category: "Rubber components", openRequests: 1, onTimeRate: 89 },
];

export interface AppNotification {
  id: string;
  orderId: string;
  kind: "supplier_confirm" | "delivery" | "deadline" | "new_order";
  title: string;
  detail: string;
  time: string;
  needsConfirmation: boolean;
}

export const NOTIFICATIONS: AppNotification[] = [
  { id: "n1", orderId: "ORD-1043", kind: "deadline", title: "Coating deadline missed", detail: "ChemCoat Industries was due Sep 25 for Anti-corrosion Coating.", time: "2h ago", needsConfirmation: true },
  { id: "n2", orderId: "ORD-1042", kind: "delivery", title: "Gasket kits dispatched", detail: "SealTech shipped 250 kits — confirm receipt on arrival.", time: "4h ago", needsConfirmation: true },
  { id: "n3", orderId: "ORD-1044", kind: "new_order", title: "New order from Apex Automotive", detail: "500 × Drive Shaft Coupling — confirm to start sourcing.", time: "Yesterday", needsConfirmation: true },
  { id: "n4", orderId: "ORD-1043", kind: "supplier_confirm", title: "BoltRight confirmed request", detail: "640 × M24 bolts, delivery by Oct 1.", time: "Yesterday", needsConfirmation: false },
];

// Fixed "today" for the demo so dates are stable
export const TODAY = "2026-09-26";

export function daysUntil(iso: string): number {
  const a = new Date(TODAY + "T00:00:00").getTime();
  const b = new Date(iso + "T00:00:00").getTime();
  return Math.round((b - a) / 86400000);
}

export function stageIndex(stage: OrderStage): number {
  return STAGES.findIndex((s) => s.key === stage);
}

export function getOrder(id: string): Order | undefined {
  return ORDERS.find((o) => o.id === id);
}
