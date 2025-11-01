"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import Header from "../common/Header";

interface PropertyGalleryProps {
  images: string[];
}

export default function PropertyGallery({ images }: PropertyGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const scroll = (direction: "next" | "prev") => {
    const container = scrollRef.current;
    if (!container) return;

    const cardWidth = (container.firstChild as HTMLElement)?.offsetWidth ?? 0;
    const scrollAmount =
      direction === "next" ? cardWidth + 24 : -cardWidth - 24; // small tweak for spacing

    container.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  if (!images || images.length === 0) return null;

  return (
    <section className="w-full mt-8 md:mt-25">
      <div className="max-w-[1350px] mx-auto h-full px-5 md:px-8">
        <div className="flex items-center justify-between">
          <Header
            title="Gallery"
            className="w-full md:w-[80%] gap-2 md:gap-10 flex flex-col md:flex-row md:items-end md:mb-6"
          />
          {/* Navigation Buttons */}
          <div className="hidden md:flex justify-end gap-4  text-black font-semibold text-[15px]">
            <button
              onClick={() => scroll("prev")}
              className="hover:opacity-70 transition cursor-pointer"
              aria-label="Previous"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <button
              onClick={() => scroll("next")}
              className="hover:opacity-70 transition cursor-pointer"
              aria-label="Next"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* ✅ Scrollable gallery */}
        <div className="relative">
          <div
            ref={scrollRef}
            className="flex gap-3 md:gap-5 overflow-x-scroll scroll-smooth no-scrollbar"
          >
            {images.map((src, index) => (
              <div
                key={index}
                onClick={() => setSelectedImage(src)}
                className="relative rounded-xl overflow-hidden cursor-pointer group flex-shrink-0 
                min-w-[95%] sm:min-w-[50%] md:min-w-[35%] lg:min-w-[25%] aspect-[4/6.5] md:aspect-[4/6]" // increased width & height
              >
                <Image
                  src={src}
                  alt={`Property Image ${index + 1}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-all duration-300"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ✅ Modal for full image view */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative w-[90vw] max-w-5xl h-[80vh]">
            <Image
              src={selectedImage}
              alt="Selected property image"
              fill
              className="object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </section>
  );
}
