"use client";
import React, { useState, useEffect } from 'react';
import { AdminLayout } from "@/components/admin/layout/AdminLayout";
import {
    FiUsers, FiSettings, FiImage, FiCalendar, FiChevronLeft, FiMapPin,
    FiX, FiLoader, FiCreditCard, FiUpload,
    FiDollarSign, FiSave, FiAlertCircle, FiInfo, FiExternalLink
} from "react-icons/fi";
import { MdOutlineQrCode2 } from "react-icons/md";
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEventDetails, useEventRegistrations } from '@/hooks/useEvents';
import { AdminService } from '@/services/admin.service';
import toast from 'react-hot-toast';

// Toggle Switch Component
const ToggleSwitch = ({
    enabled, onChange, label, description, accent = 'primary'
}: {
    enabled: boolean;
    onChange: (v: boolean) => void;
    label: string;
    description?: string;
    accent?: string;
}) => (
    <div className="flex items-start justify-between gap-4 py-3.5">
        <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-800">{label}</p>
            {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
        </div>
        <button
            type="button"
            onClick={() => onChange(!enabled)}
            className={`relative shrink-0 w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${enabled ? 'bg-primary' : 'bg-gray-200'}`}
        >
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${enabled ? 'translate-x-5' : 'translate-x-0'}`} />
        </button>
    </div>
);

export default function EventDetailedPage() {
    const params = useParams();
    const id = params?.id as string;
    const { event, isLoading, fetchEvent } = useEventDetails(id);

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

    // Registration Form Config State
    const [formConfig, setFormConfig] = useState({
        customNaming: '',
        requirePhone: true,
        requirePassport: false,
        requireAllergies: false,
        requireEmergencyContact: false,
        requireDietaryPreference: false,
        requireSpecialRequests: false,
        requireAddress: false,
        requireIdProof: false,
        requirePersonCount: false,
        requireVehicleInfo: false,
        vehicleDescription: '',
        enableOnlinePayment: true,
        enablePaidScreenshot: true,
        enableDirectPay: true,
        upiId: '',
        bankDetails: ''
    });
    const [isSavingConfig, setIsSavingConfig] = useState(false);

    // Populate formConfig from event data
    useEffect(() => {
        if (event?.registrationForm) {
            setFormConfig({
                customNaming: event.registrationForm.customNaming || '',
                requirePhone: event.registrationForm.requirePhone ?? true,
                requirePassport: event.registrationForm.requirePassport ?? false,
                requireAllergies: event.registrationForm.requireAllergies ?? false,
                requireEmergencyContact: event.registrationForm.requireEmergencyContact ?? false,
                requireDietaryPreference: event.registrationForm.requireDietaryPreference ?? false,
                requireSpecialRequests: event.registrationForm.requireSpecialRequests ?? false,
                requireAddress: event.registrationForm.requireAddress ?? false,
                requireIdProof: event.registrationForm.requireIdProof ?? false,
                requirePersonCount: event.registrationForm.requirePersonCount ?? false,
                requireVehicleInfo: event.registrationForm.requireVehicleInfo ?? false,
                vehicleDescription: event.registrationForm.vehicleDescription || '',
                enableOnlinePayment: event.registrationForm.enableOnlinePayment ?? true,
                enablePaidScreenshot: event.registrationForm.enablePaidScreenshot ?? true,
                enableDirectPay: event.registrationForm.enableDirectPay ?? true,
                upiId: event.registrationForm.upiId || '',
                bankDetails: event.registrationForm.bankDetails || ''
            });
        }
    }, [event]);

    useEffect(() => {
        if (activeTab === 'users') {
            fetchRegistrations({ page: regPage, limit: 10, status: regStatus, search: regSearch, date: regDate });
        }
    }, [activeTab, regPage, regStatus, regSearch, regDate, fetchRegistrations]);

    const handleSaveFormConfig = async () => {
        setIsSavingConfig(true);
        try {
            const { data } = await AdminService.updateEvent(id, { registrationForm: formConfig });
            if (data?.success) {
                toast.success("Registration form configuration saved!");
                fetchEvent();
            } else {
                toast.error(data?.message || "Failed to save configuration.");
            }
        } catch {
            toast.error("Network error while saving configuration.");
        } finally {
            setIsSavingConfig(false);
        }
    };

    // Media Upload Handlers
    const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const selectedFile = e.target.files[0];
            if (selectedFile.size > 1024 * 1024) {
                toast.error("File size must be less than 1MB.");
                return;
            }
            setIsUploading(true);
            const formData = new FormData();
            formData.append('file', selectedFile);
            try {
                const { data } = await AdminService.uploadSingleFile(formData);
                if (data?.success && data?.data) {
                    const uploadedImage = { url: data.data.url, fileType: data.data.fileType };
                    const response = await AdminService.updateEvent(id, { mainBanner: uploadedImage });
                    if (response.data?.success) {
                        toast.success("Main banner updated!");
                        fetchEvent();
                    } else {
                        toast.error("Failed to map image to event.");
                    }
                } else {
                    toast.error(data?.message || "Image upload failed.");
                }
            } catch {
                toast.error("A network error occurred.");
            } finally {
                setIsUploading(false);
                if (bannerInputRef.current) bannerInputRef.current.value = '';
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
                if (file.size <= 1024 * 1024) formData.append('files', file);
                else toast.error(`Skipped ${file.name} - files must be under 1MB.`);
            });
            if (!formData.has('files')) { setIsUploading(false); return; }
            try {
                const { data } = await AdminService.uploadMultipleFiles(formData);
                if (data?.success && data?.data) {
                    const mergedGallery = [
                        ...(event?.gallery || []),
                        ...data.data.map((f: any) => ({ url: f.url, fileType: f.fileType }))
                    ];
                    const response = await AdminService.updateEvent(id, { gallery: mergedGallery });
                    if (response.data?.success) {
                        toast.success("Gallery updated successfully!");
                        fetchEvent();
                    } else {
                        toast.error("Failed to patch gallery.");
                    }
                } else {
                    toast.error(data?.message || "Gallery upload failed.");
                }
            } catch {
                toast.error("A network error occurred.");
            } finally {
                setIsUploading(false);
                if (galleryInputRef.current) galleryInputRef.current.value = '';
            }
        }
    };

    const handleDeleteGalleryImage = async (urlToRemove: string) => {
        const filteredGallery = event?.gallery?.filter((img: any) => img.url !== urlToRemove);
        setIsUploading(true);
        try {
            const response = await AdminService.updateEvent(id, { gallery: filteredGallery });
            if (response.data?.success) {
                toast.success("Image removed.");
                fetchEvent();
            } else {
                toast.error("Error deleting image.");
            }
        } catch {
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

    const enabledPaymentOptions = [formConfig.enableOnlinePayment, formConfig.enablePaidScreenshot, formConfig.enableDirectPay].filter(Boolean).length;

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
                        <FiImage className="w-4 h-4" /> Basic Details &amp; Media
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
                                    <h3 className="text-lg font-bold text-gray-900 border-b pb-3 mb-4">Guidelines &amp; Restrictions</h3>
                                    <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-line">{event.guidelines || "No specific guidelines provided."}</p>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 border-b pb-3 mb-4">Things to Carry</h3>
                                    <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-line">{event.thingsToCarry || "Standard travel essentials."}</p>
                                </div>
                            </div>

                            {/* Media Section */}
                            <div className="space-y-8 border-t pt-8">
                                <div className="p-6 bg-gray-50/50 rounded-2xl border border-gray-100 shadow-sm">
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                                <FiImage className="text-primary" /> Event Hero Media
                                            </h3>
                                            <p className="text-sm text-gray-500 mt-0.5">Select how your event header looks: a single image or an automated carousel.</p>
                                        </div>
                                        <div className="flex bg-white p-1.5 rounded-xl border border-gray-200 shadow-sm">
                                            <button
                                                onClick={async () => {
                                                    setIsSavingConfig(true);
                                                    await AdminService.updateEvent(id, { bannerType: 'single' });
                                                    fetchEvent();
                                                    setIsSavingConfig(false);
                                                }}
                                                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 ${event.bannerType !== 'carousel' ? 'bg-primary text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
                                            >
                                                Single Image
                                            </button>
                                            <button
                                                onClick={async () => {
                                                    setIsSavingConfig(true);
                                                    await AdminService.updateEvent(id, { bannerType: 'carousel' });
                                                    fetchEvent();
                                                    setIsSavingConfig(false);
                                                }}
                                                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 ${event.bannerType === 'carousel' ? 'bg-primary text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
                                            >
                                                Hero Carousel
                                            </button>
                                        </div>
                                    </div>

                                    {event.bannerType === 'carousel' ? (
                                        <div className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {event.banners?.map((img: any, idx: number) => (
                                                    <div key={idx} className="group relative aspect-video rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all">
                                                        <img src={img.url} className="w-full h-full object-cover" />
                                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                            <button
                                                                onClick={async () => {
                                                                    const newBanners = event.banners.filter((_: any, i: number) => i !== idx);
                                                                    await AdminService.updateEvent(id, { banners: newBanners });
                                                                    fetchEvent();
                                                                    toast.success("Slide removed.");
                                                                }}
                                                                className="p-3 bg-red-500 text-white rounded-2xl hover:bg-red-600 transition-colors shadow-lg"
                                                                title="Delete Slide"
                                                            >
                                                                <FiX className="w-5 h-5" />
                                                            </button>
                                                        </div>
                                                        <div className="absolute bottom-3 left-3 px-2 py-1 bg-black/50 backdrop-blur-md rounded-lg text-[10px] font-bold text-white">
                                                            Slide {idx + 1}
                                                        </div>
                                                    </div>
                                                ))}
                                                {(!event.banners || event.banners.length < 5) && (
                                                    <div
                                                        onClick={() => !isUploading && bannerInputRef.current?.click()}
                                                        className={`aspect-video border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center transition-all bg-white hover:border-primary/30 hover:bg-primary/5 cursor-pointer ${isUploading ? 'opacity-50' : ''}`}
                                                    >
                                                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mb-2">
                                                            <FiUpload className="w-5 h-5 text-primary" />
                                                        </div>
                                                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{isUploading ? 'Uploading...' : 'Add Slide'}</span>
                                                        <span className="text-[10px] text-gray-400 mt-1 uppercase">Max 5 Slides</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2 p-3 bg-blue-50/50 border border-blue-100 rounded-xl">
                                                <FiInfo className="w-4 h-4 text-blue-600 shrink-0" />
                                                <p className="text-[11px] text-blue-700 font-medium">Carousel slides will automatically transition every 5 seconds on the registration page.</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="max-w-3xl">
                                            {event.mainBanner ? (
                                                <div className="relative aspect-video rounded-3xl overflow-hidden bg-white border-2 border-gray-100 shadow-xl group">
                                                    <img src={event.mainBanner.url} alt="Main Banner" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                                    {isUploading && (
                                                        <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
                                                            <FiLoader className="w-10 h-10 text-primary animate-spin" />
                                                        </div>
                                                    )}
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                                        <button 
                                                            onClick={() => bannerInputRef.current?.click()} 
                                                            disabled={isUploading} 
                                                            className="px-6 py-3 bg-white text-primary rounded-2xl text-sm font-bold shadow-2xl hover:bg-primary hover:text-white transition-all flex items-center gap-2"
                                                        >
                                                            <FiUpload className="w-4 h-4" /> Change Image
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div onClick={() => !isUploading && bannerInputRef.current?.click()} className="aspect-video border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center transition-all bg-white hover:border-primary/30 hover:bg-primary/5 cursor-pointer p-8">
                                                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                                                        <FiImage className="w-8 h-8 text-primary/40" />
                                                    </div>
                                                    <h4 className="text-lg font-bold text-gray-900">Upload Header Banner</h4>
                                                    <p className="text-sm text-gray-500 mt-1 max-w-xs text-center">This image will greet users at the top of the registration portal.</p>
                                                    <span className="mt-6 px-5 py-2.5 bg-primary text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg shadow-primary/20">
                                                        {isUploading ? "Uploading..." : "Select File"}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <input 
                                        type="file" 
                                        ref={bannerInputRef} 
                                        className="hidden" 
                                        accept="image/*" 
                                        onChange={async (e) => {
                                            const file = e.target.files?.[0];
                                            if (!file) return;
                                            setIsUploading(true);
                                            const fd = new FormData();
                                            fd.append('file', file);
                                            try {
                                                const { data } = await AdminService.uploadSingleFile(fd);
                                                if (data?.success && data?.data) {
                                                    const img = { url: data.data.url, fileType: data.data.fileType };
                                                    if (event.bannerType === 'carousel') {
                                                        const newBanners = [...(event.banners || []), img];
                                                        await AdminService.updateEvent(id, { banners: newBanners });
                                                    } else {
                                                        await AdminService.updateEvent(id, { mainBanner: img });
                                                    }
                                                    toast.success("Media updated!");
                                                    fetchEvent();
                                                }
                                            } catch (err) {
                                                toast.error("Upload failed.");
                                            }
                                            setIsUploading(false);
                                        }} 
                                        disabled={isUploading} 
                                    />
                                </div>

                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">Event Gallery Album</h3>
                                    <p className="text-gray-500 mb-4 text-sm">Upload up to 15 additional photos for this event. Max size: 1MB each.</p>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {event.gallery?.map((img: any, idx: number) => (
                                            <div key={idx} className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 border shadow-sm group">
                                                <img src={img.url} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                                                <button disabled={isUploading} onClick={() => handleDeleteGalleryImage(img.url)} className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-md shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 disabled:bg-gray-400">
                                                    <FiX className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        ))}

                                        {(!event.gallery || event.gallery.length < 15) && (
                                            <div onClick={() => !isUploading && galleryInputRef.current?.click()} className={`aspect-square border-2 border-dashed border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center text-center transition-colors ${isUploading ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'hover:bg-gray-50 cursor-pointer text-gray-500'}`}>
                                                {isUploading ? <FiLoader className="w-6 h-6 mb-2 text-primary animate-spin" /> : <FiImage className="w-6 h-6 mb-2 text-primary/40" />}
                                                <span className="text-xs font-semibold px-2">{isUploading ? 'Uploading...' : `Add to Album\n(${event.gallery?.length || 0}/15)`}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Registration Form Setup Tab */}
                    {activeTab === 'form' && (
                        <div className="space-y-6 animate-in fade-in duration-300">
                            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b pb-4 border-gray-100">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">Registration Form Configuration</h3>
                                    <p className="text-sm text-gray-500 mt-0.5">Configure what fields users must fill out and which payment options are available.</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => window.open(`/events/${id}`, '_blank')}
                                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-primary bg-white border border-primary/20 hover:bg-primary/5 transition-colors shadow-sm shrink-0"
                                    >
                                        <FiExternalLink className="w-4 h-4" />
                                        Preview Form
                                    </button>
                                    <button
                                        onClick={handleSaveFormConfig}
                                        disabled={isSavingConfig}
                                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-colors shadow-sm shrink-0 ${isSavingConfig ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-primary/90'}`}
                                    >
                                        {isSavingConfig ? <FiLoader className="w-4 h-4 animate-spin" /> : <FiSave className="w-4 h-4" />}
                                        {isSavingConfig ? 'Saving...' : 'Save Configuration'}
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Payment Options Panel */}
                                <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl border border-primary/20 p-6 space-y-1">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                                            <FiCreditCard className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 text-sm">Payment Options</h4>
                                            <p className="text-xs text-gray-500">Enable payment methods for this event</p>
                                        </div>
                                        {enabledPaymentOptions === 0 && (
                                            <span className="ml-auto flex items-center gap-1 text-xs text-orange-600 bg-orange-50 border border-orange-200 px-2 py-1 rounded-lg font-semibold">
                                                <FiAlertCircle className="w-3.5 h-3.5" /> None enabled
                                            </span>
                                        )}
                                    </div>

                                    <div className="divide-y divide-primary/10">
                                        {/* Online Payment */}
                                        <div className="pb-3">
                                            <ToggleSwitch
                                                enabled={formConfig.enableOnlinePayment}
                                                onChange={(v) => setFormConfig(prev => ({ ...prev, enableOnlinePayment: v }))}
                                                label="Online Payment (Razorpay / Card)"
                                                description="Allows users to pay instantly via UPI, credit/debit card, or net banking."
                                            />
                                        </div>

                                        {/* Paid Screenshot */}
                                        <div className="py-3 space-y-3">
                                            <ToggleSwitch
                                                enabled={formConfig.enablePaidScreenshot}
                                                onChange={(v) => setFormConfig(prev => ({ ...prev, enablePaidScreenshot: v }))}
                                                label="Already Paid – Upload Screenshot"
                                                description="User can upload a payment proof screenshot (bank transfer or UPI)."
                                            />
                                            {formConfig.enablePaidScreenshot && (
                                                <div className="bg-white rounded-xl p-4 border border-primary/10 space-y-3 ml-0">
                                                    <div>
                                                        <label className="block text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1">
                                                            <MdOutlineQrCode2 className="w-4 h-4" /> UPI ID / PA Handle
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={formConfig.upiId}
                                                            onChange={(e) => setFormConfig(prev => ({ ...prev, upiId: e.target.value }))}
                                                            placeholder="e.g. beyondstays@upi"
                                                            className="w-full px-3 py-2 bg-gray-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">Bank Transfer Details</label>
                                                        <textarea
                                                            value={formConfig.bankDetails}
                                                            onChange={(e) => setFormConfig(prev => ({ ...prev, bankDetails: e.target.value }))}
                                                            rows={3}
                                                            placeholder="Account Name: BeyondStays Pvt. Ltd.&#10;Account No: XXXXXXXXXXXXXX&#10;IFSC: XXXXXXXXXX"
                                                            className="w-full px-3 py-2 bg-gray-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Direct Pay */}
                                        <div className="pt-3">
                                            <ToggleSwitch
                                                enabled={formConfig.enableDirectPay}
                                                onChange={(v) => setFormConfig(prev => ({ ...prev, enableDirectPay: v }))}
                                                label="Pay at Venue (Direct Pay)"
                                                description="Allow users to register and pay directly at the event venue."
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-4 p-3 bg-white/60 rounded-xl border border-primary/10 flex items-start gap-2">
                                        <FiInfo className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                                        <p className="text-xs text-gray-600">
                                            <span className="font-semibold">{enabledPaymentOptions === 0 ? 'Warning:' : `${enabledPaymentOptions} option${enabledPaymentOptions > 1 ? 's' : ''} active.'}`} </span>
                                            {enabledPaymentOptions === 0 ? 'At least one payment method must be enabled for users to register.' : 'Users will see these payment options on the registration form.'}
                                        </p>
                                    </div>
                                </div>

                                {/* Form Fields Panel */}
                                <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6 space-y-1">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-9 h-9 rounded-xl bg-gray-200 flex items-center justify-center">
                                            <FiSettings className="w-5 h-5 text-gray-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 text-sm">Event Branding & Form Fields</h4>
                                            <p className="text-xs text-gray-500">Customize naming and data collection</p>
                                        </div>
                                    </div>

                                    {/* Custom Naming */}
                                    <div className="mb-6 bg-white border border-gray-200 rounded-xl p-4">
                                        <label className="block text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1">
                                            <FiSettings className="w-3 h-3" /> Particular Event Naming (Public Portal)
                                        </label>
                                        <input
                                            type="text"
                                            value={formConfig.customNaming}
                                            onChange={(e) => setFormConfig(prev => ({ ...prev, customNaming: e.target.value }))}
                                            placeholder="e.g. BeyondStays X Trek 2024 Portal"
                                            className="w-full px-3 py-2 bg-gray-50 border-none rounded-lg text-sm font-semibold text-gray-800 placeholder:font-normal focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        />
                                        <p className="text-xs text-gray-400 mt-1.5">This name will be shown at the top of the event registration portal.</p>
                                    </div>

                                    <p className="text-xs text-gray-500 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2 mb-2">
                                        <span className="font-semibold text-blue-700">Always collected:</span> Full Name, Email Address (cannot be disabled)
                                    </p>

                                    <div className="divide-y divide-gray-200">
                                        <ToggleSwitch
                                            enabled={formConfig.requirePhone}
                                            onChange={(v) => setFormConfig(prev => ({ ...prev, requirePhone: v }))}
                                            label="Phone Number"
                                            description="Collect the attendee's mobile number."
                                        />
                                        <ToggleSwitch
                                            enabled={formConfig.requireAddress}
                                            onChange={(v) => setFormConfig(prev => ({ ...prev, requireAddress: v }))}
                                            label="Home / Billing Address"
                                            description="Collect the attendee's full residential address."
                                        />
                                        <ToggleSwitch
                                            enabled={formConfig.requirePersonCount}
                                            onChange={(v) => setFormConfig(prev => ({ ...prev, requirePersonCount: v }))}
                                            label="Number of Persons"
                                            description="How many people are attending together (including registrant)."
                                        />
                                        <ToggleSwitch
                                            enabled={formConfig.requireIdProof}
                                            onChange={(v) => setFormConfig(prev => ({ ...prev, requireIdProof: v }))}
                                            label="Government ID Proof Upload"
                                            description="Require attendee to upload Aadhar / Voter ID / Passport image."
                                        />
                                        <ToggleSwitch
                                            enabled={formConfig.requirePassport}
                                            onChange={(v) => setFormConfig(prev => ({ ...prev, requirePassport: v }))}
                                            label="Passport / ID Number (text)"
                                            description="Collect passport or Aadhar number as text."
                                        />
                                        <ToggleSwitch
                                            enabled={formConfig.requireEmergencyContact}
                                            onChange={(v) => setFormConfig(prev => ({ ...prev, requireEmergencyContact: v }))}
                                            label="Emergency Contact"
                                            description="Name and phone of emergency contact person."
                                        />
                                        <ToggleSwitch
                                            enabled={formConfig.requireDietaryPreference}
                                            onChange={(v) => setFormConfig(prev => ({ ...prev, requireDietaryPreference: v }))}
                                            label="Dietary Preference"
                                            description="Vegetarian, vegan, non-vegetarian, etc."
                                        />
                                        <ToggleSwitch
                                            enabled={formConfig.requireAllergies}
                                            onChange={(v) => setFormConfig(prev => ({ ...prev, requireAllergies: v }))}
                                            label="Allergies / Medical Conditions"
                                            description="Collect health-related information for safety."
                                        />
                                        <ToggleSwitch
                                            enabled={formConfig.requireSpecialRequests}
                                            onChange={(v) => setFormConfig(prev => ({ ...prev, requireSpecialRequests: v }))}
                                            label="Special Requests / Notes"
                                            description="Allow attendees to add custom notes."
                                        />

                                        {/* Vehicle Info */}
                                        <div className="pt-1">
                                            <ToggleSwitch
                                                enabled={formConfig.requireVehicleInfo}
                                                onChange={(v) => setFormConfig(prev => ({ ...prev, requireVehicleInfo: v }))}
                                                label="Vehicle / Transport Info"
                                                description="Ask if attendee has own vehicle or needs transport assistance."
                                            />
                                            {formConfig.requireVehicleInfo && (
                                                <div className="ml-0 mt-2 mb-2 bg-white border border-gray-200 rounded-xl p-4">
                                                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Vehicle Arrangements / Cost Note <span className="text-gray-400 font-normal">(shown to user)</span></label>
                                                    <textarea
                                                        value={formConfig.vehicleDescription}
                                                        onChange={(e) => setFormConfig(prev => ({ ...prev, vehicleDescription: e.target.value }))}
                                                        rows={3}
                                                        placeholder="e.g. Shared vehicle from Bangalore available at ₹500/person. Own vehicle parking available at venue. Fuel costs not included."
                                                        className="w-full px-3 py-2 bg-gray-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                                                    />
                                                    <p className="text-xs text-gray-400 mt-1.5">This note will be shown to the user when they select their vehicle option.</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
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
                                            <th className="py-3 px-4 text-center">Payment</th>
                                            <th className="py-3 px-4 text-center">Status</th>
                                            <th className="py-3 px-4 rounded-tr-lg text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 text-sm">
                                        {isRegLoading ? (
                                            <tr>
                                                <td colSpan={5} className="py-12 text-center text-gray-500 font-medium">Loading registrations...</td>
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
                                                        <span className={`px-2.5 py-1 text-xs font-bold rounded-lg border ${
                                                            reg.paymentMethod === 'online' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                                            reg.paymentMethod === 'screenshot' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                                            reg.paymentMethod === 'direct' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                                                            'bg-gray-50 text-gray-500 border-gray-200'
                                                        }`}>
                                                            {reg.paymentMethod === 'online' ? 'Online' :
                                                             reg.paymentMethod === 'screenshot' ? 'Screenshot' :
                                                             reg.paymentMethod === 'direct' ? 'Direct' : 'N/A'}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-4 text-center">
                                                        <span className={`px-2.5 py-1 text-xs font-bold rounded-lg border ${
                                                            reg.status === 'Registered' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
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
                                                <td colSpan={5} className="py-12 text-center text-gray-500 font-medium">No registrations found matching your criteria.</td>
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
