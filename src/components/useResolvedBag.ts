"use client";

import { useEffect, useState } from "react";

import { useBag, useHydrated } from "@/components/useBag";
import type { ResolvedBag } from "@/lib/bagPricing";

const EMPTY: ResolvedBag = { lines: [], subtotalPence: 0, unavailable: [] };

/**
 * Turns the browser's {slug, size, qty} list into priced lines. The server is
 * the only thing that decides names, prices and what is still in stock.
 */
export function useResolvedBag() {
  const { lines } = useBag();
  const hydrated = useHydrated();
  const [resolved, setResolved] = useState<ResolvedBag | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!hydrated || lines.length === 0) return;

    const controller = new AbortController();

    fetch("/api/bag", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(lines),
      signal: controller.signal,
    })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("failed"))))
      .then((data: ResolvedBag) => setResolved(data))
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        console.error(error);
        setFailed(true);
      });

    return () => controller.abort();
  }, [lines, hydrated]);

  const empty = lines.length === 0;
  const bag = empty || failed ? EMPTY : resolved;

  return { bag, loading: !hydrated || (!empty && !failed && resolved === null) };
}
