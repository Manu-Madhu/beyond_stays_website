import CommonHeroSection from "@/components/common/CommonHeroSection";
import PrivacyPolicySession from "@/components/privacyPlicy/PrivacyPolicySession";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: `Privacy Policy | Beyond Stays - Internal Application`,
  description:
    "Read the Beyond Stays privacy policy to understand how we collect, use, and protect data within our internal employee and resort-partner application.",
  keywords: [
    "privacy policy",
    "beyond stays",
    "data protection",
    "internal app privacy",
    "employee privacy",
    "resort partner privacy"
  ],
  openGraph: {
    title: "Privacy Policy | Beyond Stays - Internal Application",
    description:
      "Learn how Beyond Stays manages data privacy and security for employees, admins, and resort partners using our internal application.",
    type: "website",
    url: "https://travelwithbeyondstays.com/privacy-policy",
    siteName: "Beyond Stays"
  }
};

const PrivacyPolicy = () => {
  return (
    <div>
      {/* Hero Section */}
      <CommonHeroSection
        banner="/assets/images/packages/14.jpg"
        title="Privacy Policy."
      />

      <PrivacyPolicySession />
    </div>
  );
};

export default PrivacyPolicy;
