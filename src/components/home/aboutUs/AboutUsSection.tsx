"use client";
import Button from "@/components/ui/Button";
import Image from "next/image";
import React from "react";
import Slider from "react-slick";

const AboutUsSection = () => {
  const images = [
    "/assets/images/packages/2.jpeg",
    "/assets/images/packages/2.1.jpg",
    "/assets/images/packages/10.jpeg",
    "/assets/images/event/2.jpg",
    "/assets/images/packages/11.jpeg"
  ];

  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 4000,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    pauseOnHover: false,
    dotsClass: "slick-dots custom-dots"
  };

  return (
    <div className="mt-8 md:mt-20 relative min-h-[65vh] overflow-hidden w-full flex flex-col md:flex-row">
      <div className="max-w-[1350px] mx-auto h-full px-5 md:px-8 flex justify-start">
        <div className="gap-0">
          <h2 className="titleHeader text-[40px] md:text-[45px] leading-11 md:leading-12 uppercase">
            We’re not bound <br /> by city limits
          </h2>
          <div className="md:w-[50%] md:pr-5 mt-5">
            <p className="mt-3 text-justify">
              <strong>A</strong>t Beyond Stays, we believe travel is more than
              just visiting new places — it’s about creating stories that stay
              with you forever. Our mission is to take you beyond ordinary stays
              and into extraordinary experiences that blend comfort, culture,
              and adventure. Whether you’re seeking a peaceful escape in the
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
          <Button
            title="Know More"
            link="/"
            className="border border-2 w-fit mt-5 hidden md:block"
          ></Button>
        </div>
      </div>

      {/* --- Carousel Section --- */}
      <div className="md:absolute w-full md:w-[50%] md:right-0 p-5 md:p-0 md:rounded-l-lg overflow-hidden">
        <Slider {...settings}>
          {images.map((src, i) => (
            <div key={i}>
              <Image
                src={src}
                alt={`Slide ${i + 1}`}
                width={700}
                height={700}
                className="object-cover object-center w-full h-[300px] md:h-[450px] md:rounded-l-lg "
              />
            </div>
          ))}
        </Slider>
      </div>

      <Button
        title="Know More"
        link="/"
        className="border border-2 w-fit mb-5 md:hidden mx-5"
      ></Button>
    </div>
  );
};

export default AboutUsSection;
