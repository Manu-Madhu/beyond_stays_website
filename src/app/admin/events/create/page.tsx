"use client";
import React, { useState } from 'react';
import { AdminLayout } from "@/components/admin/layout/AdminLayout";
import { FiSave, FiImage, FiUploadCloud, FiX } from "react-icons/fi";
import { useRouter } from 'next/navigation';
import { useEvents } from '@/hooks/useEvents';

export default function EventCreationPage() {
    const router = useRouter();
    const [images, setImages] = useState<string[]>([]);
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

    // Simulate image upload preview
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files).map(file => URL.createObjectURL(file));
            setImages(prev => [...prev, ...files]);
        }
    };

    const handleSaveAndPublish = async () => {
        // Format types for backend
        const payload = {
            ...formData,
            registrationFee: Number(formData.registrationFee) || 0,
            capacity: Number(formData.capacity) || 0,
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
                    </div>

                    {/* Right Column - Media & Settings */}
                    <div className="space-y-6">
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
                                <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors cursor-pointer group">
                                    <div className="w-12 h-12 bg-primary/5 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                        <FiImage className="w-6 h-6 text-primary" />
                                    </div>
                                    <div className="text-sm font-semibold text-gray-700">Click to upload main banner</div>
                                    <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP up to 5MB</p>
                                    <input type="file" className="hidden" />
                                </div>
                            </div>

                            {/* Additional Images Galley */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Event Gallery Images</label>
                                <label className="border-2 border-dashed border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors cursor-pointer group">
                                    <FiUploadCloud className="w-8 h-8 text-gray-400 group-hover:text-primary transition-colors mb-2" />
                                    <div className="text-sm font-semibold text-primary">Upload Gallery Images</div>
                                    <input type="file" multiple className="hidden" onChange={handleImageUpload} />
                                </label>

                                {images.length > 0 && (
                                    <div className="grid grid-cols-3 gap-2 mt-4">
                                        {images.map((img, idx) => (
                                            <div key={idx} className="relative aspect-square rounded-lg bg-gray-100 border overflow-hidden group">
                                                <img src={img} alt="Preview" className="w-full h-full object-cover" />
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
