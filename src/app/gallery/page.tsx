import CommonHeroSection from "@/components/common/CommonHeroSection";
import GalleryListing from "@/components/home/gallery/GalleryListing";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: `Gallery | Beyond Stays - Luxury Travel Experience`,
  description: 'Explore the Beyond Stays image gallery and discover breathtaking destinations, cozy stays, and unforgettable experiences captured in every moment.',
  keywords: ["luxury camping", "travel", "adventure", "nature", 'beyond stays', 'gallery'],
  openGraph: {
    title: `Gallery | Beyond Stays - Luxury Travel Experience`,
    description: 'Explore the Beyond Stays image gallery and discover breathtaking destinations, cozy stays, and unforgettable experiences captured in every moment.',
    type: "website",
    url: "https://travelwithbeyondstays.com/gallery",
    siteName: "Beyond Stays",
  },
}


export const generateMetadata =()=>{
    
}

const GalleryPage = () => {
  
  return (
    <>
      {/* Common Hero Setion */}
      <CommonHeroSection
        banner={"/assets/images/packages/10.jpeg"}
        title="Our Adventures"
      />

      {/* Gallery Setion */}
      <GalleryListing />
    </>
  );
};

export default GalleryPage;
