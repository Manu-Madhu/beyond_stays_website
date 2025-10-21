import Image from "next/image";
import React from "react";
import Button from "../ui/Button";

const AboutContentOne = () => {
  return (
    <div className="w-full h-full mt-8 md:mt-20 md:mb-30 hidden md:block">
      <div className="max-w-[1350px] mx-auto w-full px-5 md:px-8 overflow-hidden">
        {/* Column 1 */}
        <div className="flex gap-3 flex-1 w-full overflow-hidden">
          <div className="relative rounded-md overflow-hidden shadow-sm hover:shadow-lg transition-all duration-500 group h-[450px] cursor-pointer">
            {/* Image */}
            <img
              src={"/assets/images/packages/10.jpeg"}
              alt={"Trekking Adventure Hills"}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />

            {/* Overlay Blur */}
            <div className="absolute inset-0  backdrop-blur-0 transition-all duration-500 group-hover:bg-black/40 group-hover:backdrop-blur-sm"></div>

            {/* Text Content */}
            <div className="absolute bottom-0 left-0 w-full p-5 text-white z-10">
              <h2 className="primaryFont font-bold text-2xl leading-7 line-clamp-2 tracking-wider">
                {"Trekking Adventure Hills"}
              </h2>
              <p className="font-semibold text-sm mt-3">{"Mountain Package"}</p>
            </div>

            {/* Read More Bubble */}
            <div
              className="absolute top-[12%] right-20 translate-x-1/2 -translate-y-1/2 bg-black/80 rounded-full 
                         w-[130px] h-[130px] flex items-center justify-center 
                         scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100 
                         transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]"
            >
              <h3 className="uppercase text-white text-[15px] tracking-wide font-semibold">
                Read More
              </h3>
            </div>
          </div>
          <div className="relative rounded-md overflow-hidden shadow-sm hover:shadow-lg transition-all duration-500 group h-[450px] cursor-pointer">
            {/* Image */}
            <img
              src={"/assets/images/packages/4.jpg"}
              alt={"Sunset Lake Camping"}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />

            {/* Overlay Blur */}
            <div className="absolute inset-0  backdrop-blur-0 transition-all duration-500 group-hover:bg-black/40 group-hover:backdrop-blur-sm"></div>

            {/* Text Content */}
            <div className="absolute bottom-0 left-0 w-full p-5 text-white z-10">
              <h2 className="primaryFont font-bold text-2xl leading-7 line-clamp-2 tracking-wider">
                {"Sunset Lake Camping"}
              </h2>
              <p className="font-semibold text-sm mt-3">{"Camping"}</p>
            </div>

            {/* Read More Bubble */}
            <div
              className="absolute top-[12%] right-20 translate-x-1/2 -translate-y-1/2 bg-black/80 rounded-full 
                         w-[130px] h-[130px] flex items-center justify-center 
                         scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100 
                         transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]"
            >
              <h3 className="uppercase text-white text-[15px] tracking-wide font-semibold">
                Read More
              </h3>
            </div>
          </div>
          <div className="relative rounded-md overflow-hidden shadow-sm hover:shadow-lg transition-all duration-500 group h-[450px] cursor-pointer">
            {/* Image */}
            <img
              src={"/assets/images/packages/11.jpeg"}
              alt={"card.title"}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />

            {/* Overlay Blur */}
            <div className="absolute inset-0 backdrop-blur-0 transition-all duration-500 group-hover:bg-black/40 group-hover:backdrop-blur-sm"></div>

            {/* Text Content */}
            <div className="absolute bottom-0 left-0 w-full p-5 text-white z-10">
              <h2 className="primaryFont font-bold text-2xl leading-7 line-clamp-2 tracking-wider">
                {"Trekking Adventure Hills"}
              </h2>
              <p className="font-semibold text-sm mt-3">{"Mountain Package"}</p>
            </div>

            {/* Read More Bubble */}
            <div
              className="absolute top-[12%] right-20 translate-x-1/2 -translate-y-1/2 bg-black/80 rounded-full 
                         w-[130px] h-[130px] flex items-center justify-center 
                         scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100 
                         transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]"
            >
              <h3 className="uppercase text-white text-[15px] tracking-wide font-semibold">
                Read More
              </h3>
            </div>
          </div>
        </div>
        {/* Column 2*/}
        <div className="flex gap-3 flex-1 w-full overflow-hidden mt-3">
          <div className="relative rounded-md overflow-hidden shadow-sm hover:shadow-lg transition-all duration-500 group h-[450px] cursor-pointer">
            {/* Image */}
            <img
              src={"/assets/images/packages/3.jpg"}
              alt={"Camping"}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />

            {/* Overlay Blur */}
            <div className="absolute inset-0  backdrop-blur-0 transition-all duration-500 group-hover:bg-black/40 group-hover:backdrop-blur-sm"></div>

            {/* Text Content */}
            <div className="absolute bottom-0 left-0 w-full p-5 text-white z-10">
              <h2 className="primaryFont font-bold text-2xl leading-7 line-clamp-2 tracking-wider">
                {"Sunset Lake Camping"}
              </h2>
              <p className="font-semibold text-sm mt-3">{"Camping"}</p>
            </div>

            {/* Read More Bubble */}
            <div
              className="absolute top-[12%] right-20 translate-x-1/2 -translate-y-1/2 bg-black/80 rounded-full 
                         w-[130px] h-[130px] flex items-center justify-center 
                         scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100 
                         transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]"
            >
              <h3 className="uppercase text-white text-[15px] tracking-wide font-semibold">
                Read More
              </h3>
            </div>
          </div>
          <div className="relative rounded-md overflow-hidden shadow-sm hover:shadow-lg transition-all duration-500 group w-full h-[450px] cursor-pointer">
            {/* Image */}
            <img
              src={"/assets/images/packages/2.jpeg"}
              alt={"Outdoor Activity"}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />

            {/* Overlay Blur */}
            <div className="absolute inset-0 backdrop-blur-0 transition-all duration-500 group-hover:bg-black/40 group-hover:backdrop-blur-sm"></div>

            {/* Text Content */}
            <div className="absolute bottom-0 left-0 w-full p-5 text-white z-10">
              <h2 className="primaryFont font-bold text-2xl leading-7 line-clamp-2 tracking-wider">
                {"Elephant View Parking"}
              </h2>
              <p className="font-semibold text-sm mt-3">{"Outdoor Activity"}</p>
            </div>

            {/* Read More Bubble */}
            <div
              className="absolute top-[12%] right-20 translate-x-1/2 -translate-y-1/2 bg-black/80 rounded-full 
                         w-[130px] h-[130px] flex items-center justify-center 
                         scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100 
                         transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]"
            >
              <h3 className="uppercase text-white text-[15px] tracking-wide font-semibold">
                Read More
              </h3>
            </div>
          </div>
        </div>
        <Button
          title="Customize Your Trip"
          link="/"
          className="border-2 text-black w-fit mt-5 md:mt-8"
        />
      </div>
    </div>
  );
};

export default AboutContentOne;
