"use client";
import type React from "react";
import { useState } from "react";
import Button from "../ui/Button";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });

  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setStatus("success");
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: ""
        });
        // Clear success message after 5 seconds
        setTimeout(() => setStatus(""), 5000);
      } else {
        setStatus("error");
      }
    } catch (error) {
      setStatus("error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name and Email Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-black mb-2">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all bg-white text-black placeholder-gray-400"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-black mb-2">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="john@example.com"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all bg-white text-black placeholder-gray-400"
          />
        </div>
      </div>

      {/* Phone and Subject Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-black mb-2">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            name="phone"
            required
            value={formData.phone}
            onChange={handleChange}
            placeholder="+91 5635954215"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all bg-white text-black placeholder-gray-400"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-black mb-2">
            Subject <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="subject"
            required
            value={formData.subject}
            onChange={handleChange}
            placeholder="How can we help?"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all bg-white text-black placeholder-gray-400"
          />
        </div>
      </div>

      {/* Message */}
      <div>
        <label className="block text-sm font-semibold text-black mb-2">
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          name="message"
          rows={6}
          required
          value={formData.message}
          onChange={handleChange}
          placeholder="Tell us more about your inquiry..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all bg-white text-black placeholder-gray-400 resize-none"
        />
        <p className="text-xs text-gray-500 text-start mt-2">
          We'll respond to your message within 24 hours.
        </p>
      </div>

      {/* Status Messages */}
      {status === "success" && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 font-medium">
            ✓ Message sent successfully! We'll get back to you soon.
          </p>
        </div>
      )}

      {status === "error" && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 font-medium">
            ✗ Failed to send message. Please try again.
          </p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="relative overflow-hidden rounded-full border-2 cursor-pointer p-2.5 px-5 text-[16px] leading-[19px] text-black transition-all duration-500 ease-out group disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="relative z-10 transition-colors duration-500 group-hover:text-white text-nowrap text-[16px] font-[600] flex items-center justify-center gap-2">
          {isLoading ? "Sending..." : "Send Message"}
        </span>
        <span className="absolute inset-0 bg-black translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out"></span>
      </button>
    </form>
  );
};

export default ContactForm;
