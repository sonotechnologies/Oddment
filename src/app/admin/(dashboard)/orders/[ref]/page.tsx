import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { formatPence } from "@/lib/money";
import { prisma } from "@/lib/prisma";
import { deliveryOption } from "@/lib/shop";

import { updateOrderStatus } from "../../actions";

export const metadata: Metadata = {
  title: "Order",
  robots: { index: false, follow: false },
};

const NEXT_STEP = {
  COLLECTION: [
    { from: "PENDING", to: "READY_FOR_COLLECTION", label: "Mark ready for collection" },
    { from: "READY_FOR_COLLECTION", to: "COLLECTED", label: "Mark collected" },
  ],
  DELIVERY: [{ from: "PENDING", to: "SHIPPED", label: "Mark shipped" }],
} as const;

const STATUS_LABELS = {
  PENDING: "Pending",
  READY_FOR_COLLECTION: "Ready for collection",
  COLLECTED: "Collected",
  SHIPPED: "Shipped",
} as const;

export default async function AdminOrderPage({
  params,
}: {
  params: Promise<{ ref: string }>;
}) {
  const { ref } = await params;
  const order = await prisma.order.findUnique({
    where: { ref: decodeURIComponent(ref) },
    include: { items: true },
  });

  if (!order) notFound();

  const option = deliveryOption(order.deliveryMethod);
  const steps = NEXT_STEP[order.fulfilment].filter(
    (step) => step.from === order.status,
  );

  return (
    <>
      <Link
        href="/admin"
        className="mb-4 inline-block text-[13px] text-oxblood hover:text-clay"
      >
        ← All orders
      </Link>

      <div className="grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]">
        <div className="min-w-0 border border-rule bg-white p-5">
          <p className="mb-1 font-mono text-[13px] text-faint">{order.ref}</p>
          <p className="mb-[18px] text-[22px]">{order.customerName}</p>

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

          <div className="flex justify-between gap-3 border-t border-[rgba(43,43,43,0.1)] py-2 text-sm">
            <span>{option.name}</span>
            <span>
              {order.deliveryPence === 0
                ? "Free"
                : formatPence(order.deliveryPence)}
            </span>
          </div>

          <div className="mt-2 flex justify-between border-t border-[rgba(43,43,43,0.2)] pt-3 text-[15px] font-semibold">
            <span>Total</span>
            <span>{formatPence(order.totalPence)}</span>
          </div>
        </div>

        <div className="border border-rule bg-white p-5 text-sm leading-[1.9]">
          <p className="mb-3 text-xs uppercase tracking-[0.14em] text-faint">
            Fulfilment
          </p>
          <p>{option.name}</p>
          <p className="text-muted">
            {order.fulfilment === "COLLECTION"
              ? "Collect — 12 Weaver's Row"
              : [order.addressLine, order.city, order.postcode, order.country]
                  .filter(Boolean)
                  .join(", ")}
          </p>
          <p className="text-muted">{order.email}</p>
          <p className="text-muted">{order.phone}</p>
          <p className="text-muted">
            Placed{" "}
            {order.createdAt.toLocaleString("en-GB", {
              day: "numeric",
              month: "short",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>

          <p className="mt-4 text-xs uppercase tracking-[0.14em] text-faint">
            Status
          </p>
          <p className="mb-3">{STATUS_LABELS[order.status]}</p>

          <div className="flex flex-wrap gap-2">
            {steps.map((step) => (
              <form key={step.to} action={updateOrderStatus}>
                <input type="hidden" name="ref" value={order.ref} />
                <input type="hidden" name="status" value={step.to} />
                <button
                  type="submit"
                  className="rounded-edge bg-oxblood px-[18px] py-[11px] text-[13px] text-paper hover:bg-clay"
                >
                  {step.label}
                </button>
              </form>
            ))}
            {steps.length === 0 ? (
              <p className="text-muted">Nothing left to do on this one.</p>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}
