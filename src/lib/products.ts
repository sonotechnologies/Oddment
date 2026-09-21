import "server-only";

import type { Category } from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import { LOW_STOCK_AT } from "@/lib/shop";

const productShape = {
  include: { sizes: { orderBy: { position: "asc" } } },
} as const;

export type ProductWithSizes = Awaited<ReturnType<typeof getProduct>>;

export async function getProduct(slug: string) {
  return prisma.product.findUnique({ where: { slug }, ...productShape });
}

export type ListFilters = {
  category?: Category;
  size?: string;
  maxPricePence?: number;
  sort?: "new" | "low" | "high";
};

export async function listProducts(filters: ListFilters = {}) {
  const { category, size, maxPricePence, sort = "new" } = filters;

  const orderBy =
    sort === "low"
      ? ({ pricePence: "asc" } as const)
      : sort === "high"
        ? ({ pricePence: "desc" } as const)
        : ({ position: "asc" } as const);

  return prisma.product.findMany({
    where: {
      ...(category ? { category } : {}),
      ...(maxPricePence ? { pricePence: { lte: maxPricePence } } : {}),
      // A size filter only makes sense against sizes that can actually be bought.
      ...(size ? { sizes: { some: { label: size, stock: { gt: 0 } } } } : {}),
    },
    orderBy,
    ...productShape,
  });
}

export async function newIn(limit = 4) {
  return prisma.product.findMany({
    where: { isNewIn: true },
    orderBy: { position: "asc" },
    take: limit,
    ...productShape,
  });
}

export async function staffPicks(limit = 3) {
  return prisma.product.findMany({
    where: { isStaffPick: true },
    orderBy: { position: "asc" },
    take: limit,
    ...productShape,
  });
}

/** Every size label in use, ordered women's then men's then one size. */
export async function allSizeLabels(): Promise<string[]> {
  const rows = await prisma.productSize.findMany({
    distinct: ["label"],
    select: { label: true, position: true, product: { select: { category: true } } },
  });

  const rank: Record<Category, number> = { WOMEN: 0, MEN: 1, ACCESSORIES: 2 };
  return rows
    .sort(
      (a, b) =>
        rank[a.product.category] - rank[b.product.category] ||
        a.position - b.position,
    )
    .map((r) => r.label)
    .filter((label, i, all) => all.indexOf(label) === i);
}

type SizeRow = { label: string; stock: number };

export function totalStock(sizes: SizeRow[]): number {
  return sizes.reduce((total, s) => total + s.stock, 0);
}

/** The first buyable size that is running low, for grid and detail labels. */
export function lowestStockSize(sizes: SizeRow[]): SizeRow | null {
  return sizes.find((s) => s.stock > 0 && s.stock <= LOW_STOCK_AT) ?? null;
}
