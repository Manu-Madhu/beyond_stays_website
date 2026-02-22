import React from 'react';
import { AdminSidebar } from './AdminSidebar';
import { FiBell, FiSearch, FiUser } from 'react-icons/fi';

export const AdminLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex h-screen bg-[#F8FAFC] font-sans overflow-hidden">
            <AdminSidebar />

            <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                {/* Header Navbar */}
                <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-20 shadow-sm">
                    {/* Search */}
                    <div className="flex-1 max-w-md">
                        <div className="relative">
                            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <input
                                type="text"
                                placeholder="Search events, bookings, or users..."
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all outline-none"
                            />
                        </div>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center space-x-6">
                        <button className="relative p-2 text-gray-400 hover:text-blue-600 transition-colors">
                            <FiBell className="h-6 w-6" />
                            <span className="absolute top-1 right-1.5 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>

                        <div className="h-8 w-px bg-gray-200"></div>

                        <div className="flex items-center space-x-3 cursor-pointer group">
                            <div className="text-right hidden md:block">
                                <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">Admin User</p>
                                <p className="text-xs text-gray-500">Superadmin</p>
                            </div>
                            <div className="h-10 w-10 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-full flex items-center justify-center shadow-md">
                                <FiUser className="h-5 w-5 text-white" />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content Area */}
                <div className="flex-1 overflow-y-auto p-8 relative pt-8 custom-scrollbar">
                    {/* Subtle Background Pattern */}
                    <div className="absolute inset-0 bg-grid-slate-100/[0.04] bg-[bottom_1px_center] -z-10 [mask-image:linear-gradient(to_bottom,transparent,black)]"></div>
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
};
