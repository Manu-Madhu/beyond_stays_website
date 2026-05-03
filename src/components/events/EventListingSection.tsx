"use client";
import React, { useEffect, useState, useCallback } from "react";
import Button from "../ui/Button";
import Link from "next/link";
import { PublicService } from "@/services/public.service";
import { FiCalendar, FiMapPin, FiArrowRight, FiLoader } from "react-icons/fi";

interface EventCardType {
  id: string;
  images: string[];
  title: string;
  slug: string;
  category: string;
  location: string;
  startDate: string;
  status: string;
}

const EventListingSection = () => {
  const [upcomingEvents, setUpcomingEvents] = useState<EventCardType[]>([]);
  const [pastEvents, setPastEvents] = useState<EventCardType[]>([]);
  const [isLoadingUpcoming, setIsLoadingUpcoming] = useState(true);
  const [isLoadingPast, setIsLoadingPast] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  
  const [upcomingPage, setUpcomingPage] = useState(1);
  const [pastPage, setPastPage] = useState(1);
  const [hasMoreUpcoming, setHasMoreUpcoming] = useState(false);
  const [hasMorePast, setHasMorePast] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const mapEvent = (event: any) => ({
    id: event._id,
    slug: event.slug || event._id,
    title: event.title,
    category: event.ageRestriction || "Open to All",
    location: event.location,
    startDate: event.startDate,
    status: event.status,
    images: [
        event.listingBanner?.url || event.listingBanner?.location || event.mainBanner?.url || event.mainBanner?.location || "/assets/travel_placeholder.png"
    ],
  });

  const fetchUpcoming = useCallback(async (page: number, append = false) => {
    if (!append) setIsLoadingUpcoming(true);
    else setIsFetchingMore(true);
    
    try {
      const res = await PublicService.getPublishedEvents({ page, limit: 6, upcoming: true });
      if (res.data?.success) {
        const newEvents = res.data.data.map(mapEvent);
        setUpcomingEvents(prev => append ? [...prev, ...newEvents] : newEvents);
        setHasMoreUpcoming(res.data.meta.currentPage < res.data.meta.totalPages);
      }
    } catch (error) {
      console.error("Failed to fetch upcoming events:", error);
    } finally {
      setIsLoadingUpcoming(false);
      setIsFetchingMore(false);
    }
  }, []);

  const fetchPast = useCallback(async (page: number, append = false) => {
    if (!append) setIsLoadingPast(true);
    else setIsFetchingMore(true);
    
    try {
      const res = await PublicService.getPublishedEvents({ page, limit: 12, past: true });
      if (res.data?.success) {
        const past = res.data.data.map(mapEvent);
        setPastEvents(prev => append ? [...prev, ...past] : past);
        setHasMorePast(res.data.meta.currentPage < res.data.meta.totalPages);
      }
    } catch (error) {
      console.error("Failed to fetch past events:", error);
    } finally {
      setIsLoadingPast(false);
      setIsFetchingMore(false);
    }
  }, []);

  useEffect(() => {
    const mql = window.matchMedia('(max-width: 767px)');
    const onChange = (e: MediaQueryListEvent | MediaQueryList) => setIsMobile(e.matches);
    onChange(mql);
    mql.addEventListener('change', onChange as any);
    
    fetchUpcoming(1);
    fetchPast(1);

    return () => mql.removeEventListener('change', onChange as any);
  }, [fetchUpcoming, fetchPast]);

  const handleLoadMoreUpcoming = () => {
    const nextPage = upcomingPage + 1;
    setUpcomingPage(nextPage);
    fetchUpcoming(nextPage, true);
  };

  const handleLoadMorePast = () => {
    const nextPage = pastPage + 1;
    setPastPage(nextPage);
    fetchPast(nextPage, true);
  };

  const EventSkeleton = ({ count = 3 }: { count?: number }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(count)].map((_, i) => (
            <div key={i} className={`relative rounded-lg overflow-hidden bg-gray-100 animate-pulse ${isMobile ? "h-[320px]" : "h-[450px]"}`}>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
                <div className="absolute bottom-0 left-0 w-full p-6 space-y-4">
                    <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                    <div className="flex justify-between items-center pt-2">
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                        <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                    </div>
                </div>
            </div>
        ))}
    </div>
  );

  const EventCard = ({
    card,
    isMobile = false,
    isPast = false
  }: {
    card: EventCardType;
    isMobile?: boolean;
    isPast?: boolean;
  }) => (
    <Link title="event detailed page" href={`/events/${card?.slug}`}>
      <div
        className={`relative rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-500 group cursor-pointer ${
          isMobile ? "h-[320px]" : "h-[450px]"
        } ${isPast ? 'grayscale-[0.5] opacity-90' : ''}`}
      >
        <img
          src={card.images[0]}
          alt={card.title}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        <div className="absolute top-4 left-4 z-20">
            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${isPast ? 'bg-gray-500/80 text-white' : 'bg-primary text-white shadow-lg'}`}>
                {isPast ? 'Completed' : 'Upcoming'}
            </span>
        </div>
        <div className="absolute bottom-0 left-0 w-full p-6 text-white z-10">
          <div className="flex items-center gap-2 mb-2 text-white/80 text-[10px] font-bold uppercase tracking-[0.2em]">
            <FiMapPin className="text-primary" /> {card.location}
          </div>
          <h2 className={`primaryFont font-black italic uppercase tracking-tighter line-clamp-2 ${isMobile ? "text-2xl" : "text-3xl"}`}>
            {card.title}
          </h2>
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2 text-xs font-bold">
                <FiCalendar className="text-primary" /> {new Date(card.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </div>
            <div className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all">
                <FiArrowRight />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );

  return (
    <div className="w-full h-full mt-10 md:mt-20 mb-20">
      <div className="max-w-[1350px] mx-auto w-full px-5 md:px-8 space-y-20">
        
        {/* Upcoming Section */}
        {(isLoadingUpcoming || upcomingEvents.length > 0) && (
            <div className="space-y-10">
                <div className="flex items-end justify-between border-b border-gray-100 pb-6">
                    <div>
                        <span className="text-primary font-black uppercase tracking-[0.3em] text-[10px]">Ready for Next?</span>
                        <h2 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-gray-900 mt-2">Upcoming Expeditions</h2>
                    </div>
                </div>
                {isLoadingUpcoming ? (
                    <EventSkeleton count={3} />
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {upcomingEvents.map((card) => (
                                <EventCard key={card.id} card={card} isMobile={isMobile} />
                            ))}
                        </div>
                        {hasMoreUpcoming && (
                            <div className="flex justify-center mt-8">
                                <button 
                                    onClick={handleLoadMoreUpcoming}
                                    disabled={isFetchingMore}
                                    className="flex items-center gap-2 px-8 py-3 bg-white border-2 border-gray-100 rounded-full text-xs font-bold uppercase tracking-widest text-gray-900 hover:border-primary hover:text-primary transition-all shadow-sm"
                                >
                                    {isFetchingMore ? <FiLoader className="animate-spin" /> : 'View More Upcoming'}
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        )}

        {/* Past Section */}
        {(isLoadingPast || pastEvents.length > 0) && (
            <div className="space-y-10">
                <div className="flex items-end justify-between border-b border-gray-100 pb-6">
                    <div>
                        <span className="text-gray-400 font-black uppercase tracking-[0.3em] text-[10px]">Memories</span>
                        <h2 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-gray-400 mt-2">Completed Events</h2>
                    </div>
                </div>
                {isLoadingPast ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 opacity-50">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className={`relative rounded-lg overflow-hidden bg-gray-100 animate-pulse ${isMobile ? "h-[280px]" : "h-[350px]"}`}></div>
                        ))}
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {pastEvents.map((card) => (
                                <EventCard key={card.id} card={card} isMobile={isMobile} isPast={true} />
                            ))}
                        </div>
                        {hasMorePast && (
                            <div className="flex justify-center mt-8">
                                <button 
                                    onClick={handleLoadMorePast}
                                    disabled={isFetchingMore}
                                    className="flex items-center gap-2 px-8 py-3 bg-white border-2 border-gray-100 rounded-full text-xs font-bold uppercase tracking-widest text-gray-400 hover:border-gray-300 hover:text-gray-900 transition-all shadow-sm"
                                >
                                    {isFetchingMore ? <FiLoader className="animate-spin" /> : 'View More Past Events'}
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        )}

        {!isLoadingUpcoming && !isLoadingPast && upcomingEvents.length === 0 && pastEvents.length === 0 && (
            <div className="py-20 text-center bg-gray-50 rounded-lg border border-dashed border-gray-200">
                <h3 className="text-xl font-bold text-gray-900">No Events Found</h3>
                <p className="text-gray-500 mt-2">Check back later for new expeditions!</p>
            </div>
        )}

        <div className="pt-10 flex flex-col md:flex-row items-center justify-center gap-4">
            <Button
                title="Customize Your Trip"
                link="/contact"
                className="border-2 text-black w-full md:w-fit px-10"
            />
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}} />
    </div>
  );
};

export default EventListingSection;
