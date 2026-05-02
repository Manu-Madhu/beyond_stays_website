"use client";
import React, { useState, useEffect } from 'react';
import { 
    FiCheckCircle, FiPlusCircle, FiMinusCircle, FiUsers, FiStar, FiZap
} from 'react-icons/fi';
import Image from 'next/image';

// Extracted Components
import { FormattedContent } from '@/components/events/FormattedContent';
import { ItineraryTimeline } from '@/components/events/ItineraryTimeline';
import { EventHero } from '@/components/events/EventHero';
import { EventSidebar } from '@/components/events/EventSidebar';

interface EventDetailsClientProps {
    event: any;
}

export default function EventDetailsClient({ event }: EventDetailsClientProps) {
    const [activeImage, setActiveImage] = useState(0);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const heroImages = event.bannerType === 'carousel' 
        ? (event.banners?.map((b: any) => b.url || b.location) || [])
        : [event.mainBanner?.url || event.mainBanner?.location].filter(Boolean);

    const galleryImages = (event.gallery?.map((g: any) => g.url || g.location) || []).filter(Boolean);
    const allImages = [...heroImages, ...galleryImages].filter(Boolean);

    useEffect(() => {
        if (event.bannerType === 'carousel' && heroImages.length > 1) {
            const interval = setInterval(() => {
                setActiveImage((prev) => (prev + 1) % heroImages.length);
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [event.bannerType, heroImages.length]);

    const capacity = Number(event.capacity) || 0;
    const registrationCount = Number(event.registrationCount) || 0;
    
    const isExpired = new Date(event.endDate) < new Date();
    const isFull = capacity > 0 && registrationCount >= capacity;
    const canRegister = !isExpired && !isFull && event.status === 'Active';

    const slotsAvailable = !isMounted ? '...' : (isFull ? '0' : (capacity > 0 ? (capacity - registrationCount) : 'Unlimited'));

    return (
        <div className="min-h-screen bg-gray-50/20 pb-20">
            {/* Extracted Hero Section */}
            <EventHero event={event} allImages={allImages} activeImage={activeImage} />

            {/* Content Area */}
            <main className="max-w-[1350px] lg:w-[92%] w-full mx-auto px-5 md:px-8 mt-12 md:mt-16">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16">
                    
                    {/* Left Column */}
                    <div className="lg:col-span-8 space-y-16">
                        
                        {/* Experience Overview */}
                        <section className="space-y-6">
                            <h2 className="titleHeader text-2xl md:text-3xl uppercase tracking-tight text-gray-900 border-b border-gray-200 pb-4">
                                Experience Overview
                            </h2>
                            <div className="pt-2">
                                <FormattedContent content={event.description} className="text-[16px] leading-[1.8] text-gray-600" />
                            </div>
                        </section>

                        {/* Trip Timeline */}
                        {event.itinerary && (
                            <section className="space-y-8">
                                <h2 className="titleHeader text-2xl md:text-3xl uppercase tracking-tight text-gray-900 border-b border-gray-200 pb-4">
                                    Trip Timeline
                                </h2>
                                <ItineraryTimeline content={event.itinerary} />
                            </section>
                        )}

                        {/* Guidelines & Things to Carry */}
                        {(event.guidelines || event.thingsToCarry) && (
                            <section className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-6">
                                {event.guidelines && (
                                    <div className="space-y-4 min-w-0">
                                        <h3 className="titleHeader text-lg uppercase flex items-center gap-2">
                                            <FiZap /> Guidelines & Restrictions
                                        </h3>
                                        <div className="pt-2">
                                            <FormattedContent content={event.guidelines} className="text-[15px] text-gray-600" />
                                        </div>
                                    </div>
                                )}
                                {event.thingsToCarry && (
                                    <div className="space-y-4 min-w-0">
                                        <h3 className="titleHeader text-lg uppercase flex items-center gap-2">
                                            <FiCheckCircle /> Things to Carry
                                        </h3>
                                        <div className="pt-2">
                                            <FormattedContent content={event.thingsToCarry} className="text-[15px] text-gray-600" />
                                        </div>
                                    </div>
                                )}
                            </section>
                        )}

                        {/* Why & Who Sections */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 ">
                            {event.whyJoin && (
                                <div className="space-y-4 min-w-0">
                                    <h3 className="titleHeader text-lg uppercase text-gray-900 flex items-center gap-2">
                                        <FiStar className="text-primary" /> Why Join?
                                    </h3>
                                    <div className="pt-2">
                                        <FormattedContent content={event.whyJoin} className="text-[15px] text-gray-600" />
                                    </div>
                                </div>
                            )}
                            {event.whoCanJoin && (
                                <div className="space-y-4 min-w-0">
                                    <h3 className="titleHeader text-lg uppercase text-gray-900 flex items-center gap-2">
                                        <FiUsers className="text-gray-500" /> Who Can Join?
                                    </h3>
                                    <div className="pt-2">
                                        <FormattedContent content={event.whoCanJoin} className="text-[15px] text-gray-600" />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Inclusions & Exclusions */}
                        {(event.inclusions || event.exclusions) && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                {event.inclusions && (
                                    <div className="min-w-0 bg-emerald-50/40 p-6 rounded-xl border border-emerald-100">
                                        <h3 className="text-sm font-bold text-emerald-600 mb-4 uppercase tracking-[0.1em] flex items-center gap-2">
                                            <FiPlusCircle /> Inclusions
                                        </h3>
                                        <FormattedContent content={event.inclusions} className="text-[14px] text-gray-700" />
                                    </div>
                                )}
                                {event.exclusions && (
                                    <div className="min-w-0 bg-red-50/40 p-6 rounded-xl border border-red-100">
                                        <h3 className="text-sm font-bold text-red-500 mb-4 uppercase tracking-[0.1em] flex items-center gap-2">
                                            <FiMinusCircle /> Exclusions
                                        </h3>
                                        <FormattedContent content={event.exclusions} className="text-[14px] text-gray-700" />
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Gallery Section */}
                        {galleryImages.length > 0 && (
                            <div className="space-y-6 pt-6">
                                <h3 className="titleHeader text-xl uppercase text-gray-900 border-b border-gray-200 pb-4">Journey Gallery</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {galleryImages.map((img: string, idx: number) => (
                                        <div 
                                            key={idx} 
                                            onClick={() => setActiveImage(heroImages.length + idx)}
                                            className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-all hover:scale-[1.05] duration-300 ${activeImage === (heroImages.length + idx) ? 'border-primary' : 'border-transparent'}`}
                                        >
                                            <Image src={img} alt={`Gallery ${idx}`} fill className="object-cover" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column - Extracted Booking Card */}
                    <div className="lg:col-span-4">
                        <EventSidebar 
                            event={event} 
                            canRegister={canRegister} 
                            isExpired={isExpired} 
                            isFull={isFull} 
                            slotsAvailable={slotsAvailable} 
                        />
                    </div>

                </div>
            </main>

            <style jsx global>{`
                .rich-text-content {
                    word-break: break-word;
                    overflow-wrap: break-word;
                }
                .rich-text-content p { margin-bottom: 1.25rem; }
                .rich-text-content ul { list-style-type: disc; margin-left: 1.5rem; margin-bottom: 1.5rem; }
                .rich-text-content li { margin-bottom: 0.5rem; }
                .rich-text-content strong { font-weight: 800; color: #111827; }
            `}</style>
        </div>
    );
}
