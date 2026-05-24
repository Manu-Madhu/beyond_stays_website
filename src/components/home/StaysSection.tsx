"use client";
import React from "react";
import Header from "../common/Header";
import Button from "../ui/Button";
import TabSection from "../common/TabSection";

const StaysSection = () => {
  const [activeTab, setActiveTab] = React.useState<"Stays" | "Events">("Events");

  return (
    <div className="mt-5 md:mt-20 relative">
      <div className="max-w-[1350px] mx-auto md:min-h-full p-5 md:px-8">
        {/* Header */}
        <Header
          title={activeTab === "Stays" ? "Experience Our Stays" : "Upcoming Expeditions"}
          className="w-full md:w-[20%] gap-2 md:gap-10 flex flex-col md:flex-row md:items-end"
        >
          <Button
            title={activeTab === "Stays" ? "View All Stays" : "View All Events"}
            link={activeTab === "Stays" ? "/stays" : "/events"}
            className="border-2 text-black md:mb-2 w-fit hidden md:block"
          />
        </Header>

        {/* Tab section */}
        <div className=" md:mt-8">
          <TabSection onTabChange={(tab) => setActiveTab(tab)} />
        </div>

        <Button
          title={activeTab === "Stays" ? "View All Stays" : "View All Events"}
          link={activeTab === "Stays" ? "/stays" : "/events"}
          className="border-2 text-black md:mb-2 w-fit  md:hidden mt-4"
        />
      </div>
    </div>
  );
};

export default StaysSection;
