"use client";

import Image from "next/image";
import Link from "next/link";

import { useBag } from "@/components/useBag";
import { primaryButton } from "@/components/buttonStyles";
import { useResolvedBag } from "@/components/useResolvedBag";
import { formatPence } from "@/lib/money";
import {
  DELIVERY_OPTIONS,
  FREE_DELIVERY_OVER_PENCE,
  deliveryPence,
} from "@/lib/shop";

export default function BagPage() {
  const { setQuantity, remove, deliveryMethod, setDeliveryMethod } = useBag();
  const { bag, loading } = useResolvedBag();

  if (loading || !bag) {
    return (
      <main className="mx-auto max-w-[980px] px-[22px] pb-[70px] pt-[34px]">
        <h1 className="mb-[26px] font-serif text-[clamp(32px,5vw,44px)] font-normal">
          Your bag
        </h1>
        <p className="text-muted">Getting your bag…</p>
      </main>
    );
  }

  const postage = deliveryPence(deliveryMethod, bag.subtotalPence);
  const total = bag.subtotalPence + postage;
  const shortfall = FREE_DELIVERY_OVER_PENCE - bag.subtotalPence;

  return (
    <main className="mx-auto max-w-[980px] px-[22px] pb-[70px] pt-[34px]">
      <h1 className="mb-[26px] font-serif text-[clamp(32px,5vw,44px)] font-normal">
        Your bag
      </h1>

      {bag.unavailable.length > 0 ? (
        <p className="mb-5 border border-[rgba(181,101,74,0.4)] bg-panel px-4 py-3 text-sm text-clay">
          Sold while you were deciding: {bag.unavailable.join(", ")}. Sorry —
          most things here are one of two.
        </p>
      ) : null}

      {bag.lines.length === 0 ? (
        <div className="border border-rule p-10 text-center">
          <p className="mb-1.5 font-serif text-[26px]">Nothing in here yet.</p>
          <p className="mb-[22px] font-hand text-[22px] text-clay">
            go on, have a look round
          </p>
          <Link href="/shop" className={`${primaryButton} px-7 py-3.5`}>
            Start shopping
          </Link>
        </div>
      ) : (
        <div className="grid gap-[34px] md:grid-cols-[1fr_360px]">
          <div className="min-w-0">
            {bag.lines.map((line) => (
              <div
                key={`${line.slug}-${line.size}`}
                className="flex gap-4 border-t border-rule py-[18px]"
              >
                <Link
                  href={`/product/${line.slug}`}
                  className="relative aspect-[3/4] w-[92px] flex-none overflow-hidden border border-rule"
                >
                  {line.imageSrc ? (
                    <Image
                      src={line.imageSrc}
                      alt={line.name}
                      fill
                      sizes="92px"
                      className="object-cover"
                    />
                  ) : (
                    <span className="od-placeholder block h-full w-full" />
                  )}
                </Link>

                <div className="min-w-0 flex-1">
                  <Link
                    href={`/product/${line.slug}`}
                    className="mb-0.5 block font-serif text-xl leading-tight hover:text-clay"
                  >
                    {line.name}
                  </Link>
                  <p className="mb-2.5 text-[13px] text-muted">
                    Size {line.size} · {formatPence(line.unitPricePence)}
                  </p>

                  <div className="flex flex-wrap items-center gap-3.5">
                    <div className="flex items-center border border-[rgba(43,43,43,0.24)]">
                      <button
                        type="button"
                        aria-label={`Reduce quantity of ${line.name}`}
                        onClick={() =>
                          setQuantity(line.slug, line.size, line.quantity - 1)
                        }
                        className="px-3 py-1.5 text-base"
                      >
                        −
                      </button>
                      <span className="min-w-5 px-1.5 text-center text-sm">
                        {line.quantity}
                      </span>
                      <button
                        type="button"
                        aria-label={`Increase quantity of ${line.name}`}
                        disabled={line.quantity >= line.available}
                        onClick={() =>
                          setQuantity(line.slug, line.size, line.quantity + 1)
                        }
                        className="px-3 py-1.5 text-base disabled:opacity-35"
                      >
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => remove(line.slug, line.size)}
                      className="text-[13px] text-faint underline hover:text-ink"
                    >
                      Remove
                    </button>
                  </div>

                  {line.quantity >= line.available ? (
                    <p className="mt-2 text-xs text-clay">
                      That&apos;s all we have in size {line.size}.
                    </p>
                  ) : null}
                </div>

                <p className="text-base">{formatPence(line.linePence)}</p>
              </div>
            ))}
          </div>

          <div>
            <div className="border border-rule bg-panel p-[22px]">
              <p className="mb-3 text-[11px] uppercase tracking-[0.18em] text-faint">
                How you&apos;ll get it
              </p>
              <div className="mb-4 flex flex-col gap-2">
                {DELIVERY_OPTIONS.map((option) => {
                  const cost = deliveryPence(option.method, bag.subtotalPence);
                  const active = option.method === deliveryMethod;
                  return (
                    <button
                      key={option.method}
                      type="button"
                      onClick={() => setDeliveryMethod(option.method)}
                      className={[
                        "flex items-baseline justify-between gap-3 rounded-edge border px-3 py-2.5 text-left text-sm",
                        active
                          ? "border-oxblood bg-paper"
                          : "border-rule hover:border-ink",
                      ].join(" ")}
                    >
                      <span>{option.name}</span>
                      <span className={cost === 0 ? "text-sage" : ""}>
                        {cost === 0 ? "Free" : formatPence(cost)}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="mb-2.5 flex justify-between text-[15px]">
                <span>Subtotal</span>
                <span>{formatPence(bag.subtotalPence)}</span>
              </div>
              <div className="mb-3.5 flex justify-between text-[15px]">
                <span>
                  {DELIVERY_OPTIONS.find((o) => o.method === deliveryMethod)?.name}
                </span>
                <span>{postage === 0 ? "Free" : formatPence(postage)}</span>
              </div>
              <div className="flex justify-between border-t border-[rgba(43,43,43,0.16)] pt-3.5 font-serif text-2xl">
                <span>Total</span>
                <span>{formatPence(total)}</span>
              </div>

              <p className="mb-[18px] mt-3 text-[13px] text-muted">
                {deliveryMethod === "COLLECTION"
                  ? "Collection from the shop is always free — ready in about two hours."
                  : shortfall > 0 && deliveryMethod === "STANDARD"
                    ? `Spend ${formatPence(shortfall)} more for free UK standard delivery, or collect free from the shop.`
                    : "Delivery costs are shown here in full — nothing is added later."}
              </p>

              <Link
                href="/checkout"
                className={`${primaryButton} w-full py-4`}
              >
                Checkout
              </Link>
              <Link
                href="/shop"
                className="block w-full pt-3.5 text-center text-[13px] text-oxblood underline hover:text-clay"
              >
                Keep shopping
              </Link>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
