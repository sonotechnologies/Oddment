"use client";

import { useEffect, useState } from "react";

import { MENS_SIZE_GUIDE, WOMENS_SIZE_GUIDE } from "@/lib/shop";

const TH = "border-b border-rule-strong px-2.5 py-2 text-left font-semibold";
const TD = "border-b border-[rgba(43,43,43,0.1)] px-2.5 py-2";

export function SizeGuideTables() {
  return (
    <>
      <p className="mb-[22px] text-sm text-[rgba(43,43,43,0.72)]">
        Measurements in centimetres, taken flat and doubled. Between two sizes?
        We usually say size up, or ask us on Instagram.
      </p>

      <p className="mb-2.5 text-[11px] uppercase tracking-[0.18em] text-sage">
        Women — UK
      </p>
      <div className="mb-[26px] overflow-x-auto">
        <table className="w-full min-w-[420px] border-collapse text-sm">
          <thead>
            <tr>
              <th className={TH}>UK size</th>
              <th className={TH}>Bust</th>
              <th className={TH}>Waist</th>
              <th className={TH}>Hip</th>
            </tr>
          </thead>
          <tbody>
            {WOMENS_SIZE_GUIDE.map((row) => (
              <tr key={row.size}>
                <td className={TD}>{row.size}</td>
                <td className={TD}>{row.bust}</td>
                <td className={TD}>{row.waist}</td>
                <td className={TD}>{row.hip}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mb-2.5 text-[11px] uppercase tracking-[0.18em] text-sage">
        Men
      </p>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[420px] border-collapse text-sm">
          <thead>
            <tr>
              <th className={TH}>Size</th>
              <th className={TH}>Chest</th>
              <th className={TH}>Waist</th>
            </tr>
          </thead>
          <tbody>
            {MENS_SIZE_GUIDE.map((row) => (
              <tr key={row.size}>
                <td className={TD}>{row.size}</td>
                <td className={TD}>{row.chest}</td>
                <td className={TD}>{row.waist}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export function SizeGuideModalButton() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-[13px] text-oxblood underline hover:text-clay"
      >
        Size guide
      </button>

      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Size guide"
          className="fixed inset-0 z-90 flex items-start justify-center overflow-auto bg-[rgba(43,43,43,0.55)] p-6"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div className="animate-rise w-full max-w-[720px] bg-paper p-7">
            <div className="mb-2 flex items-start justify-between gap-4">
              <h2 className="font-serif text-3xl font-normal">Size guide</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close size guide"
                className="text-[22px] leading-none"
              >
                ×
              </button>
            </div>
            <SizeGuideTables />
          </div>
        </div>
      ) : null}
    </>
  );
}
