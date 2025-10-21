"use client";
import { BiMailSend, BiMapPin, BiPhone } from "react-icons/bi";
import ContactForm from "./ContactForm";
import Header from "../common/Header";

const ContactUsSection = () => {
  return (
    <section className="mt-8 mb-14 md:my-20 bg-white">
      <div className="max-w-[1350px] p-5 md:px-8 mx-auto">
        {/* Header */}
        <Header
          title="Get in Touch"
          description="Have a question or want to work together? We'd love to hear from you. Send us a message and we'll respond as soon as possible."
          className="w-full md:w-[50%] gap-2 md:gap-10 flex flex-col md:flex-row md:items-end"
        ></Header>

        {/* Contact Form */}
        <div className="w-full flex flex-col md:flex-row  mt-8 md:mt-16">
          <div className="w-full md:w-[50%] md:grid md:grid-cols-1 gap-10 mb-10 hidden">
            {/* Contact Info Cards */}
            <div className="flex flex-col items-start">
              <div className="flex items-center gap-2">
                <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-4">
                  <BiMailSend className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-black mb-2">Email</h3>
              </div>

              <p className="text-gray-600">beyondstayspvtltd@gmail.com</p>
              <p className="text-gray-600">support@travelwithbeyondstays.com</p>
            </div>

            <div className="flex flex-col items-start">
              <div className="flex items-center gap-2">
                <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-4">
                  <BiPhone className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-black mb-2">Phone</h3>
              </div>
              <p className="text-gray-600">+91 90207 62726</p>
              <p className="text-gray-600">Mon - Fri, 9am - 6pm IST</p>
            </div>

            <div className="flex flex-col items-start">
              <div className="flex items-center gap-2">
                <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-4">
                  <BiMapPin className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-black mb-2">
                  Location
                </h3>
              </div>
              <p className="text-gray-600">TC 81/4131, NEAR POORNA HOTEL,</p>
              <p className="text-gray-600">STATUE, Thiruvananthapuram G.P.O.,</p>
              <p className="text-gray-600">Thiruvananthapuram, Kerala, India,</p>
              <p className="text-gray-600">695001.</p>
            </div>
          </div>
          <div className="w-full">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactUsSection;
