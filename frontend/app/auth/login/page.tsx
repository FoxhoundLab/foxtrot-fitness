"use client";

import { useState } from "react";
import Image from "next/image";
import { MailCheck, Send } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { api } from "@/lib/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [devLink, setDevLink] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSending(true);
    try {
      const res = await api.requestMagicLink(email);
      setSent(true);
      if (res.dev_link) {
        setDevLink(res.dev_link);
      }
    } catch {
      setError("Couldn't send the link. Check the email and try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <Card className="w-full max-w-md p-8">
        <Image
          src="/fox-head.png"
          alt="Foxtrot Fitness"
          width={72}
          height={72}
          className="mx-auto mb-4 object-contain"
        />
        {sent ? (
          <div className="text-center">
            <MailCheck className="mx-auto mb-4 h-12 w-12 text-accent-green" />
            <h1 className="mb-2 font-display text-3xl uppercase tracking-wide text-text-primary">
              Check Your Inbox
            </h1>
            <p className="font-body text-sm text-text-secondary">
              A magic link is on its way to <span className="font-mono text-text-primary">{email}</span>.
              Click it to deploy.
            </p>
            {devLink && (
              <div className="mt-6 rounded-sm border border-border-default bg-bg-tertiary p-4">
                <p className="mb-2 font-display text-xs uppercase tracking-wider text-accent-orange">
                  Dev Mode — Link Ready
                </p>
                <p className="mb-3 font-body text-xs text-text-secondary">
                  Email delivery isn't configured. Use this link to sign in:
                </p>
                <a
                  href={devLink}
                  className="inline-block bg-accent-red px-4 py-2 font-display text-sm uppercase tracking-wide text-text-primary transition-colors hover:bg-accent-red-dark"
                >
                  Click to Sign In
                </a>
              </div>
            )}
          </div>
        ) : (
          <>
            <h1 className="mb-1 font-display text-4xl uppercase tracking-wide text-text-primary">
              Sign <span className="text-accent-red">In</span>
            </h1>
            <p className="mb-6 font-body text-sm text-text-secondary">
              No passwords. We&apos;ll email you a magic link.
            </p>
            <form onSubmit={submit} className="space-y-4">
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="operator@example.com"
                aria-label="Email address"
              />
              {error && <p className="font-body text-xs text-accent-red">{error}</p>}
              <Button type="submit" disabled={sending} className="w-full">
                <Send className="h-4 w-4" />
                {sending ? "Sending…" : "Send Magic Link"}
              </Button>
            </form>
          </>
        )}
      </Card>
    </div>
  );
}
