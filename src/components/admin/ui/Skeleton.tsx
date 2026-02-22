import React from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> { }

export function Skeleton({ className, ...props }: SkeletonProps) {
    return (
        <div
            className={twMerge(clsx("animate-pulse rounded-md bg-gray-200/80", className))}
            {...props}
        />
    );
}

export function SkeletonText({ className, lines = 1 }: { className?: string; lines?: number }) {
    return (
        <div className="space-y-2">
            {Array.from({ length: lines }).map((_, i) => (
                <Skeleton
                    key={i}
                    className={twMerge(
                        clsx("h-4 w-full", className, i === lines - 1 && lines > 1 ? "w-2/3" : "")
                    )}
                />
            ))}
        </div>
    );
}
