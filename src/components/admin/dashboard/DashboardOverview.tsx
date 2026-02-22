"use client";
import React, { useState, useEffect } from 'react';
import { FiCalendar, FiUsers, FiDollarSign, FiActivity, FiArrowUpRight, FiMoreHorizontal } from 'react-icons/fi';
import { Skeleton } from '../ui/Skeleton';
import { MetricCardSkeleton, RegistrationRowSkeleton, EventRowSkeleton } from './DashboardSkeletons';

const stats = [
    { title: "Total Events", value: "142", icon: FiCalendar, color: "text-blue-600", bg: "bg-blue-100/50" },
    { title: "Registrations", value: "8,234", icon: FiUsers, color: "text-emerald-600", bg: "bg-emerald-100/50" },
    { title: "Total Revenue", value: "$45,231", icon: FiDollarSign, color: "text-indigo-600", bg: "bg-indigo-100/50" },
    { title: "Active Events", value: "12", icon: FiActivity, color: "text-orange-600", bg: "bg-orange-100/50" },
];

export const DashboardOverview = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1200);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
                    <p className="text-gray-500 mt-1">Here's an overview of your events and registrations.</p>
                </div>
                <div className="flex gap-3">
                    <select className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm cursor-pointer hover:border-blue-500 transition-colors">
                        <option>Last 7 Days</option>
                        <option>Last 30 Days</option>
                        <option>This Year</option>
                    </select>
                </div>
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
                {loading
                    ? Array.from({ length: 4 }).map((_, i) => (
                        <MetricCardSkeleton key={i} />
                    ))
                    : stats.map((stat, i) => (
                        <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 w-full min-h-[140px] relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/0 to-gray-50/50 rounded-bl-full -z-10 transition-transform group-hover:scale-110"></div>
                            <div className="flex justify-between items-start">
                                <div className={`p-4 rounded-xl ${stat.bg} shadow-sm group-hover:shadow transition-shadow`}>
                                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                                </div>
                                <button className="text-gray-400 hover:text-gray-600 transition-colors p-1">
                                    <FiMoreHorizontal size={20} />
                                </button>
                            </div>
                            <div className="mt-4">
                                <p className="text-sm font-semibold text-gray-500 flex items-center justify-between">
                                    {stat.title}
                                </p>
                                <h3 className="text-3xl font-extrabold text-gray-900 mt-1 tracking-tight">{stat.value}</h3>
                            </div>
                        </div>
                    ))}
            </div>

            {/* Main Content Areas */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-8">
                {/* Recent Registrations Table */}
                <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col min-h-[440px]">
                    <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">Recent Registrations</h3>
                            <p className="text-sm text-gray-500">Latest people who booked events</p>
                        </div>
                        <button className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors">
                            View All <FiArrowUpRight />
                        </button>
                    </div>

                    <div className="p-6 flex-1">
                        {loading ? (
                            <div className="space-y-5">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <RegistrationRowSkeleton key={i} />
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-center py-10">
                                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                    <FiUsers className="h-8 w-8 text-gray-300" />
                                </div>
                                <h4 className="text-md font-semibold text-gray-900">No Registrations Yet</h4>
                                <p className="text-sm text-gray-500 mt-1 max-w-xs">When users register for your events, they will appear here.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Upcoming Events List */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col min-h-[440px]">
                    <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                        <h3 className="text-lg font-bold text-gray-900">Upcoming Events</h3>
                        <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold">12 Active</div>
                    </div>

                    <div className="p-6 flex-1">
                        {loading ? (
                            <div className="space-y-6">
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <EventRowSkeleton key={i} />
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-center py-10">
                                <div className="w-16 h-16 bg-blue-50/50 rounded-full flex items-center justify-center mb-4">
                                    <FiCalendar className="h-8 w-8 text-blue-200" />
                                </div>
                                <h4 className="text-md font-semibold text-gray-900">No Upcoming Events</h4>
                                <p className="text-sm text-gray-500 mt-1 max-w-xs">Create a new event to start receiving registrations.</p>
                                <button className="mt-4 px-4 py-2 bg-white border border-gray-200 shadow-sm rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                                    Create Event
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
