"use client";

import { useSyncExternalStore } from "react";

import * as store from "@/lib/bagStore";

/**
 * localStorage is the bag. Components subscribe to it directly, which keeps
 * the bag consistent across tabs and avoids hydration mismatches on the
 * header count.
 */
export function useBag() {
  const state = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getServerSnapshot,
  );

  return {
    lines: state.lines,
    count: state.lines.reduce((total, l) => total + l.quantity, 0),
    deliveryMethod: state.deliveryMethod,
    add: store.addLine,
    setQuantity: store.setLineQuantity,
    remove: store.removeLine,
    clear: store.clearBag,
    setDeliveryMethod: store.setDeliveryMethod,
  };
}

/** False during SSR and hydration, true once the browser store is live. */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    store.subscribe,
    () => true,
    () => false,
  );
}
