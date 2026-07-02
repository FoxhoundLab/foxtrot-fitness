import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-sm bg-bg-tertiary", className)} />;
}

export function ProgramCardSkeleton() {
  return (
    <div className="rounded-sm border border-border-default bg-bg-secondary p-5">
      <Skeleton className="mb-4 h-8 w-40" />
      <Skeleton className="mb-2 h-4 w-full" />
      <Skeleton className="mb-5 h-4 w-2/3" />
      <div className="mb-4 flex gap-2">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-5 w-14" />
      </div>
      <div className="flex gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-6 w-6" />
        ))}
      </div>
    </div>
  );
}
