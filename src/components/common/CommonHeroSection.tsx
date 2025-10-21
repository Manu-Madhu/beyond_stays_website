import { BannerProps } from "@/types/Common";
import Image from "next/image";
import React from "react";

const CommonHeroSection: React.FC<BannerProps> = ({
  banner,
  title,
  subtitle
}) => {
  return (
    <div className="h-[60vh] md:h-[70vh] w-full overflow-hidden relative">
      <Image
        src={banner}
        alt="Gallery image 1"
        title="Gallery image 1"
        width={1920} 
        height={1080}
        priority 
        className="w-full h-full absolute left-0 top-0 object-cover object-center z-0"
      />
      {/* Overlay to ensure text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>

      <div className="max-w-[1350px] mx-auto h-full px-5 md:px-8 flex flex-col items-start justify-center relative z-20">
        <h2 className="titleHeader text-white text-[40px] md:text-[50px] leading-11 md:leading-13 uppercase md:w-[70%]">
          {title}
        </h2>

        <div className="flex gap-3 mt-5">
          {subtitle?.length !== 0 &&
            subtitle?.map((item, index) => (
              <div
                key={index}
                className="bg-white py-1.5 px-5 text-sm font-semibold rounded-full"
              >
                {item}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default CommonHeroSection;
