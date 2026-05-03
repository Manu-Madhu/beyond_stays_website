"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    FiMapPin, FiCalendar, FiUser, FiArrowLeft, FiCheck, FiLoader, FiAlertCircle, FiCheckCircle
} from 'react-icons/fi';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { PublicService } from '@/services/public.service';

const API_BASE = (process.env.NEXT_PUBLIC_ADMIN_API_URL || 'http://127.0.0.1:8080/api/v1').replace('/v1', '/v2');

type PaymentMethod = 'online' | 'screenshot' | 'direct' | '';

interface EventData {
    _id: string;
    slug?: string;
    title: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string;
    registrationFee: number;
    capacity: number;
    ageRestriction: string;
    status: string;
    bannerType?: 'single' | 'carousel';
    mainBanner?: { url: string };
    banners?: { url: string }[];
    gallery?: { url: string }[];
    registrationForm?: {
        customNaming?: string;
        requirePhone?: boolean;
        requirePassport?: boolean;
        requireAllergies?: boolean;
        requireEmergencyContact?: boolean;
        requireDietaryPreference?: boolean;
        requireSpecialRequests?: boolean;
        requireAddress?: boolean;
        requireIdProof?: boolean;
        requirePersonCount?: boolean;
        requireVehicleInfo?: boolean;
        vehicleDescription?: string;
        enableOnlinePayment?: boolean;
        enablePaidScreenshot?: boolean;
        enableDirectPay?: boolean;
        upiId?: string;
        bankDetails?: string;
    };
}

