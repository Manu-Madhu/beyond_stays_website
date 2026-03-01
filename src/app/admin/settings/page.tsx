import React from 'react';
import { AdminLayout } from "@/components/admin/layout/AdminLayout";
import { FiSave } from "react-icons/fi";

export default function SettingsPage() {
    return (
        <AdminLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Platform Settings</h1>
                    <p className="text-gray-500 mt-1">Manage global preferences and admin configurations.</p>
                </div>

                <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 max-w-2xl">
                    <form className="space-y-6">
                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">General Info</h3>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                                <input type="text" defaultValue="BeyondStays Inc." className="w-full px-4 py-2 border rounded-xl object-none outline-none focus:ring-2 focus:ring-primary/20 bg-gray-50 focus:bg-white transition-all" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1 mt-4">Support Email</label>
                                <input type="email" defaultValue="support@beyondstays.com" className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 bg-gray-50 focus:bg-white transition-all" />
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end">
                            <button type="button" className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors">
                                <FiSave className="w-4 h-4" />
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
