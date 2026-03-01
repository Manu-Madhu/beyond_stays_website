"use client";
import React, { useState } from 'react';
import { AdminLayout } from "@/components/admin/layout/AdminLayout";
import { FiUsers, FiSettings, FiImage, FiCalendar, FiChevronLeft, FiMapPin, FiClock } from "react-icons/fi";
import Link from 'next/link';

import { useParams, useRouter } from 'next/navigation';
import { useEventDetails } from '@/hooks/useEvents';

export default function EventDetailedPage() {
    const params = useParams();
    const id = params?.id as string;
    const { event, isLoading } = useEventDetails(id);
    const router = useRouter();

    const [activeTab, setActiveTab] = useState('basic');

    // Dummy registrations data
    const registrations = [
        { id: '1', user: 'Jenny Wilson', email: 'jenny@example.com', status: 'Registered', date: 'Oct 24, 2026' },
        { id: '2', user: 'Guy Hawkins', email: 'guy@example.com', status: 'Pending', date: 'Oct 23, 2026' },
        { id: '3', user: 'Robert Fox', email: 'robert@example.com', status: 'Cancelled', date: 'Oct 21, 2026' },
    ];

    if (isLoading) {
        return (
            <AdminLayout>
                <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            </AdminLayout>
        );
    }

    if (!event) {
        return (
            <AdminLayout>
                <div className="flex flex-col justify-center items-center py-20 text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Event Not Found</h2>
                    <p className="text-gray-500 mb-4">The event you are looking for does not exist or has been deleted.</p>
                    <Link href="/admin/events" className="text-primary font-semibold hover:underline">Return to Events</Link>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="space-y-6 w-full mx-auto">
                {/* Header Profile */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden relative">
                    <div className="h-48 bg-primary/20 relative w-full overflow-hidden">
                        <img src="/assets/travel_admin_login.png" alt="Cover" className="w-full h-full object-cover opacity-80" />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>
                    </div>

                    <div className="absolute top-6 left-6 flex">
                        <Link href="/admin/events" className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-xl text-white text-sm font-semibold transition-colors">
                            <FiChevronLeft className="w-4 h-4" /> Back to Events
                        </Link>
                    </div>

                    <div className="p-8 pt-6 relative flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-end -mt-16">
                        <div className="flex-1">
                            <h1 className="text-3xl font-extrabold text-white mb-4 tracking-tight drop-shadow-md">{event.title}</h1>
                            <div className="flex flex-wrap gap-4 text-sm font-medium text-gray-600 mt-2">
                                <span className="flex items-center gap-1.5"><FiMapPin className="text-primary" /> {event.location}</span>
                                <span className="flex items-center gap-1.5"><FiCalendar className="text-primary" /> {new Date(event.startDate).toLocaleDateString()}</span>
                                <span className="px-3 py-1 bg-red-50 text-red-700 rounded-lg text-xs font-bold border border-red-200">{event.ageRestriction}</span>
                                <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${event.status === 'Active (Published)' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-gray-50 text-gray-600 border-gray-200'}`}>{event.status}</span>
                            </div>
                        </div>
                        <div className="flex gap-3 shrink-0">
                            <Link href={`/admin/events/edit/${id}`} className="px-5 py-2.5 rounded-xl flex items-center border border-gray-200 text-gray-700 bg-white font-semibold shadow-sm hover:bg-gray-50 transition-colors">
                                Edit Event
                            </Link>
                            <Link href={`/events/${id}`} target="_blank" className="bg-primary flex items-center hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-colors shadow-sm">
                                View Public Page
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Event Tabs Navigation */}
                <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar border-b border-gray-200">
                    <button onClick={() => setActiveTab('basic')} className={`px-5 py-3 rounded-t-xl text-sm font-bold flex items-center gap-2 transition-colors border-b-2 ${activeTab === 'basic' ? 'text-primary border-primary' : 'text-gray-500 border-transparent hover:text-gray-700'}`}>
                        <FiImage className="w-4 h-4" /> Basic Details & Media
                    </button>
                    <button onClick={() => setActiveTab('form')} className={`px-5 py-3 rounded-t-xl text-sm font-bold flex items-center gap-2 transition-colors border-b-2 ${activeTab === 'form' ? 'text-primary border-primary' : 'text-gray-500 border-transparent hover:text-gray-700'}`}>
                        <FiSettings className="w-4 h-4" /> Registration Form Setup
                    </button>
                    <button onClick={() => setActiveTab('users')} className={`px-5 py-3 rounded-t-xl text-sm font-bold flex items-center gap-2 transition-colors border-b-2 ${activeTab === 'users' ? 'text-primary border-primary' : 'text-gray-500 border-transparent hover:text-gray-700'}`}>
                        <FiUsers className="w-4 h-4" /> Registered Users
                    </button>
                </div>

                {/* Tabs Content */}
                <div className="bg-white p-6 rounded-b-2xl rounded-tr-2xl shadow-sm border border-gray-100 min-h-[400px]">

                    {/* Basic Details Tab */}
                    {activeTab === 'basic' && (
                        <div className="space-y-8 animate-in fade-in duration-300">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 border-b pb-3 mb-4">Event Description</h3>
                                <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-line">{event.description}</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 border-b pb-3 mb-4">Guidelines & Restrictions</h3>
                                    <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-line">{event.guidelines || "No specific guidelines provided."}</p>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 border-b pb-3 mb-4">Things to Carry</h3>
                                    <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-line">{event.thingsToCarry || "Standard travel essentials."}</p>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-bold text-gray-900 border-b pb-3 mb-4">Event Media Gallery</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100 hidden md:block border shadow-sm">
                                        <img src="/assets/travel_admin_login.png" alt="Gallery" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors cursor-pointer text-gray-500">
                                        <FiImage className="w-6 h-6 mb-2 text-primary/40" />
                                        <span className="text-xs font-semibold">Upload Images</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Form Setup Tab */}
                    {activeTab === 'form' && (
                        <div className="space-y-6 animate-in fade-in duration-300">
                            <h3 className="text-lg font-bold text-gray-900 border-b pb-3 border-gray-100">Dynamic Registration Form Setup</h3>
                            <p className="text-sm text-gray-500">Configure which fields users must fill out during registration.</p>

                            <div className="space-y-3 max-w-lg mt-4">
                                <label className="flex items-center gap-3 p-4 border rounded-xl hover:bg-gray-50 cursor-pointer">
                                    <input type="checkbox" defaultChecked className="w-5 h-5 text-primary" />
                                    <span className="font-medium text-gray-900">Require Phone Number</span>
                                </label>
                                <label className="flex items-center gap-3 p-4 border rounded-xl hover:bg-gray-50 cursor-pointer">
                                    <input type="checkbox" defaultChecked className="w-5 h-5 text-primary" />
                                    <span className="font-medium text-gray-900">Require Passport ID (International Docs)</span>
                                </label>
                                <label className="flex items-center gap-3 p-4 border rounded-xl hover:bg-gray-50 cursor-pointer">
                                    <input type="checkbox" className="w-5 h-5 text-primary" />
                                    <span className="font-medium text-gray-900">Allergies / Dietary Requirements</span>
                                </label>
                            </div>
                        </div>
                    )}

                    {/* Registered Users Tab */}
                    {activeTab === 'users' && (
                        <div className="space-y-6 animate-in fade-in duration-300">
                            <div className="flex justify-between items-center border-b pb-3">
                                <h3 className="text-lg font-bold text-gray-900">Registered Users (124)</h3>
                                <button className="px-4 py-2 bg-gray-50 border rounded-lg text-xs font-bold text-gray-600 shadow-sm hover:bg-gray-100 transition-colors">Export CSV</button>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse min-w-[600px]">
                                    <thead>
                                        <tr className="bg-gray-50 text-xs font-bold text-gray-500 uppercase">
                                            <th className="py-3 px-4 rounded-tl-lg">Attendee Details</th>
                                            <th className="py-3 px-4 text-center">Date Joined</th>
                                            <th className="py-3 px-4 text-center">Status</th>
                                            <th className="py-3 px-4 rounded-tr-lg text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 text-sm">
                                        {registrations.map(reg => (
                                            <tr key={reg.id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="py-4 px-4">
                                                    <p className="font-bold text-gray-900">{reg.user}</p>
                                                    <p className="text-gray-500 text-xs">{reg.email}</p>
                                                </td>
                                                <td className="py-4 px-4 text-gray-500 text-center font-medium">{reg.date}</td>
                                                <td className="py-4 px-4 text-center">
                                                    <span className={`px-2.5 py-1 text-xs font-bold rounded-lg border ${reg.status === 'Registered' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                                        reg.status === 'Pending' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                                                            'bg-red-50 text-red-700 border-red-200'
                                                        }`}>
                                                        {reg.status}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-4 text-right">
                                                    <button className="text-primary hover:underline font-semibold text-sm">View Reg</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
