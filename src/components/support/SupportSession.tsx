import React from "react";
import Header from "../common/Header";

const SupportSession = () => {
  return (
    <main className="min-full p-6 md:p-12 bg-white text-gray-800">
      <section className="max-w-[1350px] mx-auto bg-white rounded-2xl p-8 space-y-6">
        {/* Header */}
        <Header
          title="Support - Beyond Stays"
          description=" We are here to help you with any questions or issues related to the
          Beyond Stays internal application."
          className="w-full md:w-[50%] gap-2 md:gap-10 flex flex-col md:flex-row md:items-end"
        ></Header> 

        <div className="space-y-6 border-t pt-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            📞 Contact Support
          </h2>
          <ul className="list-disc pl-6 text-gray-600 space-y-1">
            <li>Email: support@travelwithbeyondstays.com</li>
            <li>Phone: +91 90207 62726</li>
            <li>Working Hours: Mon – Sat (9 AM – 6 PM IST)</li>
          </ul>
        </div>

        {/* <div className="space-y-6 border-t pt-6">
          <h2 className="text-xl font-semibold">📘 Documentation</h2>
          <a className="text-blue-600 underline" href="#">
            View Documentation
          </a>
        </div> */}

        <div className="space-y-6 border-t pt-6">
          <h2 className="text-xl font-semibold">🔐 Privacy Policy</h2>
          <a href="/privacy-policy" className="text-blue-600 underline">
            Read Privacy Policy
          </a>
        </div>
      </section>
    </main>
  );
};

export default SupportSession;
