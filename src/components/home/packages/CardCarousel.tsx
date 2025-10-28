"use client";
import React, { useRef } from "react";
import { CardData } from "@/types/CardData";
import Link from "next/link";

interface CardCarouselProps {
  cards: CardData[];
}

const CardCarousel: React.FC<CardCarouselProps> = ({ cards }) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const scroll = (direction: "next" | "prev") => {
    const container = scrollRef.current;
    if (!container) return;

    const cardWidth = (container.firstChild as HTMLElement)?.offsetWidth ?? 0;
    const scrollAmount =
      direction === "next" ? cardWidth + 20 : -cardWidth - 20;
    container.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  return (
    <div className="relative">
      {/* Scrollable Cards */}
      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-scroll scroll-smooth no-scrollbar"
      >
        {cards.map((card) => (
          <div
            key={card.id}
            className="relative rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-500 group min-w-[85%] sm:min-w-[45%] md:min-w-[23%] h-[450px] cursor-pointer"
          >
            {/* Image */}
            <img
              src={card.images[0]}
              alt={card.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />

            {/* Overlay Blur */}
            <div className="absolute inset-0 bg-black/20 backdrop-blur-0 transition-all duration-500 group-hover:bg-black/40 group-hover:backdrop-blur-sm"></div>

            {/* Text Content */}
            <div className="absolute bottom-0 left-0 w-full p-5 text-white z-10">
              <h2 className="primaryFont font-bold text-2xl leading-7 line-clamp-2 tracking-wider">
                {card.title}
              </h2>
              <p className="font-semibold text-sm mt-3">{card.category}</p>
            </div>

            {/* Read More Bubble */}
            <Link title="package detailed page" href={'/property/property-one-beyond-stays'}>
              <div className="absolute top-[12%] right-20 translate-x-1/2 -translate-y-1/2 bg-black/80 rounded-full w-[130px] h-[130px] flex items-center justify-center 
                scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]"
              >
                <h3 className="uppercase text-white text-[15px] tracking-wide font-semibold">
                  Read More
                </h3>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <div className="hidden md:flex justify-end gap-4 mt-4 text-black font-semibold text-[15px]">
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
            className="w-5 h-5"
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
          className="hover:opacity-70 transition  cursor-pointer"
          aria-label="Next"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5"
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
  );
};

export default CardCarousel;
