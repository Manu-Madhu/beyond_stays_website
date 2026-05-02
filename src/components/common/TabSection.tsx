"use client";
import React, { useState, useEffect } from "react";
import { packagesData } from "@/data/packagesData";
import { PublicService } from "@/services/public.service";
import { FiCalendar } from "react-icons/fi";
import CardCarousel from "../home/packages/CardCarousel";

const tabs = ["Packages", "Events"] as const;
type TabType = (typeof tabs)[number];

const TabSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("Packages");
  const [events, setEvents] = useState<any[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoadingEvents(true);
      try {
        const { data } = await PublicService.getPublishedEvents({ limit: 10, upcoming: true });
        if (data?.success) {
          // Map DB events to CardData structure for the carousel
          const mappedEvents = data.data.map((event: any) => ({
            id: event._id,
            slug: event.slug || event._id, 
            title: event.title,
            category: event.ageRestriction, // Or use a category if available
            description: event.description,
            // Use listingBanner if available, else mainBanner, else fallback
            images: [
                event.listingBanner?.url || event.listingBanner?.location || event.mainBanner?.url || event.mainBanner?.location || "/assets/travel_placeholder.png"
            ],
            type: 'event',
            itinerary: event.itinerary,
            inclusions: event.inclusions,
            exclusions: event.exclusions,
            whoCanJoin: event.whoCanJoin,
            whyJoin: event.whyJoin
          }));
          setEvents(mappedEvents);
        }
      } catch (error) {
        console.error("Failed to fetch events:", error);
      } finally {
        setIsLoadingEvents(false);
      }
    };

    fetchEvents();
  }, []);

  const EventSkeleton = () => (
    <div className="flex gap-5 overflow-hidden">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="min-w-[85%] sm:min-w-[45%] md:min-w-[23%] h-[450px] bg-gray-100 rounded-lg animate-pulse relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
            <div className="absolute bottom-0 left-0 w-full p-5 space-y-3">
                <div className="h-8 bg-gray-200 rounded-md w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded-md w-1/2"></div>
            </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="w-full">
      {/* Tabs Header */}
      <div className="flex items-center justify-between pb-5">
        <div className="flex gap-10">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`font-bold text-[18px] transition-all cursor-pointer ${
                activeTab === tab
                  ? "text-black border-b-2 border-black pb-1"
                  : "text-gray-400 hover:text-black"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Cards Section */}
      {activeTab === "Packages" ? (
        <CardCarousel cards={packagesData} />
      ) : (
        isLoadingEvents ? (
          <EventSkeleton />
        ) : events.length > 0 ? (
          <CardCarousel cards={events} />
        ) : (
          <div className="py-20 text-center bg-gray-50 rounded-[2.5rem] border border-dashed border-gray-200">
            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
              <FiCalendar className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Active Events</h3>
            <p className="text-gray-500 max-w-sm mx-auto font-medium">
              We're currently planning our next expeditions. Check back soon for new adventures!
            </p>
          </div>
        )
      )}
    </div>
  );
};

export default TabSection;
