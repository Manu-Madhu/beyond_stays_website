import React from "react";
import Button from "../ui/Button";

const HeroSection = () => {
  return (
    <div className=" md:min-h-screen w-full h-full overflow-x-hidden">
      <div className="w-full h-[100vh] relative flex items-center justify-center overflow-hidden">
        <video
          muted
          autoPlay
          loop
          playsInline
          className="w-full h-full object-cover"
        >
          {/* <source src={"/assets/video/coverVideo.mp4"} type="video/mp4" /> */}
          <source src={process.env.NEXT_PUBLIC_FIREBASE_STORAGE_URL || "/assets/video/coverVideo.mp4"} type="video/mp4" />
        </video>
        <div className="bg-black/20 absolute top-0 left-0 w-full h-full"></div>
        <div className="container flex flex-col gap-6 md:gap-10 items-center justify-end h-full absolute bottom-[30%] md:bottom-[12%]">
          <h2 className="uppercase text-center font-[800] leading-[50px] md:leading-[92px] text-[45px] md:text-[100px] text-white">
            Discover Your Adventure
          </h2>
          <Button
            title="Adventure With Us"
            link="/"
            className="border-2 text-white"
          />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
