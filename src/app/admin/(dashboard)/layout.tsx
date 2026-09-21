import Link from "next/link";

import { requireAdmin } from "@/lib/adminAuth";

import { signOut } from "../login/actions";

export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await requireAdmin();

  return (
    <main className="min-h-screen bg-[#FBFAF7] px-[22px] pb-16 pt-[26px]">
      <div className="mx-auto max-w-[1180px]">
        <div className="mb-[26px] flex flex-wrap items-center gap-4 border-b border-rule pb-4">
          <span className="text-[15px] font-semibold tracking-[0.02em]">
            Oddment Admin
          </span>
          <span className="text-xs text-faint">
            Signed in as {session.email}
          </span>

          <div className="ml-auto flex flex-wrap gap-2">
            <Link
              href="/admin"
              className="rounded-full border border-[rgba(43,43,43,0.24)] px-3.5 py-[7px] text-[13px] hover:border-ink"
            >
              Orders
            </Link>
            <Link
              href="/admin/stock"
              className="rounded-full border border-[rgba(43,43,43,0.24)] px-3.5 py-[7px] text-[13px] hover:border-ink"
            >
              Stock
            </Link>
            <form action={signOut}>
              <button
                type="submit"
                className="rounded-full border border-[rgba(43,43,43,0.24)] px-3.5 py-[7px] text-[13px] text-muted hover:border-ink"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>

        {children}
      </div>
    </main>
  );
}
