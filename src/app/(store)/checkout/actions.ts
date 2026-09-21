"use server";

import { z } from "zod";

import { bagSchema } from "@/lib/bag";
import { prisma } from "@/lib/prisma";
import { deliveryOption, deliveryPence } from "@/lib/shop";

const checkoutSchema = z
  .object({
    lines: bagSchema.min(1),
    method: z.enum(["STANDARD", "NEXT_DAY", "INTERNATIONAL", "COLLECTION"]),
    name: z.string().trim().min(2, "We need a name for the order.").max(120),
    email: z.string().trim().email("That email doesn't look right.").max(200),
    phone: z.string().trim().min(6, "We need a number to reach you on.").max(40),
    addressLine: z.string().trim().max(200).optional(),
    city: z.string().trim().max(100).optional(),
    postcode: z.string().trim().max(20).optional(),
    country: z.string().trim().max(100).optional(),
  })
  .superRefine((value, ctx) => {
    if (value.method === "COLLECTION") return;
    for (const field of ["addressLine", "city", "postcode"] as const) {
      if (!value[field]) {
        ctx.addIssue({
          code: "custom",
          path: [field],
          message: "Needed for delivery.",
        });
      }
    }
  });

export type CheckoutInput = z.input<typeof checkoutSchema>;

export type CheckoutResult =
  | { ok: true; ref: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

export async function placeOrder(input: CheckoutInput): Promise<CheckoutResult> {
  const parsed = checkoutSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      fieldErrors[key] ??= issue.message;
    }
    return {
      ok: false,
      error: "Please check the highlighted fields.",
      fieldErrors,
    };
  }

  const data = parsed.data;
  const isCollection = deliveryOption(data.method).isCollection;

  try {
    const ref = await prisma.$transaction(async (tx) => {
      const products = await tx.product.findMany({
        where: { slug: { in: data.lines.map((l) => l.slug) } },
        include: { sizes: true },
      });

      const items = data.lines.map((line) => {
        const product = products.find((p) => p.slug === line.slug);
        const size = product?.sizes.find((s) => s.label === line.size);
        if (!product || !size) {
          throw new Error(`${line.slug} is no longer available.`);
        }
        return { line, product, size };
      });

      // Guarded decrement: the update only matches while enough stock remains,
      // so two people buying the last one cannot both succeed.
      for (const { line, product, size } of items) {
        const updated = await tx.productSize.updateMany({
          where: { id: size.id, stock: { gte: line.quantity } },
          data: { stock: { decrement: line.quantity } },
        });
        if (updated.count !== 1) {
          throw new Error(`${product.name} in size ${size.label} just sold out.`);
        }
      }

      const subtotalPence = items.reduce(
        (total, { line, product }) => total + product.pricePence * line.quantity,
        0,
      );
      const postagePence = deliveryPence(data.method, subtotalPence);

      const order = await tx.order.create({
        data: {
          ref: `pending-${crypto.randomUUID()}`,
          customerName: data.name,
          email: data.email,
          phone: data.phone,
          fulfilment: isCollection ? "COLLECTION" : "DELIVERY",
          deliveryMethod: data.method,
          addressLine: isCollection ? null : data.addressLine,
          city: isCollection ? null : data.city,
          postcode: isCollection ? null : data.postcode,
          country: isCollection ? null : (data.country ?? "United Kingdom"),
          subtotalPence,
          deliveryPence: postagePence,
          totalPence: subtotalPence + postagePence,
          items: {
            create: items.map(({ line, product, size }) => ({
              productId: product.id,
              productName: product.name,
              productSlug: product.slug,
              sizeLabel: size.label,
              unitPricePence: product.pricePence,
              quantity: line.quantity,
            })),
          },
        },
        select: { id: true, number: true },
      });

      // The human-facing ref is derived from the sequence, so it is unique
      // without a second round of collision handling.
      const finalRef = `ODD-${4182 + order.number}`;
      await tx.order.update({ where: { id: order.id }, data: { ref: finalRef } });

      return finalRef;
    });

    return { ok: true, ref };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Something went wrong.";
    return { ok: false, error: message };
  }
}
