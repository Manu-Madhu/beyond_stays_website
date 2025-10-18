import React from "react";
import Header from "../common/Header";
import Button from "../ui/Button";
import TabSection from "../common/TabSection";
import Image from "next/image";

const PackagesSection = () => {
  return (
    <div className="mt-5 md:mt-20 relative">
      <div className="max-w-[1350px] mx-auto md:min-h-screen p-5 md:px-8">
        {/* Header */}
        <Header
          title="Experience Packages"
          className="w-full md:w-[20%] gap-2 md:gap-10 flex flex-col md:flex-row md:items-end"
        >
          <Button
            title="View All Packages"
            link="/"
            className="border-2 text-black md:mb-2 w-fit hidden md:block"
          />
        </Header>

        {/* Tab section */}
        <div className=" md:mt-8">
          <TabSection />
        </div>

        <Button
          title="View All Packages"
          link="/"
          className="border-2 text-black md:mb-2 w-fit  md:hidden mt-4"
        />
      </div>

      {/* absolute image */}
      <Image
        src={"/logo/logov1.png"}
        title="logo"
        alt="logo"
        className="absolute bottom-0  w-48 -left-5 hidden md:block -z-10 -rotate-45 opacity-20"
        width={500}
        height={500}
      />
    </div>
  );
};

export default PackagesSection;
