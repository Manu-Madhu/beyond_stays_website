import React from 'react';
import { Skeleton } from '../ui/Skeleton';

export const MetricCardSkeleton = () => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 w-full min-h-[140px] flex flex-col justify-center gap-4 group hover:shadow-md transition-shadow">
        <div className="flex items-center space-x-4">
            <Skeleton className="w-14 h-14 rounded-xl" />
            <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-7 w-20" />
            </div>
        </div>
    </div>
);

export const RegistrationRowSkeleton = () => (
    <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
            <Skeleton className="w-12 h-12 rounded-full ring-4 ring-gray-50" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-24" />
            </div>
        </div>
        <div className="flex items-center gap-4">
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
        </div>
    </div>
);

export const EventRowSkeleton = () => (
    <div className="flex gap-4">
        <div className="flex flex-col items-center min-w-[50px]">
            <Skeleton className="w-full h-14 rounded-xl" />
        </div>
        <div className="flex-1 space-y-2 py-1">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-3 w-2/3" />
        </div>
    </div>
);