export default function RegistrationClient({ initialEvent }: { initialEvent: any }) {
    const params = useParams();
    const router = useRouter();
    const slug = params?.slug as string;

    const [event, setEvent] = useState<EventData | null>(initialEvent || null);
    const [isLoading, setIsLoading] = useState(!initialEvent);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');

    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('');
    const [screenshotPreview, setScreenshotPreview] = useState<string>('');
    const [isUploadingScreenshot, setIsUploadingScreenshot] = useState(false);
    const screenshotInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        user: '',
        email: '',
        phone: '',
        address: '',
        personCount: 1,
        vehicleOption: '',
        passportId: '',
        allergies: '',
        emergencyContactName: '',
        emergencyContactPhone: '',
        dietaryPreference: '',
        specialRequests: ''
    });

    const [idProofFile, setIdProofFile] = useState<{ url: string; fileType: string } | null>(null);
    const [isUploadingIdProof, setIsUploadingIdProof] = useState(false);
    const [uploadedScreenshot, setUploadedScreenshot] = useState<{ url: string; fileType: string } | null>(null);

    // Fetch Event Data if not provided
    useEffect(() => {
        if (initialEvent) {
            setEvent(initialEvent);
            setIsLoading(false);
            return;
        }

        const fetchEvent = async () => {
            try {
                const { data: slugData } = await PublicService.getEventBySlug(slug);
                if (slugData?.success) {
                    setEvent(slugData.data);
                } else {
                    const { data } = await PublicService.getEventById(slug);
                    if (data?.success) {
                        setEvent(data.data);
                    } else {
                        setError(data?.message || 'Event not found.');
                    }
                }
            } catch {
                setError('Failed to load event.');
            } finally {
                setIsLoading(false);
            }
        };
        if (slug && !initialEvent) fetchEvent();
    }, [slug, initialEvent]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleIdProofUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setIsUploadingIdProof(true);
        const fd = new FormData();
        fd.append('file', file);
        try {
            const res = await fetch(`${API_BASE}/public-uploads/single`, { method: 'POST', body: fd });
            const json = await res.json();
            if (json.success && json.data) {
                setIdProofFile({ url: json.data.url, fileType: json.data.fileType });
                toast.success('ID Proof uploaded!');
            }
        } catch {
            toast.error('ID Proof upload failed.');
        } finally {
            setIsUploadingIdProof(false);
        }
    };

    const handleScreenshotSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) { toast.error('Screenshot must be under 5MB'); return; }

        setScreenshotPreview(URL.createObjectURL(file));
        setIsUploadingScreenshot(true);
        const fd = new FormData();
        fd.append('file', file);
        try {
            const res = await fetch(`${API_BASE}/public-uploads/single`, { method: 'POST', body: fd });
            const json = await res.json();
            if (json.success && json.data) {
                setUploadedScreenshot({ url: json.data.url, fileType: json.data.fileType });
                toast.success('Screenshot uploaded!');
            } else {
                toast.error('Screenshot upload failed.');
            }
        } catch {
            toast.error('Could not upload screenshot.');
        } finally {
            setIsUploadingScreenshot(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.user.trim() || !formData.email.trim()) {
            toast.error('Name and email are required.');
            return;
        }

        if (event?.registrationFee && event.registrationFee > 0 && !paymentMethod) {
            toast.error('Please select a payment method.');
            return;
        }

        if (paymentMethod === 'screenshot' && !uploadedScreenshot) {
            toast.error('Please upload your payment screenshot.');
            return;
        }

        setIsSubmitting(true);
        try {
            const payload: any = {
                ...formData,
                paymentMethod: paymentMethod || 'direct',
                idProof: idProofFile ? { ...idProofFile, location: idProofFile.url } : undefined,
                ...(paymentMethod === 'screenshot' && uploadedScreenshot && { paymentScreenshot: { ...uploadedScreenshot, location: uploadedScreenshot.url } })
            };

            const targetId = event?._id || slug;
            const { data } = await PublicService.registerForEvent(targetId, payload);

            if (data?.success) {
                setIsSuccess(true);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                toast.error(data?.message || 'Registration failed.');
            }
        } catch {
            toast.error('Network error. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto"></div>
                    <p className="text-gray-500 font-semibold text-sm">Loading Registration...</p>
                </div>
            </div>
        );
    }

    if (error || !event) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
                <div className="max-w-md w-full text-center space-y-6">
                    <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
                        <FiAlertCircle className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Registration Unavailable</h2>
                    <p className="text-gray-500">{error || 'This event portal is closed or the link is invalid.'}</p>
                    <Link href="/" className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-all">
                        Return Home
                    </Link>
                </div>
            </div>
        );
    }

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
                <div className="max-w-lg w-full bg-white rounded-lg shadow-sm border border-gray-200 p-10 text-center space-y-6">
                    <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                        <FiCheck className="w-10 h-10" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">Registration Complete</h2>
                        <p className="text-gray-600 mt-2">
                            You have successfully registered for <br />
                            <span className="font-semibold text-black">{event.title}</span>
                        </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-6 text-left border border-gray-100">
                        <div className="space-y-4">
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-semibold">Date</p>
                                <p className="text-sm font-semibold text-gray-900">{new Date(event.startDate).toLocaleDateString()}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-semibold">Location</p>
                                <p className="text-sm font-semibold text-gray-900">{event.location}</p>
                            </div>
                        </div>
                    </div>
                    <p className="text-sm text-gray-500">A confirmation has been sent to your email.</p>
                    <Link href={`/events/${event.slug || event._id}`} className="block w-full bg-gray-900 text-white py-4 rounded-lg font-semibold hover:bg-black transition-all">
                        Back to Event
                    </Link>
                </div>
            </div>
        );
    }

    const rf = event.registrationForm || {};
    const enabledPaymentMethods = [
        rf.enableOnlinePayment && 'online',
        rf.enablePaidScreenshot && 'screenshot',
        rf.enableDirectPay && 'direct',
    ].filter(Boolean) as PaymentMethod[];

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Standard Hero Section */}
            <div className="relative h-[45vh] overflow-hidden bg-gray-900">
                <img
                    src={event.mainBanner?.url || "/assets/travel_placeholder.png"}
                    className="w-full h-full object-cover opacity-50"
                    alt="Hero"
                />
                <div className="absolute top-6 left-6 z-20">
                    <button onClick={() => router.back()} className="p-2.5 bg-black/40 backdrop-blur-md rounded-full text-white hover:bg-black/60 transition-all border border-white/20">
                        <FiArrowLeft size={20} />
                    </button>
                </div>
                <div className="absolute bottom-8 left-6 md:left-12 z-20 w-full ">
                    <div className='max-w-[1350px] mx-auto w-full'>

                        <h1 className="text-3xl md:text-4xl font-black text-white uppercase italic tracking-tight">{event.title}</h1>
                        <div className="flex items-center gap-4 mt-2 text-white/90 text-sm font-medium">
                            <span className="flex items-center gap-1"><FiMapPin /> {event.location}</span>
                            <span className="flex items-center gap-1"><FiCalendar /> {new Date(event.startDate).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
            </div>

            <main className="max-w-[1000px] mx-auto px-4 md:px-8 mt-10">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 md:p-12">
                    <div className="mb-10 border-b border-gray-100 pb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Event Registration</h2>
                        <p className="text-gray-500 mt-2 text-sm">Please fill out the form below to secure your spot.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-10">
                        {/* Attendee Info */}
                        <div className="space-y-6">
                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <FiUser className="text-primary" /> Attendee Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Full Name *</label>
                                    <input type="text" name="user" value={formData.user} onChange={handleChange} required className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm" placeholder="John Doe" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Email Address *</label>
                                    <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm" placeholder="john@example.com" />
                                </div>
                                {rf.requirePhone && (
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">Phone Number *</label>
                                        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm" placeholder="+91 9876543210" />
                                    </div>
                                )}
                                {rf.requirePersonCount && (
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">Number of People</label>
                                        <input type="number" name="personCount" value={formData.personCount} onChange={handleChange} min="1" className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm" />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Logistics, ID & Health */}
                        {(rf.requireAddress || rf.requirePassport || rf.requireIdProof || rf.requireVehicleInfo || rf.requireEmergencyContact || rf.requireDietaryPreference || rf.requireAllergies || rf.requireSpecialRequests) && (
                            <div className="space-y-10 pt-8 border-t border-gray-100">

                                {/* Logistics & ID */}
                                {(rf.requireAddress || rf.requirePassport || rf.requireIdProof || rf.requireVehicleInfo) && (
                                    <div className="space-y-6">
                                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                            <FiMapPin className="text-primary" /> Logistics & ID Proof
                                        </h3>
                                        <div className="grid grid-cols-1 gap-6">
                                            {rf.requireAddress && (
                                                <div className="space-y-2">
                                                    <label className="text-sm font-semibold text-gray-700">Full Address *</label>
                                                    <textarea name="address" rows={2} value={formData.address} onChange={handleChange} required className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm resize-none" placeholder="Enter your full residential address" />
                                                </div>
                                            )}

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {rf.requirePassport && (
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-semibold text-gray-700">Gov ID / Passport Number *</label>
                                                        <input type="text" name="passportId" value={formData.passportId} onChange={handleChange} required className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm" placeholder="Aadhar / Passport Number" />
                                                    </div>
                                                )}
                                                {rf.requireIdProof && (
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-semibold text-gray-700">ID Proof Upload *</label>
                                                        <div
                                                            onClick={() => document.getElementById('idProofInp')?.click()}
                                                            className={`relative h-24 border-2 border-dashed rounded-lg cursor-pointer flex flex-col items-center justify-center transition-all ${idProofFile ? 'border-primary bg-primary/5' : 'border-gray-300 hover:bg-gray-50'}`}
                                                        >
                                                            {isUploadingIdProof ? (
                                                                <FiLoader className="animate-spin text-primary" />
                                                            ) : idProofFile ? (
                                                                <>
                                                                    {idProofFile.fileType.startsWith('image') ? (
                                                                        <img src={idProofFile.url} className="h-full w-full object-cover rounded-lg" />
                                                                    ) : (
                                                                        <span className="text-primary font-bold text-xs uppercase">PDF Attached</span>
                                                                    )}
                                                                    <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity rounded-lg">
                                                                        <span className="text-white text-[10px] font-bold">CHANGE FILE</span>
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                <span className="text-gray-400 text-xs font-medium">Click to Upload ID File</span>
                                                            )}
                                                        </div>
                                                        <input id="idProofInp" type="file" className="hidden" onChange={handleIdProofUpload} accept="image/*,application/pdf" />
                                                    </div>
                                                )}
                                            </div>

                                            {rf.requireVehicleInfo && (
                                                <div className="space-y-3 bg-gray-50 p-5 rounded-lg border border-gray-200">
                                                    <label className="text-sm font-bold text-gray-900 block">Vehicle / Transport Preference</label>
                                                    {rf.vehicleDescription && <p className="text-xs text-gray-500 italic mb-2">{rf.vehicleDescription}</p>}
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                        <button
                                                            type="button"
                                                            onClick={() => setFormData(prev => ({ ...prev, vehicleOption: 'own' }))}
                                                            className={`px-4 py-3 rounded-lg text-xs font-bold border transition-all text-left flex items-center justify-between ${formData.vehicleOption === 'own' ? 'bg-primary border-primary text-white shadow-md' : 'bg-white border-gray-200 text-gray-600 hover:border-primary/50'}`}
                                                        >
                                                            I have my own vehicle
                                                            {formData.vehicleOption === 'own' && <FiCheck />}
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => setFormData(prev => ({ ...prev, vehicleOption: 'assistance' }))}
                                                            className={`px-4 py-3 rounded-lg text-xs font-bold border transition-all text-left flex items-center justify-between ${formData.vehicleOption === 'assistance' ? 'bg-primary border-primary text-white shadow-md' : 'bg-white border-gray-200 text-gray-600 hover:border-primary/50'}`}
                                                        >
                                                            I need transport assistance
                                                            {formData.vehicleOption === 'assistance' && <FiCheck />}
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Health & Preferences */}
                                {(rf.requireEmergencyContact || rf.requireDietaryPreference || rf.requireAllergies || rf.requireSpecialRequests) && (
                                    <div className="space-y-6 pt-6 border-t border-gray-100">
                                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                            <FiCheckCircle className="text-emerald-500" /> Health & Preferences
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {rf.requireEmergencyContact && (
                                                <>
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-semibold text-gray-700">Emergency Contact Name *</label>
                                                        <input type="text" name="emergencyContactName" value={formData.emergencyContactName} onChange={handleChange} required className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm" placeholder="Contact Person Name" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-semibold text-gray-700">Emergency Contact Phone *</label>
                                                        <input type="tel" name="emergencyContactPhone" value={formData.emergencyContactPhone} onChange={handleChange} required className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm" placeholder="+91 9876543210" />
                                                    </div>
                                                </>
                                            )}
                                            {rf.requireDietaryPreference && (
                                                <div className="space-y-2">
                                                    <label className="text-sm font-semibold text-gray-700">Dietary Preference</label>
                                                    <select name="dietaryPreference" value={formData.dietaryPreference} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm cursor-pointer font-bold">
                                                        <option value="">Select Option</option>
                                                        <option value="vegetarian">Vegetarian</option>
                                                        <option value="non-vegetarian">Non-Vegetarian</option>
                                                        <option value="vegan">Vegan</option>
                                                        <option value="jain">Jain Food</option>
                                                        <option value="other">Other</option>
                                                    </select>
                                                </div>
                                            )}
                                            {rf.requireAllergies && (
                                                <div className="space-y-2 md:col-span-2">
                                                    <label className="text-sm font-semibold text-gray-700">Medical Conditions / Allergies</label>
                                                    <textarea name="allergies" rows={2} value={formData.allergies} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm resize-none" placeholder="Please list any allergies or medical conditions we should be aware of" />
                                                </div>
                                            )}
                                            {rf.requireSpecialRequests && (
                                                <div className="space-y-2 md:col-span-2">
                                                    <label className="text-sm font-semibold text-gray-700">Special Requests / Notes</label>
                                                    <textarea name="specialRequests" rows={2} value={formData.specialRequests} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm resize-none" placeholder="Any other requests or notes for the organizer" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Payment Selection */}
                        {event.registrationFee > 0 && (
                            <div className="space-y-6 pt-8 border-t border-gray-100">
                                <h3 className="text-lg font-bold text-gray-900 flex justify-between items-center">
                                    <span className="uppercase tracking-widest text-[10px] text-gray-400">Payment Settlement</span>
                                    <span className="text-2xl font-black italic">₹{event.registrationFee.toLocaleString()}</span>
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    {rf.enableOnlinePayment && (
                                        <button type="button" onClick={() => setPaymentMethod('online')} className={`py-4 rounded-lg border text-[10px] font-black uppercase tracking-widest transition-all ${paymentMethod === 'online' ? 'bg-primary border-primary text-white shadow-lg' : 'bg-white border-gray-200 text-gray-500 hover:border-primary/50'}`}>Pay Online</button>
                                    )}
                                    {rf.enablePaidScreenshot && (
                                        <button type="button" onClick={() => setPaymentMethod('screenshot')} className={`py-4 rounded-lg border text-[10px] font-black uppercase tracking-widest transition-all ${paymentMethod === 'screenshot' ? 'bg-primary border-primary text-white shadow-lg' : 'bg-white border-gray-200 text-gray-500 hover:border-primary/50'}`}>Upload Screenshot</button>
                                    )}
                                    {rf.enableDirectPay && (
                                        <button type="button" onClick={() => setPaymentMethod('direct')} className={`py-4 rounded-lg border text-[10px] font-black uppercase tracking-widest transition-all ${paymentMethod === 'direct' ? 'bg-primary border-primary text-white shadow-lg' : 'bg-white border-gray-200 text-gray-500 hover:border-primary/50'}`}>Direct Pay</button>
                                    )}
                                </div>

                                {paymentMethod === 'screenshot' && (
                                    <div className="p-6 bg-gray-50 rounded-lg border border-gray-200 space-y-4">
                                        <div className="space-y-2">
                                            <h4 className="text-[10px] font-black uppercase tracking-widest text-primary">Payment Details</h4>
                                            {rf.upiId && <p className="text-sm font-bold text-gray-800">UPI ID: <span className="text-primary underline">{rf.upiId}</span></p>}
                                            {rf.bankDetails && <p className="text-xs text-gray-600 whitespace-pre-line leading-relaxed">{rf.bankDetails}</p>}
                                        </div>
                                        <div
                                            onClick={() => screenshotInputRef.current?.click()}
                                            className="relative w-full h-40 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center bg-white cursor-pointer hover:bg-gray-50 transition-all overflow-hidden"
                                        >
                                            {isUploadingScreenshot ? (
                                                <FiLoader className="animate-spin text-primary" />
                                            ) : uploadedScreenshot ? (
                                                <img src={uploadedScreenshot.url} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="text-center">
                                                    <span className="text-gray-400 text-xs font-bold uppercase">Click to Attach Screenshot</span>
                                                </div>
                                            )}
                                        </div>
                                        <input ref={screenshotInputRef} type="file" className="hidden" onChange={handleScreenshotSelect} />
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="pt-8">
                            <button
                                type="submit"
                                disabled={isSubmitting || isUploadingScreenshot || isUploadingIdProof}
                                className={`w-full py-5 rounded-lg text-white text-sm font-semibold uppercase tracking-widest transition-all shadow-xl ${isSubmitting ? 'bg-gray-400 cursor-not-allowed translate-y-1' : 'bg-primary hover:bg-primary/90 active:scale-[0.98]'}`}
                            >
                                {isSubmitting ? 'Processing...' : 'Complete Registration'}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}
