import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function EnhancedSkeleton({ className, ...props }) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <Skeleton className="h-full w-full" {...props} />
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-slate-700/20 to-transparent" />
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="relative overflow-hidden bg-slate-900 rounded-xl border border-slate-800 h-full">
      <div className="p-6 space-y-4 h-full flex flex-col">
        <EnhancedSkeleton className="h-48 w-full rounded-lg" />
        <EnhancedSkeleton className="h-6 w-3/4" />
        <EnhancedSkeleton className="h-4 w-1/2" />
        <div className="flex gap-2 pt-4 mt-auto">
          <EnhancedSkeleton className="h-8 w-16 rounded-full" />
          <EnhancedSkeleton className="h-8 w-20 rounded-full" />
        </div>
      </div>
    </div>
  );
}