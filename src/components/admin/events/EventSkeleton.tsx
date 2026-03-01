import React from 'react';

export const EventSkeleton = () => {
    return (
        <tr className="animate-pulse bg-white border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors">
            <td className="py-4 px-6">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 relative rounded-lg bg-gray-200 shrink-0"></div>
                    <div className="h-4 bg-gray-200 rounded w-48"></div>
                </div>
            </td>
            <td className="py-4 px-6">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
            </td>
            <td className="py-4 px-6">
                <div className="h-4 bg-gray-200 rounded w-32"></div>
            </td>
            <td className="py-4 px-6">
                <div className="h-4 bg-gray-200 rounded w-8 mx-auto"></div>
            </td>
            <td className="py-4 px-6">
                <div className="h-6 bg-gray-200 rounded-full w-16"></div>
            </td>
            <td className="py-4 px-6 text-right flex justify-end items-center space-x-4">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
                <div className="h-6 w-6 bg-gray-200 rounded-md"></div>
            </td>
        </tr>
    );
};
