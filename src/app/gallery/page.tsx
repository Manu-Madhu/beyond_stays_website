import CommonHeroSection from "@/components/common/CommonHeroSection";
import GalleryListing from "@/components/home/gallery/GalleryListing";
import React from "react";

const GalleryPage = () => {
  return (
    <>
      {/* Common Hero Setion */}
      <CommonHeroSection
        banner={"/assets/images/packages/10.jpeg"}
        title="Our Adventures Snapped"
      />

      {/* Gallery Setion */}
      <GalleryListing />
    </>
  );
};

export default GalleryPage;
