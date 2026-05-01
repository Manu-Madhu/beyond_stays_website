"use client";
import React, { useState, useEffect } from 'react';
import { AdminLayout } from "@/components/admin/layout/AdminLayout";
import { FiDownload, FiSearch, FiFilter, FiExternalLink, FiEye } from "react-icons/fi";
import { AdminService } from '@/services/admin.service';
import Link from 'next/link';

export default function PaymentsPage() {
    const [registrations, setRegistrations] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [meta, setMeta] = useState<any>({});
    const [page, setPage] = useState(1);
    const [status, setStatus] = useState('All Status');
    const [method, setMethod] = useState('All Methods');
    const [search, setSearch] = useState('');

    const fetchRegistrations = async () => {
        setIsLoading(true);
        try {
            const { data } = await AdminService.getAllRegistrations({
                page,
                limit: 10,
                status,
                search,
                paymentMethod: method === 'All Methods' ? '' : method.toLowerCase()
            });
            if (data?.success) {
                setRegistrations(data.data);
                setMeta(data.meta);
            }
        } catch (error) {
            console.error("Failed to fetch registrations", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRegistrations();
    }, [page, status, method, search]);

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Payment & Registration Listing</h1>
                        <p className="text-gray-500 mt-1">Track all event registrations and payments across the platform.</p>
                    </div>
                    <button className="bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-gray-50 transition-colors shadow-sm">
                        <FiDownload className="w-4 h-4" />
                        Export Report
                    </button>
                </div>

                {/* Filters */}
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-wrap gap-4 items-center">
                    <div className="relative flex-1 min-w-[200px]">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Search name or email..." 
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        />
                    </div>
                    <select 
                        value={status}
                        onChange={(e) => { setStatus(e.target.value); setPage(1); }}
                        className="px-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm font-semibold text-gray-700 outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
                    >
                        <option value="All Status">All Status</option>
                        <option value="Registered">Registered</option>
                        <option value="Pending">Pending</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                    <select 
                        value={method}
                        onChange={(e) => { setMethod(e.target.value); setPage(1); }}
                        className="px-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm font-semibold text-gray-700 outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
                    >
                        <option value="All Methods">All Methods</option>
                        <option value="Online">Online Payment</option>
                        <option value="Screenshot">Screenshot</option>
                        <option value="Direct">Direct Pay</option>
                    </select>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50 border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                                    <th className="py-4 px-6">User / Attendee</th>
                                    <th className="py-4 px-6">Event Details</th>
                                    <th className="py-4 px-6">Payment Method</th>
                                    <th className="py-4 px-6">Amount (Est.)</th>
                                    <th className="py-4 px-6">Status</th>
                                    <th className="py-4 px-6 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 text-sm">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={6} className="py-12 text-center text-gray-400">Loading registrations...</td>
                                    </tr>
                                ) : registrations.length > 0 ? (
                                    registrations.map(reg => (
                                        <tr key={reg._id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="py-4 px-6">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-gray-900">{reg.user}</span>
                                                    <span className="text-xs text-gray-500">{reg.email}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-gray-700">{reg.eventId?.title || 'Event Removed'}</span>
                                                    <span className="text-[10px] text-gray-400">{new Date(reg.createdAt).toLocaleDateString()}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border uppercase ${
                                                    reg.paymentMethod === 'online' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                                    reg.paymentMethod === 'screenshot' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                                    reg.paymentMethod === 'direct' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                                                    'bg-gray-50 text-gray-400 border-gray-100'
                                                }`}>
                                                    {reg.paymentMethod || 'N/A'}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className="font-bold text-gray-900">
                                                    ₹{((reg.eventId?.registrationFee || 0) * (reg.personCount || 1)).toLocaleString()}
                                                </span>
                                                <span className="text-[10px] text-gray-400 block">{reg.personCount || 1} Person(s)</span>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border ${
                                                    reg.status === 'Registered' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                                    reg.status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                                    'bg-red-50 text-red-700 border-red-100'
                                                }`}>
                                                    {reg.status}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-right">
                                                <Link href={`/admin/events/${reg.eventId?._id}`} className="text-primary hover:bg-primary/5 p-2 rounded-lg inline-block transition-colors">
                                                    <FiEye size={18} title="View Event" />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="py-12 text-center text-gray-400 italic">No registrations found matching your filters.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {meta.totalPages > 1 && (
                        <div className="p-6 bg-gray-50/50 border-t border-gray-100 flex justify-center gap-2">
                            {Array.from({ length: meta.totalPages }).map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setPage(i + 1)}
                                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                                        page === i + 1 ? 'bg-primary text-white shadow-md' : 'bg-white border text-gray-500 hover:bg-gray-50'
                                    }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
