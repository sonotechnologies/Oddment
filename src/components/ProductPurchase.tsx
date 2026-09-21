"use client";

import Link from "next/link";
import { useState } from "react";

import { useBag } from "@/components/useBag";
import { SizeGuideModalButton } from "@/components/SizeGuide";
import { primaryButton } from "@/components/buttonStyles";
import { LOW_STOCK_AT } from "@/lib/shop";

type Size = { label: string; stock: number };

export function ProductPurchase({
  slug,
  sizes,
  singleSize,
}: {
  slug: string;
  sizes: Size[];
  singleSize: boolean;
}) {
  const { add } = useBag();
  const [selected, setSelected] = useState<string | null>(
    singleSize && sizes[0]?.stock > 0 ? sizes[0].label : null,
  );
  const [added, setAdded] = useState(false);

  const chosen = sizes.find((s) => s.label === selected) ?? null;
  const soldOutEverywhere = sizes.every((s) => s.stock === 0);

  function handleAdd() {
    if (!chosen || chosen.stock === 0) return;
    add({ slug, size: chosen.label, quantity: 1 });
    setAdded(true);
  }

  return (
    <>
      {!singleSize ? (
        <>
          <div className="mb-2.5 flex items-baseline justify-between gap-3">
            <p className="text-xs uppercase tracking-[0.16em] text-faint">
              Size
            </p>
            <SizeGuideModalButton />
          </div>
          <div className="flex flex-wrap gap-2.5">
            {sizes.map((size) => {
              const out = size.stock === 0;
              const active = size.label === selected;
              return (
                <button
                  key={size.label}
                  type="button"
                  disabled={out}
                  aria-pressed={active}
                  onClick={() => {
                    setSelected(size.label);
                    setAdded(false);
                  }}
                  className={[
                    "flex min-w-[58px] flex-col items-center gap-0.5 rounded-edge border px-2.5 py-[9px]",
                    active
                      ? "border-ink bg-ink text-paper"
                      : out
                        ? "cursor-not-allowed border-[rgba(43,43,43,0.22)] bg-panel text-[rgba(43,43,43,0.4)] line-through"
                        : "border-[rgba(43,43,43,0.22)] bg-panel text-ink hover:border-ink",
                  ].join(" ")}
                >
                  <span className="text-[15px]">{size.label}</span>
                  <span
                    className={[
                      "text-[10px] tracking-[0.04em]",
                      out
                        ? "text-[rgba(43,43,43,0.4)]"
                        : size.stock <= LOW_STOCK_AT
                          ? active
                            ? "text-paper"
                            : "text-clay"
                          : "text-[rgba(43,43,43,0.45)]",
                    ].join(" ")}
                  >
                    {out
                      ? "sold out"
                      : size.stock <= LOW_STOCK_AT
                        ? `${size.stock} left`
                        : " "}
                  </span>
                </button>
              );
            })}
          </div>
        </>
      ) : null}

      {chosen && chosen.stock > 0 && chosen.stock <= LOW_STOCK_AT ? (
        <p className="mt-3.5 inline-flex items-center gap-2 text-sm text-clay">
          <span className="inline-block h-[7px] w-[7px] rounded-full bg-clay" />
          Only {chosen.stock} left in size {chosen.label} — we won&apos;t be
          getting more
        </p>
      ) : null}

      {soldOutEverywhere ? (
        <p className="mt-3.5 text-sm text-clay">
          Sold out for now. Ask us on Instagram — we sometimes get one back.
        </p>
      ) : null}

      <div className="mt-[26px] flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleAdd}
          disabled={!chosen || chosen.stock === 0}
          className={`${primaryButton} px-[34px] py-4`}
        >
          {added ? "Added to bag ✓" : chosen ? "Add to bag" : "Choose a size"}
        </button>
        {added ? (
          <Link
            href="/bag"
            className="inline-flex items-center rounded-edge border border-rule-strong px-6 py-4 text-sm text-ink hover:border-ink"
          >
            View bag
          </Link>
        ) : null}
      </div>
    </>
  );
}
