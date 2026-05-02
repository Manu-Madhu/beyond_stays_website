"use client";
import React, { useState, useEffect } from 'react';
import { AdminLayout } from "@/components/admin/layout/AdminLayout";
import { FiSave, FiImage, FiUploadCloud, FiX, FiLoader, FiChevronLeft } from "react-icons/fi";
import { useRouter, useParams } from 'next/navigation';
import { useEventDetails } from '@/hooks/useEvents';
import { AdminService } from '@/services/admin.service';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { RichTextEditor } from '@/components/admin/ui/RichTextEditor';

export default function EventEditPage() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;

    const { event, isLoading } = useEventDetails(id);

    const [images, setImages] = useState<any[]>([]);
    const [mainBanner, setMainBanner] = useState<{ url: string, fileType: string } | null>(null);
    const [carouselBanners, setCarouselBanners] = useState<any[]>([]);
    const [listingBanner, setListingBanner] = useState<{ url: string, fileType: string } | null>(null);
    const [isUploadingBanner, setIsUploadingBanner] = useState(false);
    const [isUploadingCarousel, setIsUploadingCarousel] = useState(false);
    const [isUploadingListingBanner, setIsUploadingListingBanner] = useState(false);
    const [isUploadingGallery, setIsUploadingGallery] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        startDate: '',
        endDate: '',
        location: '',
        description: '',
        guidelines: '',
        thingsToCarry: '',
        itinerary: '',
        inclusions: '',
        exclusions: '',
        whoCanJoin: '',
        whyJoin: '',
        ageRestriction: 'No Restriction (All Ages)',
        status: 'Draft',
        registrationFee: '',
        capacity: '',
        bannerType: 'single' as 'single' | 'carousel'
    });

    const [registrationForm, setRegistrationForm] = useState({
        paymentType: 'online',
        enableOnlinePayment: true,
        enablePaidScreenshot: false,
        enableDirectPay: false,
        upiId: '',
        bankDetails: ''
    });

    // Populate form when event data loads
    useEffect(() => {
        if (event) {
            const toLocalDatetime = (dateStr: string) => {
                if (!dateStr) return '';
                const d = new Date(dateStr);
                const offset = d.getTimezoneOffset() * 60000;
                return new Date(d.getTime() - offset).toISOString().slice(0, 16);
            };

            setFormData({
                title: event.title || '',
                startDate: toLocalDatetime(event.startDate),
                endDate: toLocalDatetime(event.endDate),
                location: event.location || '',
                description: event.description || '',
                guidelines: event.guidelines || '',
                thingsToCarry: event.thingsToCarry || '',
                itinerary: event.itinerary || '',
                inclusions: event.inclusions || '',
                exclusions: event.exclusions || '',
                whoCanJoin: event.whoCanJoin || '',
                whyJoin: event.whyJoin || '',
                ageRestriction: event.ageRestriction || 'No Restriction (All Ages)',
                status: event.status || 'Draft',
                registrationFee: event.registrationFee?.toString() || '',
                capacity: event.capacity?.toString() || '',
                bannerType: event.bannerType || 'single'
            });

            if (event.mainBanner) {
                setMainBanner({
                    url: event.mainBanner.url || event.mainBanner.location || '',
                    fileType: event.mainBanner.fileType || 'image/jpeg'
                });
            }
            if (event.listingBanner) {
                setListingBanner({
                    url: event.listingBanner.url || event.listingBanner.location || '',
                    fileType: event.listingBanner.fileType || 'image/jpeg'
                });
            }
            if (event.banners && event.banners.length > 0) {
                setCarouselBanners(event.banners.map((img: any) => ({
                    url: img.url || img.location || '',
                    fileType: img.fileType || 'image/jpeg'
                })));
            }
            if (event.gallery && event.gallery.length > 0) {
                setImages(event.gallery.map((img: any) => ({
                    url: img.url || img.location || '',
                    fileType: img.fileType || 'image/jpeg'
                })));
            }
            
            if (event.registrationForm) {
                setRegistrationForm({
                    paymentType: event.registrationForm.paymentType || 'online',
                    enableOnlinePayment: event.registrationForm.enableOnlinePayment ?? true,
                    enablePaidScreenshot: event.registrationForm.enablePaidScreenshot ?? false,
                    enableDirectPay: event.registrationForm.enableDirectPay ?? false,
                    upiId: event.registrationForm.upiId || '',
                    bankDetails: event.registrationForm.bankDetails || ''
                });
            }
        }
    }, [event]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleRegFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
        
        setRegistrationForm(prev => {
            const updated = { ...prev, [name]: val };
            if (name === 'paymentType') {
                if (value === 'online') {
                    updated.enableOnlinePayment = true;
                    updated.enablePaidScreenshot = false;
                } else if (value === 'manual') {
                    updated.enableOnlinePayment = false;
                    updated.enablePaidScreenshot = true;
                } else if (value === 'both') {
                    updated.enableOnlinePayment = true;
                    updated.enablePaidScreenshot = true;
                }
            }
            return updated;
        });
    };

    const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            if (file.size > 5 * 1024 * 1024) return toast.error("File limit is 5MB");

            setIsUploadingBanner(true);
            const uploadData = new FormData();
            uploadData.append('file', file);
            try {
                const { data } = await AdminService.uploadSingleFile(uploadData);
                if (data?.success && data?.data) {
                    setMainBanner({ url: data.data.url, fileType: data.data.fileType });
                    toast.success("Main banner uploaded.");
                } else {
                    toast.error("Upload failed.");
                }
            } catch {
                toast.error("Network error during upload.");
            } finally {
                setIsUploadingBanner(false);
            }
        }
    };

    const handleListingBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            if (file.size > 5 * 1024 * 1024) return toast.error("File limit is 5MB");

            setIsUploadingListingBanner(true);
            const uploadData = new FormData();
            uploadData.append('file', file);
            try {
                const { data } = await AdminService.uploadSingleFile(uploadData);
                if (data?.success && data?.data) {
                    setListingBanner({ url: data.data.url, fileType: data.data.fileType });
                    toast.success("Listing banner uploaded.");
                } else {
                    toast.error("Upload failed.");
                }
            } catch {
                toast.error("Network error during upload.");
            } finally {
                setIsUploadingListingBanner(false);
            }
        }
    };

    const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            if (images.length + e.target.files.length > 15) return toast.error("Maximum 15 gallery images allowed.");

            setIsUploadingGallery(true);
            const uploadData = new FormData();
            Array.from(e.target.files).forEach(file => {
                if (file.size <= 5 * 1024 * 1024) uploadData.append('files', file);
            });
            try {
                const { data } = await AdminService.uploadMultipleFiles(uploadData);
                if (data?.success && data?.data) {
                    const mappedImgs = data.data.map((f: any) => ({ url: f.url, fileType: f.fileType }));
                    setImages(prev => [...prev, ...mappedImgs]);
                    toast.success("Gallery images added.");
                } else {
                    toast.error("Upload failed.");
                }
            } catch {
                toast.error("Network error during multiple upload.");
            } finally {
                setIsUploadingGallery(false);
            }
        }
    };

    const handleUpdate = async () => {
        if (!formData.title || !formData.startDate || !formData.endDate || !formData.location || !formData.description) {
            toast.error("Please fill in all required fields.");
            return;
        }

        setIsSubmitting(true);
        try {
            const payload = {
                ...formData,
                registrationFee: Number(formData.registrationFee) || 0,
                capacity: Number(formData.capacity) || 0,
                mainBanner: mainBanner ? { ...mainBanner, location: mainBanner.url } : null,
                banners: carouselBanners.map(img => ({ ...img, location: img.url })),
                listingBanner: listingBanner ? { ...listingBanner, location: listingBanner.url } : null,
                gallery: images.map(img => ({ ...img, location: img.url })),
                registrationForm: registrationForm
            };

            const { data } = await AdminService.updateEvent(id, payload);
            if (data?.success) {
                toast.success("Event updated successfully!");
                router.push(`/admin/events/${id}`);
            } else {
                toast.error(data?.message || "Failed to update event.");
            }
        } catch {
            toast.error("An error occurred while updating the event.");
        } finally {
            setIsSubmitting(false);
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
            <div className="space-y-6 mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4">
                        <Link href={`/admin/events/${id}`} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors">
                            <FiChevronLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Edit Event</h1>
                            <p className="text-gray-500 mt-0.5 text-sm">Update the details for <span className="font-semibold text-gray-700">{event?.title}</span></p>
                        </div>
                    </div>
                    <div className="flex gap-3 mt-2 md:mt-0">
                        <Link href={`/admin/events/${id}`} className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors">
                            Cancel
                        </Link>
                        <button
                            onClick={handleUpdate}
                            disabled={isSubmitting}
                            className={`${isSubmitting ? 'bg-gray-400' : 'bg-primary hover:bg-primary/90'} text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors shadow-sm`}
                        >
                            {isSubmitting ? <FiLoader className="w-4 h-4 animate-spin" /> : <FiSave className="w-4 h-4" />}
                            {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Main Details */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-5">
                            <h3 className="text-lg font-bold text-gray-900 border-b pb-3 border-gray-100">Basic Information</h3>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Event Title *</label>
                                <input name="title" value={formData.title} onChange={handleChange} type="text" placeholder="e.g. Himalayas Winter Trek" className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Start Date & Time */}
                                <div className="space-y-3">
                                    <label className="block text-sm font-semibold text-gray-700">Start Date & Time *</label>
                                    <div className="flex flex-wrap gap-2">
                                        <input 
                                            type="date" 
                                            value={formData.startDate.split('T')[0]} 
                                            onChange={(e) => {
                                                const time = formData.startDate.split('T')[1] || "09:00";
                                                setFormData(prev => ({ ...prev, startDate: `${e.target.value}T${time}` }));
                                            }}
                                            className="flex-1 min-w-[140px] px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all" 
                                        />
                                        <div className="flex gap-1 bg-gray-50 p-1 rounded-xl">
                                            <select 
                                                className="bg-transparent border-none text-sm font-bold focus:ring-0 outline-none"
                                                value={(() => {
                                                    const time = (formData.startDate.includes('T') ? formData.startDate.split('T')[1] : "") || "09:00";
                                                    let h = parseInt(time.split(':')[0]);
                                                    return h === 0 ? 12 : (h > 12 ? h - 12 : h);
                                                })()}
                                                onChange={(e) => {
                                                    const date = formData.startDate.split('T')[0] || new Date().toISOString().split('T')[0];
                                                    const time = (formData.startDate.includes('T') ? formData.startDate.split('T')[1] : "") || "09:00";
                                                    const isPm = parseInt(time.split(':')[0]) >= 12;
                                                    let h = parseInt(e.target.value);
                                                    if (isPm && h < 12) h += 12;
                                                    if (!isPm && h === 12) h = 0;
                                                    const newTime = `${h.toString().padStart(2, '0')}:${time.split(':')[1] || "00"}`;
                                                    setFormData(prev => ({ ...prev, startDate: `${date}T${newTime}` }));
                                                }}
                                            >
                                                {[...Array(12)].map((_, i) => <option key={i+1} value={i+1}>{i+1}</option>)}
                                            </select>
                                            <span className="flex items-center text-gray-400">:</span>
                                            <select 
                                                className="bg-transparent border-none text-sm font-bold focus:ring-0 outline-none"
                                                value={(formData.startDate.includes('T') ? formData.startDate.split('T')[1]?.split(':')[1] : "") || "00"}
                                                onChange={(e) => {
                                                    const date = formData.startDate.split('T')[0] || new Date().toISOString().split('T')[0];
                                                    const time = (formData.startDate.includes('T') ? formData.startDate.split('T')[1] : "") || "09:00";
                                                    const newTime = `${time.split(':')[0] || "09"}:${e.target.value}`;
                                                    setFormData(prev => ({ ...prev, startDate: `${date}T${newTime}` }));
                                                }}
                                            >
                                                {["00", "15", "30", "45"].map(m => <option key={m} value={m}>{m}</option>)}
                                            </select>
                                            <select 
                                                className="bg-transparent border-none text-xs font-black text-primary focus:ring-0 outline-none"
                                                value={(() => {
                                                    const time = (formData.startDate.includes('T') ? formData.startDate.split('T')[1] : "") || "09:00";
                                                    return parseInt(time.split(':')[0]) >= 12 ? "PM" : "AM";
                                                })()}
                                                onChange={(e) => {
                                                    const date = formData.startDate.split('T')[0] || new Date().toISOString().split('T')[0];
                                                    const time = (formData.startDate.includes('T') ? formData.startDate.split('T')[1] : "") || "09:00";
                                                    let h = parseInt(time.split(':')[0]);
                                                    const isPm = e.target.value === "PM";
                                                    if (isPm && h < 12) h += 12;
                                                    if (!isPm && h >= 12) h -= 12;
                                                    const newTime = `${h.toString().padStart(2, '0')}:${time.split(':')[1] || "00"}`;
                                                    setFormData(prev => ({ ...prev, startDate: `${date}T${newTime}` }));
                                                }}
                                            >
                                                <option value="AM">AM</option>
                                                <option value="PM">PM</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* End Date & Time */}
                                <div className="space-y-3">
                                    <label className="block text-sm font-semibold text-gray-700">End Date & Time *</label>
                                    <div className="flex flex-wrap gap-2">
                                        <input 
                                            type="date" 
                                            value={formData.endDate.split('T')[0]} 
                                            onChange={(e) => {
                                                const time = formData.endDate.split('T')[1] || "18:00";
                                                setFormData(prev => ({ ...prev, endDate: `${e.target.value}T${time}` }));
                                            }}
                                            className="flex-1 min-w-[140px] px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all" 
                                        />
                                        <div className="flex gap-1 bg-gray-50 p-1 rounded-xl">
                                            <select 
                                                className="bg-transparent border-none text-sm font-bold focus:ring-0 outline-none"
                                                value={(() => {
                                                    const time = (formData.endDate.includes('T') ? formData.endDate.split('T')[1] : "") || "18:00";
                                                    let h = parseInt(time.split(':')[0]);
                                                    return h === 0 ? 12 : (h > 12 ? h - 12 : h);
                                                })()}
                                                onChange={(e) => {
                                                    const date = formData.endDate.split('T')[0] || new Date().toISOString().split('T')[0];
                                                    const time = (formData.endDate.includes('T') ? formData.endDate.split('T')[1] : "") || "18:00";
                                                    const isPm = parseInt(time.split(':')[0]) >= 12;
                                                    let h = parseInt(e.target.value);
                                                    if (isPm && h < 12) h += 12;
                                                    if (!isPm && h === 12) h = 0;
                                                    const newTime = `${h.toString().padStart(2, '0')}:${time.split(':')[1] || "00"}`;
                                                    setFormData(prev => ({ ...prev, endDate: `${date}T${newTime}` }));
                                                }}
                                            >
                                                {[...Array(12)].map((_, i) => <option key={i+1} value={i+1}>{i+1}</option>)}
                                            </select>
                                            <span className="flex items-center text-gray-400">:</span>
                                            <select 
                                                className="bg-transparent border-none text-sm font-bold focus:ring-0 outline-none"
                                                value={(formData.endDate.includes('T') ? formData.endDate.split('T')[1]?.split(':')[1] : "") || "00"}
                                                onChange={(e) => {
                                                    const date = formData.endDate.split('T')[0] || new Date().toISOString().split('T')[0];
                                                    const time = (formData.endDate.includes('T') ? formData.endDate.split('T')[1] : "") || "18:00";
                                                    const newTime = `${time.split(':')[0] || "18"}:${e.target.value}`;
                                                    setFormData(prev => ({ ...prev, endDate: `${date}T${newTime}` }));
                                                }}
                                            >
                                                {["00", "15", "30", "45"].map(m => <option key={m} value={m}>{m}</option>)}
                                            </select>
                                            <select 
                                                className="bg-transparent border-none text-xs font-black text-primary focus:ring-0 outline-none"
                                                value={(() => {
                                                    const time = (formData.endDate.includes('T') ? formData.endDate.split('T')[1] : "") || "18:00";
                                                    return parseInt(time.split(':')[0]) >= 12 ? "PM" : "AM";
                                                })()}
                                                onChange={(e) => {
                                                    const date = formData.endDate.split('T')[0] || new Date().toISOString().split('T')[0];
                                                    const time = (formData.endDate.includes('T') ? formData.endDate.split('T')[1] : "") || "18:00";
                                                    let h = parseInt(time.split(':')[0]);
                                                    const isPm = e.target.value === "PM";
                                                    if (isPm && h < 12) h += 12;
                                                    if (!isPm && h >= 12) h -= 12;
                                                    const newTime = `${h.toString().padStart(2, '0')}:${time.split(':')[1] || "00"}`;
                                                    setFormData(prev => ({ ...prev, endDate: `${date}T${newTime}` }));
                                                }}
                                            >
                                                <option value="AM">AM</option>
                                                <option value="PM">PM</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Location / Destination *</label>
                                <input name="location" value={formData.location} onChange={handleChange} type="text" placeholder="Location Name or Maps URL" className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Description *</label>
                                <RichTextEditor 
                                    value={formData.description} 
                                    onChange={(content) => setFormData(prev => ({ ...prev, description: content }))}
                                    placeholder="Describe the event, travel itinerary, and what to expect..."
                                />
                            </div>
                        </div>

                        {/* Requirements & Guidelines */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-5">
                            <h3 className="text-lg font-bold text-gray-900 border-b pb-3 border-gray-100">Requirements &amp; Guidelines</h3>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Itinerary Overview</label>
                                <RichTextEditor 
                                    value={formData.itinerary} 
                                    onChange={(content) => setFormData(prev => ({ ...prev, itinerary: content }))}
                                    placeholder="Day-by-day plan for the trip..."
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Inclusions</label>
                                    <RichTextEditor 
                                        value={formData.inclusions} 
                                        onChange={(content) => setFormData(prev => ({ ...prev, inclusions: content }))}
                                        placeholder="What is included in the package (e.g., Food, Stay, Guide)..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Exclusions</label>
                                    <RichTextEditor 
                                        value={formData.exclusions} 
                                        onChange={(content) => setFormData(prev => ({ ...prev, exclusions: content }))}
                                        placeholder="What is NOT included..."
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Who Can Join?</label>
                                    <RichTextEditor 
                                        value={formData.whoCanJoin} 
                                        onChange={(content) => setFormData(prev => ({ ...prev, whoCanJoin: content }))}
                                        placeholder="Target audience, fitness level, etc..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Why Join This Trip?</label>
                                    <RichTextEditor 
                                        value={formData.whyJoin} 
                                        onChange={(content) => setFormData(prev => ({ ...prev, whyJoin: content }))}
                                        placeholder="Unique highlights and reasons to book..."
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Important Guidelines / Rules</label>
                                <RichTextEditor 
                                    value={formData.guidelines} 
                                    onChange={(content) => setFormData(prev => ({ ...prev, guidelines: content }))}
                                    placeholder="List rules, terms, or conditions for this event..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Things to Carry</label>
                                <RichTextEditor 
                                    value={formData.thingsToCarry} 
                                    onChange={(content) => setFormData(prev => ({ ...prev, thingsToCarry: content }))}
                                    placeholder="List items participants need to bring..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Age Restriction</label>
                                <select name="ageRestriction" value={formData.ageRestriction} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium text-gray-800">
                                    <option value="No Restriction (All Ages)">No Restriction (All Ages)</option>
                                    <option value="12+ Years">12+ Years</option>
                                    <option value="18+ Years (Adults Only)">18+ Years (Adults Only)</option>
                                    <option value="21+ Years">21+ Years</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6 lg:col-span-1">
                        {/* Event Settings */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-5">
                            <h3 className="text-lg font-bold text-gray-900 border-b pb-3 border-gray-100">Event Settings</h3>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Status</label>
                                <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium text-gray-800">
                                    <option value="Draft">Draft</option>
                                    <option value="Active (Published)">Active (Published)</option>
                                    <option value="Passed">Passed</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Registration Fee (₹)</label>
                                <input name="registrationFee" value={formData.registrationFee} onChange={handleChange} type="number" placeholder="0.00" className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Maximum Capacity</label>
                                <input name="capacity" value={formData.capacity} onChange={handleChange} type="number" placeholder="e.g. 50" className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                            </div>
                        </div>

                        {/* Payment Settings */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-5">
                            <h3 className="text-lg font-bold text-gray-900 border-b pb-3 border-gray-100">Payment Settings</h3>
                            
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Payment Type</label>
                                <select 
                                    name="paymentType" 
                                    value={registrationForm.paymentType} 
                                    onChange={handleRegFormChange} 
                                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium text-gray-800"
                                >
                                    <option value="online">Online Payment Only</option>
                                    <option value="manual">Manual Payment Only</option>
                                    <option value="both">Both (Online & Manual)</option>
                                </select>
                            </div>

                            {(registrationForm.paymentType === 'manual' || registrationForm.paymentType === 'both') && (
                                <>
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                        <input 
                                            type="checkbox" 
                                            name="enablePaidScreenshot" 
                                            id="enablePaidScreenshot"
                                            checked={registrationForm.enablePaidScreenshot}
                                            onChange={handleRegFormChange}
                                            className="w-5 h-5 text-primary rounded border-gray-300 focus:ring-primary"
                                        />
                                        <label htmlFor="enablePaidScreenshot" className="text-sm font-medium text-gray-700 cursor-pointer">
                                            Allow User to Upload Payment Screenshot
                                        </label>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">UPI ID (Optional)</label>
                                        <input 
                                            name="upiId" 
                                            value={registrationForm.upiId} 
                                            onChange={handleRegFormChange} 
                                            type="text" 
                                            placeholder="e.g. beyondstays@upi" 
                                            className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all" 
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Bank Details (Optional)</label>
                                        <textarea 
                                            name="bankDetails" 
                                            value={registrationForm.bankDetails} 
                                            onChange={handleRegFormChange} 
                                            rows={2} 
                                            placeholder="A/C No, IFSC, etc." 
                                            className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all custom-scrollbar resize-none"
                                        />
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Media Uploads */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-5">
                            <h3 className="text-lg font-bold text-gray-900 border-b pb-3 border-gray-100">Media &amp; Banners</h3>

                            {/* Banner Type Selection */}
                            <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-100">
                                <button
                                    onClick={() => setFormData(prev => ({ ...prev, bannerType: 'single' }))}
                                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${formData.bannerType === 'single' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    Single Banner
                                </button>
                                <button
                                    onClick={() => setFormData(prev => ({ ...prev, bannerType: 'carousel' }))}
                                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${formData.bannerType === 'carousel' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    Hero Carousel
                                </button>
                            </div>

                            {/* Single Banner Upload */}
                            {formData.bannerType === 'single' ? (
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Main Event Banner</label>
                                    <label className={`border-2 border-dashed border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center text-center transition-colors ${mainBanner ? 'bg-primary/5 min-h-32' : 'hover:bg-gray-50 cursor-pointer group'}`}>
                                        {mainBanner ? (
                                            <div className="relative w-full aspect-video rounded-lg overflow-hidden group">
                                                <img src={mainBanner.url} className="w-full h-full object-cover" alt="Main banner" />
                                                <button onClick={(e) => { e.preventDefault(); setMainBanner(null); }} className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <FiX size={14} />
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="w-12 h-12 bg-primary/5 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                                    <FiImage className="w-6 h-6 text-primary" />
                                                </div>
                                                <div className="text-sm font-semibold text-gray-700">{isUploadingBanner ? "Uploading..." : "Click to upload main banner"}</div>
                                                <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP up to 5MB</p>
                                            </>
                                        )}
                                        <input type="file" className="hidden" accept="image/*" disabled={isUploadingBanner} onChange={handleBannerUpload} />
                                    </label>
                                </div>
                            ) : (
                                /* Carousel Banners Upload */
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Carousel Slides (Max 5)</label>
                                    <div className="grid grid-cols-2 gap-2 mb-4">
                                        {carouselBanners.map((img, idx) => (
                                            <div key={idx} className="relative aspect-video rounded-lg bg-gray-100 border overflow-hidden group">
                                                <img src={img.url} alt="Carousel slide" className="w-full h-full object-cover" />
                                                <button onClick={() => setCarouselBanners(carouselBanners.filter((_, i) => i !== idx))} type="button" className="absolute top-1 right-1 bg-black/50 hover:bg-red-500 text-white p-1 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <FiX size={12} />
                                                </button>
                                            </div>
                                        ))}
                                        {carouselBanners.length < 5 && (
                                            <label className={`aspect-video border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center transition-colors cursor-pointer hover:bg-gray-50 ${isUploadingCarousel ? 'opacity-50' : ''}`}>
                                                <FiUploadCloud className="w-6 h-6 text-gray-400" />
                                                <span className="text-[10px] font-bold text-gray-500 uppercase mt-1">{isUploadingCarousel ? '...' : 'Add Slide'}</span>
                                                <input 
                                                    type="file" 
                                                    className="hidden" 
                                                    accept="image/*" 
                                                    disabled={isUploadingCarousel} 
                                                    onChange={async (e) => {
                                                        const file = e.target.files?.[0];
                                                        if (!file) return;
                                                        setIsUploadingCarousel(true);
                                                        const fd = new FormData();
                                                        fd.append('file', file);
                                                        try {
                                                            const { data } = await AdminService.uploadSingleFile(fd);
                                                            if (data?.success && data?.data) {
                                                                setCarouselBanners(prev => [...prev, { url: data.data.url, fileType: data.data.fileType }]);
                                                                toast.success("Slide added.");
                                                            }
                                                        } catch { toast.error("Upload failed."); }
                                                        setIsUploadingCarousel(false);
                                                    }} 
                                                />
                                            </label>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Listing Banner */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Listing / Card Banner (Vertical Ratio)</label>
                                <label className={`border-2 border-dashed border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center text-center transition-colors ${listingBanner ? 'bg-primary/5 min-h-32' : 'hover:bg-gray-50 cursor-pointer group'}`}>
                                    {listingBanner ? (
                                        <div className="relative w-24 aspect-[3/4] rounded-lg overflow-hidden group">
                                            <img src={listingBanner.url} className="w-full h-full object-cover" alt="Listing banner" />
                                            <button onClick={(e) => { e.preventDefault(); setListingBanner(null); }} className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                                <FiX size={14} />
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="w-12 h-12 bg-primary/5 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                                <FiImage className="w-6 h-6 text-primary" />
                                            </div>
                                            <div className="text-sm font-semibold text-gray-700">{isUploadingListingBanner ? "Uploading..." : "Click to upload listing banner"}</div>
                                            <p className="text-xs text-gray-400 mt-1">Ideal for cards (3:4 ratio)</p>
                                        </>
                                    )}
                                    <input type="file" className="hidden" accept="image/*" disabled={isUploadingListingBanner} onChange={handleListingBannerUpload} />
                                </label>
                            </div>

                            {/* Gallery */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Event Gallery Images</label>
                                <label className={`border-2 border-dashed border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center text-center transition-colors ${isUploadingGallery ? 'opacity-50 min-h-24' : 'hover:bg-gray-50 cursor-pointer group'}`}>
                                    <FiUploadCloud className="w-8 h-8 text-gray-400 group-hover:text-primary transition-colors mb-2" />
                                    <div className="text-sm font-semibold text-primary">{isUploadingGallery ? "Uploading..." : "Upload Gallery Images"}</div>
                                    <input type="file" multiple className="hidden" accept="image/*" disabled={isUploadingGallery} onChange={handleGalleryUpload} />
                                </label>

                                {images.length > 0 && (
                                    <div className="grid grid-cols-3 gap-2 mt-4">
                                        {images.map((img, idx) => (
                                            <div key={idx} className="relative aspect-square rounded-lg bg-gray-100 border overflow-hidden group">
                                                <img src={img.url} alt="Preview" className="w-full h-full object-cover" />
                                                <button onClick={() => setImages(images.filter((_, i) => i !== idx))} type="button" className="absolute top-1 right-1 bg-black/50 hover:bg-red-500 text-white p-1 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <FiX size={12} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
