import Link from "next/link";

import { Photo } from "@/components/Photo";
import { productImages } from "@/lib/images";
import { formatPence } from "@/lib/money";
import { lowestStockSize, totalStock } from "@/lib/products";

type ProductCardProps = {
  product: {
    slug: string;
    name: string;
    pricePence: number;
    imageQuery: string;
    sizes: { label: string; stock: number }[];
  };
  priority?: boolean;
};

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const [image] = productImages(product.slug);
  const remaining = totalStock(product.sizes);
  const low = lowestStockSize(product.sizes);
  const soldOut = remaining === 0;

  return (
    <Link href={`/product/${product.slug}`} className="group block text-left">
      <div className="relative">
        <Photo
          image={image ?? null}
          label={`product shot — ${product.imageQuery}`}
          className="aspect-[3/4] border border-rule"
          sizes="(max-width: 640px) 50vw, (max-width: 1180px) 33vw, 240px"
          priority={priority}
        />
        {soldOut ? (
          <span className="absolute left-2.5 top-2.5 border border-[rgba(43,43,43,0.4)] bg-paper px-2 py-1 text-[11px] text-faint">
            Sold out
          </span>
        ) : low ? (
          <span className="absolute left-2.5 top-2.5 border border-clay bg-paper px-2 py-1 text-[11px] tracking-[0.04em] text-clay">
            {low.stock === 1
              ? `Last one — size ${low.label}`
              : `Only ${low.stock} left in size ${low.label}`}
          </span>
        ) : null}
      </div>
      <p className="mb-0.5 mt-3 font-serif text-xl leading-tight group-hover:text-clay">
        {product.name}
      </p>
      <p className="text-sm text-muted">{formatPence(product.pricePence)}</p>
    </Link>
  );
}
