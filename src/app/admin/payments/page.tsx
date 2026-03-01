import React from 'react';
import { AdminLayout } from "@/components/admin/layout/AdminLayout";
import { FiDownload } from "react-icons/fi";

export default function PaymentsPage() {
    // Dummy Data
    const payments = [
        { id: '#INV-4821', user: 'Leslie Alexander', amount: '$499.00', status: 'Completed', date: 'Oct 24, 2026' },
        { id: '#INV-4820', user: 'Savannah Nguyen', amount: '$150.00', status: 'Completed', date: 'Oct 23, 2026' },
        { id: '#INV-4819', user: 'Courtney Henry', amount: '$320.00', status: 'Refunded', date: 'Oct 21, 2026' },
        { id: '#INV-4818', user: 'Devon Lane', amount: '$85.00', status: 'Completed', date: 'Oct 21, 2026' },
    ];

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Payment Listing</h1>
                        <p className="text-gray-500 mt-1">Track platform revenue, transactions, and refunds.</p>
                    </div>
                    <button className="bg-white border text-gray-700 px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 hover:bg-gray-50 transition-colors">
                        <FiDownload className="w-4 h-4" />
                        Export
                    </button>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 text-sm font-semibold text-gray-500">
                                <th className="py-4 px-6 font-medium">Invoice ID</th>
                                <th className="py-4 px-6 font-medium">Customer</th>
                                <th className="py-4 px-6 font-medium">Date</th>
                                <th className="py-4 px-6 font-medium">Amount</th>
                                <th className="py-4 px-6 font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                            {payments.map(pay => (
                                <tr key={pay.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="py-4 px-6 font-medium text-gray-900">{pay.id}</td>
                                    <td className="py-4 px-6 text-gray-600">{pay.user}</td>
                                    <td className="py-4 px-6 text-gray-500">{pay.date}</td>
                                    <td className="py-4 px-6 font-semibold">{pay.amount}</td>
                                    <td className="py-4 px-6">
                                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${pay.status === 'Completed' ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-600'
                                            }`}>
                                            {pay.status}
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
