"use client";
import React from 'react';
import Link from 'next/link';

export const EventSidebar = ({ 
    event, 
    canRegister, 
    isExpired, 
    isFull, 
    slotsAvailable 
}: { 
    event: any, 
    canRegister: boolean, 
    isExpired: boolean, 
    isFull: boolean, 
    slotsAvailable: string | number 
}) => {
    return (
        <div className="sticky top-28 space-y-6">
            <div className="bg-[#0A0A0A] text-white rounded-2xl shadow-xl overflow-hidden flex flex-col border border-white/10">
                <div className="p-8 pb-6">
                    <div className="flex items-center gap-2 mb-6">
                        <div className={`w-2 h-2 rounded-full ${canRegister ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]' : 'bg-red-500'}`}></div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
                            {isExpired ? "Registration Closed" : "Active Registration"}
                        </p>
                    </div>
                    
                    <p className="text-[11px] font-medium text-gray-500 uppercase tracking-[0.1em] mb-2">Registration Fee</p>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-black tracking-tight">₹{(event.registrationFee || 0).toLocaleString()}</span>
                        <span className="text-gray-500 font-bold text-xs uppercase tracking-widest">/ PERSON</span>
                    </div>
                </div>

                <div className="px-8 py-6 flex flex-col gap-5 border-y border-white/10 bg-white/[0.02]">
                    <div className="flex items-center justify-between">
                        <span className="text-[12px] text-gray-400 uppercase tracking-widest">Duration</span>
                        <span className="text-sm font-bold">{new Date(event.startDate).toLocaleDateString([], { month: 'short', day: 'numeric' })} - {new Date(event.endDate).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-[12px] text-gray-400 uppercase tracking-widest">Availability</span>
                        <span className={`text-sm font-bold ${isFull ? 'text-red-400' : 'text-emerald-400'}`}>{isFull ? 'Sold Out' : slotsAvailable + ' Slots Left'}</span>
                    </div>
                </div>

                <div className="p-8 pt-6 space-y-6">
                    {canRegister ? (
                        <Link 
                            href={`/events/${event._id}/register`}
                            className="block w-full bg-white text-black text-center py-4 rounded-xl font-black text-[12px] uppercase tracking-[0.2em] hover:bg-gray-200 transition-colors"
                        >
                            Confirm Booking
                        </Link>
                    ) : (
                        <div className="w-full bg-white/5 text-gray-500 text-center py-4 rounded-xl font-bold text-[12px] uppercase tracking-[0.2em] border border-white/10 cursor-not-allowed">
                            Booking Closed
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
