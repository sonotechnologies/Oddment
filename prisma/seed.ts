import { PrismaPg } from "@prisma/adapter-pg";
import { config as loadEnv } from "dotenv";

import { CATALOGUE, sizesFor } from "../src/data/catalogue";
import { PrismaClient } from "../src/generated/prisma/client";

loadEnv({ path: ".env.local", quiet: true });
loadEnv({ quiet: true });

/** Deterministic PRNG so re-seeding gives the same shop every time. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hash(value: string): number {
  let h = 2166136261;
  for (let i = 0; i < value.length; i++) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/**
 * Stock spread deliberately includes sold-out and 1-3 sizes so the low-stock
 * label and disabled size buttons are visible without hand-editing the data.
 */
function stockFor(slug: string, sizes: string[]): number[] {
  const rng = mulberry32(hash(slug));
  const counts: number[] = sizes.map(() => {
    const roll = rng();
    if (roll < 0.12) return 0;
    if (roll < 0.4) return 1 + Math.floor(rng() * 3);
    return 4 + Math.floor(rng() * 5);
  });

  if (counts.reduce((total, c) => total + c, 0) === 0) {
    counts[Math.floor(rng() * counts.length)] = 5;
  }
  return counts;
}

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL is not set");

  const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

  let created = 0;
  for (const [index, product] of CATALOGUE.entries()) {
    const sizes = sizesFor(product.category);
    const counts = stockFor(product.slug, sizes);

    const data = {
      name: product.name,
      category: product.category,
      pricePence: product.pricePence,
      description: product.description,
      staffNote: product.staffNote ?? null,
      staffNoteAuthor: product.staffNoteAuthor ?? null,
      isNewIn: product.isNewIn ?? false,
      isStaffPick: Boolean(product.staffNote),
      imageQuery: product.imageQuery,
      position: index,
    };

    const saved = await prisma.product.upsert({
      where: { slug: product.slug },
      create: { slug: product.slug, ...data },
      update: data,
      select: { id: true },
    });

    // Sizes are upserted separately so re-seeding an existing shop resets
    // stock levels without orphaning rows referenced by past orders.
    for (const [i, label] of sizes.entries()) {
      await prisma.productSize.upsert({
        where: { productId_label: { productId: saved.id, label } },
        create: { productId: saved.id, label, stock: counts[i], position: i },
        update: { stock: counts[i], position: i },
      });
    }
    created++;
  }

  const lowSizes = await prisma.productSize.count({ where: { stock: { gt: 0, lte: 3 } } });
  const soldOut = await prisma.productSize.count({ where: { stock: 0 } });
  console.log(`Seeded ${created} products — ${lowSizes} low-stock sizes, ${soldOut} sold out.`);

  await prisma.$disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
