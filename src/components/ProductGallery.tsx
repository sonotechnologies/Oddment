"use client";

import { useState } from "react";

import { Photo } from "@/components/Photo";
import type { ShopImage } from "@/lib/images";

export type GallerySlot = { image: ShopImage | null; label: string };

export function ProductGallery({
  slots,
  productName,
}: {
  slots: GallerySlot[];
  productName: string;
}) {
  const [active, setActive] = useState(0);
  const current = slots[active] ?? slots[0];

  return (
    <div>
      <Photo
        image={current.image}
        label={current.label}
        className="aspect-[4/5] border border-rule"
        sizes="(max-width: 768px) 100vw, 560px"
        priority
      />

      {slots.length > 1 ? (
        <div
          className="mt-2.5 grid gap-2"
          style={{
            gridTemplateColumns: `repeat(${Math.min(slots.length, 4)}, minmax(0, 1fr))`,
          }}
        >
          {slots.map((slot, index) => {
            const isActive = index === active;
            return (
              <button
                key={`${slot.label}-${index}`}
                type="button"
                onClick={() => setActive(index)}
                aria-label={`Show image ${index + 1} of ${slots.length} for ${productName}`}
                aria-current={isActive}
                className={[
                  "block transition-opacity",
                  isActive
                    ? "outline outline-2 outline-offset-[-2px] outline-ink"
                    : "opacity-80 hover:opacity-100",
                ].join(" ")}
              >
                <Photo
                  image={slot.image}
                  label={slot.label}
                  className="aspect-square border border-rule"
                  sizes="120px"
                  variant="deep"
                />
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
