import Image from "next/image";
import Link from "next/link";
import React from "react";
import Marquee from "react-fast-marquee";
import { BiPhone } from "react-icons/bi";
import { BsFacebook, BsInstagram, BsTwitter } from "react-icons/bs";
import { MdEmail } from "react-icons/md";

const Footer = () => {
  return (
    <>
      {/* Top Marque section */}
      <div className=" overflow-hidden border-t-2 border-t-black  md:hidden mb-2 mt-1">
        <Marquee gradient={false} speed={100} pauseOnHover={true}>
          <h1 className="titleHeader text-[50px] md:text-[170px] text-gray-900 text-center whitespace-nowrap ">
            # BEYOND STAYS &nbsp; # BEYOND STAYS &nbsp; # BEYOND STAYS &nbsp;
          </h1>
        </Marquee>
      </div>

      {/* bottom Marque section */}
      <div className=" overflow-hidden  border-t-black hidden md:flex">
        <Marquee gradient={false} speed={100} pauseOnHover={true}>
          <h1 className="titleHeader text-[50px] md:text-[120px] text-gray-900 text-center leading-[1] whitespace-nowrap mb-0 mt-0 overflow-hidden">
            # BEYOND STAYS &nbsp; # BEYOND STAYS &nbsp; # BEYOND STAYS &nbsp;
          </h1>
        </Marquee>
      </div>

      {/* Bottom footer section */}
      <div className="bg-[#000] w-full mt-1">
        <div className="max-w-[1350px] px-5 md:px-8 mx-auto w-full flex flex-col md:flex-row pt-8 md:pt-16">
          <div className="logo md:w-[75%] pb-7 md:pb-16">
            <Image
              src={"/logo/logo2white.png"}
              className="w-30"
              width={500}
              height={500}
              alt="logo"
              title="logo"
            />
            <p className="text-sm text-gray-300 text-justify md:w-[60%] mt-5">
              Beyond Stays offers handpicked stays and custom travel plans made
              just for you. From start to finish, we take care of the details so
              you can enjoy the journey.
            </p>
            <div className="text-gray-300  flex gap-3 mt-5">
              <Link href={"https://www.instagram.com/beyondstays?igsh=MXZ3Nzk4Nm5wZjI2YQ=="} title="instagram">
                <BsInstagram className="cursor-pointer hover:text-white" />
              </Link>
              <Link href={"https://www.facebook.com/share/1BWJcZ23dF/?mibextid=wwXIfr"} title="Facebook">
                <BsFacebook className="cursor-pointer hover:text-white" />
              </Link>
              <Link href={"/"} title="Twitter">
                <BsTwitter className="cursor-pointer hover:text-white" />
              </Link>
            </div>
          </div>
          <div className="w-full text-[#b3b3b3] text-sm font-[400] flex flex-col md:flex-row gap-5 md:gap-14 pb-10">
            <ul className="md:hidden flex-col gap-1 w-full">
              <p className="text-sm">
                TC 81/4131, NEAR POORNA HOTEL, STATUE, Thiruvananthapuram
                G.P.O., Thiruvananthapuram, Thiruvananthapuram, Kerala, India,
                695001
              </p>
              <p className="text-sm flex items-center gap-2  text-justify mt-2">
                <MdEmail /> beyondstayspvtltd@gmail.com
              </p>
              <p className="text-sm flex items-center gap-2 text-justify mt-2 text-nowrap">
                <BiPhone /> +91 90207 62726
              </p>
            </ul>
            <ul className="flex flex-col gap-2 text-nowrap">
              <li className="cursor-pointer hover:underline underline-offset-4 hover:decoration-white-200 hover:text-white">
                About Beyond stays
              </li>
              <li className="cursor-pointer hover:underline underline-offset-4 hover:decoration-white-200 hover:text-white">
                Packages
              </li>
              <li className="cursor-pointer hover:underline underline-offset-4 hover:decoration-white-200 hover:text-white">
                Contact Us
              </li>
              <li className="cursor-pointer hover:underline underline-offset-4 hover:decoration-white-200 hover:text-white">
                Customize Your Plan
              </li>
            </ul>
            <ul className="flex flex-col gap-2 text-nowrap">
              <li className="cursor-pointer hover:underline underline-offset-4 hover:decoration-white-200 hover:text-white">
                About Beyond stays
              </li>
              <li className="cursor-pointer hover:underline underline-offset-4 hover:decoration-white-200 hover:text-white">
                Packages
              </li>
              <li className="cursor-pointer hover:underline underline-offset-4 hover:decoration-white-200 hover:text-white">
                Contact Us
              </li>
            </ul>
            <ul className="flex flex-col gap-2 text-nowrap">
              <li className="cursor-pointer hover:underline underline-offset-4 hover:decoration-white-200 hover:text-white">
                Media
              </li>
              <li className="cursor-pointer hover:underline underline-offset-4 hover:decoration-white-200 hover:text-white">
                Plan Your Trip
              </li>
              <li className="cursor-pointer hover:underline underline-offset-4 hover:decoration-white-200 hover:text-white">
                Contact Us
              </li>
            </ul>
            <ul className="hidden md:flex flex-col gap-1 w-full">
              <p className="text-sm">
                TC 81/4131, NEAR POORNA HOTEL, STATUE, Thiruvananthapuram
                G.P.O., Thiruvananthapuram, Thiruvananthapuram, Kerala, India,
                695001
              </p>
              <p className="text-sm flex items-center gap-2  text-justify mt-2">
                <MdEmail /> beyondstayspvtltd@gmail.com
              </p>
              <p className="text-sm flex items-center gap-2 text-justify mt-2 text-nowrap">
                <BiPhone /> +91 90207 62726
              </p>
            </ul>
          </div>
        </div>

        {/* bottom footer */}
        <div className="max-w-[1350px] px-5 md:px-8 mx-auto w-full ">
          <div className="border-t border-gray-300 w-full space-x-3 py-4 md:py-6 text-xs text-gray-300  flex flex-col md:flex-row md:justify-between md:items-center gap-2 ">
            <p className="">
              ©{new Date().getFullYear()} Beyond Stays INDIA. All Rights
              Reserved.
            </p>
            <p>
              Developed By{" "}
              <a
                href="https://www.linkedin.com/in/manu-m-madhu/"
                target="_blank"
                title="Developer URL"
                className="hover:underline hover:text-white cursor-pointer"
              >
                Manu M.
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
