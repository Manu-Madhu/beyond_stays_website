import { Metadata } from "next";
import AboutSection from "@/components/about/AboutSection";
import AboutUsContact from "@/components/about/AboutUsContact";
import CommonHeroSection from "@/components/common/CommonHeroSection";
import React from "react";

export const metadata: Metadata = {
  title: `About Us | Beyond Stays - Luxury Travel Experience`,
  description: 'Discover Beyond Stays – your perfect escape for unique boutique stays, curated experiences, and personalized hospitality across stunning destinations.',
  keywords: ["luxury camping", "travel", "adventure", "nature", 'beyond stays'],
  openGraph: {
    title: `About Us | Beyond Stays - Luxury Travel Experience`,
    description: 'Discover Beyond Stays – your perfect escape for unique boutique stays, curated experiences, and personalized hospitality across stunning destinations.',
    images: ["/assets/images/packages/4.jpg"],
    type: "website",
  },
}

const AboutUs = () => {
  return (
    <div>
      {/* Hero section  */}
      <CommonHeroSection
        banner="/assets/images/packages/4.jpg"
        title="About Us"
      />

      {/* About Section */}
      <AboutSection />

      {/* Contact us Redirection */}
      <AboutUsContact />
    </div>
  );
};

export default AboutUs;
