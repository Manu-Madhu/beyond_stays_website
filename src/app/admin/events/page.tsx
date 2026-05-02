"use client";
import React, { useState, useEffect } from 'react';
import { AdminLayout } from "@/components/admin/layout/AdminLayout";
import { FiPlus, FiMoreVertical, FiSearch, FiChevronLeft, FiChevronRight, FiCalendar } from "react-icons/fi";
import Link from 'next/link';
import Image from 'next/image';
import { useEventList } from '@/hooks/useEvents';
import { EventSkeleton } from '@/components/admin/events/EventSkeleton';

export default function EventsPage() {
    const [statusFilter, setStatusFilter] = useState('All Status');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
    const limit = 10;

    const { events, meta, isLoading, fetchEvents } = useEventList();

    useEffect(() => {
        fetchEvents({ page, limit, status: statusFilter, search });
    }, [page, statusFilter, search, fetchEvents]);

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Events Management</h1>
                        <p className="text-gray-500 mt-1">View, manage, and create events for BeyondStays.</p>
                    </div>
                    <div className="flex flex-col md:flex-row flex-wrap items-stretch md:items-center gap-3 w-full lg:w-auto">
                        {/* Search Box */}
                        <div className="relative flex-grow md:flex-grow-0 md:min-w-[200px]">
                            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input 
                                type="text" 
                                placeholder="Search event..." 
                                value={search}
                                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-sm"
                            />
                        </div>
                        <select
                            value={statusFilter}
                            onChange={(e) => {
                                setStatusFilter(e.target.value);
                                setPage(1); // Reset page on filter change
                            }}
                            className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm cursor-pointer hover:border-primary/50 transition-colors"
                        >
                            <option value="All Status">All Status</option>
                            <option value="Active">Active</option>
                            <option value="Draft">Draft</option>
                            <option value="Passed">Passed</option>
                        </select>
                        <Link href="/admin/events/create" className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors shadow-sm whitespace-nowrap">
                            <FiPlus className="w-4 h-4" />
                            New Event
                        </Link>
                    </div>
                </div>

                {/* Events Table Listing */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                    <div className="overflow-x-auto min-h-[650px]">
                        <table className="w-full text-left border-collapse min-w-[800px]">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100 text-sm font-semibold text-gray-500">
                                    <th className="py-4 px-6 font-medium">Event Details</th>
                                    <th className="py-4 px-6 font-medium">Location</th>
                                    <th className="py-4 px-6 font-medium">Date</th>
                                    <th className="py-4 px-6 font-medium text-center">Registrations</th>
                                    <th className="py-4 px-6 font-medium">Status</th>
                                    <th className="py-4 px-6 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-sm">
                                {isLoading ? (
                                    <>
                                        <EventSkeleton />
                                        <EventSkeleton />
                                        <EventSkeleton />
                                        <EventSkeleton />
                                        <EventSkeleton />
                                    </>
                                ) : events.length > 0 ? (
                                    events.map(event => (
                                        <tr key={event._id} className="hover:bg-gray-50/50 transition-colors group">
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 relative rounded-lg overflow-hidden bg-gray-100 shrink-0">
                                                        <Image src={'/assets/travel_admin_login.png'} alt={event.title || 'Event Image'} fill className="object-cover" />
                                                    </div>
                                                    <Link href={`/admin/events/${event._id}`} className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
                                                        {event.title}
                                                    </Link>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 text-gray-600">{event.location}</td>
                                            <td className="py-4 px-6 text-gray-600 font-medium">{new Date(event.startDate).toLocaleDateString()}</td>
                                            <td className="py-4 px-6 text-center font-semibold text-gray-900">{event.registrations || 0} / {event.capacity || '∞'}</td>
                                            <td className="py-4 px-6">
                                                <span className={`px-3 py-1 text-xs font-bold rounded-full border ${event.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                                    event.status === 'Draft' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                                    'bg-gray-50 text-gray-500 border-gray-200'
                                                }`}>
                                                    {event.status}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-right relative">
                                                <button 
                                                    onClick={() => setOpenDropdownId(openDropdownId === event._id ? null : event._id)}
                                                    className="text-gray-400 hover:text-gray-900 transition-colors p-2 rounded-lg hover:bg-gray-100"
                                                >
                                                    <FiMoreVertical size={18} />
                                                </button>

                                                {openDropdownId === event._id && (
                                                    <>
                                                        <div 
                                                            className="fixed inset-0 z-10" 
                                                            onClick={() => setOpenDropdownId(null)}
                                                        ></div>
                                                        <div className="absolute right-6 top-12 w-40 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                                                            <Link href={`/admin/events/${event._id}`} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors w-full text-left font-medium">
                                                                View Details
                                                            </Link>
                                                            <Link href={`/admin/events/edit/${event._id}`} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors w-full text-left font-medium border-t border-gray-50">
                                                                Edit
                                                            </Link>
                                                        </div>
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="py-20 text-center">
                                            <div className="flex flex-col items-center justify-center space-y-4">
                                                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100">
                                                    <FiCalendar className="w-8 h-8 text-gray-300" />
                                                </div>
                                                <div className="space-y-1">
                                                    <h3 className="text-lg font-bold text-gray-900">No Events Found</h3>
                                                    <p className="text-gray-500 text-sm max-w-xs mx-auto">
                                                        It looks like you haven't created any events yet. Get started by creating your first expedition.
                                                    </p>
                                                </div>
                                                <Link href="/admin/events/create" className="text-primary font-bold text-sm hover:underline">
                                                    Create your first event →
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500 bg-gray-50/30">
                        {isLoading ? (
                            <div className="h-4 bg-gray-200 rounded animate-pulse w-48"></div>
                        ) : (
                            <span>Showing {events.length === 0 ? 0 : (meta.currentPage - 1) * meta.itemsPerPage + 1} to {Math.min(meta.currentPage * meta.itemsPerPage, meta.totalItems)} of {meta.totalItems} results</span>
                        )}
                        <div className="flex gap-1">
                            <button
                                onClick={() => setPage(prev => Math.max(1, prev - 1))}
                                disabled={meta.currentPage === 1 || isLoading}
                                className="p-2 rounded-lg border bg-white hover:bg-gray-50 text-gray-400 disabled:opacity-50 transition-colors"
                            >
                                <FiChevronLeft />
                            </button>

                            {!isLoading && Array.from({ length: meta.totalPages }, (_, i) => i + 1).map(pageNum => (
                                <button
                                    key={pageNum}
                                    onClick={() => setPage(pageNum)}
                                    className={`px-3 py-1 rounded-lg border font-medium transition-colors ${pageNum === meta.currentPage ? 'bg-primary text-white border-primary' : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-200'}`}
                                >
                                    {pageNum}
                                </button>
                            ))}

                            <button
                                onClick={() => setPage(prev => Math.min(meta.totalPages, prev + 1))}
                                disabled={meta.currentPage === meta.totalPages || isLoading || meta.totalPages === 0}
                                className="p-2 rounded-lg border bg-white hover:bg-gray-50 text-gray-600 disabled:opacity-50 transition-colors"
                            >
                                <FiChevronRight />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
