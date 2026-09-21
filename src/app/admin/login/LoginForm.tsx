"use client";

import { useSearchParams } from "next/navigation";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { type LoginState, signIn } from "./actions";

const FIELD =
  "rounded-edge border border-[rgba(43,43,43,0.22)] bg-white p-3 text-[15px]";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-1 rounded-edge bg-oxblood px-5 py-3 text-sm uppercase tracking-[0.06em] text-paper hover:bg-clay disabled:opacity-60"
    >
      {pending ? "Checking…" : "Sign in"}
    </button>
  );
}

export function LoginForm() {
  const params = useSearchParams();
  const [state, formAction] = useActionState<LoginState, FormData>(signIn, {});

  return (
    <form action={formAction} className="flex flex-col gap-3.5">
      <input type="hidden" name="next" value={params.get("next") ?? "/admin"} />

      <label className="flex flex-col gap-1.5 text-[13px] text-muted">
        Email
        <input
          className={FIELD}
          name="email"
          type="email"
          autoComplete="username"
          required
        />
      </label>

      <label className="flex flex-col gap-1.5 text-[13px] text-muted">
        Password
        <input
          className={FIELD}
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
      </label>

      {state.error ? (
        <p className="text-[13px] text-clay">{state.error}</p>
      ) : null}

      <SubmitButton />
    </form>
  );
}
