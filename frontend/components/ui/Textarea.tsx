import * as React from "react";
import { cn } from "@/lib/utils";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "min-h-[100px] w-full rounded-sm border border-border-default bg-bg-tertiary px-3 py-2 font-body text-base text-text-primary placeholder:text-text-muted focus:border-accent-red focus:outline-none",
      className
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";
