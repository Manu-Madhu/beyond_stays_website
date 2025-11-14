import AboutContentOne from "@/components/about/AboutContentOne";
import CommonHeroSection from "@/components/common/CommonHeroSection";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: `Properties | Beyond Stays - Luxury Travel Experience`,
  description:
    "Discover Beyond Stays’ handpicked properties across breathtaking destinations. From boutique retreats to luxury villas, find your perfect stay with us.",
  keywords: ["luxury camping", "travel", "adventure", "nature", "beyond stays"],
  openGraph: {
    title: `Properties  | Beyond Stays - Luxury Travel Experience`,
    description:
      "Discover Beyond Stays’ handpicked properties across breathtaking destinations. From boutique retreats to luxury villas, find your perfect stay with us.",
    type: "website",
    url: "https://beyondstays.com/properties",
    siteName: "Beyond Stays"
  }
};

const PackagePage = () => {
  return (
    <div>
      {/* Hero section  */}
      <CommonHeroSection
        banner="/assets/images/packages/4.jpg"
        title="Our Properties"
      />

      {/* About Content one */}
      <AboutContentOne />
    </div>
  );
};

export default PackagePage;
