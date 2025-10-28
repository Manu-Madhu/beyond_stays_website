'use client'
import React from "react";
import Button from "../ui/Button";

interface PackageCard {
  id: number;
  image: string;
  title: string;
  category: string;
}

const AboutContentOne = () => {
  const packageData: PackageCard[] = [
    {
      id: 1,
      image: "/assets/images/packages/10.jpeg",
      title: "Trekking Adventure Hills",
      category: "Mountain Package"
    },
    {
      id: 2,
      image: "/assets/images/packages/4.jpg",
      title: "Sunset Lake Camping",
      category: "Camping"
    },
    {
      id: 3,
      image: "/assets/images/packages/11.jpeg",
      title: "Mountain Hiking Expedition",
      category: "Mountain Package"
    },
    {
      id: 4,
      image: "/assets/images/packages/3.jpg",
      title: "Lakeside Camping Experience",
      category: "Camping"
    },
    {
      id: 5,
      image: "/assets/images/packages/2.jpeg",
      title: "Elephant View Parking",
      category: "Outdoor Activity"
    },
    {
      id: 6,
      image: "/assets/images/packages/2.jpeg",
      title: "Elephant View Parking",
      category: "Outdoor Activity"
    },
  ];

  const PackageCard = ({ card, isMobile = false }: { card: PackageCard; isMobile?: boolean }) => (
    <div
      className={`relative rounded-md overflow-hidden shadow-sm hover:shadow-lg transition-all duration-500 group cursor-pointer ${isMobile ? 'h-[300px]' : 'h-[450px]'
        }`}
    >
      {/* Image */}
      <img
        src={card.image}
        alt={card.title}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />

      {/* Overlay Blur */}
      <div className="absolute inset-0 backdrop-blur-0 transition-all duration-500 group-hover:bg-black/40 group-hover:backdrop-blur-sm"></div>

      {/* Text Content */}
      <div className="absolute bottom-0 left-0 w-full p-5 text-white z-10">
        <h2 className={`primaryFont font-bold line-clamp-2 tracking-wider ${isMobile ? 'text-xl leading-6' : 'text-2xl leading-7'
          }`}>
          {card.title}
        </h2>
        <p className={`font-semibold ${isMobile ? 'text-sm mt-2' : 'text-sm mt-3'}`}>
          {card.category}
        </p>
      </div>

      {/* Read More Bubble */}
      <div
        className={`absolute bg-black/80 rounded-full flex items-center justify-center 
                   scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100 
                   transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]
                   ${isMobile
            ? 'top-[15%] right-8 translate-x-1/2 -translate-y-1/2 w-[100px] h-[100px]'
            : 'top-[12%] right-20 translate-x-1/2 -translate-y-1/2 w-[130px] h-[130px]'
          }`}
      >
        <h3 className={`uppercase text-white tracking-wide font-semibold text-center ${isMobile ? 'text-[13px]' : 'text-[15px]'
          }`}>
          Read More
        </h3>
      </div>
    </div>
  );

  return (
    <div className="w-full h-full mt-8 md:mt-20 md:mb-30">
      <div className="max-w-[1350px] mx-auto w-full px-5 md:px-8">
        {/* Mobile View */}
        <div className="block md:hidden">
          <div className="grid grid-cols-1 gap-4">
            {packageData.map((card) => (
              <PackageCard key={card.id} card={card} isMobile={true} />
            ))}
          </div>
        </div>

        {/* Desktop View */}
        <div className="hidden md:block overflow-hidden">
          <div className="flex gap-3 flex-1 w-full overflow-hidden">
            {packageData.slice(0, 3).map((card) => (
              <div key={card.id} className="flex-1">
                <PackageCard card={card} />
              </div>
            ))}
          </div>
          <div className="flex gap-3 flex-1 w-full overflow-hidden mt-3">
            {packageData.slice(3, 5).map((card) => (
              <div key={card.id} className={card.id === 5 ? "flex-1" : "flex-1"}>
                <PackageCard card={card} />
              </div>
            ))}
          </div>
        </div>

        <Button
          title="Customize Your Trip"
          link="/contact"
          className={`border-2 text-black ${window.innerWidth < 768 ? 'w-full mt-6' : 'w-fit mt-5 md:mt-8'
            }`}
        />
      </div>
    </div>
  );
};

export default AboutContentOne;