import Header from "@/components/common/Header";
import Button from "@/components/ui/Button";
import Image from "next/image";
import React from "react";

const AboutUsSection = () => {
  return (
    <div className="mt-5 md:mt-25 relative h-[60vh] md:min-h-screen overflow-hidden w-full">
      <div className="max-w-[1350px] mx-auto md:min-h-screen p-5 md:px-8 flex justify-start z-30 md:z-50">
        <div className="z-30 md:z-50 gap-0 md:mt-[5%]">
          <h2 className="titleHeader text-[40px] md:text-[80px] leading-11 md:leading-20 uppercase">
            We’re <br /> not bound <br /> by city limits
          </h2>
        </div>
      </div>
      <div className="md:absolute bottom-0 h-full md:min-w-[81%] right-0 z-10 rounded-tl-2xl md:bg-[#64CCC9] flex md:items-end md:justify-end">
        <div className="w-full h-full z-50 relative">
          <div className="bg-white h-[35%] w-full z-50 absolute bottom-0 p-5">
            <h3 className="titleHeader text-[30px]">BEYOND STAYS</h3>
            <p className="mt-3 text-justify">
              At Beyond Stays, we believe travel is more than just visiting new
              places — it’s about creating stories that stay with you forever.
              Our mission is to take you beyond ordinary stays and into
              extraordinary experiences that blend comfort, culture, and
              adventure. Whether you’re seeking a peaceful escape in the
              mountains, a beachside retreat, or an international getaway, our
              curated travel packages are designed to fit every traveler’s
              dream. With a passionate team of travel experts, we ensure every
              journey is seamless — from personalized itineraries to handpicked
              accommodations and local experiences that truly capture the spirit
              of each destination. At Beyond Stays, we don’t just plan trips —
              we craft journeys that inspire, connect, and leave you with
              memories that last a lifetime.
            </p>
          </div>
        </div>
        <Image
          src={"/assets/images/packages/9.jpg"}
          title="Banner"
          alt="Banner"
          className="object-end object-cover w-full md:h-full"
          width={700}
          height={700}
        />
      </div>
    </div>
  );
};

export default AboutUsSection;
