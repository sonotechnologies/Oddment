import type { Metadata } from "next";
import Link from "next/link";

import { formatPence } from "@/lib/money";
import { prisma } from "@/lib/prisma";
import { LOW_STOCK_AT, deliveryOption } from "@/lib/shop";

export const metadata: Metadata = {
  title: "Orders",
  robots: { index: false, follow: false },
};

const STATUS_LABELS = {
  PENDING: "Pending",
  READY_FOR_COLLECTION: "Ready for collection",
  COLLECTED: "Collected",
  SHIPPED: "Shipped",
} as const;

const STATUS_COLOURS = {
  PENDING: "var(--color-clay)",
  READY_FOR_COLLECTION: "var(--color-sage)",
  COLLECTED: "rgba(43,43,43,0.5)",
  SHIPPED: "rgba(43,43,43,0.5)",
} as const;

const FILTERS = [
  { key: "all", label: "All" },
  { key: "collection", label: "Click & collect" },
  { key: "delivery", label: "Delivery" },
] as const;

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const rawFilter = Array.isArray(params.fulfilment)
    ? params.fulfilment[0]
    : params.fulfilment;
  const filter =
    rawFilter === "collection" || rawFilter === "delivery" ? rawFilter : "all";

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const [orders, todaysOrders, awaitingCollection, lowStockLines] =
    await Promise.all([
      prisma.order.findMany({
        where:
          filter === "all"
            ? {}
            : {
                fulfilment: filter === "collection" ? "COLLECTION" : "DELIVERY",
              },
        orderBy: { createdAt: "desc" },
        include: { items: true },
        take: 50,
      }),
      prisma.order.findMany({
        where: { createdAt: { gte: startOfToday } },
        select: { totalPence: true },
      }),
      prisma.order.count({ where: { status: "READY_FOR_COLLECTION" } }),
      prisma.productSize.count({ where: { stock: { gt: 0, lte: LOW_STOCK_AT } } }),
    ]);

  const takenToday = todaysOrders.reduce((sum, o) => sum + o.totalPence, 0);
  const toPack = orders.filter((o) => o.status === "PENDING").length;

  const stats = [
    {
      label: "Orders today",
      value: String(todaysOrders.length),
      sub: `${toPack} still to pack`,
    },
    { label: "Taken today", value: formatPence(takenToday), sub: "online only" },
    {
      label: "Awaiting collection",
      value: String(awaitingCollection),
      sub: "ready on the shelf",
    },
    {
      label: "Low stock lines",
      value: String(lowStockLines),
      sub: `${LOW_STOCK_AT} or fewer`,
    },
  ];

  return (
    <>
      <div className="mb-7 grid gap-3.5 [grid-template-columns:repeat(auto-fit,minmax(170px,1fr))]">
        {stats.map((stat) => (
          <div key={stat.label} className="border border-rule bg-white p-4">
            <p className="mb-1.5 text-xs text-faint">{stat.label}</p>
            <p className="text-[26px] font-medium">{stat.value}</p>
            <p className="mt-1 text-xs text-sage">{stat.sub}</p>
          </div>
        ))}
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <Link
            key={f.key}
            href={f.key === "all" ? "/admin" : `/admin?fulfilment=${f.key}`}
            className={[
              "rounded-full px-3.5 py-[7px] text-[13px]",
              filter === f.key
                ? "border border-ink bg-ink text-paper"
                : "border border-[rgba(43,43,43,0.24)] hover:border-ink",
            ].join(" ")}
          >
            {f.label}
          </Link>
        ))}
      </div>

      <div className="border border-rule bg-white">
        <p className="border-b border-[rgba(43,43,43,0.12)] px-4 py-3.5 text-[13px] font-semibold">
          {orders.length === 0
            ? "No orders yet"
            : `${orders.length} order${orders.length === 1 ? "" : "s"}`}
        </p>

        {orders.length === 0 ? (
          <p className="px-4 py-8 text-sm text-muted">
            Orders placed on the shop will appear here.
          </p>
        ) : (
          orders.map((order) => (
            <Link
              key={order.id}
              href={`/admin/orders/${order.ref}`}
              className="flex w-full flex-wrap items-center gap-3 border-b border-[rgba(43,43,43,0.08)] px-4 py-3.5 text-sm hover:bg-[#FBFAF7]"
            >
              <span className="w-[88px] flex-none font-mono text-xs">
                {order.ref}
              </span>
              <span className="min-w-[120px] flex-1">{order.customerName}</span>
              <span className="w-[110px] flex-none text-xs text-[rgba(43,43,43,0.65)]">
                {deliveryOption(order.deliveryMethod).name}
              </span>
              <span className="w-[130px] flex-none text-xs text-faint">
                {order.items.reduce((n, i) => n + i.quantity, 0)} item
                {order.items.reduce((n, i) => n + i.quantity, 0) === 1 ? "" : "s"}
                {" · "}
                {order.createdAt.toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                })}
              </span>
              <span
                className="flex-none border px-2 py-[3px] text-[11px] tracking-[0.04em]"
                style={{
                  color: STATUS_COLOURS[order.status],
                  borderColor: STATUS_COLOURS[order.status],
                }}
              >
                {STATUS_LABELS[order.status]}
              </span>
              <span className="w-16 flex-none text-right">
                {formatPence(order.totalPence)}
              </span>
            </Link>
          ))
        )}
      </div>
    </>
  );
}
