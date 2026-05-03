"use client";
import React, { useEffect, useState } from "react";
import Button from "../ui/Button";
import Link from "next/link";
import { PublicService } from "@/services/public.service";
import { FiCalendar, FiMapPin, FiArrowRight } from "react-icons/fi";

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
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);

    const fetchEvents = async () => {
        setIsLoading(true);
        try {
          // Fetch upcoming
          const upcomingRes = await PublicService.getPublishedEvents({ limit: 10, upcoming: true });
          if (upcomingRes.data?.success) {
            setUpcomingEvents(upcomingRes.data.data.map(mapEvent));
          }

          // Fetch all active (to filter for past)
          // For simplicity, we assume events with startDate < today are "Past"
          const allRes = await PublicService.getPublishedEvents({ limit: 20 });
          if (allRes.data?.success) {
            const today = new Date();
            const past = allRes.data.data
                .filter((e: any) => new Date(e.startDate) < today)
                .map(mapEvent);
            setPastEvents(past);
          }
        } catch (error) {
          console.error("Failed to fetch events:", error);
        } finally {
          setIsLoading(false);
        }
    };

    fetchEvents();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
        {/* Image */}
        <img
          src={card.images[0]}
          alt={card.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

        {/* Status Badge */}
        <div className="absolute top-4 left-4 z-20">
            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${isPast ? 'bg-gray-500/80 text-white' : 'bg-primary text-white shadow-lg'}`}>
                {isPast ? 'Completed' : 'Upcoming'}
            </span>
        </div>

        {/* Text Content */}
        <div className="absolute bottom-0 left-0 w-full p-6 text-white z-10">
          <div className="flex items-center gap-2 mb-2 text-white/80 text-[10px] font-bold uppercase tracking-[0.2em]">
            <FiMapPin className="text-primary" /> {card.location}
          </div>
          <h2
            className={`primaryFont font-black italic uppercase tracking-tighter line-clamp-2 ${
              isMobile ? "text-2xl" : "text-3xl"
            }`}
          >
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

  if (isLoading) {
    return (
        <div className="w-full py-20 flex flex-col items-center justify-center space-y-4">
            <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Loading Adventures...</p>
        </div>
    );
  }

  return (
    <div className="w-full h-full mt-10 md:mt-20 mb-20">
      <div className="max-w-[1350px] mx-auto w-full px-5 md:px-8 space-y-20">
        
        {/* Upcoming Section */}
        {upcomingEvents.length > 0 && (
            <div className="space-y-10">
                <div className="flex items-end justify-between border-b border-gray-100 pb-6">
                    <div>
                        <span className="text-primary font-black uppercase tracking-[0.3em] text-[10px]">Ready for Next?</span>
                        <h2 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-gray-900 mt-2">Upcoming Expeditions</h2>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {upcomingEvents.map((card) => (
                        <EventCard key={card.id} card={card} isMobile={isMobile} />
                    ))}
                </div>
            </div>
        )}

        {/* Past Section */}
        {pastEvents.length > 0 && (
            <div className="space-y-10">
                <div className="flex items-end justify-between border-b border-gray-100 pb-6">
                    <div>
                        <span className="text-gray-400 font-black uppercase tracking-[0.3em] text-[10px]">Memories</span>
                        <h2 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-gray-400 mt-2">Completed Events</h2>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {pastEvents.map((card) => (
                        <EventCard key={card.id} card={card} isMobile={isMobile} isPast={true} />
                    ))}
                </div>
            </div>
        )}

        {upcomingEvents.length === 0 && pastEvents.length === 0 && (
            <div className="py-20 text-center bg-gray-50 rounded-lg border border-dashed border-gray-200">
                <h3 className="text-xl font-bold text-gray-900">No Events Found</h3>
                <p className="text-gray-500 mt-2">Check back later for new expeditions!</p>
            </div>
        )}

        <div className="pt-10 flex justify-center">
            <Button
                title="Customize Your Trip"
                link="/contact"
                className="border-2 text-black w-fit px-10"
            />
        </div>
      </div>
    </div>
  );
};

export default EventListingSection;
