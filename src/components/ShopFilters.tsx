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
    "rounded-full px-3.5 py-2 text-[13px] transition-colors",
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

  // Collapsed by default on mobile so the products are not pushed off-screen.
  const [open, setOpen] = useState(false);

  const activeCount = (activeSize ? 1 : 0) + (params.get("max") ? 1 : 0);

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
    <aside className="md:max-w-[280px]">
      <div className="flex items-center gap-2 md:hidden">
        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          aria-expanded={open}
          aria-controls="shop-filters"
          className="flex flex-1 items-center justify-between gap-2 rounded-edge border border-[rgba(43,43,43,0.24)] px-3.5 py-2.5 text-sm"
        >
          <span>
            Filters
            {activeCount > 0 ? (
              <span className="ml-1.5 rounded-full bg-oxblood px-1.5 py-0.5 text-[11px] text-paper">
                {activeCount}
              </span>
            ) : null}
          </span>
          <svg
            viewBox="0 0 16 16"
            width="14"
            height="14"
            aria-hidden="true"
            className={open ? "rotate-180" : ""}
          >
            <path
              d="M3 6 L8 11 L13 6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        </button>
        <SortSelect />
      </div>

      <div id="shop-filters" className={open ? "block" : "hidden md:block"}>
        <div className="border-t border-rule py-[18px]">
          <p className="mb-3 text-[11px] uppercase tracking-[0.18em] text-faint">
            Category
          </p>
          <div className="flex flex-wrap gap-2">
            {CATEGORY_LINKS.map((category) => (
              <Link
                key={category.href}
                href={category.href}
                onClick={() => setOpen(false)}
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
                className={`min-w-11 ${pill(activeSize === size)}`}
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
            className="h-6 w-full accent-oxblood"
          />
          <div className="mt-1.5 flex justify-between text-xs text-faint">
            <span>{formatPence(1500)}</span>
            <span>{formatPence(maxAvailablePence)}</span>
          </div>
        </div>

        {hasFilters ? (
          <Link
            href={pathname}
            onClick={() => setOpen(false)}
            className="mt-4 inline-block text-[13px] text-oxblood underline hover:text-clay"
          >
            Clear filters
          </Link>
        ) : null}
      </div>
    </aside>
  );
}

export function SortSelect() {
  const pathname = usePathname();
  const router = useRouter();
  const params = useSearchParams();

  return (
    <label className="flex items-center gap-2 text-[13px] text-muted">
      <span className="hidden sm:inline">Sort</span>
      <select
        aria-label="Sort products"
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
        className="rounded-edge border border-[rgba(43,43,43,0.2)] bg-panel px-2.5 py-2.5 text-[13px] md:py-2"
      >
        <option value="new">New in</option>
        <option value="low">Price: low to high</option>
        <option value="high">Price: high to low</option>
      </select>
    </label>
  );
}
