"use client";

import {
  type BagLine,
  type StoredDeliveryMethod,
  readStoredBag,
  readStoredDeliveryMethod,
  sameLine,
  writeStoredBag,
  writeStoredDeliveryMethod,
} from "@/lib/bag";

export type BagState = {
  lines: BagLine[];
  deliveryMethod: StoredDeliveryMethod;
};

/**
 * localStorage is an external store, so React reads it through
 * useSyncExternalStore rather than an effect. The cached snapshot must keep a
 * stable identity between changes or the hook re-renders forever.
 */
const SERVER_STATE: BagState = { lines: [], deliveryMethod: "STANDARD" };

let state: BagState | null = null;
const listeners = new Set<() => void>();

function load(): BagState {
  return {
    lines: readStoredBag(),
    deliveryMethod: readStoredDeliveryMethod(),
  };
}

function emit() {
  for (const listener of listeners) listener();
}

function onStorage() {
  state = load();
  emit();
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  if (listeners.size === 1) {
    window.addEventListener("storage", onStorage);
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      window.removeEventListener("storage", onStorage);
    }
  };
}

export function getSnapshot(): BagState {
  state ??= load();
  return state;
}

export function getServerSnapshot(): BagState {
  return SERVER_STATE;
}

function commit(next: BagState) {
  state = next;
  writeStoredBag(next.lines);
  writeStoredDeliveryMethod(next.deliveryMethod);
  emit();
}

export function addLine(line: BagLine) {
  const current = getSnapshot();
  const index = current.lines.findIndex((l) => sameLine(l, line));
  const lines =
    index >= 0
      ? current.lines.map((l, i) =>
          i === index
            ? { ...l, quantity: Math.min(20, l.quantity + line.quantity) }
            : l,
        )
      : [...current.lines, line];
  commit({ ...current, lines });
}

export function setLineQuantity(slug: string, size: string, quantity: number) {
  const current = getSnapshot();
  const lines =
    quantity <= 0
      ? current.lines.filter((l) => !sameLine(l, { slug, size }))
      : current.lines.map((l) =>
          sameLine(l, { slug, size })
            ? { ...l, quantity: Math.min(20, quantity) }
            : l,
        );
  commit({ ...current, lines });
}

export function removeLine(slug: string, size: string) {
  setLineQuantity(slug, size, 0);
}

export function clearBag() {
  commit({ ...getSnapshot(), lines: [] });
}

export function setDeliveryMethod(deliveryMethod: StoredDeliveryMethod) {
  commit({ ...getSnapshot(), deliveryMethod });
}
