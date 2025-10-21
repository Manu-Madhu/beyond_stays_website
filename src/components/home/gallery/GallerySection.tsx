"use client";
import Header from "@/components/common/Header";
import Button from "@/components/ui/Button";
import Image from "next/image";
import React, { useState } from "react";

const GallerySection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const mobileImages = [
    "/assets/images/packages/10.jpeg",
    "/assets/images/packages/1.jpg",
    "/assets/images/packages/2.1.jpg",
    "/assets/images/packages/3.jpg",
    "/assets/images/packages/4.jpg",
    "/assets/images/packages/7.jpg",
    "/assets/images/event/1.jpg",
    "/assets/images/event/5.jpg"
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) =>
      prev === mobileImages.length - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? mobileImages.length - 1 : prev - 1
    );
  };

  return (
    <div className="mt-8 md:mt-20">
      {/* Mobile Layout - Carousel */}
      <div className="block md:hidden mb-10">
        {/* View Gallery Button for Mobile */}
        <div className="text-start px-4">
          <Header
            title="BEYOND GALLERY"
            className="w-full md:w-[20%] gap-2 md:gap-10 flex flex-col md:flex-row md:items-end"
          />
        </div>
        <div className="relative overflow-hidden rounded-lg mx-4 mt-2">
          {/* Carousel Container */}
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {mobileImages.map((src, index) => (
              <div key={index} className="w-full flex-shrink-0">
                <div className="relative overflow-hidden group ">
                  <Image
                    src={src}
                    alt={`Gallery image ${index + 1}`}
                    title={`Gallery image ${index + 1}`}
                    width={600}
                    height={400}
                    className="w-full h-[400px] object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-black/5 transition-all duration-300" />
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all duration-300"
            aria-label="Previous image"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all duration-300"
            aria-label="Next image"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-4 space-x-2">
            {mobileImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide ? "bg-black" : "bg-gray-300"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
        <div className="px-5 mt-4 text-center">
          <Button title="View Gallery" link="/gallery" className="border-2 " />
        </div>
      </div>

      {/* Desktop Layout - Multi Column (Unchanged) */}
      <div className="hidden md:flex gap-1">
        {/* Column 1 */}
        <div className="flex flex-col gap-1 flex-1">
          <div className="relative overflow-hidden group">
            <Image
              src={"/assets/images/packages/10.jpeg"}
              alt="Gallery image 1"
              title="Gallery image 1"
              width={300}
              height={500}
              className="w-full h-[245px] object-cover transition-transform duration-500 ease-out group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/20  group-hover:bg-black/5 transition-all duration-300" />
          </div>

          <div className="relative overflow-hidden  group">
            <Image
              src={"/assets/images/packages/1.jpg"}
              alt="Gallery image 2"
              title="Gallery image 2"
              width={300}
              height={500}
              className="w-full h-[250px] object-cover transition-transform duration-500 ease-out group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/20  group-hover:bg-black/5 transition-all duration-300" />
          </div>

          <div className="flex gap-1">
            <div className="relative overflow-hidden  group flex-1">
              <Image
                src={"/assets/images/event/4.jpeg"}
                alt="Gallery image 3"
                title="Gallery image 3"
                width={500}
                height={300}
                className="w-full h-[200px] object-cover transition-transform duration-500 ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/20  group-hover:bg-black/5 transition-all duration-300" />
            </div>
            <div className="relative overflow-hidden  group flex-1">
              <Image
                src={"/assets/images/packages/11.jpeg"}
                alt="Gallery image 4"
                title="Gallery image 4"
                width={500}
                height={300}
                className="w-full h-[200px] object-cover transition-transform duration-500 ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/5  group-hover:bg-black/5 transition-all duration-300" />
            </div>
          </div>
        </div>

        {/* Column 2 */}
        <div className="flex flex-col gap-1 flex-1">
          <div className="flex gap-1">
            <div className="relative overflow-hidden  group flex-1">
              <Image
                src={"/assets/images/packages/2.1.jpg"}
                alt="Gallery image 5"
                title="Gallery image 5"
                width={500}
                height={500}
                className="w-full h-[245px] object-cover transition-transform duration-500 ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/20  group-hover:bg-black/5 transition-all duration-300" />
            </div>
            <div className="relative overflow-hidden  group flex-1">
              <Image
                src={"/assets/images/packages/4.jpg"}
                alt="Gallery image 6"
                title="Gallery image 6"
                width={500}
                height={500}
                className="w-full h-[245px] object-cover transition-transform duration-500 ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/20  group-hover:bg-black/5 transition-all duration-300" />
            </div>
          </div>

          <div className="relative overflow-hidden  group">
            <Image
              src={"/assets/images/packages/7.jpg"}
              alt="Gallery image 7"
              title="Gallery image 7"
              width={500}
              height={500}
              className="w-full h-[250px] object-cover transition-transform duration-500 ease-out group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/20  group-hover:bg-black/5 transition-all duration-300" />
          </div>

          <div className="flex gap-1">
            <div className="relative overflow-hidden  group flex-1">
              <Image
                src={"/assets/images/packages/8.jpg"}
                alt="Gallery image 8"
                title="Gallery image 8"
                width={500}
                height={300}
                className="w-full h-[200px] object-cover transition-transform duration-500 ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/20  group-hover:bg-black/5 transition-all duration-300" />
            </div>
            <div className="relative overflow-hidden  group flex-1">
              <Image
                src={"/assets/images/packages/9.jpg"}
                alt="Gallery image 9"
                title="Gallery image 9"
                width={500}
                height={300}
                className="w-full h-[200px] object-cover transition-transform duration-500 ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/20  group-hover:bg-black/5 transition-all duration-300" />
            </div>
            <div className="relative overflow-hidden  group flex-1">
              <Image
                src={"/assets/images/packages/1.jpg"}
                alt="Gallery image 10"
                title="Gallery image 10"
                width={500}
                height={300}
                className="w-full h-[200px] object-cover transition-transform duration-500 ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/20  group-hover:bg-black/5 transition-all duration-300" />
            </div>
          </div>
        </div>

        {/* Column 3 */}
        <div className="relative overflow-hidden group flex-1 items-center justify-center">
          <Image
            src={"/assets/images/packages/3.jpg"}
            alt="Gallery image 11"
            title="Gallery image 11"
            width={500}
            height={300}
            className="w-full h-[702px] object-cover transition-transform duration-500 ease-out group-hover:scale-110"
          />
          <div className="absolute z-30 top-[40%] w-full flex flex-col items-center justify-center">
            <h2 className="titleHeader text-white mb-3 text-[25px]">
              # BEYOND STAYS
            </h2>
            <Button
              title="View Gallery"
              link="/gallery"
              className="bg-white text-xs text-black px-5"
            />
          </div>
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/5 transition-all duration-300" />
        </div>

        {/* Column 4 */}
        <div className="flex flex-col gap-1 flex-1">
          <div className="relative overflow-hidden  group">
            <Image
              src={"/assets/images/event/1.jpg"}
              alt="Gallery image 12"
              title="Gallery image 12"
              width={500}
              height={300}
              className="w-full h-[200px] object-cover transition-transform duration-500 ease-out group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/20  group-hover:bg-black/5 transition-all duration-300" />
          </div>
          <div className="relative overflow-hidden  group">
            <Image
              src={"/assets/images/event/3.jpeg"}
              alt="Gallery image 13"
              title="Gallery image 13"
              width={500}
              height={300}
              className="w-full h-[200px] object-cover transition-transform duration-500 ease-out group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/20  group-hover:bg-black/5 transition-all duration-300" />
          </div>
          <div className="relative overflow-hidden  group">
            <Image
              src={"/assets/images/event/5.jpg"}
              alt="Gallery image 14"
              title="Gallery image 14"
              width={500}
              height={300}
              className="w-full h-[295px] object-cover transition-transform duration-500 ease-out group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/20  group-hover:bg-black/5 transition-all duration-300" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GallerySection;
