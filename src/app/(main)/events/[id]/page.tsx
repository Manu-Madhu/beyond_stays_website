"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
    FiMapPin, FiCalendar, FiClock, FiUsers, FiArrowLeft, 
    FiCheckCircle, FiInfo, FiChevronRight, FiMap, FiShield 
} from 'react-icons/fi';
import Link from 'next/link';
import { PublicService } from '@/services/public.service';

export default function EventDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;

    const [event, setEvent] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(0);

    useEffect(() => {
        const fetchEvent = async () => {
            if (!id) return;
            try {
                const { data } = await PublicService.getEventById(id);
                if (data?.success) {
                    setEvent(data.data);
                }
            } catch (error) {
                console.error("Failed to fetch event details:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchEvent();
    }, [id]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6 text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Event Not Found</h1>
                <Link href="/" className="text-primary font-semibold hover:underline">Return to Home</Link>
            </div>
        );
    }

    const allImages = [
        event.mainBanner?.url,
        ...(event.banners?.map((b: any) => b.url) || []),
        ...(event.gallery?.map((g: any) => g.url) || [])
    ].filter(Boolean);

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Hero Section */}
            <div className="relative h-[60vh] overflow-hidden">
                <img 
                    src={allImages[activeImage] || "/assets/travel_placeholder.png"} 
                    alt={event.title} 
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                
                <div className="absolute top-6 left-6 z-20">
                    <button onClick={() => router.back()} className="p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all border border-white/20">
                        <FiArrowLeft size={24} />
                    </button>
                </div>

                <div className="absolute bottom-10 left-0 right-0 px-6 md:px-12 z-10">
                    <div className="max-w-7xl mx-auto space-y-4">
                        <div className="flex flex-wrap gap-3">
                            <span className="px-4 py-1 bg-primary text-white text-xs font-bold uppercase tracking-widest rounded-full">
                                {event.ageRestriction}
                            </span>
                            <span className="px-4 py-1 bg-white/10 backdrop-blur-md text-white text-xs font-bold uppercase tracking-widest rounded-full border border-white/20">
                                {event.status}
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight uppercase italic drop-shadow-2xl">
                            {event.title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-6 text-white/90 text-sm font-bold">
                            <div className="flex items-center gap-2"><FiMapPin className="text-primary" /> {event.location}</div>
                            <div className="flex items-center gap-2"><FiCalendar className="text-primary" /> {new Date(event.startDate).toDateString()}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Grid */}
            <main className="max-w-7xl mx-auto px-6 md:px-12 mt-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    
                    {/* Left Column - Details */}
                    <div className="lg:col-span-8 space-y-12">
                        {/* Description */}
                        <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                            <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                                <FiInfo className="text-primary" /> About the Event
                            </h2>
                            <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-line">
                                {event.description}
                            </p>
                        </section>

                        {/* Gallery Preview */}
                        {allImages.length > 1 && (
                            <section>
                                <h2 className="text-2xl font-black text-gray-900 mb-6">Event Gallery</h2>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {allImages.map((img, idx) => (
                                        <div 
                                            key={idx} 
                                            onClick={() => setActiveImage(idx)}
                                            className={`aspect-square rounded-2xl overflow-hidden cursor-pointer border-4 transition-all ${activeImage === idx ? 'border-primary' : 'border-transparent hover:border-primary/50'}`}
                                        >
                                            <img src={img} className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Guidelines & Carry */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {event.guidelines && (
                                <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                                    <h3 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                                        <FiShield className="text-primary" /> Guidelines
                                    </h3>
                                    <p className="text-gray-600 text-sm whitespace-pre-line">{event.guidelines}</p>
                                </section>
                            )}
                            {event.thingsToCarry && (
                                <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                                    <h3 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                                        <FiMap className="text-primary" /> Things to Carry
                                    </h3>
                                    <p className="text-gray-600 text-sm whitespace-pre-line">{event.thingsToCarry}</p>
                                </section>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Booking Card */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-12 space-y-6">
                            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 space-y-8">
                                <div className="space-y-2">
                                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Registration Fee</p>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-4xl font-black text-gray-900">₹{event.registrationFee?.toLocaleString()}</span>
                                        <span className="text-gray-400 text-sm font-bold">/ person</span>
                                    </div>
                                </div>

                                <div className="space-y-4 pt-6 border-t border-gray-50">
                                    <div className="flex items-center justify-between text-sm font-bold">
                                        <span className="text-gray-500">Available Slots</span>
                                        <span className="text-gray-900">{event.capacity || 'Unlimited'}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm font-bold">
                                        <span className="text-gray-500">Starts At</span>
                                        <span className="text-gray-900">{new Date(event.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                </div>

                                <Link 
                                    href={`/events/${event._id}/register`}
                                    className="block w-full bg-primary text-white text-center py-5 rounded-2xl font-black text-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 active:scale-95"
                                >
                                    Book Now
                                </Link>

                                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex gap-3">
                                    <FiCheckCircle className="text-emerald-500 w-5 h-5 shrink-0 mt-0.5" />
                                    <p className="text-[10px] font-bold text-emerald-800 leading-relaxed uppercase tracking-tight">
                                        Instant Confirmation • Secure Checkout
                                    </p>
                                </div>
                            </div>

                            {/* Additional Info */}
                            <div className="bg-gray-900 rounded-3xl p-8 text-white space-y-6">
                                <h4 className="text-sm font-black text-white/40 uppercase tracking-widest">Need Help?</h4>
                                <p className="text-sm text-white/70 leading-relaxed font-medium">
                                    Have questions about this event? Contact our travel specialists for assistance.
                                </p>
                                <button className="flex items-center gap-2 text-primary font-black text-xs uppercase tracking-widest hover:text-white transition-colors">
                                    Chat with us <FiChevronRight />
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}
