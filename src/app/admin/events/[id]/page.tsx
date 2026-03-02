"use client";
import React, { useState, useEffect } from 'react';
import { AdminLayout } from "@/components/admin/layout/AdminLayout";
import { FiUsers, FiSettings, FiImage, FiCalendar, FiChevronLeft, FiMapPin, FiClock, FiX, FiLoader } from "react-icons/fi";
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEventDetails, useEventRegistrations } from '@/hooks/useEvents';
import { AdminService } from '@/services/admin.service';
import toast from 'react-hot-toast';

export default function EventDetailedPage() {
    const params = useParams();
    const id = params?.id as string;
    const { event, isLoading, fetchEvent } = useEventDetails(id);
    const router = useRouter();

    const [activeTab, setActiveTab] = useState('basic');
    const bannerInputRef = React.useRef<HTMLInputElement>(null);
    const galleryInputRef = React.useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);

    // Registrations State
    const [regSearch, setRegSearch] = useState('');
    const [regStatus, setRegStatus] = useState('All Status');
    const [regDate, setRegDate] = useState('');
    const [regPage, setRegPage] = useState(1);

    const { registrations, meta: regMeta, isLoading: isRegLoading, fetchRegistrations } = useEventRegistrations(id);

    useEffect(() => {
        if (activeTab === 'users') {
            fetchRegistrations({ page: regPage, limit: 10, status: regStatus, search: regSearch, date: regDate });
        }
    }, [activeTab, regPage, regStatus, regSearch, regDate, fetchRegistrations]);

    // Media Upload Handlers
    const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const selectedFile = e.target.files[0];

            // Validate Size (1MB max)
            if (selectedFile.size > 1024 * 1024) {
                toast.error("File size must be less than 1MB.");
                return;
            }

            setIsUploading(true);
            const formData = new FormData();
            formData.append('file', selectedFile);

            try {
                // Upload to S3/Cloud storage via backend
                const { data } = await AdminService.uploadSingleFile(formData);

                if (data?.success && data?.data) {
                    const uploadedImage = {
                        url: data.data.url,
                        fileType: data.data.fileType
                    };

                    // Patch Event via existing /admin/events/:id updater
                    const response = await fetch(`${process.env.NEXT_PUBLIC_ADMIN_API_URL || 'http://127.0.0.1:8080/api/v1'}/admin/events/${id}`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                        },
                        body: JSON.stringify({ mainBanner: uploadedImage })
                    });

                    if (response.ok) {
                        toast.success("Main banner updated!");
                        fetchEvent(); // Refresh page data
                    } else {
                        toast.error("Failed to map image to event.");
                    }
                } else {
                    toast.error(data?.message || "Image upload failed.");
                }
            } catch (error) {
                console.error("Upload error:", error);
                toast.error("A network error occurred.");
            } finally {
                setIsUploading(false);
            }
        }
    };

    const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const currentTotal = event?.gallery?.length || 0;
            const toAddCount = e.target.files.length;

            if (currentTotal + toAddCount > 15) {
                toast.error(`You can only upload up to ${15 - currentTotal} more images.`);
                return;
            }

            setIsUploading(true);
            const formData = new FormData();
            Array.from(e.target.files).forEach(file => {
                if (file.size <= 1024 * 1024) { // Only append if <= 1MB
                    formData.append('files', file);
                } else {
                    toast.error(`Skipped ${file.name} - files must be under 1MB.`);
                }
            });

            // Upload multiple files via backend
            if (!formData.has('files')) {
                setIsUploading(false);
                return; // Nothing valid was selected
            }

            try {
                const { data } = await AdminService.uploadMultipleFiles(formData);

                if (data?.success && data?.data) {
                    // Combine old gallery metadata with the newly generated objects
                    const mergedGallery = [
                        ...(event?.gallery || []),
                        ...data.data.map((f: any) => ({ url: f.url, fileType: f.fileType }))
                    ];

                    const response = await fetch(`${process.env.NEXT_PUBLIC_ADMIN_API_URL || 'http://127.0.0.1:8080/api/v1'}/admin/events/${id}`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                        },
                        body: JSON.stringify({ gallery: mergedGallery })
                    });

                    if (response.ok) {
                        toast.success("Gallery updated successfully!");
                        fetchEvent();
                    } else {
                        toast.error("Failed to patch gallery.");
                    }
                } else {
                    toast.error(data?.message || "Gallery upload failed.");
                }
            } catch (error) {
                console.error("Upload error:", error);
                toast.error("A network error occurred.");
            } finally {
                setIsUploading(false);
            }
        }
    };

    const handleDeleteGalleryImage = async (urlToRemove: string) => {
        const filteredGallery = event?.gallery?.filter((img: any) => img.url !== urlToRemove);

        setIsUploading(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_ADMIN_API_URL || 'http://127.0.0.1:8080/api/v1'}/admin/events/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                },
                body: JSON.stringify({ gallery: filteredGallery })
            });

            if (response.ok) {
                toast.success("Image removed.");
                fetchEvent();
            } else {
                toast.error("Error deleting image.");
            }
        } catch (error) {
            toast.error("Network error modifying gallery.");
        } finally {
            setIsUploading(false);
        }
    };

    if (isLoading) {
        return (
            <AdminLayout>
                <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            </AdminLayout>
        );
    }

    if (!event) {
        return (
            <AdminLayout>
                <div className="flex flex-col justify-center items-center py-20 text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Event Not Found</h2>
                    <p className="text-gray-500 mb-4">The event you are looking for does not exist or has been deleted.</p>
                    <Link href="/admin/events" className="text-primary font-semibold hover:underline">Return to Events</Link>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="space-y-6 w-full mx-auto">
                {/* Header Profile */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden relative">
                    <div className="h-64 bg-primary/20 relative w-full overflow-hidden">
                        <img src={event.mainBanner?.url || "/assets/travel_admin_login.png"} alt="Cover" className="w-full h-full object-cover opacity-80" />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/40 to-transparent"></div>
                    </div>

                    <div className="absolute top-6 left-6 flex">
                        <Link href="/admin/events" className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-xl text-white text-sm font-semibold transition-colors">
                            <FiChevronLeft className="w-4 h-4" /> Back to Events
                        </Link>
                    </div>

                    <div className="p-8 pt-6 relative flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-end -mt-16">
                        <div className="flex-1">
                            <h1 className="text-3xl font-extrabold text-white mb-4 tracking-tight drop-shadow-md">{event.title}</h1>
                            <div className="flex flex-wrap gap-4 text-sm font-medium text-gray-600 mt-2">
                                <span className="flex items-center gap-1.5"><FiMapPin className="text-primary" /> {event.location}</span>
                                <span className="flex items-center gap-1.5"><FiCalendar className="text-primary" /> {new Date(event.startDate).toLocaleDateString()}</span>
                                <span className="px-3 py-1 bg-red-50 text-red-700 rounded-lg text-xs font-bold border border-red-200">{event.ageRestriction}</span>
                                <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${event.status === 'Active (Published)' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-gray-50 text-gray-600 border-gray-200'}`}>{event.status}</span>
                            </div>
                        </div>
                        <div className="flex gap-3 shrink-0">
                            <Link href={`/admin/events/edit/${id}`} className="px-5 py-2.5 rounded-xl flex items-center border border-gray-200 text-gray-700 bg-white font-semibold shadow-sm hover:bg-gray-50 transition-colors">
                                Edit Event
                            </Link>
                            <Link href={`/events/${id}`} target="_blank" className="bg-primary flex items-center hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-colors shadow-sm">
                                View Public Page
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Event Tabs Navigation */}
                <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar border-b border-gray-200">
                    <button onClick={() => setActiveTab('basic')} className={`px-5 py-3 rounded-t-xl text-sm font-bold flex items-center gap-2 transition-colors border-b-2 ${activeTab === 'basic' ? 'text-primary border-primary' : 'text-gray-500 border-transparent hover:text-gray-700'}`}>
                        <FiImage className="w-4 h-4" /> Basic Details & Media
                    </button>
                    <button onClick={() => setActiveTab('form')} className={`px-5 py-3 rounded-t-xl text-sm font-bold flex items-center gap-2 transition-colors border-b-2 ${activeTab === 'form' ? 'text-primary border-primary' : 'text-gray-500 border-transparent hover:text-gray-700'}`}>
                        <FiSettings className="w-4 h-4" /> Registration Form Setup
                    </button>
                    <button onClick={() => setActiveTab('users')} className={`px-5 py-3 rounded-t-xl text-sm font-bold flex items-center gap-2 transition-colors border-b-2 ${activeTab === 'users' ? 'text-primary border-primary' : 'text-gray-500 border-transparent hover:text-gray-700'}`}>
                        <FiUsers className="w-4 h-4" /> Registered Users
                    </button>
                </div>

                {/* Tabs Content */}
                <div className="bg-white p-6 rounded-b-2xl rounded-tr-2xl shadow-sm border border-gray-100 min-h-[400px]">

                    {/* Basic Details Tab */}
                    {activeTab === 'basic' && (
                        <div className="space-y-8 animate-in fade-in duration-300">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 border-b pb-3 mb-4">Event Description</h3>
                                <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-line">{event.description}</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 border-b pb-3 mb-4">Guidelines & Restrictions</h3>
                                    <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-line">{event.guidelines || "No specific guidelines provided."}</p>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 border-b pb-3 mb-4">Things to Carry</h3>
                                    <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-line">{event.thingsToCarry || "Standard travel essentials."}</p>
                                </div>
                            </div>

                            {/* Media Section */}
                            <div className="space-y-8 border-t pt-8">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">Main Event Banner</h3>
                                    <p className="text-gray-500 mb-4 text-sm">This is the hero image displayed at the top of the event page.</p>

                                    {/* Expose hidden native inputs for React Refs */}
                                    <input
                                        type="file"
                                        ref={bannerInputRef}
                                        className="hidden"
                                        accept="image/png, image/jpeg, image/jpg, image/webp"
                                        onChange={handleBannerUpload}
                                        disabled={isUploading}
                                    />

                                    <input
                                        type="file"
                                        ref={galleryInputRef}
                                        className="hidden"
                                        multiple
                                        accept="image/png, image/jpeg, image/jpg, image/webp"
                                        onChange={handleGalleryUpload}
                                        disabled={isUploading}
                                    />

                                    {event.mainBanner ? (
                                        <div className="relative aspect-video max-w-2xl rounded-xl overflow-hidden bg-gray-100 border shadow-sm group">
                                            <img src={event.mainBanner.url} alt="Main Banner" className="w-full h-full object-cover transition-opacity" />
                                            {isUploading && (
                                                <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
                                                    <FiLoader className="w-8 h-8 text-primary animate-spin" />
                                                </div>
                                            )}
                                            <div className="absolute top-4 right-4 flex gap-2">
                                                <button
                                                    onClick={() => bannerInputRef.current?.click()}
                                                    disabled={isUploading}
                                                    className="px-3 py-1.5 bg-white/90 backdrop-blur text-gray-700 text-xs font-bold rounded-lg shadow-sm hover:bg-white transition-colors"
                                                >
                                                    Change Banner
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div
                                            onClick={() => !isUploading && bannerInputRef.current?.click()}
                                            className="aspect-video max-w-2xl border-2 border-dashed border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors cursor-pointer text-gray-500"
                                        >
                                            {isUploading ? <FiLoader className="w-8 h-8 mb-3 text-primary animate-spin" /> : <FiImage className="w-8 h-8 mb-3 text-primary/40" />}
                                            <span className="text-sm font-semibold">{isUploading ? "Uploading..." : "Upload Main Banner"}</span>
                                            <span className="text-xs mt-1 text-gray-400">Max size: 1MB. Recommended: 1920x1080px</span>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">Event Gallery Album</h3>
                                    <p className="text-gray-500 mb-4 text-sm">Upload up to 15 additional photos for this event. These will be displayed in the gallery grid. Max size: 1MB each.</p>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {/* Existing Gallery Images */}
                                        {event.gallery?.map((img: any, idx: number) => (
                                            <div key={idx} className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 border shadow-sm group">
                                                <img src={img.url} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                                                <button
                                                    disabled={isUploading}
                                                    onClick={() => handleDeleteGalleryImage(img.url)}
                                                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-md shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 disabled:bg-gray-400"
                                                >
                                                    <FiX className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        ))}

                                        {/* Upload Button */}
                                        {(!event.gallery || event.gallery.length < 15) && (
                                            <div
                                                onClick={() => !isUploading && galleryInputRef.current?.click()}
                                                className={`aspect-square border-2 border-dashed border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center text-center transition-colors ${isUploading ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'hover:bg-gray-50 cursor-pointer text-gray-500'}`}
                                            >
                                                {isUploading ? <FiLoader className="w-6 h-6 mb-2 text-primary animate-spin" /> : <FiImage className="w-6 h-6 mb-2 text-primary/40" />}
                                                <span className="text-xs font-semibold px-2">{isUploading ? 'Uploading...' : `Add to Album \n (${event.gallery?.length || 0}/15)`}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Form Setup Tab */}
                    {activeTab === 'form' && (
                        <div className="space-y-6 animate-in fade-in duration-300">
                            <h3 className="text-lg font-bold text-gray-900 border-b pb-3 border-gray-100">Dynamic Registration Form Setup</h3>
                            <p className="text-sm text-gray-500">Configure which fields users must fill out during registration.</p>

                            <div className="space-y-3 max-w-lg mt-4">
                                <label className="flex items-center gap-3 p-4 border rounded-xl hover:bg-gray-50 cursor-pointer">
                                    <input type="checkbox" defaultChecked className="w-5 h-5 text-primary" />
                                    <span className="font-medium text-gray-900">Require Phone Number</span>
                                </label>
                                <label className="flex items-center gap-3 p-4 border rounded-xl hover:bg-gray-50 cursor-pointer">
                                    <input type="checkbox" defaultChecked className="w-5 h-5 text-primary" />
                                    <span className="font-medium text-gray-900">Require Passport ID (International Docs)</span>
                                </label>
                                <label className="flex items-center gap-3 p-4 border rounded-xl hover:bg-gray-50 cursor-pointer">
                                    <input type="checkbox" className="w-5 h-5 text-primary" />
                                    <span className="font-medium text-gray-900">Allergies / Dietary Requirements</span>
                                </label>
                            </div>
                        </div>
                    )}

                    {/* Registered Users Tab */}
                    {activeTab === 'users' && (
                        <div className="space-y-6 animate-in fade-in duration-300">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-4">
                                <h3 className="text-lg font-bold text-gray-900 shrink-0">Registered Users ({regMeta.totalItems})</h3>

                                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                                    <div className="relative flex-1 md:w-48">
                                        <input
                                            type="text"
                                            placeholder="Search name or email..."
                                            value={regSearch}
                                            onChange={(e) => { setRegSearch(e.target.value); setRegPage(1); }}
                                            className="w-full px-3 py-2 bg-gray-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        />
                                    </div>
                                    <input
                                        type="date"
                                        value={regDate}
                                        onChange={(e) => { setRegDate(e.target.value); setRegPage(1); }}
                                        className="px-3 py-2 bg-gray-50 border-none rounded-lg text-sm text-gray-700 focus:ring-2 focus:ring-primary/20 outline-none transition-all shrink-0"
                                    />
                                    <select
                                        value={regStatus}
                                        onChange={(e) => { setRegStatus(e.target.value); setRegPage(1); }}
                                        className="px-3 py-2 bg-gray-50 border-none rounded-lg text-sm font-medium text-gray-700 focus:ring-2 focus:ring-primary/20 outline-none transition-all cursor-pointer shrink-0"
                                    >
                                        <option value="All Status">All Status</option>
                                        <option value="Registered">Registered</option>
                                        <option value="Pending">Pending</option>
                                        <option value="Cancelled">Cancelled</option>
                                    </select>
                                    <button className="px-4 py-2 bg-gray-50 border rounded-lg text-xs font-bold text-gray-600 shadow-sm hover:bg-gray-100 transition-colors shrink-0">
                                        Export CSV
                                    </button>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse min-w-[600px]">
                                    <thead>
                                        <tr className="bg-gray-50 text-xs font-bold text-gray-500 uppercase">
                                            <th className="py-3 px-4 rounded-tl-lg">Attendee Details</th>
                                            <th className="py-3 px-4 text-center">Date Joined</th>
                                            <th className="py-3 px-4 text-center">Status</th>
                                            <th className="py-3 px-4 rounded-tr-lg text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 text-sm">
                                        {isRegLoading ? (
                                            <tr>
                                                <td colSpan={4} className="py-12 text-center text-gray-500 font-medium">Loading registrations...</td>
                                            </tr>
                                        ) : registrations.length > 0 ? (
                                            registrations.map(reg => (
                                                <tr key={reg._id || reg.id} className="hover:bg-gray-50/50 transition-colors">
                                                    <td className="py-4 px-4">
                                                        <p className="font-bold text-gray-900">{reg.user}</p>
                                                        <p className="text-gray-500 text-xs">{reg.email}</p>
                                                    </td>
                                                    <td className="py-4 px-4 text-gray-500 text-center font-medium">
                                                        {new Date(reg.createdAt || reg.date).toLocaleDateString()}
                                                    </td>
                                                    <td className="py-4 px-4 text-center">
                                                        <span className={`px-2.5 py-1 text-xs font-bold rounded-lg border ${reg.status === 'Registered' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                                            reg.status === 'Pending' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                                                                'bg-red-50 text-red-700 border-red-200'
                                                            }`}>
                                                            {reg.status}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-4 text-right">
                                                        <button className="text-primary hover:underline font-semibold text-sm">View Reg</button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={4} className="py-12 text-center text-gray-500 font-medium">No registrations found matching your criteria.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <div className="flex justify-between items-center pt-2">
                                <span className="text-xs text-gray-500">
                                    {registrations.length === 0 ? 0 : (regMeta.currentPage - 1) * regMeta.itemsPerPage + 1} to {Math.min(regMeta.currentPage * regMeta.itemsPerPage, regMeta.totalItems)} of {regMeta.totalItems} entries
                                </span>
                                <div className="flex gap-1">
                                    <button
                                        disabled={regMeta.currentPage === 1 || isRegLoading}
                                        onClick={() => setRegPage(prev => Math.max(1, prev - 1))}
                                        className="px-3 py-1 bg-gray-50 border rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-100 disabled:opacity-50 transition-colors"
                                    >
                                        Prev
                                    </button>
                                    <button
                                        disabled={regMeta.currentPage === regMeta.totalPages || isRegLoading || regMeta.totalPages === 0}
                                        onClick={() => setRegPage(prev => Math.min(regMeta.totalPages, prev + 1))}
                                        className="px-3 py-1 bg-gray-50 border rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-100 disabled:opacity-50 transition-colors"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
