"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { AdminLayout } from "@/components/admin/layout/AdminLayout";
import {
    FiDownload, FiSearch, FiEye, FiX, FiCalendar, FiUser, FiPhone, FiMail,
    FiUsers, FiMapPin, FiCheck, FiAlertTriangle, FiClock, FiCreditCard,
    FiFileText, FiTruck, FiHeart, FiMessageSquare, FiExternalLink, FiLoader
} from "react-icons/fi";
import { AdminService } from '@/services/admin.service';
import Link from 'next/link';
import toast from 'react-hot-toast';

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string; border: string }> = {
    Registered: { label: 'Confirmed', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
    Pending:    { label: 'Pending',   bg: 'bg-amber-50',   text: 'text-amber-700',   border: 'border-amber-200' },
    Cancelled:  { label: 'Cancelled', bg: 'bg-red-50',     text: 'text-red-700',     border: 'border-red-100' },
};

function StatusBadge({ status }: { status: string }) {
    const cfg = STATUS_CONFIG[status] || STATUS_CONFIG['Pending'];
    return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold border uppercase tracking-wider ${cfg.bg} ${cfg.text} ${cfg.border}`}>
            {status === 'Registered' && <FiCheck size={10} />}
            {status === 'Pending'    && <FiClock size={10} />}
            {status === 'Cancelled'  && <FiX size={10} />}
            {cfg.label}
        </span>
    );
}

function InfoRow({ label, value, mono = false }: { label: string; value?: string | number | null; mono?: boolean }) {
    if (!value && value !== 0) return null;
    return (
        <div className="flex justify-between items-start py-2.5 border-b border-gray-50 last:border-0 gap-4">
            <span className="text-xs text-gray-400 font-semibold uppercase tracking-wide shrink-0">{label}</span>
            <span className={`text-sm font-semibold text-gray-900 text-right ${mono ? 'font-mono text-xs' : ''}`}>{value}</span>
        </div>
    );
}

export default function EventRegistrationsPage() {
    const [registrations, setRegistrations] = useState<any[]>([]);
    const [isLoading, setIsLoading]         = useState(true);
    const [meta, setMeta]                   = useState<any>({});
    const [page, setPage]                   = useState(1);
    const [status, setStatus]               = useState('All Status');
    const [method, setMethod]               = useState('All Methods');
    const [search, setSearch]               = useState('');
    const [date, setDate]                   = useState('');
    const [selectedReg, setSelectedReg]     = useState<any>(null);
    const [isActioning, setIsActioning]     = useState(false);
    const [rejectReason, setRejectReason]   = useState('');
    const [showRejectModal, setShowRejectModal] = useState(false);

    const fetchRegistrations = useCallback(async () => {
        setIsLoading(true);
        try {
            const { data } = await AdminService.getAllRegistrations({ page, limit: 15, status, search, paymentMethod: method === 'All Methods' ? '' : method.toLowerCase(), date });
            if (data?.success) { setRegistrations(data.data); setMeta(data.meta); }
        } catch { toast.error('Failed to load registrations'); }
        finally { setIsLoading(false); }
    }, [page, status, method, search, date]);

    useEffect(() => { fetchRegistrations(); }, [fetchRegistrations]);

    const handleStatusUpdate = async (newStatus: 'Registered' | 'Cancelled', reason?: string) => {
        if (!selectedReg) return;
        setIsActioning(true);
        try {
            const { data } = await AdminService.updateRegistrationStatus(selectedReg._id, newStatus, reason);
            if (data?.success) {
                toast.success(newStatus === 'Registered' ? '✅ Booking confirmed! Email sent to attendee.' : '❌ Registration cancelled. Email sent to attendee.');
                setSelectedReg({ ...selectedReg, status: newStatus });
                setShowRejectModal(false);
                setRejectReason('');
                fetchRegistrations();
            } else {
                toast.error(data?.message || 'Action failed.');
            }
        } catch { toast.error('Network error. Please try again.'); }
        finally { setIsActioning(false); }
    };

    const exportToCSV = () => {
        if (!registrations.length) return;
        const headers = ["ID","Name","Email","Phone","Event","Date","Payment","Amount","Status"];
        const rows = registrations.map(r => [
            r._id, `"${r.user}"`, `"${r.email}"`, `"${r.phone||'N/A'}"`,
            `"${r.eventId?.title||'Unknown'}"`, `"${new Date(r.createdAt).toLocaleDateString()}"`,
            r.paymentMethod||'N/A', ((r.eventId?.registrationFee||0)*(r.personCount||1)), r.status
        ]);
        const csv = "data:text/csv;charset=utf-8," + [headers, ...rows].map(r => r.join(",")).join("\n");
        const a = document.createElement('a'); a.href = encodeURI(csv);
        a.download = `registrations_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Event Registrations</h1>
                        <p className="text-gray-500 mt-1 text-sm">Manage attendees, confirm bookings &amp; send notifications.</p>
                    </div>
                    <button onClick={exportToCSV} className="bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-gray-50 transition-colors shadow-sm">
                        <FiDownload className="w-4 h-4" /> Export CSV
                    </button>
                </div>

                {/* Filters */}
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-wrap gap-3 items-center">
                    <div className="relative flex-1 min-w-[200px]">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input type="text" placeholder="Search name or email..." value={search}
                            onChange={e => { setSearch(e.target.value); setPage(1); }}
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none" />
                    </div>
                    <div className="relative">
                        <input type="date" value={date} onChange={e => { setDate(e.target.value); setPage(1); }}
                            className="px-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm font-semibold text-gray-700 outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer" />
                        {date && <button onClick={() => { setDate(''); setPage(1); }} className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-200 hover:bg-gray-300 rounded-full p-1"><FiX size={10} /></button>}
                    </div>
                    <select value={status} onChange={e => { setStatus(e.target.value); setPage(1); }} className="px-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm font-semibold text-gray-700 outline-none cursor-pointer">
                        <option>All Status</option>
                        <option value="Registered">Confirmed</option>
                        <option value="Pending">Pending</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                    <select value={method} onChange={e => { setMethod(e.target.value); setPage(1); }} className="px-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm font-semibold text-gray-700 outline-none cursor-pointer">
                        <option>All Methods</option>
                        <option value="Online">Online Payment</option>
                        <option value="Screenshot">Screenshot</option>
                        <option value="Direct">Direct Pay</option>
                    </select>
                </div>

                {/* Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto min-h-[500px]">
                        <table className="w-full text-left border-collapse min-w-[800px]">
                            <thead>
                                <tr className="bg-gray-50/70 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                    <th className="py-4 px-5">Attendee</th>
                                    <th className="py-4 px-5">Event</th>
                                    <th className="py-4 px-5">Registered On</th>
                                    <th className="py-4 px-5">Payment</th>
                                    <th className="py-4 px-5">Status</th>
                                    <th className="py-4 px-5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 text-sm">
                                {isLoading ? (
                                    <tr><td colSpan={6} className="py-16 text-center text-gray-400">
                                        <FiLoader className="animate-spin inline mr-2" />Loading registrations...
                                    </td></tr>
                                ) : registrations.length > 0 ? registrations.map(reg => (
                                    <tr key={reg._id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="py-4 px-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs uppercase shrink-0">
                                                    {reg.user?.charAt(0) || 'U'}
                                                </div>
                                                <div>
                                                    <span className="font-bold text-gray-900 block">{reg.user}</span>
                                                    <span className="text-xs text-gray-400">{reg.email}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-5">
                                            <span className="font-semibold text-gray-700 block truncate max-w-[180px]">{reg.eventId?.title || 'Unknown Event'}</span>
                                            <span className="text-[10px] text-gray-400">{reg.personCount || 1} person(s)</span>
                                        </td>
                                        <td className="py-4 px-5 text-gray-500 font-medium text-xs">
                                            {new Date(reg.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}
                                            <span className="block text-gray-300">{new Date(reg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </td>
                                        <td className="py-4 px-5">
                                            <span className="font-bold text-gray-900 block">₹{((reg.eventId?.registrationFee||0)*(reg.personCount||1)).toLocaleString()}</span>
                                            <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded border ${
                                                reg.paymentMethod==='online' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                                reg.paymentMethod==='screenshot' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                                'bg-purple-50 text-purple-600 border-purple-100'}`}>
                                                {reg.paymentMethod || 'N/A'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-5"><StatusBadge status={reg.status} /></td>
                                        <td className="py-4 px-5 text-right">
                                            <button onClick={() => setSelectedReg(reg)} className="text-primary hover:bg-primary/5 p-2 rounded-lg inline-block transition-colors" title="View Details">
                                                <FiEye size={17} />
                                            </button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan={6} className="py-20 text-center">
                                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gray-50 mb-3"><FiSearch className="text-gray-300" size={22} /></div>
                                        <p className="text-gray-400 font-medium text-sm">No registrations found.</p>
                                        <button onClick={() => { setSearch(''); setDate(''); setStatus('All Status'); setMethod('All Methods'); }} className="text-primary text-xs font-bold mt-2 hover:underline">Clear Filters</button>
                                    </td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {meta.totalPages > 1 && (
                        <div className="p-5 bg-gray-50/50 border-t border-gray-100 flex justify-center gap-2">
                            {Array.from({ length: meta.totalPages }).map((_, i) => (
                                <button key={i} onClick={() => setPage(i+1)} className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${page===i+1 ? 'bg-primary text-white shadow-md' : 'bg-white border text-gray-500 hover:bg-gray-50'}`}>{i+1}</button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* ─── Detail Modal ─── */}
            {selectedReg && (
                <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={e => { if (e.target === e.currentTarget) setSelectedReg(null); }}>
                    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
                        
                        {/* Modal Header */}
                        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 shrink-0">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">Registration Details</h2>
                                <p className="text-[10px] text-gray-400 mt-0.5 font-mono">{selectedReg._id}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <StatusBadge status={selectedReg.status} />
                                <button onClick={() => setSelectedReg(null)} className="text-gray-400 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-xl transition-colors"><FiX size={18} /></button>
                            </div>
                        </div>

                        <div className="overflow-y-auto flex-1 p-6 space-y-6">
                            
                            {/* Action Buttons */}
                            {selectedReg.status === 'Pending' && (
                                <div className="flex gap-3 p-4 bg-amber-50 border border-amber-100 rounded-xl">
                                    <div className="flex-1">
                                        <p className="text-xs font-bold text-amber-700 mb-1">⏳ Awaiting Admin Action</p>
                                        <p className="text-[11px] text-amber-600">Confirm to send a booking confirmation email, or reject to notify the attendee.</p>
                                    </div>
                                    <div className="flex flex-col gap-2 shrink-0">
                                        <button onClick={() => handleStatusUpdate('Registered')} disabled={isActioning}
                                            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors disabled:opacity-50">
                                            {isActioning ? <FiLoader className="animate-spin" size={12}/> : <FiCheck size={12}/>} Confirm
                                        </button>
                                        <button onClick={() => setShowRejectModal(true)} disabled={isActioning}
                                            className="flex items-center gap-1.5 px-4 py-2 bg-white border border-red-200 text-red-600 text-xs font-bold rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50">
                                            <FiX size={12}/> Reject
                                        </button>
                                    </div>
                                </div>
                            )}
                            {selectedReg.status === 'Registered' && (
                                <div className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
                                    <div>
                                        <p className="text-xs font-bold text-emerald-700">✅ Booking Confirmed</p>
                                        <p className="text-[11px] text-emerald-600 mt-0.5">Confirmation email was sent to the attendee.</p>
                                    </div>
                                    <button onClick={() => setShowRejectModal(true)} disabled={isActioning}
                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-red-200 text-red-500 text-[10px] font-bold rounded-lg hover:bg-red-50 transition-colors">
                                        <FiX size={10}/> Cancel Booking
                                    </button>
                                </div>
                            )}
                            {selectedReg.status === 'Cancelled' && (
                                <div className="flex items-center justify-between p-4 bg-red-50 border border-red-100 rounded-xl">
                                    <p className="text-xs font-bold text-red-600">❌ Registration Cancelled</p>
                                    <button onClick={() => handleStatusUpdate('Registered')} disabled={isActioning}
                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white text-[10px] font-bold rounded-lg hover:bg-emerald-700 transition-colors">
                                        <FiCheck size={10}/> Re-Confirm
                                    </button>
                                </div>
                            )}

                            {/* Event Info */}
                            <section>
                                <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2"><FiCalendar size={11}/> Event Details</h3>
                                <div className="bg-primary/5 border border-primary/10 rounded-xl p-4">
                                    <Link href={`/admin/events/${selectedReg.eventId?._id}`} className="font-bold text-primary hover:underline text-base block">
                                        {selectedReg.eventId?.title || 'Unknown Event'}
                                    </Link>
                                    <p className="text-xs text-gray-500 mt-1">Registered on {new Date(selectedReg.createdAt).toLocaleString('en-IN', { dateStyle: 'long', timeStyle: 'short' })}</p>
                                </div>
                            </section>

                            {/* Attendee Information */}
                            <section>
                                <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2"><FiUser size={11}/> Attendee Information</h3>
                                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-0">
                                    <InfoRow label="Full Name" value={selectedReg.user} />
                                    <InfoRow label="Email" value={selectedReg.email} />
                                    <InfoRow label="Phone" value={selectedReg.phone} />
                                    <InfoRow label="Number of Persons" value={selectedReg.personCount || 1} />
                                    <InfoRow label="Address" value={selectedReg.address} />
                                    <InfoRow label="Passport / Gov ID No." value={selectedReg.passportId} />
                                    <InfoRow label="Dietary Preference" value={selectedReg.dietaryPreference} />
                                    <InfoRow label="Allergies / Medical" value={selectedReg.allergies} />
                                    <InfoRow label="Emergency Contact" value={selectedReg.emergencyContactName} />
                                    <InfoRow label="Emergency Phone" value={selectedReg.emergencyContactPhone} />
                                    <InfoRow label="Special Requests" value={selectedReg.specialRequests} />
                                    <InfoRow label="Vehicle Preference" value={selectedReg.vehicleOption === 'own' ? 'Has own vehicle' : selectedReg.vehicleOption === 'assistance' ? 'Needs transport assistance' : undefined} />
                                </div>
                            </section>

                            {/* Payment Details */}
                            <section>
                                <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2"><FiCreditCard size={11}/> Payment Details</h3>
                                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-0">
                                    <InfoRow label="Method" value={selectedReg.paymentMethod ? selectedReg.paymentMethod.charAt(0).toUpperCase() + selectedReg.paymentMethod.slice(1) : 'N/A'} />
                                    <InfoRow label="Total Amount" value={`₹${((selectedReg.eventId?.registrationFee||0) * (selectedReg.personCount||1)).toLocaleString('en-IN')}`} />
                                    {selectedReg.paymentTransactionId && <InfoRow label="Transaction ID" value={selectedReg.paymentTransactionId} mono />}
                                </div>
                            </section>

                            {/* ID Proof & Screenshot */}
                            {(selectedReg.idProof?.url || selectedReg.paymentScreenshot?.url) && (
                                <section>
                                    <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2"><FiFileText size={11}/> Uploaded Documents</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {selectedReg.idProof?.url && (
                                            <div className="border border-gray-100 rounded-xl p-3 group">
                                                <div className="flex justify-between items-center mb-2">
                                                    <p className="text-xs font-bold text-gray-700">ID Proof</p>
                                                    <a href={selectedReg.idProof.url} target="_blank" rel="noreferrer" className="text-[10px] text-primary hover:underline flex items-center gap-1"><FiExternalLink size={10}/> Open</a>
                                                </div>
                                                <div className="aspect-[4/3] bg-gray-50 rounded-lg overflow-hidden border">
                                                    {selectedReg.idProof.fileType?.startsWith('image') ? (
                                                        <img src={selectedReg.idProof.url} alt="ID Proof" className="w-full h-full object-contain" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-xs font-bold text-primary">PDF Document</div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                        {selectedReg.paymentScreenshot?.url && (
                                            <div className="border border-gray-100 rounded-xl p-3 group">
                                                <div className="flex justify-between items-center mb-2">
                                                    <p className="text-xs font-bold text-gray-700">Payment Screenshot</p>
                                                    <a href={selectedReg.paymentScreenshot.url} target="_blank" rel="noreferrer" className="text-[10px] text-primary hover:underline flex items-center gap-1"><FiExternalLink size={10}/> Open</a>
                                                </div>
                                                <div className="aspect-[4/3] bg-gray-50 rounded-lg overflow-hidden border">
                                                    <img src={selectedReg.paymentScreenshot.url} alt="Payment Screenshot" className="w-full h-full object-contain" />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </section>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* ─── Reject Reason Modal ─── */}
            {showRejectModal && (
                <div className="fixed inset-0 z-[110] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-5">
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center shrink-0"><FiAlertTriangle className="text-red-500" /></div>
                            <div>
                                <h3 className="font-bold text-gray-900">Reject Registration?</h3>
                                <p className="text-xs text-gray-500 mt-1">An email will be sent to <strong>{selectedReg?.email}</strong> notifying them of the cancellation.</p>
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-600 mb-1.5 block">Reason (optional — shown in email)</label>
                            <textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)} rows={3} placeholder="e.g. Event is fully booked, slot no longer available..."
                                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm resize-none focus:ring-2 focus:ring-red-200 outline-none" />
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => { setShowRejectModal(false); setRejectReason(''); }} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
                            <button onClick={() => handleStatusUpdate('Cancelled', rejectReason)} disabled={isActioning}
                                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
                                {isActioning ? <FiLoader className="animate-spin" size={14}/> : <FiX size={14}/>} Confirm Rejection
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
