"use client";
import React, { useState, useEffect } from 'react';
import { FiCalendar, FiUsers, FiDollarSign, FiActivity, FiArrowUpRight, FiMoreHorizontal } from 'react-icons/fi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Skeleton } from '../ui/Skeleton';
import { MetricCardSkeleton, RegistrationRowSkeleton, EventRowSkeleton } from './DashboardSkeletons';

const stats = [
    { title: "Total Events", value: "142", icon: FiCalendar, color: "text-primary", bg: "bg-primary/10" },
    { title: "Registrations", value: "8,234", icon: FiUsers, color: "text-emerald-600", bg: "bg-emerald-100/50" },
    { title: "Total Revenue", value: "$45,231", icon: FiDollarSign, color: "text-indigo-600", bg: "bg-indigo-100/50" },
    { title: "Active Events", value: "12", icon: FiActivity, color: "text-orange-600", bg: "bg-orange-100/50" },
];

const dummyRegistrations = [
    { id: 1, name: "Jenny Wilson", email: "jenny@example.com", event: "Winter Mountain Trek", date: "Just now", amount: "$499.00", initial: "J" },
    { id: 2, name: "Guy Hawkins", email: "guy@example.com", event: "Island Surf Retreat", date: "2 mins ago", amount: "$150.00", initial: "G" },
    { id: 3, name: "Robert Fox", email: "robert@example.com", event: "Desert Safari", date: "1 hr ago", amount: "$299.00", initial: "R" },
    { id: 4, name: "Eleanor Pena", email: "eleanor@example.com", event: "Winter Mountain Trek", date: "3 hrs ago", amount: "$499.00", initial: "E" },
    { id: 5, name: "Courtney Henry", email: "courtney@example.com", event: "Forest Camping", date: "5 hrs ago", amount: "$199.00", initial: "C" },
];

const dummyUpcomingEvents = [
    { id: 1, title: "Winter Mountain Trek", date: "Dec 15, 2026", location: "Himalayas, India", registered: 124, capacity: 150 },
    { id: 2, title: "Island Surf Retreat", date: "Jan 10, 2027", location: "Bali, Indonesia", registered: 89, capacity: 100 },
    { id: 3, title: "Cultural City Tour", date: "Mar 12, 2027", location: "Kyoto, Japan", registered: 34, capacity: 50 },
    { id: 4, title: "European Backpacking", date: "Apr 05, 2027", location: "Europe", registered: 45, capacity: 80 },
];

const dummyChartData = [
    { name: 'Jan', registrations: 420 },
    { name: 'Feb', registrations: 550 },
    { name: 'Mar', registrations: 850 },
    { name: 'Apr', registrations: 650 },
    { name: 'May', registrations: 980 },
    { name: 'Jun', registrations: 1250 },
    { name: 'Jul', registrations: 1100 },
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
                            <LineChart data={dummyChartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
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
                        <button className="text-sm font-semibold text-primary hover:text-primary/80 flex items-center gap-1 transition-colors">
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
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse min-w-[500px]">
                                    <thead>
                                        <tr className="border-b border-gray-100 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                            <th className="pb-3 px-4">Attendee</th>
                                            <th className="pb-3 px-4">Event</th>
                                            <th className="pb-3 px-4">Time</th>
                                            <th className="pb-3 px-4 text-right">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {dummyRegistrations.map((reg) => (
                                            <tr key={reg.id} className="hover:bg-gray-50/50 transition-colors group">
                                                <td className="py-3 px-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                                                            {reg.initial}
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-gray-900 text-sm">{reg.name}</p>
                                                            <p className="text-xs text-gray-500">{reg.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4 font-medium text-gray-700 text-sm">{reg.event}</td>
                                                <td className="py-3 px-4 text-gray-500 text-sm">{reg.date}</td>
                                                <td className="py-3 px-4 text-right font-bold text-gray-900 text-sm">{reg.amount}</td>
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
                        <div className="p-1.5 bg-primary/10 text-primary rounded-lg text-xs font-bold">12 Active</div>
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
                                {dummyUpcomingEvents.map((event) => (
                                    <div key={event.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 group">
                                        <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
                                            <div className="bg-primary/5 w-full h-full flex flex-col items-center justify-center">
                                                <span className="text-[10px] uppercase font-bold text-primary">{event.date.split(' ')[0]}</span>
                                                <span className="text-lg font-bold text-gray-900 leading-none">{event.date.split(' ')[1].replace(',', '')}</span>
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-gray-900 text-sm truncate group-hover:text-primary transition-colors">{event.title}</h4>
                                            <p className="text-xs text-gray-500 truncate">{event.location}</p>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <div className="text-sm font-bold text-gray-900">{event.registered} <span className="text-gray-400 font-normal">/ {event.capacity}</span></div>
                                            <div className="w-16 h-1.5 bg-gray-100 rounded-full mt-1 overflow-hidden">
                                                <div
                                                    className="h-full bg-primary rounded-full"
                                                    style={{ width: `${(event.registered / event.capacity) * 100}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <button className="w-full mt-2 py-2.5 rounded-xl border-2 border-dashed border-gray-200 text-gray-500 font-semibold text-sm hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2">
                                    <FiCalendar /> View Event Calendar
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
