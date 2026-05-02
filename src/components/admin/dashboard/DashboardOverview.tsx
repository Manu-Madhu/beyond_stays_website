"use client";
import React, { useState, useEffect } from 'react';
import { FiCalendar, FiUsers, FiDollarSign, FiActivity, FiArrowUpRight, FiMoreHorizontal } from 'react-icons/fi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Skeleton } from '../ui/Skeleton';
import { MetricCardSkeleton, RegistrationRowSkeleton, EventRowSkeleton } from './DashboardSkeletons';
import { AdminService } from '@/services/admin.service';
import Link from 'next/link';

export const DashboardOverview = () => {
    const [loading, setLoading] = useState(true);
    const [apiStats, setApiStats] = useState<any>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await AdminService.getEventStats();
                if (data?.success) {
                    setApiStats(data.data);
                }
            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const stats = [
        { title: "Total Events", value: apiStats?.totalEvents || 0, icon: FiCalendar, color: "text-primary", bg: "bg-primary/10", link: "/admin/events" },
        { title: "Registrations", value: apiStats?.totalRegistrations || 0, icon: FiUsers, color: "text-emerald-600", bg: "bg-emerald-100/50", link: "/admin/payments" },
        { title: "Total Revenue", value: `₹${(apiStats?.totalRevenue || 0).toLocaleString()}`, icon: FiDollarSign, color: "text-indigo-600", bg: "bg-indigo-100/50", link: "/admin/payments" },
        { title: "Active Events", value: apiStats?.activeEvents || 0, icon: FiActivity, color: "text-orange-600", bg: "bg-orange-100/50", link: "/admin/events" },
    ];

    const recentRegistrations = apiStats?.recentRegistrations || [];
    const upcomingEvents = apiStats?.upcomingEvents || [];

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
                    <p className="text-gray-500 mt-1">Here's an overview of your events and registrations.</p>
                </div>
                <div className="flex gap-3">
                    <select className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm cursor-pointer hover:border-primary/50 transition-colors">
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
                        <Link href={stat.link} key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 w-full min-h-[140px] relative overflow-hidden group block">
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
                        </Link>
                    ))}
            </div>

            {/* Registration Trends Chart */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mt-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-gray-900">Registration Trends</h3>
                </div>
                <div className="h-[300px] w-full">
                    {loading ? (
                        <div className="w-full h-full bg-gray-50 rounded-xl animate-pulse"></div>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={apiStats?.chartData || []} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} dx={-10} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    cursor={{ stroke: '#f3f4f6', strokeWidth: 2 }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="registrations"
                                    stroke="#36454F"
                                    strokeWidth={3}
                                    dot={{ r: 4, fill: '#36454F', strokeWidth: 0 }}
                                    activeDot={{ r: 6, strokeWidth: 0 }}
                                    animationDuration={1500}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>

            {/* Main Content Areas */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">
                {/* Recent Registrations Table */}
                <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col min-h-[440px]">
                    <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">Recent Registrations</h3>
                            <p className="text-sm text-gray-500">Latest people who booked events</p>
                        </div>
                        <Link href="/admin/payments" className="text-sm font-semibold text-primary hover:text-primary/80 flex items-center gap-1 transition-colors">
                            View All <FiArrowUpRight />
                        </Link>
                    </div>

                    <div className="p-6 flex-1">
                        {loading ? (
                            <div className="space-y-5">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <RegistrationRowSkeleton key={i} />
                                ))}
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse min-w-[500px]">
                                    <thead>
                                        <tr className="border-b border-gray-100 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                            <th className="pb-3 px-4">Attendee</th>
                                            <th className="pb-3 px-4">Event</th>
                                            <th className="pb-3 px-4">Date</th>
                                            <th className="pb-3 px-4 text-right">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {recentRegistrations.length === 0 ? (
                                            <tr>
                                                <td colSpan={4} className="py-8 text-center text-gray-400 italic">No recent registrations found.</td>
                                            </tr>
                                        ) : recentRegistrations.map((reg: any) => (
                                            <tr key={reg._id} className="hover:bg-gray-50/50 transition-colors group">
                                                <td className="py-3 px-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                                                            {reg.user?.charAt(0).toUpperCase() || 'U'}
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-gray-900 text-sm">{reg.user}</p>
                                                            <p className="text-xs text-gray-500">{reg.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4 font-medium text-gray-700 text-sm">{reg.eventId?.title || 'Unknown Event'}</td>
                                                <td className="py-3 px-4 text-gray-500 text-sm">{new Date(reg.createdAt).toLocaleDateString()}</td>
                                                <td className="py-3 px-4 text-right font-bold text-sm">
                                                    <span className={`px-2 py-1 rounded-lg text-[10px] font-bold border ${
                                                        reg.status === 'Registered' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                                                        reg.status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-100' : 
                                                        'bg-red-50 text-red-700 border-red-100'
                                                    }`}>
                                                        {reg.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>

                {/* Upcoming Events List */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col min-h-[440px]">
                    <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                        <h3 className="text-lg font-bold text-gray-900">Upcoming Events</h3>
                        <div className="p-1.5 bg-primary/10 text-primary rounded-lg text-xs font-bold">{apiStats?.activeEvents || 0} Active</div>
                    </div>

                    <div className="p-6 flex-1">
                        {loading ? (
                            <div className="space-y-6">
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <EventRowSkeleton key={i} />
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {upcomingEvents.length === 0 ? (
                                    <p className="text-center py-8 text-gray-400 italic text-sm">No upcoming events scheduled.</p>
                                ) : upcomingEvents.map((event: any) => {
                                    const dateObj = new Date(event.startDate);
                                    const monthStr = dateObj.toLocaleDateString('en-US', { month: 'short' });
                                    const dayStr = dateObj.toLocaleDateString('en-US', { day: 'numeric' });
                                    const capacity = event.capacity || 0;
                                    const registered = event.registrationCount || 0;
                                    const fillRatio = capacity > 0 ? (registered / capacity) * 100 : 0;

                                    return (
                                        <div key={event._id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 group">
                                            <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
                                                <div className="bg-primary/5 w-full h-full flex flex-col items-center justify-center">
                                                    <span className="text-[10px] uppercase font-bold text-primary">{monthStr}</span>
                                                    <span className="text-lg font-bold text-gray-900 leading-none">{dayStr}</span>
                                                </div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-bold text-gray-900 text-sm truncate group-hover:text-primary transition-colors">{event.title}</h4>
                                                <p className="text-xs text-gray-500 truncate">{event.location}</p>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <div className="text-sm font-bold text-gray-900">{registered} <span className="text-gray-400 font-normal">/ {capacity > 0 ? capacity : '∞'}</span></div>
                                                <div className="w-16 h-1.5 bg-gray-100 rounded-full mt-1 overflow-hidden">
                                                    <div
                                                        className="h-full bg-primary rounded-full"
                                                        style={{ width: `${Math.min(fillRatio, 100)}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                                <Link href="/admin/events" className="w-full mt-2 py-2.5 rounded-xl border-2 border-dashed border-gray-200 text-gray-500 font-semibold text-sm hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2">
                                    <FiCalendar /> View All Events
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
