import type { Category, DeliveryMethod } from "@/generated/prisma/enums";

export const SHOP = {
  name: "Oddment",
  tagline: "Good things, oddly chosen.",
  addressLines: ["12 Weaver's Row", "Northern Quarter", "Manchester M4 1AA"],
  instagram: "@oddment.mcr",
  instagramUrl: "https://www.instagram.com/oddment.mcr",
  email: "hello@oddment.example",
  hours: [
    { days: "Monday–Saturday", time: "10am–6pm" },
    { days: "Sunday", time: "11am–4pm" },
  ],
} as const;

/** A size at or below this shows a low-stock note to customers. */
export const LOW_STOCK_AT = 3;

export const FREE_DELIVERY_OVER_PENCE = 7500;

export type DeliveryOption = {
  method: DeliveryMethod;
  name: string;
  detail: string;
  timing: string;
  pricePence: number;
  /** Collection has no postage and no delivery address. */
  isCollection: boolean;
};

export const DELIVERY_OPTIONS: DeliveryOption[] = [
  {
    method: "COLLECTION",
    name: "Click & collect",
    detail:
      "Pick up from 12 Weaver's Row. We'll text you when it's on the shelf.",
    timing: "Ready in about 2 hours during opening hours. Held for seven days.",
    pricePence: 0,
    isCollection: true,
  },
  {
    method: "STANDARD",
    name: "UK Standard",
    detail: "Royal Mail Tracked 48, sent from the shop and wrapped in tissue.",
    timing: "2–4 working days.",
    pricePence: 395,
    isCollection: false,
  },
  {
    method: "NEXT_DAY",
    name: "UK Next Day",
    detail: "Ordered before 1pm, on its way the same afternoon.",
    timing: "Next working day.",
    pricePence: 695,
    isCollection: false,
  },
  {
    method: "INTERNATIONAL",
    name: "International",
    detail: "Tracked worldwide. Any duties are paid by you on arrival.",
    timing: "7–14 working days.",
    pricePence: 1495,
    isCollection: false,
  },
];

export function deliveryOption(method: DeliveryMethod): DeliveryOption {
  const option = DELIVERY_OPTIONS.find((o) => o.method === method);
  if (!option) throw new Error(`Unknown delivery method: ${method}`);
  return option;
}

/**
 * Authoritative delivery price. UK Standard is free over the threshold;
 * expedited and international postage is always charged.
 */
export function deliveryPence(
  method: DeliveryMethod,
  subtotalPence: number,
): number {
  const option = deliveryOption(method);
  if (option.method === "STANDARD" && subtotalPence >= FREE_DELIVERY_OVER_PENCE) {
    return 0;
  }
  return option.pricePence;
}

export const CATEGORY_LABELS: Record<Category, string> = {
  WOMEN: "Women",
  MEN: "Men",
  ACCESSORIES: "Accessories",
};

export const CATEGORY_SLUGS: Record<string, Category> = {
  women: "WOMEN",
  men: "MEN",
  accessories: "ACCESSORIES",
};

export const WOMENS_SIZE_GUIDE = [
  { size: "6", bust: "80", waist: "62", hip: "88" },
  { size: "8", bust: "84", waist: "66", hip: "92" },
  { size: "10", bust: "88", waist: "70", hip: "96" },
  { size: "12", bust: "93", waist: "75", hip: "101" },
  { size: "14", bust: "98", waist: "80", hip: "106" },
  { size: "16", bust: "104", waist: "86", hip: "112" },
  { size: "18", bust: "110", waist: "92", hip: "118" },
];

export const MENS_SIZE_GUIDE = [
  { size: "XS", chest: "89", waist: "76" },
  { size: "S", chest: "94", waist: "81" },
  { size: "M", chest: "99", waist: "86" },
  { size: "L", chest: "104", waist: "91" },
  { size: "XL", chest: "110", waist: "97" },
  { size: "XXL", chest: "116", waist: "104" },
];
