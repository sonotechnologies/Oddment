"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireAdmin } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";

const statusSchema = z.enum([
  "PENDING",
  "READY_FOR_COLLECTION",
  "COLLECTED",
  "SHIPPED",
]);

export async function updateOrderStatus(formData: FormData) {
  await requireAdmin();

  const ref = String(formData.get("ref") ?? "");
  const status = statusSchema.parse(formData.get("status"));

  const order = await prisma.order.findUnique({
    where: { ref },
    select: { fulfilment: true },
  });
  if (!order) throw new Error("Order not found");

  // Collection and delivery orders move along different tracks.
  const allowed =
    order.fulfilment === "COLLECTION"
      ? ["PENDING", "READY_FOR_COLLECTION", "COLLECTED"]
      : ["PENDING", "SHIPPED"];

  if (!allowed.includes(status)) {
    throw new Error(`${status} is not valid for a ${order.fulfilment} order`);
  }

  await prisma.order.update({ where: { ref }, data: { status } });

  revalidatePath("/admin");
  revalidatePath(`/admin/orders/${ref}`);
}

export async function adjustStock(formData: FormData) {
  await requireAdmin();

  const sizeId = String(formData.get("sizeId") ?? "");
  const delta = Number(formData.get("delta"));
  if (!sizeId || !Number.isInteger(delta)) throw new Error("Bad stock change");

  const size = await prisma.productSize.findUnique({
    where: { id: sizeId },
    select: { stock: true },
  });
  if (!size) throw new Error("Size not found");

  await prisma.productSize.update({
    where: { id: sizeId },
    data: { stock: Math.max(0, size.stock + delta) },
  });

  revalidatePath("/admin/stock");
}
