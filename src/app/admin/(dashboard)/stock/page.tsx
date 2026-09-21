import type { Metadata } from "next";

import { formatPence } from "@/lib/money";
import { prisma } from "@/lib/prisma";
import { CATEGORY_LABELS, LOW_STOCK_AT } from "@/lib/shop";

import { adjustStock } from "../actions";

export const metadata: Metadata = {
  title: "Stock",
  robots: { index: false, follow: false },
};

export default async function AdminStockPage() {
  const products = await prisma.product.findMany({
    orderBy: { position: "asc" },
    include: { sizes: { orderBy: { position: "asc" } } },
  });

  return (
    <>
      <p className="mb-4 text-sm text-muted">
        Adjust counts as stock moves between the shop floor and online. Anything
        at {LOW_STOCK_AT} or fewer shows a low-stock note to customers; zero
        shows as sold out.
      </p>

      <div className="border border-rule bg-white">
        {products.map((product) => {
          const total = product.sizes.reduce((sum, s) => sum + s.stock, 0);
          return (
            <div
              key={product.id}
              className="flex flex-wrap items-center gap-4 border-b border-[rgba(43,43,43,0.08)] px-4 py-3.5"
            >
              <div className="min-w-[180px] flex-1">
                <p className="text-[15px]">{product.name}</p>
                <p className="mt-0.5 text-xs text-faint">
                  {CATEGORY_LABELS[product.category]} ·{" "}
                  {formatPence(product.pricePence)} · {total} in stock
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => {
                  const border =
                    size.stock === 0
                      ? "border-[rgba(43,43,43,0.14)] bg-[rgba(43,43,43,0.04)]"
                      : size.stock <= LOW_STOCK_AT
                        ? "border-clay bg-white"
                        : "border-[rgba(43,43,43,0.2)] bg-white";
                  return (
                    <div
                      key={size.id}
                      className={`flex min-w-[54px] flex-col items-center gap-0.5 border px-2 py-1.5 ${border}`}
                    >
                      <span className="text-[11px] text-faint">
                        {size.label}
                      </span>
                      <div className="flex items-center gap-1">
                        <form action={adjustStock}>
                          <input type="hidden" name="sizeId" value={size.id} />
                          <input type="hidden" name="delta" value="-1" />
                          <button
                            type="submit"
                            aria-label={`Reduce ${product.name} size ${size.label}`}
                            className="px-1 text-sm disabled:opacity-30"
                            disabled={size.stock === 0}
                          >
                            −
                          </button>
                        </form>
                        <span className="min-w-[14px] text-center text-sm">
                          {size.stock}
                        </span>
                        <form action={adjustStock}>
                          <input type="hidden" name="sizeId" value={size.id} />
                          <input type="hidden" name="delta" value="1" />
                          <button
                            type="submit"
                            aria-label={`Increase ${product.name} size ${size.label}`}
                            className="px-1 text-sm"
                          >
                            +
                          </button>
                        </form>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
