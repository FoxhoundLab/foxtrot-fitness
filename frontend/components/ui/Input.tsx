import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "min-h-[44px] w-full rounded-sm border border-border-default bg-bg-tertiary px-3 py-2 font-body text-base text-text-primary placeholder:text-text-muted focus:border-accent-red focus:outline-none",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";
