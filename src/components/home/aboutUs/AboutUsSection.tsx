"use client";
import Button from "@/components/ui/Button";
import Image from "next/image";
import React from "react";
import Slider from "react-slick";

const AboutUsSection = () => {
  const images = [
    "/assets/images/packages/2.1.jpg",
    "/assets/images/packages/2.jpeg",
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
    <div className="mt-8 md:mt-25 relative md:h-[450px] overflow-hidden w-full flex flex-col md:flex-row">
      <div className="max-w-[1350px] mx-auto h-full px-5 md:px-8 flex justify-start">
        <div className="gap-0">
          <h2 className="titleHeader text-[40px] md:text-[45px] leading-11 md:leading-12 uppercase">
            Where Every
            <br />
            Stay Becomes a Story
          </h2>
          <div className="md:w-[50%] md:pr-5 mt-5">
            <p className="mt-3 text-justify">
              <strong>B</strong>eyond Stays is all about making travel and stay
              experiences better. We plan special trips for people who want
              something unique and personal. Whether it’s a relaxing getaway, an
              adventure trip, or a quiet escape, we take care of everything —
              from choosing the perfect stay to planning your full journey.{" "}
              <br />
              Whether it’s helping a resort improve or planning a custom holiday
              for a client, we do it with care and attention to detail. We
              believe every stay should feel special, and every trip should be
              easy and fun. With Beyond Stays, {" "}
              <strong className="capitalize mt-1 text-sm text-gray-500">every stay becomes a story worth sharing.</strong>
            </p>
          </div>
          <Button
            title="Read More"
            link="/about-us"
            className="border-2 w-fit mt-5 hidden md:block"
          ></Button>
        </div>
      </div>

      {/* --- Carousel Section --- */}
      <div className="md:absolute w-full md:w-[50%] h-[320px] md:h-[450px] md:right-0 p-5 md:p-0 md:rounded-l-lg overflow-hidden">
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
        className="border-2 w-fit my-5 md:hidden mx-5"
      ></Button>
    </div>
  );
};

export default AboutUsSection;
