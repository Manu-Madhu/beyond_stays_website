import AboutContentOne from "@/components/about/AboutContentOne";
import CommonHeroSection from "@/components/common/CommonHeroSection";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: `Stays | Beyond Stays - Luxury Travel Experience`,
  description:
    "Discover Beyond Stays’ handpicked stays across breathtaking destinations. From boutique retreats to luxury villas, find your perfect stay with us.",
  keywords: ["luxury camping", "travel", "adventure", "nature", "beyond stays"],
  openGraph: {
    title: `Stays | Beyond Stays - Luxury Travel Experience`,
    description:
      "Discover Beyond Stays’ handpicked stays across breathtaking destinations. From boutique retreats to luxury villas, find your perfect stay with us.",
    type: "website",
    url: "https://travelwithbeyondstays.com/stays",
    siteName: "Beyond Stays"
  }
};

const StaysPage = () => {
  return (
    <div>
      {/* Hero section  */}
      <CommonHeroSection
        banner="/assets/images/packages/4.jpg"
        title="Our Stays"
      />

      {/* About Content one */}
      <AboutContentOne />
    </div>
  );
};

export default StaysPage;
