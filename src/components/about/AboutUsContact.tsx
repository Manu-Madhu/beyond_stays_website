import React from "react";
import Button from "../ui/Button";

const AboutUsContact = () => {
  return (
    <div className="max-w-[1350px] mx-auto w-full px-5 md:px-8 mt-8 mb-14 md:mt-25 md:mb-30 overflow-hidden relative">
      <div className="max-h-[600px] rounded-md overflow-hidden">
        <img
          src={"/assets/images/packages/10.jpeg"}
          alt={"Trekking Adventure Hills"}
          className="w-full h-full object-cover "
        />
      </div>

      <div className="absolute bottom-0 px-5 md:px-8 p-2 md:p-5 right-0 bg-white max-w-[50%] rounded-tl-lg">
        <h2 className="titleHeader text-[16px] md:text-[45px] leading-5 md:leading-13 uppercase">
          Little Legs, Big Adventures: Hiking Beyond Stays with Kids
        </h2>

        <Button title="Connect Us" link="/contact" className="border-2 text-black w-fit mt-2 md:my-5 text-xs"></Button>
      </div>
    </div>
  );
};

export default AboutUsContact;
