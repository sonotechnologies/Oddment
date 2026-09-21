/**
 * Downloads product and lifestyle photography from Pexels into /public.
 *
 * This is the ONLY place the Pexels API key is ever used. It runs on a
 * developer's machine (`npm run fetch-images`), never in a page, component,
 * API route or at build time — the deployed site only ever serves the files
 * committed under /public.
 *
 * Re-runnable: files already on disk are kept and never downloaded twice.
 */

import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";

import { config as loadEnv } from "dotenv";

import { CATALOGUE } from "../src/data/catalogue";

loadEnv({ path: ".env.local", quiet: true });
loadEnv({ quiet: true });

const API_KEY = process.env.PEXELS_API_KEY;
const IMAGES_PER_PRODUCT = 3;
const LIFESTYLE_COUNT = 8;
const PUBLIC_DIR = path.join(process.cwd(), "public");
const MANIFEST_PATH = path.join(
  process.cwd(),
  "src",
  "data",
  "images.generated.json",
);

const LIFESTYLE_QUERIES = [
  "clothing boutique interior",
  "small shop doorway street",
  "woman wearing overshirt street style",
  "clothes rail boutique",
  "shop counter interior warm",
  "folded clothes shelf shop",
  "independent shop front",
  "shop assistant wrapping parcel",
];

type PexelsPhoto = {
  id: number;
  width: number;
  height: number;
  alt: string | null;
  url: string;
  photographer: string;
  photographer_url: string;
  src: { large2x: string; large: string; medium: string };
};

type ShopImage = {
  src: string;
  width: number;
  height: number;
  alt: string;
  photographer: string;
  photographerUrl: string;
  pexelsUrl: string;
};

type Manifest = {
  generatedAt: string | null;
  products: Record<string, ShopImage[]>;
  lifestyle: ShopImage[];
};

function requireKey(): string {
  if (!API_KEY) {
    console.error(
      "PEXELS_API_KEY is not set.\n" +
        "Add it to .env.local (see .env.example). Get a free key at\n" +
        "https://www.pexels.com/api/ — never commit the key.",
    );
    process.exit(1);
  }
  return API_KEY;
}

async function search(
  query: string,
  perPage: number,
  orientation: "portrait" | "landscape",
): Promise<PexelsPhoto[]> {
  const url = new URL("https://api.pexels.com/v1/search");
  url.searchParams.set("query", query);
  url.searchParams.set("per_page", String(perPage));
  url.searchParams.set("orientation", orientation);
  // Neutral, naturally lit frames sit together as one shop's stock.
  url.searchParams.set("size", "medium");

  const response = await fetch(url, {
    headers: { Authorization: requireKey() },
  });

  if (response.status === 429) {
    throw new Error("Pexels rate limit reached — wait an hour and re-run.");
  }
  if (!response.ok) {
    throw new Error(`Pexels search failed (${response.status}) for "${query}"`);
  }

  const data = (await response.json()) as { photos?: PexelsPhoto[] };
  return data.photos ?? [];
}

async function exists(filePath: string): Promise<boolean> {
  try {
    const info = await stat(filePath);
    return info.size > 0;
  } catch {
    return false;
  }
}

async function download(url: string, destination: string): Promise<void> {
  if (await exists(destination)) return;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Download failed (${response.status}): ${url}`);
  }
  const buffer = Buffer.from(await response.arrayBuffer());
  await writeFile(destination, buffer);
}

async function readManifest(): Promise<Manifest> {
  try {
    const raw = await readFile(MANIFEST_PATH, "utf8");
    const parsed = JSON.parse(raw) as Manifest;
    return {
      generatedAt: parsed.generatedAt ?? null,
      products: parsed.products ?? {},
      lifestyle: parsed.lifestyle ?? [],
    };
  } catch {
    return { generatedAt: null, products: {}, lifestyle: [] };
  }
}

function toShopImage(
  photo: PexelsPhoto,
  publicPath: string,
  fallbackAlt: string,
): ShopImage {
  return {
    src: publicPath,
    width: photo.width,
    height: photo.height,
    alt: photo.alt?.trim() || fallbackAlt,
    photographer: photo.photographer,
    photographerUrl: photo.photographer_url,
    pexelsUrl: photo.url,
  };
}

async function fetchProducts(manifest: Manifest) {
  for (const product of CATALOGUE) {
    const dir = path.join(PUBLIC_DIR, "products", product.slug);
    const alreadyHave = manifest.products[product.slug] ?? [];

    const onDisk = await Promise.all(
      alreadyHave.map((image) =>
        exists(path.join(PUBLIC_DIR, image.src.replace(/^\//, ""))),
      ),
    );
    if (alreadyHave.length >= IMAGES_PER_PRODUCT && onDisk.every(Boolean)) {
      console.log(`· ${product.slug} — already have ${alreadyHave.length}`);
      continue;
    }

    await mkdir(dir, { recursive: true });
    const photos = await search(product.imageQuery, IMAGES_PER_PRODUCT, "portrait");

    if (photos.length === 0) {
      console.warn(`! ${product.slug} — no results for "${product.imageQuery}"`);
      continue;
    }

    const images: ShopImage[] = [];
    for (const [index, photo] of photos.entries()) {
      const filename = `${index + 1}-${photo.id}.jpg`;
      await download(photo.src.large2x, path.join(dir, filename));
      images.push(
        toShopImage(
          photo,
          `/products/${product.slug}/${filename}`,
          `${product.name} — ${product.imageQuery}`,
        ),
      );
    }

    manifest.products[product.slug] = images;
    console.log(`✓ ${product.slug} — ${images.length} image(s)`);
  }
}

async function fetchLifestyle(manifest: Manifest) {
  const dir = path.join(PUBLIC_DIR, "lifestyle");
  const onDisk = await Promise.all(
    manifest.lifestyle.map((image) =>
      exists(path.join(PUBLIC_DIR, image.src.replace(/^\//, ""))),
    ),
  );
  if (manifest.lifestyle.length >= LIFESTYLE_COUNT && onDisk.every(Boolean)) {
    console.log(`· lifestyle — already have ${manifest.lifestyle.length}`);
    return;
  }

  await mkdir(dir, { recursive: true });
  const images: ShopImage[] = [];

  for (const query of LIFESTYLE_QUERIES) {
    const [photo] = await search(query, 1, "landscape");
    if (!photo) {
      console.warn(`! lifestyle — no results for "${query}"`);
      continue;
    }
    const filename = `${photo.id}.jpg`;
    await download(photo.src.large2x, path.join(dir, filename));
    images.push(toShopImage(photo, `/lifestyle/${filename}`, query));
    console.log(`✓ lifestyle — ${query}`);
  }

  manifest.lifestyle = images;
}

async function main() {
  requireKey();

  const manifest = await readManifest();

  await fetchLifestyle(manifest);
  await fetchProducts(manifest);

  manifest.generatedAt = new Date().toISOString();
  await writeFile(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`);

  const productCount = Object.keys(manifest.products).length;
  console.log(
    `\nDone. ${productCount} products with photography, ` +
      `${manifest.lifestyle.length} lifestyle shots.\n` +
      "Commit /public/products, /public/lifestyle and " +
      "src/data/images.generated.json so Vercel can serve them.",
  );
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
