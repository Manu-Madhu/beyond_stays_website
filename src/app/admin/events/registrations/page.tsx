"use client";
import React, { useState, useEffect } from 'react';
import { AdminLayout } from "@/components/admin/layout/AdminLayout";
import { FiDownload, FiSearch, FiEye, FiX, FiCalendar, FiUser, FiPhone, FiMail, FiUsers } from "react-icons/fi";
import { AdminService } from '@/services/admin.service';
import Link from 'next/link';

export default function EventRegistrationsPage() {
    const [registrations, setRegistrations] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [meta, setMeta] = useState<any>({});
    
    // Filters
    const [page, setPage] = useState(1);
    const [status, setStatus] = useState('All Status');
    const [method, setMethod] = useState('All Methods');
    const [search, setSearch] = useState('');
    const [date, setDate] = useState('');

    // Modal
    const [selectedReg, setSelectedReg] = useState<any>(null);

    const fetchRegistrations = async () => {
        setIsLoading(true);
        try {
            const { data } = await AdminService.getAllRegistrations({
                page,
                limit: 15,
                status,
                search,
                paymentMethod: method === 'All Methods' ? '' : method.toLowerCase(),
                date
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
    }, [page, status, method, search, date]);

    const exportToCSV = () => {
        if (!registrations || registrations.length === 0) return;
        const headers = ["ID", "Attendee Name", "Email", "Phone", "Event Name", "Registration Date", "Payment Method", "Amount", "Status"];
        const rows = registrations.map(reg => [
            reg._id,
            `"${reg.user}"`,
            `"${reg.email}"`,
            `"${reg.phone || 'N/A'}"`,
            `"${reg.eventId?.title || 'Unknown Event'}"`,
            `"${new Date(reg.createdAt).toLocaleDateString()}"`,
            reg.paymentMethod || 'N/A',
            ((reg.eventId?.registrationFee || 0) * (reg.personCount || 1)),
            reg.status
        ]);
        
        const csvContent = "data:text/csv;charset=utf-8," 
            + headers.join(",") + "\n" 
            + rows.map(e => e.join(",")).join("\n");
            
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `registrations_export_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <AdminLayout>
            <div className="space-y-6 animate-in fade-in duration-500">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Event Registrations</h1>
                        <p className="text-gray-500 mt-1">Manage attendees, view payments, and export registration logs.</p>
                    </div>
                    <button 
                        onClick={exportToCSV}
                        className="bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-gray-50 transition-colors shadow-sm"
                    >
                        <FiDownload className="w-4 h-4" />
                        Export to CSV
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
                    <div className="relative">
                        <input 
                            type="date" 
                            value={date}
                            onChange={(e) => { setDate(e.target.value); setPage(1); }}
                            className="px-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm font-semibold text-gray-700 outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
                        />
                        {date && (
                            <button 
                                onClick={() => { setDate(''); setPage(1); }} 
                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-200 hover:bg-gray-300 rounded-full p-1 text-gray-600 transition-colors"
                                title="Clear Date"
                            >
                                <FiX size={12} />
                            </button>
                        )}
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
                    <div className="overflow-x-auto min-h-[650px]">
                        <table className="w-full text-left border-collapse min-w-[800px]">
                            <thead>
                                <tr className="bg-gray-50/50 border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                                    <th className="py-4 px-6">Attendee</th>
                                    <th className="py-4 px-6">Event Info</th>
                                    <th className="py-4 px-6">Registration Date</th>
                                    <th className="py-4 px-6">Payment</th>
                                    <th className="py-4 px-6">Status</th>
                                    <th className="py-4 px-6 text-right">Actions</th>
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
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs uppercase shrink-0">
                                                        {reg.user?.charAt(0) || 'U'}
                                                    </div>
                                                    <div>
                                                        <span className="font-bold text-gray-900 block">{reg.user}</span>
                                                        <span className="text-xs text-gray-500">{reg.email}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className="font-semibold text-gray-700 block truncate max-w-[200px]">{reg.eventId?.title || 'Unknown Event'}</span>
                                                <span className="text-[10px] text-gray-400">{reg.personCount || 1} Person(s)</span>
                                            </td>
                                            <td className="py-4 px-6 text-gray-600 font-medium">
                                                {new Date(reg.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex flex-col gap-1 items-start">
                                                    <span className="font-bold text-gray-900">
                                                        ₹{((reg.eventId?.registrationFee || 0) * (reg.personCount || 1)).toLocaleString()}
                                                    </span>
                                                    <span className={`px-2 py-0.5 text-[9px] font-bold rounded border uppercase ${
                                                        reg.paymentMethod === 'online' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                                        reg.paymentMethod === 'screenshot' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                                        reg.paymentMethod === 'direct' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                                                        'bg-gray-50 text-gray-400 border-gray-100'
                                                    }`}>
                                                        {reg.paymentMethod || 'N/A'}
                                                    </span>
                                                </div>
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
                                            <td className="py-4 px-6 text-right space-x-2">
                                                <button 
                                                    onClick={() => setSelectedReg(reg)}
                                                    className="text-primary hover:bg-primary/5 p-2 rounded-lg inline-block transition-colors"
                                                    title="View Details"
                                                >
                                                    <FiEye size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="py-16 text-center">
                                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 mb-4">
                                                <FiSearch className="text-gray-400" size={24} />
                                            </div>
                                            <p className="text-gray-500 font-medium">No registrations found matching your filters.</p>
                                            <button onClick={() => {setSearch(''); setDate(''); setStatus('All Status'); setMethod('All Methods');}} className="text-primary text-sm font-bold mt-2 hover:underline">Clear Filters</button>
                                        </td>
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

                {/* Detailed View Modal */}
                {selectedReg && (
                    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
                        <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">Registration Details</h2>
                                    <p className="text-xs text-gray-500 mt-1">ID: {selectedReg._id}</p>
                                </div>
                                <button onClick={() => setSelectedReg(null)} className="text-gray-400 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-xl transition-colors">
                                    <FiX size={20} />
                                </button>
                            </div>
                            
                            <div className="p-6 overflow-y-auto space-y-8">
                                {/* Attendee Info Section */}
                                <section>
                                    <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-4">Attendee Information</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3 border border-gray-100">
                                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-gray-400"><FiUser /></div>
                                            <div>
                                                <p className="text-xs text-gray-500">Full Name</p>
                                                <p className="font-bold text-gray-900">{selectedReg.user}</p>
                                            </div>
                                        </div>
                                        <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3 border border-gray-100">
                                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-gray-400"><FiMail /></div>
                                            <div className="truncate">
                                                <p className="text-xs text-gray-500">Email Address</p>
                                                <p className="font-bold text-gray-900 truncate" title={selectedReg.email}>{selectedReg.email}</p>
                                            </div>
                                        </div>
                                        {selectedReg.phone && (
                                            <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3 border border-gray-100">
                                                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-gray-400"><FiPhone /></div>
                                                <div>
                                                    <p className="text-xs text-gray-500">Phone Number</p>
                                                    <p className="font-bold text-gray-900">{selectedReg.phone}</p>
                                                </div>
                                            </div>
                                        )}
                                        <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3 border border-gray-100">
                                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-gray-400"><FiUsers /></div>
                                            <div>
                                                <p className="text-xs text-gray-500">Total Persons</p>
                                                <p className="font-bold text-gray-900">{selectedReg.personCount || 1}</p>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* Event Info Section */}
                                <section>
                                    <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-4">Event Details</h3>
                                    <div className="bg-primary/5 border border-primary/10 rounded-2xl p-5 flex flex-col md:flex-row justify-between gap-4">
                                        <div>
                                            <p className="text-xs text-primary/70 font-semibold uppercase tracking-wider mb-1">Event Name</p>
                                            <Link href={`/admin/events/${selectedReg.eventId?._id}`} className="font-bold text-lg text-primary hover:underline">
                                                {selectedReg.eventId?.title || 'Unknown Event'}
                                            </Link>
                                            <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                                                <FiCalendar className="text-gray-400" />
                                                Registered on {new Date(selectedReg.createdAt).toLocaleString()}
                                            </div>
                                        </div>
                                        <div className="bg-white rounded-xl p-3 shadow-sm self-start md:self-center shrink-0 min-w-[120px] text-center">
                                            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Status</p>
                                            <p className={`font-black mt-1 ${
                                                selectedReg.status === 'Registered' ? 'text-emerald-600' :
                                                selectedReg.status === 'Pending' ? 'text-amber-600' : 'text-red-600'
                                            }`}>{selectedReg.status}</p>
                                        </div>
                                    </div>
                                </section>

                                {/* Payment Info Section */}
                                <section>
                                    <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-4">Payment Details</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                        <div className="border border-gray-100 rounded-xl p-4">
                                            <p className="text-xs text-gray-500 mb-1">Method</p>
                                            <p className="font-bold text-gray-900 uppercase">{selectedReg.paymentMethod || 'N/A'}</p>
                                        </div>
                                        <div className="border border-gray-100 rounded-xl p-4 md:col-span-3">
                                            <p className="text-xs text-gray-500 mb-1">Calculated Amount</p>
                                            <p className="font-bold text-gray-900 text-xl">₹{((selectedReg.eventId?.registrationFee || 0) * (selectedReg.personCount || 1)).toLocaleString()}</p>
                                        </div>
                                    </div>
                                    
                                    {(selectedReg.idProof || selectedReg.screenshot) && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                            {selectedReg.idProof && (
                                                <div className="border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow group">
                                                    <p className="text-sm font-bold text-gray-900 flex justify-between items-center mb-3">
                                                        ID Proof
                                                        <a href={selectedReg.idProof} target="_blank" rel="noreferrer" className="text-xs text-primary bg-primary/10 px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">Open Original</a>
                                                    </p>
                                                    <div className="aspect-[4/3] bg-gray-50 rounded-lg overflow-hidden border border-gray-100 relative">
                                                        <img src={selectedReg.idProof} alt="ID Proof" className="w-full h-full object-contain" />
                                                    </div>
                                                </div>
                                            )}
                                            {selectedReg.screenshot && (
                                                <div className="border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow group">
                                                    <p className="text-sm font-bold text-gray-900 flex justify-between items-center mb-3">
                                                        Payment Screenshot
                                                        <a href={selectedReg.screenshot} target="_blank" rel="noreferrer" className="text-xs text-primary bg-primary/10 px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">Open Original</a>
                                                    </p>
                                                    <div className="aspect-[4/3] bg-gray-50 rounded-lg overflow-hidden border border-gray-100 relative">
                                                        <img src={selectedReg.screenshot} alt="Screenshot" className="w-full h-full object-contain" />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </section>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
