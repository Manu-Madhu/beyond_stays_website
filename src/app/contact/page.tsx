import CommonHeroSection from "@/components/common/CommonHeroSection";
import ContactUsSection from "@/components/contactPage/ContactUsSection";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: `Contact Us | Beyond Stays - Luxury Travel Experience`,
  description: 'Get in touch with Beyond Stays for bookings, inquiries, or assistance. Our team is here to help you plan your perfect stay and unforgettable getaway.',
  keywords: ["luxury camping", "travel", "adventure", "nature", 'beyond stays', 'gallery'],
  openGraph: {
    title: `Contact Us | Beyond Stays - Luxury Travel Experience`,
    description: 'Get in touch with Beyond Stays for bookings, inquiries, or assistance. Our team is here to help you plan your perfect stay and unforgettable getaway.',
    type: "website",
    url: "https://beyondstays.com/contact",
    siteName: "Beyond Stays",
  },
}


const ContactPage = () => {
  return (
    <div>
      {/* Hero Section */}
      <CommonHeroSection
        banner="/assets/images/packages/14.jpg"
        title="Contact Us."
      />

      {/* Session */}
      <ContactUsSection />
    </div>
  );
};

export default ContactPage;
