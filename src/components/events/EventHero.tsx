"use client";
import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FiMapPin, FiCalendar, FiArrowLeft } from 'react-icons/fi';

export const EventHero = ({ event, allImages, activeImage }: { event: any, allImages: string[], activeImage: number }) => {
    const router = useRouter();

    return (
        <div className="relative h-[55vh] md:h-[60vh] overflow-hidden z-20">
            <div className='bg-gradient-to-tr from-black/60 via-black/20 to-transparent w-full h-full absolute top-0 left-0 right-0 bottom-0 z-10'></div>
            <Image 
                src={allImages[activeImage] || "/assets/travel_placeholder.png"} 
                alt={event.title} 
                fill
                priority
                sizes="100vw"
                className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10"></div>
            
            <div className="absolute top-6 left-6 z-20">
                <button onClick={() => router.back()} className="p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all border border-white/20">
                    <FiArrowLeft size={20} />
                </button>
            </div>

            <div className="absolute bottom-10 left-0 right-0 px-6 md:px-12 z-10">
                <div className="max-w-7xl mx-auto space-y-4">
                    <div className="flex flex-wrap gap-3">
                        <span className="px-3 py-1 bg-primary text-white text-[10px] font-bold uppercase tracking-widest rounded-full">
                            {event.ageRestriction}
                        </span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight uppercase italic drop-shadow-lg max-w-4xl">
                        {event.title}
                    </h1>
                    <div className="flex flex-wrap items-center gap-6 text-white/90 text-sm font-bold">
                        <div className="flex items-center gap-2"><FiMapPin className="text-primary" /> {event.location}</div>
                        <div className="flex items-center gap-2">
                            <FiCalendar className="text-primary" /> 
                            {new Date(event.startDate).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                            <span className="opacity-60 ml-1">@ {new Date(event.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
