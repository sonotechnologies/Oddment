import { z } from "zod";

/**
 * Only the identity of a line lives in the browser. Names, prices and stock
 * are always resolved server-side so a stale or edited localStorage value can
 * never change what someone is charged.
 */
export const bagLineSchema = z.object({
  slug: z.string().min(1).max(120),
  size: z.string().min(1).max(20),
  quantity: z.number().int().min(1).max(20),
});

export const bagSchema = z.array(bagLineSchema).max(50);

export type BagLine = z.infer<typeof bagLineSchema>;

export const BAG_STORAGE_KEY = "oddment.bag.v1";

export function readStoredBag(): BagLine[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(BAG_STORAGE_KEY);
    if (!raw) return [];
    const parsed = bagSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : [];
  } catch {
    return [];
  }
}

export function writeStoredBag(lines: BagLine[]) {
  try {
    window.localStorage.setItem(BAG_STORAGE_KEY, JSON.stringify(lines));
  } catch {
    // Private browsing or blocked storage — the bag just won't persist.
  }
}

export function sameLine(a: BagLine, b: Pick<BagLine, "slug" | "size">) {
  return a.slug === b.slug && a.size === b.size;
}

const DELIVERY_STORAGE_KEY = "oddment.delivery.v1";

const deliveryMethodSchema = z.enum([
  "STANDARD",
  "NEXT_DAY",
  "INTERNATIONAL",
  "COLLECTION",
]);

export type StoredDeliveryMethod = z.infer<typeof deliveryMethodSchema>;

export function readStoredDeliveryMethod(): StoredDeliveryMethod {
  if (typeof window === "undefined") return "STANDARD";
  try {
    const parsed = deliveryMethodSchema.safeParse(
      window.localStorage.getItem(DELIVERY_STORAGE_KEY),
    );
    return parsed.success ? parsed.data : "STANDARD";
  } catch {
    return "STANDARD";
  }
}

export function writeStoredDeliveryMethod(method: StoredDeliveryMethod) {
  try {
    window.localStorage.setItem(DELIVERY_STORAGE_KEY, method);
  } catch {
    // Storage blocked — the choice just won't persist.
  }
}
