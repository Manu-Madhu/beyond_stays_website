"use client";
import React from 'react';
import { FiHome, FiCalendar, FiUsers, FiCreditCard, FiSettings, FiLogOut, FiX } from 'react-icons/fi';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/utils/cn';
import toast from 'react-hot-toast';
import { ConfirmModal } from '@/components/common/ConfirmModal';

const menuItems = [
    { name: 'Dashboard', icon: FiHome, path: '/admin' },
    { name: 'Events', icon: FiCalendar, path: '/admin/events' },
    { name: 'Event Registration', icon: FiUsers, path: '/admin/events/registrations' },
    { name: 'Payment Listing', icon: FiCreditCard, path: '/admin/payments' },
    { name: 'Settings', icon: FiSettings, path: '/admin/settings' },
];

interface AdminSidebarProps {
    isOpen: boolean;
    setIsOpen: (val: boolean) => void;
}

export const AdminSidebar = ({ isOpen, setIsOpen }: AdminSidebarProps) => {
    const pathname = usePathname();
    const router = useRouter();
    const [isLogoutModalOpen, setIsLogoutModalOpen] = React.useState(false);

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        toast.success("Successfully logged out");
        router.push('/admin/login');
    };

    return (
        <>
            <aside className={cn(
                "bg-white border-r border-gray-100 flex flex-col h-screen font-sans shadow-sm z-30 fixed md:relative transition-transform duration-300 w-64",
                isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
            )}>
                <div className="p-6 border-b border-gray-50 flex items-center justify-between shrink-0">
                    <div className="flex items-center">
                        <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center mr-3 shadow-md">
                            <span className="text-white font-bold text-lg">B</span>
                        </div>
                        <span className="text-xl font-bold text-gray-900 tracking-tight">
                            BeyondStays
                        </span>
                    </div>
                    {/* Mobile Close Button */}
                    <button
                        className="md:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                        onClick={() => setIsOpen(false)}
                    >
                        <FiX className="h-5 w-5" />
                    </button>
                </div>

                <div className="flex-1 py-8 px-4 space-y-2 overflow-y-auto custom-scrollbar">
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 ml-3">Menu</div>
                    {menuItems.map((item) => {
                        const isActive = item.path === '/admin' ? pathname === '/admin' : pathname.startsWith(item.path);
                        return (
                            <Link
                                key={item.name}
                                href={item.path}
                                onClick={() => setIsOpen(false)}
                                className={cn(
                                    "flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group",
                                    isActive
                                        ? "bg-primary text-white shadow-md shadow-primary/20"
                                        : "text-gray-600 hover:bg-primary/5 hover:text-primary"
                                )}
                            >
                                <item.icon className={cn(
                                    "h-5 w-5 transition-colors",
                                    isActive ? "text-white" : "text-gray-400 group-hover:text-primary"
                                )} />
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </div>

                <div className="p-4 border-t border-gray-50 shrink-0">
                    <button
                        onClick={() => setIsLogoutModalOpen(true)}
                        className="flex items-center space-x-3 px-4 py-3 w-full rounded-xl text-sm font-semibold text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200 group"
                    >
                        <FiLogOut className="h-5 w-5 text-gray-400 group-hover:text-red-500 transition-colors" />
                        <span>Logout Account</span>
                    </button>
                </div>
            </aside>

            <ConfirmModal
                isOpen={isLogoutModalOpen}
                title="Confirm Logout"
                message="Are you sure you want to log out of the admin portal? You will need to sign in again to manage events."
                confirmText="Log Out"
                cancelText="Cancel"
                onConfirm={handleLogout}
                onCancel={() => setIsLogoutModalOpen(false)}
            />
        </>
    );
};
