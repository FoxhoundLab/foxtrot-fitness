"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { api, setSession } from "@/lib/api";

function CallbackHandler() {
  const router = useRouter();
  const params = useSearchParams();
  const [failed, setFailed] = useState(false);
  const verifying = useRef(false);

  useEffect(() => {
    const token = params.get("token");
    if (!token) {
      setFailed(true);
      return;
    }
    if (verifying.current) return; // tokens are one-time use — don't double-verify
    verifying.current = true;

    // Only relative paths — never forward users to an external URL after login
    const rawReturnTo = params.get("returnTo");
    const returnTo =
      rawReturnTo && rawReturnTo.startsWith("/") && !rawReturnTo.startsWith("//")
        ? rawReturnTo
        : undefined;

    api
      .verifyToken(token, returnTo)
      .then(({ email, token: jwt }) => {
        setSession(email, jwt);
        router.replace(returnTo ?? "/library");
      })
      .catch(() => setFailed(true));
  }, [params, router]);

  if (failed) {
    return (
      <div className="text-center">
        <h1 className="mb-2 font-display text-4xl uppercase text-accent-red">Link Expired</h1>
        <p className="mb-6 font-body text-sm text-text-secondary">
          That magic link is invalid or expired. Request a fresh one.
        </p>
        <Link
          href="/auth/login"
          className="font-display uppercase tracking-wide text-text-primary underline decoration-accent-red hover:text-accent-red"
        >
          Back to Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="text-center">
      <div className="mx-auto mb-6 h-12 w-12 animate-pulse-red bg-accent-red" />
      <p className="font-mono text-sm text-text-secondary">VERIFYING CREDENTIALS...</p>
    </div>
  );
}

export default function CallbackPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <Suspense fallback={null}>
        <CallbackHandler />
      </Suspense>
    </div>
  );
}
