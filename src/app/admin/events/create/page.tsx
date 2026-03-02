"use client";
import React, { useState } from 'react';
import { AdminLayout } from "@/components/admin/layout/AdminLayout";
import { FiSave, FiImage, FiUploadCloud, FiX } from "react-icons/fi";
import { useRouter } from 'next/navigation';
import { useEvents } from '@/hooks/useEvents';
import { AdminService } from '@/services/admin.service';
import toast from 'react-hot-toast';

export default function EventCreationPage() {
    const router = useRouter();
    const [images, setImages] = useState<any[]>([]); // To store array of {url, fileType}
    const [mainBanner, setMainBanner] = useState<{ url: string, fileType: string } | null>(null);
    const [isUploadingBanner, setIsUploadingBanner] = useState(false);
    const [isUploadingGallery, setIsUploadingGallery] = useState(false);
    const { publishEvent, isSubmitting } = useEvents();

    // Form State mapped to backend Mongoose Event schema
    const [formData, setFormData] = useState({
        title: '',
        startDate: '',
        endDate: '',
        location: '',
        description: '',
        guidelines: '',
        thingsToCarry: '',
        ageRestriction: 'No Restriction (All Ages)',
        status: 'Draft',
        registrationFee: '',
        capacity: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Upload main banner using AdminService S3 backend
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
                    toast.success("Main banner uploaded temporarily.");
                } else {
                    toast.error("Upload failed.");
                }
            } catch (error) {
                toast.error("Network error during upload.");
            } finally {
                setIsUploadingBanner(false);
            }
        }
    };

    // Simulate image upload preview
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
            } catch (error) {
                toast.error("Network error during multiple upload.");
            } finally {
                setIsUploadingGallery(false);
            }
        }
    };

    const handleSaveAndPublish = async () => {
        // Format types for backend
        const payload = {
            ...formData,
            registrationFee: Number(formData.registrationFee) || 0,
            capacity: Number(formData.capacity) || 0,
            mainBanner: mainBanner,
            gallery: images
        };

        const result = await publishEvent(payload);
        if (result.success) {
            router.push('/admin/events');
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-6 mx-auto">
                <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Create New Event</h1>
                        <p className="text-gray-500 mt-1">Fill in the details below to publish a new travel event to the website.</p>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={() => router.back()} disabled={isSubmitting} className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors">
                            Cancel
                        </button>
                        <button
                            onClick={handleSaveAndPublish}
                            disabled={isSubmitting}
                            className={`${isSubmitting ? 'bg-gray-400' : 'bg-primary hover:bg-primary/90'} text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors shadow-sm`}
                        >
                            <FiSave className="w-4 h-4" />
                            {isSubmitting ? 'Publishing...' : 'Save & Publish'}
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

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Start Date & Time *</label>
                                    <input name="startDate" value={formData.startDate} onChange={handleChange} type="datetime-local" className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">End Date & Time *</label>
                                    <input name="endDate" value={formData.endDate} onChange={handleChange} type="datetime-local" className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Location / Destination *</label>
                                <input name="location" value={formData.location} onChange={handleChange} type="text" placeholder="Location Name or Maps URL" className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Description *</label>
                                <textarea name="description" value={formData.description} onChange={handleChange} rows={5} placeholder="Describe the event, travel itinerary, and what to expect..." className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all custom-scrollbar resize-none"></textarea>
                            </div>
                        </div>

                        {/* Requirements & Guidelines */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-5">
                            <h3 className="text-lg font-bold text-gray-900 border-b pb-3 border-gray-100">Requirements & Guidelines</h3>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Important Guidelines / Rules</label>
                                <textarea name="guidelines" value={formData.guidelines} onChange={handleChange} rows={3} placeholder="List rules, terms, or conditions for this event..." className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all custom-scrollbar resize-none"></textarea>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Things to Carry</label>
                                <textarea name="thingsToCarry" value={formData.thingsToCarry} onChange={handleChange} rows={3} placeholder="List items participants need to bring..." className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all custom-scrollbar resize-none"></textarea>
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
                    </div> {/* End Left Column */}

                    {/* Right Column - Media & Settings */}
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
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Registration Fee ($)</label>
                                <input name="registrationFee" value={formData.registrationFee} onChange={handleChange} type="number" placeholder="0.00" className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Maximum Capacity</label>
                                <input name="capacity" value={formData.capacity} onChange={handleChange} type="number" placeholder="e.g. 50" className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                            </div>
                        </div>

                        {/* Media Uploads */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-5">
                            <h3 className="text-lg font-bold text-gray-900 border-b pb-3 border-gray-100">Media & Banners</h3>

                            {/* Main Banner */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Main Event Banner</label>
                                <label className={`border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center text-center transition-colors ${mainBanner ? 'bg-primary/5 min-h-32' : 'hover:bg-gray-50 cursor-pointer group'}`}>
                                    {mainBanner ? (
                                        <div className="relative w-full aspect-video rounded-lg overflow-hidden group">
                                            <img src={mainBanner.url} className="w-full h-full object-cover" />
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

                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        disabled={isUploadingBanner}
                                        onChange={handleBannerUpload}
                                    />
                                </label>
                            </div>

                            {/* Additional Images Galley */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Event Gallery Images</label>
                                <label className={`border-2 border-dashed border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center text-center transition-colors ${isUploadingGallery ? 'opacity-50 min-h-32' : 'hover:bg-gray-50 cursor-pointer group'}`}>
                                    <FiUploadCloud className="w-8 h-8 text-gray-400 group-hover:text-primary transition-colors mb-2" />
                                    <div className="text-sm font-semibold text-primary">{isUploadingGallery ? "Uploading..." : "Upload Gallery Images"}</div>
                                    <input
                                        type="file"
                                        multiple
                                        className="hidden"
                                        accept="image/*"
                                        disabled={isUploadingGallery}
                                        onChange={handleGalleryUpload}
                                    />
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
                    </div> {/* End Right Column */}
                </div> {/* End Grid */}
            </div>
        </AdminLayout>
    );
}
