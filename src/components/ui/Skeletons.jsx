import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";

export function GridSkeleton({ count = 6 }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array(count).fill(0).map((_, i) => (
                <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden h-[400px] flex flex-col">
                    <Skeleton className="h-48 w-full bg-slate-800" />
                    <div className="p-6 flex-1 space-y-4">
                        <Skeleton className="h-6 w-3/4 bg-slate-800" />
                        <Skeleton className="h-4 w-full bg-slate-800" />
                        <Skeleton className="h-4 w-5/6 bg-slate-800" />
                        <div className="flex gap-2 pt-4">
                            <Skeleton className="h-6 w-16 rounded-full bg-slate-800" />
                            <Skeleton className="h-6 w-16 rounded-full bg-slate-800" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export function ListSkeleton({ count = 3 }) {
    return (
        <div className="grid gap-8">
            {Array(count).fill(0).map((_, i) => (
                <div key={i} className="bg-slate-900/50 border border-slate-800 rounded-xl p-8 h-[300px] flex gap-8">
                     <Skeleton className="w-[300px] h-full bg-slate-800 rounded-lg hidden md:block" />
                     <div className="flex-1 space-y-4">
                        <Skeleton className="h-8 w-1/3 bg-slate-800" />
                        <Skeleton className="h-4 w-1/4 bg-slate-800" />
                        <Skeleton className="h-32 w-full bg-slate-800 mt-6" />
                     </div>
                </div>
            ))}
        </div>
    );
}