"use client";
import React, { useState, useEffect } from 'react';
import { AdminSidebar } from './AdminSidebar';
import { FiBell, FiSearch, FiUser, FiMenu } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

export const AdminLayout = ({ children }: { children: React.ReactNode }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            router.push('/admin/login'); // Redirect immediately
        } else {
            setIsAuthorized(true);
        }
    }, [router]);

    if (!isAuthorized) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-[#F8FAFC] font-sans overflow-hidden">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <AdminSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative">
                {/* Header Navbar */}
                <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-4 md:px-8 shrink-0 z-10 shadow-sm relative">
                    {/* Search & Mobile Menu Button */}
                    <div className="flex items-center flex-1 space-x-4 max-w-md">
                        <button
                            className="p-2 -ml-2 text-gray-600 md:hidden hover:bg-gray-100 rounded-lg"
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            <FiMenu className="h-6 w-6" />
                        </button>
                        <div className="relative hidden sm:block flex-1">
                            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <input
                                type="text"
                                placeholder="Search events..."
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all outline-none"
                            />
                        </div>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center space-x-4 md:space-x-6">
                        <button className="relative p-2 text-gray-400 hover:text-primary transition-colors">
                            <FiBell className="h-6 w-6" />
                            <span className="absolute top-1 right-1.5 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>

                        <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>

                        <div className="flex items-center space-x-3 cursor-pointer group">
                            <div className="text-right hidden md:block">
                                <p className="text-sm font-semibold text-gray-900 group-hover:text-primary transition-colors">Admin User</p>
                                <p className="text-xs text-gray-500">Superadmin</p>
                            </div>
                            <div className="h-10 w-10 bg-primary/90 rounded-full flex items-center justify-center shadow-md">
                                <FiUser className="h-5 w-5 text-white" />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content Area - Scrollable */}
                <div
                    className="flex-1 p-4 md:p-8 relative overflow-y-auto"
                    data-lenis-prevent
                >
                    {/* Subtle Background Pattern */}
                    <div className="absolute inset-0 bg-grid-slate-100/[0.04] bg-[bottom_1px_center] -z-10 [mask-image:linear-gradient(to_bottom,transparent,black)] pointer-events-none"></div>
                    <div className="max-w-7xl mx-auto pb-10">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
};
