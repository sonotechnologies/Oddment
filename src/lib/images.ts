import manifest from "@/data/images.generated.json";

export type ShopImage = {
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

const images = manifest as Manifest;

/**
 * Photography is downloaded by `npm run fetch-images` and committed. Until
 * that has run every surface falls back to a labelled placeholder, so the
 * site is fully usable with no imagery present.
 */
export function productImages(slug: string): ShopImage[] {
  return images.products[slug] ?? [];
}

export function lifestyleImage(index: number): ShopImage | null {
  if (images.lifestyle.length === 0) return null;
  return images.lifestyle[index % images.lifestyle.length];
}

export function hasImagery(): boolean {
  return images.lifestyle.length > 0 || Object.keys(images.products).length > 0;
}
