import React from 'react';
import { AdminLayout } from "@/components/admin/layout/AdminLayout";
import { FiUsers, FiFilter } from "react-icons/fi";

export default function EventRegistrationsPage() {
    // Dummy Data
    const registrations = [
        { id: '1', user: 'Jenny Wilson', event: 'Winter Mountain Trek', status: 'Registered', date: 'Oct 24, 2026' },
        { id: '2', user: 'Guy Hawkins', event: 'Island Surf Retreat', status: 'Pending', date: 'Oct 23, 2026' },
        { id: '3', user: 'Robert Fox', event: 'Desert Safari', status: 'Cancelled', date: 'Oct 21, 2026' },
        { id: '4', user: 'Eleanor Pena', event: 'Winter Mountain Trek', status: 'Registered', date: 'Oct 21, 2026' },
    ];

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Event Registrations</h1>
                        <p className="text-gray-500 mt-1">Manage attendees and user registrations.</p>
                    </div>
                    <button className="bg-white border text-gray-700 px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 hover:bg-gray-50 transition-colors">
                        <FiFilter className="w-4 h-4" />
                        Filter Logs
                    </button>
                </div>

                {/* Dummy Content Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 text-sm font-semibold text-gray-500">
                                <th className="py-4 px-6 font-medium">Attendee</th>
                                <th className="py-4 px-6 font-medium">Event Name</th>
                                <th className="py-4 px-6 font-medium">Registration Date</th>
                                <th className="py-4 px-6 font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                            {registrations.map(reg => (
                                <tr key={reg.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="py-4 px-6 font-medium text-gray-900">{reg.user}</td>
                                    <td className="py-4 px-6 text-gray-600">{reg.event}</td>
                                    <td className="py-4 px-6 text-gray-500">{reg.date}</td>
                                    <td className="py-4 px-6">
                                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${reg.status === 'Registered' ? 'bg-green-100 text-green-700' :
                                                reg.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-red-100 text-red-700'
                                            }`}>
                                            {reg.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
