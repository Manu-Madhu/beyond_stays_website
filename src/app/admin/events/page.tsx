import React from 'react';
import { AdminLayout } from "@/components/admin/layout/AdminLayout";
import { FiPlus, FiMoreVertical, FiFilter, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import Link from 'next/link';
import Image from 'next/image';

export default function EventsPage() {
    // Dummy Data
    const events = [
        { id: 'ev_1', name: 'Winter Mountain Trek', location: 'Himalayas, India', date: 'Dec 15, 2026', status: 'Active', registrations: 124, image: '/assets/travel_admin_login.png' },
        { id: 'ev_2', name: 'Island Surf Retreat', location: 'Bali, Indonesia', date: 'Jan 10, 2027', status: 'Active', registrations: 89, image: '/assets/travel_admin_login.png' },
        { id: 'ev_3', name: 'Desert Safari', location: 'Dubai, UAE', date: 'Oct 21, 2026', status: 'Passed', registrations: 210, image: '/assets/travel_admin_login.png' },
        { id: 'ev_4', name: 'Forest Camping', location: 'Yellowstone, USA', date: 'Sep 05, 2026', status: 'Passed', registrations: 45, image: '/assets/travel_admin_login.png' },
        { id: 'ev_5', name: 'Cultural City Tour', location: 'Kyoto, Japan', date: 'Mar 12, 2027', status: 'Active', registrations: 34, image: '/assets/travel_admin_login.png' },
    ];

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Events Management</h1>
                        <p className="text-gray-500 mt-1">View, manage, and create events for BeyondStays.</p>
                    </div>
                    <Link href="/admin/events/create" className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors shadow-sm">
                        <FiPlus className="w-4 h-4" />
                        New Event
                    </Link>
                </div>

                {/* Filters */}
                <div className="flex gap-3">
                    <button className="bg-white border text-gray-700 px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 hover:bg-gray-50 transition-colors">
                        <FiFilter className="w-4 h-4" />
                        Filters
                    </button>
                    <select className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm cursor-pointer hover:border-primary/50 transition-colors">
                        <option>All Status</option>
                        <option>Active</option>
                        <option>Passed</option>
                    </select>
                </div>

                {/* Events Table Listing */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                    <div className="overflow-x-auto">
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
                                {events.map(event => (
                                    <tr key={event.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 relative rounded-lg overflow-hidden bg-gray-100 shrink-0">
                                                    <Image src={event.image || '/assets/travel_admin_login.png'} alt={event.name} fill className="object-cover" />
                                                </div>
                                                <Link href={`/admin/events/${event.id}`} className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
                                                    {event.name}
                                                </Link>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-gray-600">{event.location}</td>
                                        <td className="py-4 px-6 text-gray-600 font-medium">{event.date}</td>
                                        <td className="py-4 px-6 text-center font-semibold text-gray-900">{event.registrations}</td>
                                        <td className="py-4 px-6">
                                            <span className={`px-3 py-1 text-xs font-bold rounded-full border ${event.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                                    'bg-gray-50 text-gray-600 border-gray-200'
                                                }`}>
                                                {event.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <Link href={`/admin/events/${event.id}`} className="text-primary hover:text-primary/70 font-semibold text-sm mr-4 transition-colors">
                                                View Details
                                            </Link>
                                            <button className="text-gray-400 hover:text-gray-900 transition-colors p-1 rounded-md hover:bg-gray-100">
                                                <FiMoreVertical size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Dummy */}
                    <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500 bg-gray-50/30">
                        <span>Showing 1 to 5 of 12 results</span>
                        <div className="flex gap-1">
                            <button className="p-2 rounded-lg border bg-white hover:bg-gray-50 text-gray-400 disabled:opacity-50"><FiChevronLeft /></button>
                            <button className="px-3 py-1 rounded-lg border bg-primary text-white font-medium">1</button>
                            <button className="px-3 py-1 rounded-lg border bg-white hover:bg-gray-50 font-medium">2</button>
                            <button className="px-3 py-1 rounded-lg border bg-white hover:bg-gray-50 font-medium">3</button>
                            <button className="p-2 rounded-lg border bg-white hover:bg-gray-50 text-gray-600"><FiChevronRight /></button>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
