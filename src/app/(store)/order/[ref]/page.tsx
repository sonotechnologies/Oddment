import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { primaryButton } from "@/components/buttonStyles";
import { formatPence } from "@/lib/money";
import { prisma } from "@/lib/prisma";
import { SHOP, deliveryOption } from "@/lib/shop";

type OrderPageProps = { params: Promise<{ ref: string }> };

export const metadata: Metadata = {
  title: "Order confirmed",
  robots: { index: false, follow: false },
};

export default async function OrderPage({ params }: OrderPageProps) {
  const { ref } = await params;
  const order = await prisma.order.findUnique({
    where: { ref: decodeURIComponent(ref) },
    include: { items: true },
  });

  if (!order) notFound();

  const option = deliveryOption(order.deliveryMethod);
  const isCollection = order.fulfilment === "COLLECTION";

  return (
    <main className="mx-auto max-w-[720px] px-[22px] pb-20 pt-14 text-center">
      <svg
        viewBox="0 0 120 20"
        width="130"
        height="20"
        className="mx-auto mb-[18px] overflow-visible"
        aria-hidden="true"
      >
        <path
          d="M3 14 C 34 3, 86 19, 117 7"
          fill="none"
          stroke="var(--color-sage)"
          strokeWidth="2.6"
          strokeLinecap="round"
        />
      </svg>

      <h1 className="mb-3 font-serif text-[clamp(32px,5vw,46px)] font-normal">
        That&apos;s all sorted
      </h1>
      <p className="mb-1.5 text-[17px] text-[rgba(43,43,43,0.82)]">
        Order {order.ref} — confirmation on its way to {order.email}.
      </p>
      <p className="mb-2 text-[13px] text-faint">
        (This is a demo shop, so no email is actually sent.)
      </p>
      <p className="mb-[30px] font-hand text-2xl text-clay">
        thanks, from the four of us
      </p>

      <div className="mb-6 border border-rule bg-panel p-6 text-left">
        <p className="mb-2.5 text-[11px] uppercase tracking-[0.18em] text-faint">
          {option.name}
        </p>
        <p className="mb-1 text-base">
          {isCollection
            ? SHOP.addressLines.join(", ")
            : [order.addressLine, order.city, order.postcode]
                .filter(Boolean)
                .join(", ")}
        </p>
        <p className="mb-4 text-sm text-muted">{option.timing}</p>

        {order.items.map((item) => (
          <div
            key={item.id}
            className="flex justify-between gap-3 border-t border-[rgba(43,43,43,0.1)] py-2 text-sm"
          >
            <span>
              {item.productName} — {item.sizeLabel} ×{item.quantity}
            </span>
            <span>{formatPence(item.unitPricePence * item.quantity)}</span>
          </div>
        ))}

        <div className="flex justify-between border-t border-[rgba(43,43,43,0.1)] py-2 text-sm">
          <span>{option.name}</span>
          <span>
            {order.deliveryPence === 0
              ? "Free"
              : formatPence(order.deliveryPence)}
          </span>
        </div>

        <div className="flex justify-between border-t border-[rgba(43,43,43,0.16)] pt-3.5 text-base">
          <span>Paid</span>
          <span>{formatPence(order.totalPence)}</span>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        <Link href="/" className={`${primaryButton} px-7 py-[15px]`}>
          Back to the shop
        </Link>
        <a
          href={SHOP.instagramUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center rounded-edge border border-rule-strong px-6 py-[15px] text-sm text-ink hover:border-ink"
        >
          Message us on Instagram
        </a>
      </div>
    </main>
  );
}
