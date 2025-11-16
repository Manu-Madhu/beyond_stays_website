import React from "react";
import Header from "../common/Header";

export default function PrivacyPolicySession() {
  return (
    <main className="min-h-screen p-6 md:p-12 bg-gray-50 text-gray-800">
      <section className="max-w-[1350px] mx-auto  p-8 space-y-6">
        <Header
          title="Privacy Policy - Beyond Stays"
          description=""
          className="w-full md:w-[80%] gap-2 md:gap-10 flex flex-col md:flex-row md:items-end"
        ></Header>
        <p className="text-lg text-gray-600">Last Updated: January 2025</p>

        <section className="space-y-6 mt-6 text-gray-700">
          <h2 className="text-xl font-semibold">1. Information We Collect</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Account details (name, email, employee ID)</li>
            <li>Login information for authentication</li>
            <li>Booking & inquiry details</li>
            <li>Resort onboarding information</li>
            <li>Device logs for security</li>
          </ul>

          <h2 className="text-xl font-semibold">
            2. How We Use Your Information
          </h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Authenticate and secure user access</li>
            <li>Manage bookings and inquiries</li>
            <li>Onboard new resort partners</li>
            <li>Improve operational workflows</li>
          </ul>

          <h2 className="text-xl font-semibold">3. Data Sharing</h2>
          <p>We only share data with:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Authorized resort partners</li>
            <li>Internal Beyond Stays admin team</li>
            <li>Government authorities when required by law</li>
          </ul>

          <h2 className="text-xl font-semibold">4. Data Security</h2>
          <p>
            We use modern security practices to protect your data and limit
            system access to authorized users only.
          </p>

          <h2 className="text-xl font-semibold">5. User Responsibilities</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Do not share login credentials</li>
            <li>Use the app only for official purposes</li>
            <li>Report suspicious activity immediately</li>
          </ul>

          <h2 className="text-xl font-semibold">6. Contact Us</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Email: support@travelwithbeyondstays.com</li>
            <li>Phone: +91 90207 62726</li>
          </ul>
        </section>
      </section>
    </main>
  );
}
