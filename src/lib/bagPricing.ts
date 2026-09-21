import "server-only";

import type { BagLine } from "@/lib/bag";
import { productImages } from "@/lib/images";
import { prisma } from "@/lib/prisma";

export type ResolvedLine = {
  slug: string;
  name: string;
  size: string;
  quantity: number;
  unitPricePence: number;
  linePence: number;
  /** How many of this size are actually on the shelf right now. */
  available: number;
  imageSrc: string | null;
  imageQuery: string;
};

export type ResolvedBag = {
  lines: ResolvedLine[];
  subtotalPence: number;
  /** Lines dropped because the product or size no longer exists. */
  unavailable: string[];
};

/**
 * Prices and stock always come from the database, never from the browser.
 * The client only ever tells us which slug and size it wants.
 */
export async function resolveBag(lines: BagLine[]): Promise<ResolvedBag> {
  if (lines.length === 0) {
    return { lines: [], subtotalPence: 0, unavailable: [] };
  }

  const products = await prisma.product.findMany({
    where: { slug: { in: lines.map((l) => l.slug) } },
    include: { sizes: true },
  });

  const resolved: ResolvedLine[] = [];
  const unavailable: string[] = [];

  for (const line of lines) {
    const product = products.find((p) => p.slug === line.slug);
    const size = product?.sizes.find((s) => s.label === line.size);
    if (!product || !size) {
      unavailable.push(`${line.slug} (${line.size})`);
      continue;
    }

    const quantity = Math.min(line.quantity, size.stock);
    if (quantity <= 0) {
      unavailable.push(`${product.name} — size ${line.size}`);
      continue;
    }

    resolved.push({
      slug: product.slug,
      name: product.name,
      size: size.label,
      quantity,
      unitPricePence: product.pricePence,
      linePence: product.pricePence * quantity,
      available: size.stock,
      imageSrc: productImages(product.slug)[0]?.src ?? null,
      imageQuery: product.imageQuery,
    });
  }

  return {
    lines: resolved,
    subtotalPence: resolved.reduce((total, l) => total + l.linePence, 0),
    unavailable,
  };
}
