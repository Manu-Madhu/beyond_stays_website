// pages/support.tsx
import CommonHeroSection from "@/components/common/CommonHeroSection";
import SupportSession from "@/components/support/SupportSession";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: `Support | Beyond Stays - Internal App Assistance`,
  description:
    "Get support for the Beyond Stays internal application. Contact our team for help with bookings, onboarding, employee access, or resort partner assistance.",
  keywords: [
    "beyond stays",
    "support",
    "help",
    "internal app",
    "resort management",
    "employee app",
    "partner onboarding",
    "booking support"
  ],
  openGraph: {
    title: `Support | Beyond Stays - Internal App Assistance`,
    description:
      "Need help with the Beyond Stays internal app? Contact our support team for assistance with login, bookings, onboarding, and resort operations.",
    type: "website",
    url: "https://travelwithbeyondstays.com/support",
    siteName: "Beyond Stays"
  }
};

export default function SupportPage() {
  return (
    <>
      {/* Hero Section */}
      <CommonHeroSection
        banner="/assets/images/packages/14.jpg"
        title="Support."
      />

      <SupportSession />
    </>
  );
}
