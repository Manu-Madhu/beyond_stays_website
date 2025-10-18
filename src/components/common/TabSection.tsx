"use client";
import React, { useState } from "react";
import { packagesData } from "@/data/packagesData";
import { eventsData } from "@/data/eventsData";
import CardCarousel from "../home/packages/CardCarousel";

const tabs = ["Packages", "Events"] as const;
type TabType = (typeof tabs)[number];

const TabSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("Packages");

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
        <CardCarousel cards={eventsData} />
      )}
    </div>
  );
};

export default TabSection;
