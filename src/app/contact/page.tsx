import CommonHeroSection from "@/components/common/CommonHeroSection";
import ContactUsSection from "@/components/contactPage/ContactUsSection";
import React from "react";

const ContactPage = () => {
  return (
    <div>
      {/* Hero Section */}
      <CommonHeroSection
        banner="/assets/images/packages/14.jpg"
        title="Connect With Us."
      />

      {/* Session */}
      <ContactUsSection />
    </div>
  );
};

export default ContactPage;
