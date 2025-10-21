import Image from "next/image";
import React from "react";

const AboutSection = () => {
  return (
    <div className="max-w-[1350px] mx-auto px-5 md:px-8 mt-8 md:mt-20 overflow-hidden">
      <div className="w-full flex flex-col md:flex-row gap-5 md:gap-10">
        <div className="w-full h-full flex flex-col items-center justify-start">
          <h2 className="titleHeader text-[30px] md:text-[65px] leading-8 md:leading-16 font-bold uppercase md:w-[80%] z-10">
            Where Every Stay Becomes a Story
          </h2>
          <Image
            src={"/assets/images/packages/1.png"}
            alt="Gallery image 1"
            title="Gallery image 1"
            width={1920}
            height={1080}
            priority
            className="w-full h-[350px] md:h-[520px] object-cover object-center z-0 rounded-lg mt-5 md:-mt-6"
          />
        </div>
        <div className="w-full h-full ">
          <div className="md:w-[80%] text-justify md:text-start space-y-2 md:space-y-3">
            <hr className="w-[20%] h-2 bg-black mb-10 hidden md:block" />
            <p>
              <strong>B</strong>eyond Stays is all about making travel and stay
              experiences better. We plan special trips for people who want
              something unique and personal. Whether it’s a relaxing getaway, an
              adventure trip, or a quiet escape, we take care of everything —
              from choosing the perfect stay to planning your full journey.
            </p>
            <p>
              Whether it’s helping a resort improve or planning a custom holiday
              for a client, we do it with care and attention to detail. We
              believe every stay should feel special, and every trip should be
              easy and fun.
            </p>
            <p>
              With Beyond Stays, every stay becomes a story worth sharing. Our
              curated experiences are designed to connect travelers with
              authentic destinations, memorable activities, and personalized
              touches that turn ordinary trips into extraordinary memories.
            </p>
            <p>
              From boutique hotels and luxury villas to hidden local gems, we
              handpick accommodations that reflect the character of each
              destination. We work closely with property owners to ensure every
              detail — from amenities to ambience — exceeds expectations.
            </p>
            <p>
              Beyond Stays isn’t just about travel; it’s about creating moments
              that inspire, rejuvenate, and bring people closer to the world
              around them. Whether it’s savoring a sunset in a remote paradise
              or discovering a secret spot in a bustling city, we make sure
              every experience is seamless, comfortable, and unforgettable.
            </p>
            <p>
              Our team is passionate about travel, deeply knowledgeable about
              destinations, and committed to crafting journeys that are as
              unique as our clients. With us, every trip tells a story — your
              story.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;
