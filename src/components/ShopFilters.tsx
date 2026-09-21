"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { formatPence } from "@/lib/money";

const CATEGORY_LINKS = [
  { href: "/shop", name: "All" },
  { href: "/shop/women", name: "Women" },
  { href: "/shop/men", name: "Men" },
  { href: "/shop/accessories", name: "Accessories" },
];

function pill(active: boolean) {
  return [
    "rounded-full px-3.5 py-[7px] text-[13px] transition-colors",
    active
      ? "border border-ink bg-ink text-paper"
      : "border border-[rgba(43,43,43,0.24)] text-ink hover:border-ink",
  ].join(" ");
}

export function ShopFilters({
  sizes,
  maxAvailablePence,
}: {
  sizes: string[];
  maxAvailablePence: number;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const params = useSearchParams();

  const activeSize = params.get("size");
  const maxParam = Number(params.get("max"));
  const activeMax =
    Number.isFinite(maxParam) && maxParam > 0 ? maxParam : maxAvailablePence;

  // While dragging, the thumb follows the pointer; on release the URL wins
  // again, so no effect is needed to keep the two in step.
  const [dragging, setDragging] = useState<number | null>(null);
  const sliderValue = dragging ?? activeMax;

  function withParam(key: string, value: string | null) {
    const next = new URLSearchParams(params.toString());
    if (value === null) next.delete(key);
    else next.set(key, value);
    const query = next.toString();
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  function commitPrice() {
    if (dragging === null) return;
    const value = dragging;
    setDragging(null);
    withParam("max", String(value));
  }

  const hasFilters = params.toString().length > 0;

  return (
    <aside className="max-w-[280px]">
      <div className="border-t border-rule py-[18px]">
        <p className="mb-3 text-[11px] uppercase tracking-[0.18em] text-faint">
          Category
        </p>
        <div className="flex flex-wrap gap-2">
          {CATEGORY_LINKS.map((category) => (
            <Link
              key={category.href}
              href={category.href}
              className={pill(pathname === category.href)}
            >
              {category.name}
            </Link>
          ))}
        </div>
      </div>

      <div className="border-t border-rule py-[18px]">
        <p className="mb-3 text-[11px] uppercase tracking-[0.18em] text-faint">
          Size
        </p>
        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => (
            <button
              key={size}
              type="button"
              onClick={() =>
                withParam("size", activeSize === size ? null : size)
              }
              className={pill(activeSize === size)}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div className="border-y border-rule py-[18px]">
        <label
          htmlFor="max-price"
          className="mb-3 block text-[11px] uppercase tracking-[0.18em] text-faint"
        >
          Price up to {formatPence(sliderValue)}
        </label>
        <input
          id="max-price"
          type="range"
          min={1500}
          max={maxAvailablePence}
          step={500}
          value={sliderValue}
          onChange={(e) => setDragging(Number(e.target.value))}
          onMouseUp={commitPrice}
          onTouchEnd={commitPrice}
          onKeyUp={commitPrice}
          className="w-full accent-oxblood"
        />
        <div className="mt-1.5 flex justify-between text-xs text-faint">
          <span>{formatPence(1500)}</span>
          <span>{formatPence(maxAvailablePence)}</span>
        </div>
      </div>

      {hasFilters ? (
        <Link
          href={pathname}
          className="mt-4 inline-block text-[13px] text-oxblood underline hover:text-clay"
        >
          Clear filters
        </Link>
      ) : null}
    </aside>
  );
}

export function SortSelect() {
  const pathname = usePathname();
  const router = useRouter();
  const params = useSearchParams();

  return (
    <label className="flex items-center gap-2 text-[13px] text-muted">
      Sort
      <select
        value={params.get("sort") ?? "new"}
        onChange={(e) => {
          const next = new URLSearchParams(params.toString());
          if (e.target.value === "new") next.delete("sort");
          else next.set("sort", e.target.value);
          const query = next.toString();
          router.push(query ? `${pathname}?${query}` : pathname, {
            scroll: false,
          });
        }}
        className="rounded-edge border border-[rgba(43,43,43,0.2)] bg-panel px-2.5 py-2 text-[13px]"
      >
        <option value="new">New in</option>
        <option value="low">Price: low to high</option>
        <option value="high">Price: high to low</option>
      </select>
    </label>
  );
}
