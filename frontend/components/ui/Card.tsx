import * as React from "react";
import { cn } from "@/lib/utils";

export const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-sm border border-border-default bg-bg-secondary transition-all",
        className
      )}
      {...props}
    />
  )
);
Card.displayName = "Card";

export function CardGlow({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <Card
      className={cn("hover:border-border-active hover:shadow-glow-red", className)}
      {...props}
    />
  );
}
