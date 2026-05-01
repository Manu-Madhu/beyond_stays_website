"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    FiMapPin, FiCalendar, FiClock, FiUsers, FiCreditCard,
    FiUpload, FiDollarSign, FiCheck, FiLoader, FiAlertCircle,
    FiUser, FiMail, FiPhone, FiShield, FiHeart, FiStar,
    FiArrowLeft, FiCheckCircle, FiX, FiInfo
} from 'react-icons/fi';
import { MdOutlineQrCode2 } from 'react-icons/md';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { PublicService } from '@/services/public.service';

const API_BASE = (process.env.NEXT_PUBLIC_ADMIN_API_URL || 'http://127.0.0.1:8080/api/v1').replace('/v1', '/v2');

type PaymentMethod = 'online' | 'screenshot' | 'direct' | '';

interface EventData {
    _id: string;
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

export default function EventRegistrationPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;

    const [event, setEvent] = useState<EventData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
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
        emergencyContact: '',
        dietaryPreference: '',
        specialRequests: ''
    });

    const [idProofFile, setIdProofFile] = useState<{ url: string; fileType: string } | null>(null);
    const [isUploadingIdProof, setIsUploadingIdProof] = useState(false);
    const [uploadedScreenshot, setUploadedScreenshot] = useState<{ url: string; fileType: string } | null>(null);

    const [activeBannerIndex, setActiveBannerIndex] = useState(0);

    // Fetch Event Data
    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const { data } = await PublicService.getEventById(id);
                if (data?.success) {
                    setEvent(data.data);
                } else {
                    setError(data?.message || 'Event not found.');
                }
            } catch {
                setError('Failed to load event.');
            } finally {
                setIsLoading(false);
            }
        };
        if (id) fetchEvent();
    }, [id]);

    // Carousel auto-slide
    useEffect(() => {
        if (event?.bannerType === 'carousel' && event.banners && event.banners.length > 1) {
            const timer = setInterval(() => {
                setActiveBannerIndex(prev => (prev + 1) % (event.banners?.length || 1));
            }, 5000);
            return () => clearInterval(timer);
        }
    }, [event]);

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
            const res = await fetch(`${API_BASE}/uploads/single`, { method: 'POST', body: fd });
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
            const res = await fetch(`${API_BASE}/uploads/single`, { method: 'POST', body: fd });
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
                idProof: idProofFile || undefined,
                ...(paymentMethod === 'screenshot' && uploadedScreenshot && { paymentScreenshot: uploadedScreenshot })
            };

            const { data } = await PublicService.registerForEvent(id, payload);

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
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto"></div>
                    <p className="text-gray-500 font-bold tracking-widest uppercase text-xs">Loading Experience...</p>
                </div>
            </div>
        );
    }

    if (error || !event) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
                <div className="max-w-md w-full text-center space-y-6">
                    <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto shadow-xl">
                        <FiAlertCircle className="w-10 h-10" />
                    </div>
                    <h2 className="text-3xl font-black text-gray-900">Event Unavailable</h2>
                    <p className="text-gray-500 font-medium">{error || 'This event portal is closed or the link is invalid.'}</p>
                    <Link href="/" className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-2xl font-bold hover:bg-primary/90 transition-all shadow-lg">
                        <FiArrowLeft /> Return to Home
                    </Link>
                </div>
            </div>
        );
    }

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-6">
                <div className="max-w-xl w-full bg-white rounded-[2.5rem] shadow-2xl p-10 text-center space-y-8 animate-in zoom-in duration-500 scale-100">
                    <div className="w-24 h-24 bg-emerald-500 text-white rounded-[2rem] flex items-center justify-center mx-auto shadow-xl shadow-emerald-200">
                        <FiCheck className="w-12 h-12" />
                    </div>
                    <div>
                        <h2 className="text-4xl font-black text-gray-900 tracking-tight">You're All Set!</h2>
                        <p className="text-gray-500 mt-3 font-medium text-lg leading-relaxed">
                            Registration received for <br />
                            <span className="text-primary font-black uppercase italic">{event.title}</span>
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-left border-y border-gray-100 py-6">
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</p>
                            <p className="text-sm font-bold text-gray-800">{new Date(event.startDate).toLocaleDateString()}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Location</p>
                            <p className="text-sm font-bold text-gray-800">{event.location}</p>
                        </div>
                    </div>
                    <p className="text-sm text-gray-400 font-medium">Confirmation details have been sent to your email address.</p>
                    <Link href="/" className="block w-full bg-gray-900 text-white py-5 rounded-3xl font-black text-lg hover:bg-black transition-all shadow-xl active:scale-95">
                        Back to Home
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
        <div className="min-h-screen bg-[#fafafa] pb-20">
            {/* Dynamic Hero Section */}
            <div className="relative h-[40vh] w-full overflow-hidden bg-gray-950">
                <img 
                    src={event.mainBanner?.url || "/assets/travel_placeholder.png"} 
                    className="w-full h-full object-cover opacity-60" 
                    alt="Hero"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent"></div>
                <div className="absolute top-6 left-6 z-20">
                    <button onClick={() => router.back()} className="p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all border border-white/20">
                        <FiArrowLeft size={24} />
                    </button>
                </div>
                <div className="absolute bottom-10 left-10 right-10 z-20">
                    <h1 className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tighter leading-none">Register for {event.title}</h1>
                </div>
            </div>

            <main className="max-w-4xl mx-auto px-4 -mt-10 relative z-30">
                <div className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 p-8 md:p-12 space-y-12">
                    <form onSubmit={handleSubmit} className="space-y-12">
                        {/* Attendee Info */}
                        <div className="space-y-8">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center">
                                    <FiUser className="w-6 h-6" />
                                </div>
                                <h3 className="text-2xl font-black text-gray-950 tracking-tight">Attendee Information</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest ml-1">Full Name *</label>
                                    <input type="text" name="user" value={formData.user} onChange={handleChange} required className="w-full px-6 py-5 bg-gray-50 border-2 border-transparent rounded-[1.25rem] focus:bg-white focus:border-primary/20 outline-none transition-all font-bold text-gray-900" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest ml-1">Email *</label>
                                    <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-6 py-5 bg-gray-50 border-2 border-transparent rounded-[1.25rem] focus:bg-white focus:border-primary/20 outline-none transition-all font-bold text-gray-900" />
                                </div>
                                {rf.requirePhone && (
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest ml-1">Phone *</label>
                                        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="w-full px-6 py-5 bg-gray-50 border-2 border-transparent rounded-[1.25rem] focus:bg-white focus:border-primary/20 outline-none transition-all font-bold text-gray-900" />
                                    </div>
                                )}
                                {rf.requirePersonCount && (
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest ml-1">People</label>
                                        <input type="number" name="personCount" value={formData.personCount} onChange={handleChange} min="1" className="w-full px-6 py-5 bg-gray-50 border-2 border-transparent rounded-[1.25rem] focus:bg-white focus:border-primary/20 outline-none transition-all font-bold text-gray-900" />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Additional Fields */}
                        {(rf.requireAddress || rf.requirePassport || rf.requireIdProof) && (
                            <div className="space-y-8 pt-8 border-t border-gray-50">
                                <h3 className="text-xl font-black text-gray-950 tracking-tight">Logistics & ID</h3>
                                <div className="grid grid-cols-1 gap-8">
                                    {rf.requireAddress && (
                                        <div className="space-y-2">
                                            <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest ml-1">Full Address *</label>
                                            <textarea name="address" rows={3} value={formData.address} onChange={handleChange} required className="w-full px-6 py-5 bg-gray-50 border-2 border-transparent rounded-[1.25rem] focus:bg-white focus:border-primary/20 outline-none transition-all font-bold text-gray-900 resize-none" />
                                        </div>
                                    )}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {rf.requirePassport && (
                                            <div className="space-y-2">
                                                <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest ml-1">Gov ID Number *</label>
                                                <input type="text" name="passportId" value={formData.passportId} onChange={handleChange} required className="w-full px-6 py-5 bg-gray-50 border-2 border-transparent rounded-[1.25rem] focus:bg-white focus:border-primary/20 outline-none transition-all font-bold text-gray-900" />
                                            </div>
                                        )}
                                        {rf.requireIdProof && (
                                            <div className="space-y-2">
                                                <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest ml-1">ID Proof Upload *</label>
                                                <div 
                                                    onClick={() => document.getElementById('idProofInp')?.click()}
                                                    className={`px-6 py-4 border-2 border-dashed rounded-2xl cursor-pointer text-center ${idProofFile ? 'border-primary bg-primary/5' : 'border-gray-200'}`}
                                                >
                                                    {isUploadingIdProof ? <FiLoader className="animate-spin mx-auto" /> : idProofFile ? <span className="text-primary font-bold">Uploaded</span> : <span className="text-gray-400 font-bold">Upload File</span>}
                                                </div>
                                                <input id="idProofInp" type="file" className="hidden" onChange={handleIdProofUpload} />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Payment Selection */}
                        {event.registrationFee > 0 && (
                            <div className="space-y-8 pt-8 border-t border-gray-50">
                                <h3 className="text-xl font-black text-gray-950 tracking-tight">Payment Settlement (₹{event.registrationFee.toLocaleString()})</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {rf.enableOnlinePayment && (
                                        <button type="button" onClick={() => setPaymentMethod('online')} className={`p-6 rounded-3xl border-2 font-black uppercase text-xs tracking-widest transition-all ${paymentMethod === 'online' ? 'bg-primary border-primary text-white shadow-lg' : 'bg-white border-gray-100 text-gray-400 hover:border-primary/20'}`}>Pay Online</button>
                                    )}
                                    {rf.enablePaidScreenshot && (
                                        <button type="button" onClick={() => setPaymentMethod('screenshot')} className={`p-6 rounded-3xl border-2 font-black uppercase text-xs tracking-widest transition-all ${paymentMethod === 'screenshot' ? 'bg-primary border-primary text-white shadow-lg' : 'bg-white border-gray-100 text-gray-400 hover:border-primary/20'}`}>Upload Screenshot</button>
                                    )}
                                    {rf.enableDirectPay && (
                                        <button type="button" onClick={() => setPaymentMethod('direct')} className={`p-6 rounded-3xl border-2 font-black uppercase text-xs tracking-widest transition-all ${paymentMethod === 'direct' ? 'bg-primary border-primary text-white shadow-lg' : 'bg-white border-gray-100 text-gray-400 hover:border-primary/20'}`}>Direct Pay</button>
                                    )}
                                </div>

                                {paymentMethod === 'screenshot' && (
                                    <div className="p-8 bg-amber-50 rounded-[2rem] border border-amber-100 space-y-6">
                                        <div className="space-y-4">
                                            <h4 className="text-sm font-black text-amber-800 uppercase tracking-widest">Payment Details</h4>
                                            {rf.upiId && <p className="text-lg font-black text-amber-950">UPI: {rf.upiId}</p>}
                                            {rf.bankDetails && <p className="text-sm font-bold text-amber-900 whitespace-pre-line">{rf.bankDetails}</p>}
                                        </div>
                                        <div 
                                            onClick={() => screenshotInputRef.current?.click()}
                                            className="w-full h-40 border-2 border-dashed border-amber-300 rounded-2xl flex flex-col items-center justify-center bg-white cursor-pointer"
                                        >
                                            {isUploadingScreenshot ? <FiLoader className="animate-spin" /> : uploadedScreenshot ? <span className="text-primary font-bold">Screenshot Uploaded</span> : <span className="text-amber-500 font-bold">Attach Screenshot</span>}
                                        </div>
                                        <input ref={screenshotInputRef} type="file" className="hidden" onChange={handleScreenshotSelect} />
                                    </div>
                                )}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isSubmitting || isUploadingScreenshot || isUploadingIdProof}
                            className={`w-full py-6 rounded-3xl text-white font-black text-lg shadow-xl transition-all active:scale-95 ${isSubmitting ? 'bg-gray-400' : 'bg-primary hover:bg-primary/90'}`}
                        >
                            {isSubmitting ? 'Processing...' : 'Confirm Registration'}
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
}
