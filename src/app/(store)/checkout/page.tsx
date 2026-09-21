"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useBag } from "@/components/useBag";
import { primaryButton } from "@/components/buttonStyles";
import { useResolvedBag } from "@/components/useResolvedBag";
import { formatPence } from "@/lib/money";
import { DELIVERY_OPTIONS, deliveryPence } from "@/lib/shop";

import { placeOrder } from "./actions";

type Step = "method" | "details" | "payment";

const FIELD =
  "rounded-edge border border-[rgba(43,43,43,0.22)] bg-panel p-3.5 text-[15px]";
const LABEL = "flex flex-col gap-1.5 text-[13px] text-muted";

export default function CheckoutPage() {
  const router = useRouter();
  const { lines, clear, deliveryMethod, setDeliveryMethod } = useBag();
  const { bag, loading } = useResolvedBag();

  const [step, setStep] = useState<Step>("method");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    addressLine: "",
    city: "",
    postcode: "",
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [processing, setProcessing] = useState(false);

  const isCollection = deliveryMethod === "COLLECTION";

  if (loading || !bag) {
    return (
      <main className="mx-auto max-w-[980px] px-[22px] pb-[70px] pt-[34px]">
        <p className="text-muted">Loading checkout…</p>
      </main>
    );
  }

  if (bag.lines.length === 0) {
    return (
      <main className="mx-auto max-w-[980px] px-[22px] pb-[70px] pt-[34px]">
        <h1 className="mb-3 font-serif text-[clamp(30px,4.6vw,42px)] font-normal">
          Nothing to check out
        </h1>
        <p className="mb-6 text-muted">
          Your bag is empty — pick something out first.
        </p>
        <Link href="/shop" className={`${primaryButton} px-7 py-3.5`}>
          Start shopping
        </Link>
      </main>
    );
  }

  const postage = deliveryPence(deliveryMethod, bag.subtotalPence);
  const total = bag.subtotalPence + postage;
  const option = DELIVERY_OPTIONS.find((o) => o.method === deliveryMethod)!;

  function update(key: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function goToPayment() {
    const missing: Record<string, string> = {};
    if (form.name.trim().length < 2) missing.name = "We need a name.";
    if (!form.email.includes("@")) missing.email = "That email doesn't look right.";
    if (form.phone.trim().length < 6) missing.phone = "We need a contact number.";
    if (!isCollection) {
      if (!form.addressLine.trim()) missing.addressLine = "Needed for delivery.";
      if (!form.city.trim()) missing.city = "Needed for delivery.";
      if (!form.postcode.trim()) missing.postcode = "Needed for delivery.";
    }
    setFieldErrors(missing);
    if (Object.keys(missing).length > 0) return;
    setFormError("");
    setStep("payment");
  }

  async function pay() {
    setProcessing(true);
    setFormError("");

    // Demo gateway: a beat of "processing" so the flow feels real.
    await new Promise((resolve) => setTimeout(resolve, 1200));

    const result = await placeOrder({
      lines,
      method: deliveryMethod,
      name: form.name,
      email: form.email,
      phone: form.phone,
      ...(isCollection
        ? {}
        : {
            addressLine: form.addressLine,
            city: form.city,
            postcode: form.postcode,
            country: "United Kingdom",
          }),
    });

    if (!result.ok) {
      setProcessing(false);
      setFormError(result.error);
      if (result.fieldErrors) {
        setFieldErrors(result.fieldErrors);
        setStep("details");
      }
      return;
    }

    clear();
    router.push(`/order/${result.ref}`);
  }

  const summary = (
    <div className="border border-rule bg-panel p-5">
      <p className="mb-3 text-[11px] uppercase tracking-[0.18em] text-faint">
        Order
      </p>
      {bag.lines.map((line) => (
        <div
          key={`${line.slug}-${line.size}`}
          className="mb-2 flex justify-between gap-2.5 text-sm"
        >
          <span>
            {line.name} — {line.size} ×{line.quantity}
          </span>
          <span>{formatPence(line.linePence)}</span>
        </div>
      ))}
      <div className="my-3 flex justify-between text-sm">
        <span>{option.name}</span>
        <span>{postage === 0 ? "Free" : formatPence(postage)}</span>
      </div>
      <div className="flex justify-between border-t border-[rgba(43,43,43,0.16)] pt-3 font-serif text-[22px]">
        <span>Total</span>
        <span>{formatPence(total)}</span>
      </div>
    </div>
  );

  return (
    <main className="mx-auto max-w-[980px] px-[22px] pb-[70px] pt-[34px]">
      <div className="mb-[22px] flex flex-wrap items-center gap-2.5 text-xs uppercase tracking-[0.14em]">
        {(
          [
            ["method", "1 · How you'll get it"],
            ["details", "2 · Your details"],
            ["payment", "3 · Payment"],
          ] as const
        ).map(([key, label], i) => (
          <span key={key} className="flex items-center gap-2.5">
            {i > 0 ? <span className="text-faint">—</span> : null}
            <span className={step === key ? "text-ink" : "text-faint"}>
              {label}
            </span>
          </span>
        ))}
      </div>

      {step === "method" ? (
        <>
          <h1 className="mb-1.5 font-serif text-[clamp(30px,4.6vw,42px)] font-normal">
            Delivery or collection?
          </h1>
          <p className="mb-[26px] text-muted">
            Both work the same at the till. Collection is free and usually ready
            within a couple of hours.
          </p>

          <div className="grid gap-[18px] [grid-template-columns:repeat(auto-fit,minmax(260px,1fr))]">
            {DELIVERY_OPTIONS.map((o) => {
              const cost = deliveryPence(o.method, bag.subtotalPence);
              const active = o.method === deliveryMethod;
              return (
                <button
                  key={o.method}
                  type="button"
                  onClick={() => setDeliveryMethod(o.method)}
                  className={[
                    "rounded-edge border p-[22px] text-left",
                    active
                      ? "border-oxblood bg-panel shadow-[inset_0_0_0_1px_var(--color-oxblood)]"
                      : "border-[rgba(43,43,43,0.2)] hover:border-ink",
                  ].join(" ")}
                >
                  <p className="mb-1.5 text-[11px] uppercase tracking-[0.2em] text-sage">
                    {cost === 0 ? "Free" : formatPence(cost)}
                  </p>
                  <p className="mb-2 font-serif text-[26px]">{o.name}</p>
                  <p className="mb-3 text-sm text-[rgba(43,43,43,0.78)]">
                    {o.detail}
                  </p>
                  <p className="text-[13px] text-faint">{o.timing}</p>
                  {o.isCollection ? (
                    <p className="mt-2 font-hand text-xl text-clay">
                      kettle&apos;s on
                    </p>
                  ) : null}
                </button>
              );
            })}
          </div>

          <div className="mt-[26px] flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setStep("details")}
              className={primaryButton}
            >
              Continue
            </button>
            <Link href="/bag" className="text-[13px] text-oxblood underline">
              Back to bag
            </Link>
          </div>
        </>
      ) : null}

      {step === "details" ? (
        <>
          <h1 className="mb-[22px] font-serif text-[clamp(30px,4.6vw,42px)] font-normal">
            Your details
          </h1>
          <div className="grid gap-[34px] md:grid-cols-[1fr_340px]">
            <div className="flex min-w-0 flex-col gap-3.5">
              <label className={LABEL}>
                Name
                <input
                  className={FIELD}
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="Jo Whitaker"
                  autoComplete="name"
                />
                {fieldErrors.name ? (
                  <span className="text-clay">{fieldErrors.name}</span>
                ) : null}
              </label>

              <label className={LABEL}>
                Email
                <input
                  className={FIELD}
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  placeholder="jo@example.co.uk"
                  autoComplete="email"
                />
                {fieldErrors.email ? (
                  <span className="text-clay">{fieldErrors.email}</span>
                ) : null}
              </label>

              <label className={LABEL}>
                {isCollection
                  ? "Mobile number (for the collection text)"
                  : "Phone number"}
                <input
                  className={FIELD}
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  placeholder="07700 900123"
                  autoComplete="tel"
                />
                {fieldErrors.phone ? (
                  <span className="text-clay">{fieldErrors.phone}</span>
                ) : null}
              </label>

              {!isCollection ? (
                <>
                  <label className={LABEL}>
                    Address
                    <input
                      className={FIELD}
                      value={form.addressLine}
                      onChange={(e) => update("addressLine", e.target.value)}
                      placeholder="42 Ardwick Green North"
                      autoComplete="address-line1"
                    />
                    {fieldErrors.addressLine ? (
                      <span className="text-clay">{fieldErrors.addressLine}</span>
                    ) : null}
                  </label>
                  <div className="flex gap-3">
                    <label className={`${LABEL} flex-1`}>
                      Town or city
                      <input
                        className={FIELD}
                        value={form.city}
                        onChange={(e) => update("city", e.target.value)}
                        placeholder="Manchester"
                        autoComplete="address-level2"
                      />
                      {fieldErrors.city ? (
                        <span className="text-clay">{fieldErrors.city}</span>
                      ) : null}
                    </label>
                    <label className={`${LABEL} flex-1`}>
                      Postcode
                      <input
                        className={FIELD}
                        value={form.postcode}
                        onChange={(e) => update("postcode", e.target.value)}
                        placeholder="M12 6FZ"
                        autoComplete="postal-code"
                      />
                      {fieldErrors.postcode ? (
                        <span className="text-clay">{fieldErrors.postcode}</span>
                      ) : null}
                    </label>
                  </div>
                </>
              ) : (
                <p className="rounded-edge border border-rule bg-panel p-3.5 text-sm text-muted">
                  Collecting from 12 Weaver&apos;s Row — no address needed.
                  We&apos;ll text you when it&apos;s on the shelf.
                </p>
              )}

              {formError ? (
                <p className="text-[13px] text-clay">{formError}</p>
              ) : null}

              <div className="mt-1.5 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={goToPayment}
                  className={primaryButton}
                >
                  Continue to payment
                </button>
                <button
                  type="button"
                  onClick={() => setStep("method")}
                  className="px-2 text-[13px] text-oxblood underline"
                >
                  Back
                </button>
              </div>
            </div>
            <div>{summary}</div>
          </div>
        </>
      ) : null}

      {step === "payment" ? (
        <>
          <h1 className="mb-1.5 font-serif text-[clamp(30px,4.6vw,42px)] font-normal">
            Payment
          </h1>
          <p className="mb-6 inline-block border border-[rgba(181,101,74,0.4)] bg-panel px-3 py-1.5 text-sm text-clay">
            Demo only — no card is charged and these details are fixed.
          </p>

          <div className="grid gap-[34px] md:grid-cols-[1fr_340px]">
            <div className="flex min-w-0 flex-col gap-3.5">
              <label className={LABEL}>
                Card number
                <input
                  className={`${FIELD} text-faint`}
                  value="4242 4242 4242 4242"
                  readOnly
                />
              </label>
              <div className="flex gap-3">
                <label className={`${LABEL} flex-1`}>
                  Expiry
                  <input className={`${FIELD} text-faint`} value="09/29" readOnly />
                </label>
                <label className={`${LABEL} flex-1`}>
                  CVC
                  <input className={`${FIELD} text-faint`} value="123" readOnly />
                </label>
              </div>

              {formError ? (
                <p className="text-[13px] text-clay">{formError}</p>
              ) : null}

              <div className="mt-1.5 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={pay}
                  disabled={processing}
                  className={primaryButton}
                >
                  {processing ? "Taking payment…" : `Pay ${formatPence(total)}`}
                </button>
                <button
                  type="button"
                  onClick={() => setStep("details")}
                  disabled={processing}
                  className="px-2 text-[13px] text-oxblood underline disabled:opacity-50"
                >
                  Back
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {summary}
              <div className="border border-rule bg-panel p-5 text-sm">
                <p className="mb-2.5 text-[11px] uppercase tracking-[0.18em] text-faint">
                  {option.name}
                </p>
                <p className="mb-2.5">
                  {isCollection
                    ? "12 Weaver's Row, Northern Quarter, M4 1AA"
                    : [form.addressLine, form.city, form.postcode]
                        .filter(Boolean)
                        .join(", ")}
                </p>
                <p className="text-muted">{option.timing}</p>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </main>
  );
}
