"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function ExecutionView({ content }: { content: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (!content) {
    return (
      <p className="py-12 text-center font-body text-sm text-text-muted">
        No execution view available for this program.
      </p>
    );
  }

  return (
    <div className="relative">
      <div className="no-print sticky top-2 z-10 mb-3 flex justify-end">
        <Button onClick={copy} size="sm" className="shadow-glow-red">
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? "Copied" : "Copy to Clipboard"}
        </Button>
      </div>
      <pre className="overflow-x-auto whitespace-pre-wrap rounded-sm border border-border-default bg-bg-secondary p-4 font-mono text-sm leading-relaxed text-text-primary sm:p-6">
        {content}
      </pre>
    </div>
  );
}
