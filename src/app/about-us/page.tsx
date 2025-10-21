import AboutContentOne from "@/components/about/AboutContentOne";
import AboutSection from "@/components/about/AboutSection";
import CommonHeroSection from "@/components/common/CommonHeroSection";
import React from "react";

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

      {/* About Content one */}
      <AboutContentOne/>

    </div>
  );
};

export default AboutUs;
