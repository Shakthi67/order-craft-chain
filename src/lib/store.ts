import { useSyncExternalStore } from "react";

export interface DemoState {
  confirmed: string[]; // manufacturer-confirmed notification ids
  dismissed: string[];
  supplierConfirmed: string[]; // material ids confirmed by supplier
  requests: CustomRequest[];
}

export interface CustomRequest {
  id: string;
  orderId: string;
  supplier: string;
  name: string;
  quantity: string;
  deadline?: string | undefined;
}

const KEY = "forgeworks:state";
const EMPTY: DemoState = { confirmed: [], dismissed: [], supplierConfirmed: [], requests: [] };
let cache: DemoState | null = null;
const listeners = new Set<() => void>();

function read(): DemoState {
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(KEY);
    cache = raw ? { ...EMPTY, ...JSON.parse(raw) } : EMPTY;
  } catch {
    cache = EMPTY;
  }
  return cache!;
}

export function update(fn: (s: DemoState) => DemoState) {
  cache = fn(read());
  localStorage.setItem(KEY, JSON.stringify(cache));
  listeners.forEach((l) => l());
}

export function useDemoState(): DemoState {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    read,
    () => EMPTY,
  );
}

const add = (arr: string[], id: string) => (arr.includes(id) ? arr : [...arr, id]);
export const confirmNotification = (id: string) => update((s) => ({ ...s, confirmed: add(s.confirmed, id) }));
export const dismissNotification = (id: string) => update((s) => ({ ...s, dismissed: add(s.dismissed, id) }));
export const supplierConfirm = (materialId: string) =>
  update((s) => ({ ...s, supplierConfirmed: add(s.supplierConfirmed, materialId) }));

export const sendRequest = (r: Omit<CustomRequest, "id">) =>
  update((s) => ({ ...s, requests: [...s.requests, { ...r, id: `rq-${Date.now()}` }] }));

import type { Material, Order } from "./demo-data";
/** Order materials plus any requests sent from the dashboard */
export function materialsFor(order: Order, s: DemoState): Material[] {
  const extra: Material[] = s.requests
    .filter((r) => r.orderId === order.id)
    .map((r) => ({ id: r.id, name: r.name, quantity: r.quantity, source: "third_party", supplier: r.supplier, deadline: r.deadline, status: "requested" }));
  return [...order.materials, ...extra];
}
