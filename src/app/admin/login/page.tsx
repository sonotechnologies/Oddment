import type { Metadata } from "next";
import { Suspense } from "react";

import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Staff sign in",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FBFAF7] px-[22px] py-16">
      <div className="w-full max-w-[380px]">
        <p className="mb-1.5 text-[11px] uppercase tracking-[0.22em] text-sage">
          Oddment
        </p>
        <h1 className="mb-1.5 font-serif text-3xl font-normal">Staff sign in</h1>
        <p className="mb-7 text-sm text-muted">
          Back room only — orders and stock for the shop.
        </p>
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
