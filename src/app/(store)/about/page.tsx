import type { Metadata } from "next";

import { HandUnderline } from "@/components/HandUnderline";
import { Photo } from "@/components/Photo";
import { lifestyleImage } from "@/lib/images";

export const metadata: Metadata = {
  title: "About",
  description:
    "Oddment started in 2016 as a rail of coats in the corner of a friend's print studio. The story of the shop on Weaver's Row.",
};

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-[760px] px-[22px] pb-20 pt-11">
      <p className="mb-3 text-[11px] uppercase tracking-[0.24em] text-sage">
        About
      </p>
      <h1 className="font-serif text-[clamp(34px,5.4vw,50px)] font-normal leading-[1.1]">
        The shop on Weaver&apos;s Row
      </h1>
      <HandUnderline width={180} className="my-3.5 mb-7" />

      <div className="flex flex-col gap-5 text-lg leading-[1.75] text-[rgba(43,43,43,0.88)]">
        <p>
          Oddment started in 2016 as a rail of coats in the corner of a
          friend&apos;s print studio. We had no plan beyond buying things we
          liked and hoping somebody else would like them too. Nine years later
          we have a proper door, a proper till, and the same buying habit.
        </p>
        <p>
          The name comes from the offcuts a tailor keeps back — the leftover
          lengths too good to bin. We buy the same way: small runs, end-of-roll
          fabrics, the odd sizes other shops send back. It means we often have
          two of something and never twelve, and that when a piece goes, it
          usually goes for good.
        </p>
        <p>
          Four of us run the place. Sam does most of the womenswear buying, Rob
          the menswear, Nia the shop floor and everything on Instagram, and Dev
          keeps the books from the back room. If you order online, one of us
          wraps it.
        </p>
      </div>

      <Photo
        image={lifestyleImage(7)}
        label="photo — the four of us behind the counter"
        className="my-8 aspect-[16/9] border border-rule"
        sizes="(max-width: 768px) 100vw, 760px"
        variant="deep"
      />

      <p className="font-hand text-[26px] text-clay">
        come and say hello — we&apos;re usually all in on Saturdays
      </p>
    </main>
  );
}
