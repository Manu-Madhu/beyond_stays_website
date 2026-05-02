"use client";
import React, { useEffect, useState } from 'react';
import { AdminLayout } from "@/components/admin/layout/AdminLayout";
import { 
    FiUsers, FiCalendar, FiDollarSign, FiActivity, 
    FiArrowUpRight, FiCheckCircle, FiClock, FiAlertCircle 
} from "react-icons/fi";
import { AdminService } from '@/services/admin.service';
import Link from 'next/link';

export default function DashboardPage() {
    const [stats, setStats] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await AdminService.getEventStats();
                if (data?.success) {
                    setStats(data.data);
                }
            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (isLoading) {
        return (
            <AdminLayout>
                <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            </AdminLayout>
        );
    }

    const statCards = [
        { 
            title: 'Total Events', 
            value: stats?.totalEvents || 0, 
            icon: <FiCalendar className="w-6 h-6 text-blue-600" />, 
            bg: 'bg-blue-50',
            link: '/admin/events'
        },
        { 
            title: 'Total Registrations', 
            value: stats?.totalRegistrations || 0, 
            icon: <FiUsers className="w-6 h-6 text-purple-600" />, 
            bg: 'bg-purple-50',
            link: '/admin/payments'
        },
        { 
            title: 'Event Revenue', 
            value: `₹${(stats?.totalRevenue || 0).toLocaleString()}`, 
            icon: <FiDollarSign className="w-6 h-6 text-emerald-600" />, 
            bg: 'bg-emerald-50',
            link: '/admin/payments'
        },
        { 
            title: 'Active Ratio', 
            value: `${stats?.activeRatio || 0}%`, 
            icon: <FiActivity className="w-6 h-6 text-orange-600" />, 
            bg: 'bg-orange-50',
            link: '#'
        }
    ];

    return (
        <AdminLayout>
            <div className="space-y-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
                    <p className="text-gray-500 mt-1">Welcome back, Admin. Here is what is happening with BeyondStays today.</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statCards.map((card, idx) => (
                        <Link key={idx} href={card.link} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-xl ${card.bg} group-hover:scale-110 transition-transform`}>
                                    {card.icon}
                                </div>
                            </div>
                            <h3 className="text-gray-500 text-sm font-medium">{card.title}</h3>
                            <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
                        </Link>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recent Registrations */}
                    <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                            <h3 className="font-bold text-gray-900">Recent Event Registrations</h3>
                            <Link href="/admin/payments" className="text-xs font-bold text-primary hover:underline">View All</Link>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-gray-50/50 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                    <tr>
                                        <th className="py-4 px-6">User</th>
                                        <th className="py-4 px-6">Event</th>
                                        <th className="py-4 px-6">Date</th>
                                        <th className="py-4 px-6">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50 text-sm">
                                    {stats?.recentRegistrations?.map((reg: any) => (
                                        <tr key={reg._id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="py-4 px-6">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-gray-900">{reg.user}</span>
                                                    <span className="text-xs text-gray-500">{reg.email}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className="text-gray-600 font-medium">{reg.eventId?.title || 'Unknown Event'}</span>
                                            </td>
                                            <td className="py-4 px-6 text-gray-500">
                                                {new Date(reg.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="py-4 px-6">
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
                                    {(!stats?.recentRegistrations || stats.recentRegistrations.length === 0) && (
                                        <tr>
                                            <td colSpan={4} className="py-12 text-center text-gray-400 italic">No recent registrations found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Quick Stats/Actions */}
                    <div className="space-y-6">
                        <div className="bg-primary rounded-2xl p-6 text-white shadow-lg shadow-primary/20 relative overflow-hidden">
                            <div className="relative z-10">
                                <h3 className="font-bold text-lg mb-2">BeyondStays Premium</h3>
                                <p className="text-white/80 text-sm mb-6">Manage your travel empire with ease. Need help with the new DigitalOcean integration?</p>
                                <button className="w-full py-3 bg-white text-primary rounded-xl font-bold text-sm hover:bg-gray-50 transition-colors shadow-lg">
                                    Contact Support
                                </button>
                            </div>
                            {/* Decorative blobs */}
                            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
                            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 bg-black/10 rounded-full blur-3xl"></div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h3 className="font-bold text-gray-900 mb-4">Payment Methods Used</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                                            <FiCheckCircle size={16} />
                                        </div>
                                        <span className="text-sm font-medium text-gray-700">Online UPI/Card</span>
                                    </div>
                                    <span className="text-sm font-bold text-gray-900">{stats?.paymentStats?.online || 0}%</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
                                            <FiClock size={16} />
                                        </div>
                                        <span className="text-sm font-medium text-gray-700">Screenshot Ver.</span>
                                    </div>
                                    <span className="text-sm font-bold text-gray-900">{stats?.paymentStats?.screenshot || 0}%</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-600">
                                            <FiAlertCircle size={16} />
                                        </div>
                                        <span className="text-sm font-medium text-gray-700">Direct Venue Pay</span>
                                    </div>
                                    <span className="text-sm font-bold text-gray-900">{stats?.paymentStats?.direct || 0}%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}