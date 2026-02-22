"use client";
import React from 'react';
import { FiHome, FiCalendar, FiUsers, FiCreditCard, FiSettings, FiLogOut } from 'react-icons/fi';
import { usePathname, useRouter } from 'next/navigation';

const menuItems = [
    { name: 'Dashboard', icon: FiHome, path: '/admin' },
    { name: 'Event Creation', icon: FiCalendar, path: '/admin/events/create' },
    { name: 'Event Registration', icon: FiUsers, path: '/admin/events/registrations' },
    { name: 'Payment Listing', icon: FiCreditCard, path: '/admin/payments' },
    { name: 'Settings', icon: FiSettings, path: '/admin/settings' },
];

export const AdminSidebar = () => {
    const pathname = usePathname();
    const router = useRouter();

    return (
        <aside className="w-64 bg-white border-r border-gray-100 flex flex-col h-screen font-sans shadow-sm z-10 relative">
            <div className="p-6 border-b border-gray-50 flex items-center">
                <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3 shadow-md">
                    <span className="text-white font-bold text-lg">B</span>
                </div>
                <span className="text-xl font-bold text-gray-900 tracking-tight">
                    BeyondStays
                </span>
            </div>

            <div className="flex-1 py-8 px-4 space-y-2 overflow-y-auto custom-scrollbar">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 ml-3">Menu</div>
                {menuItems.map((item) => {
                    const isActive = pathname === item.path;
                    return (
                        <a
                            key={item.name}
                            href={item.path}
                            className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group ${isActive
                                    ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                                    : 'text-gray-600 hover:bg-blue-50 hover:text-blue-700'
                                }`}
                        >
                            <item.icon className={`h-5 w-5 transition-colors ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-blue-600'}`} />
                            <span>{item.name}</span>
                        </a>
                    );
                })}
            </div>

            <div className="p-4 border-t border-gray-50">
                <button
                    onClick={() => router.push('/admin/login')}
                    className="flex items-center space-x-3 px-4 py-3 w-full rounded-xl text-sm font-semibold text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200 group"
                >
                    <FiLogOut className="h-5 w-5 text-gray-400 group-hover:text-red-500 transition-colors" />
                    <span>Logout Account</span>
                </button>
            </div>
        </aside>
    );
};
