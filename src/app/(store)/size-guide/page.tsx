import type { Metadata } from "next";

import { SizeGuideTables } from "@/components/SizeGuide";

export const metadata: Metadata = {
  title: "Size guide",
  description:
    "UK women's sizes 6–18 and men's XS–XXL, measured in centimetres.",
};

export default function SizeGuidePage() {
  return (
    <main className="mx-auto max-w-[760px] px-[22px] pb-20 pt-11">
      <h1 className="mb-4 font-serif text-[clamp(32px,5vw,46px)] font-normal">
        Size guide
      </h1>
      <SizeGuideTables />
    </main>
  );
}
