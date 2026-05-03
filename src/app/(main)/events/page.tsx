import CommonHeroSection from "@/components/common/CommonHeroSection";
import EventListingSection from "@/components/events/EventListingSection";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: `Expeditions & Events | Beyond Stays`,
  description:
    "Join our curated expeditions and events. From mountain treks to cultural escapes, experience the extraordinary with Beyond Stays.",
  keywords: ["expeditions", "events", "travel", "adventure", "beyond stays"],
};

const EventsPage = () => {
  return (
    <div>
      {/* Hero section  */}
      <CommonHeroSection
        banner="/assets/images/packages/4.jpg"
        title="Our Expeditions"
      />

      {/* Events Listing */}
      <EventListingSection />
    </div>
  );
};

export default EventsPage;