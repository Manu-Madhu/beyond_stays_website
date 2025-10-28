import AboutSection from "@/components/about/AboutSection";
import AboutUsContact from "@/components/about/AboutUsContact";
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

      {/* Contact us Redirection */}
      <AboutUsContact />
    </div>
  );
};

export default AboutUs;
