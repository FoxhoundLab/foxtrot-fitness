import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-sm font-display uppercase tracking-wide",
  {
    variants: {
      variant: {
        red: "bg-accent-red text-text-primary",
        orange: "bg-accent-orange text-bg-primary",
        green: "bg-accent-green text-bg-primary",
        blue: "bg-accent-blue text-text-primary",
        outline: "border border-border-default text-text-secondary",
      },
      size: {
        sm: "px-2 py-0.5 text-xs",
        md: "px-2.5 py-1 text-sm",
        lg: "px-3 py-1 text-base",
      },
    },
    defaultVariants: { variant: "red", size: "md" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, size, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, size }), className)} {...props} />;
}
