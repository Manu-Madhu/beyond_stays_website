"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Button from "../ui/Button";
import Link from "next/link";
import { FiMenu } from "react-icons/fi";
import { IoClose } from "react-icons/io5";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <header
      className={`fixed top-0 left-0 w-full h-[75px] z-40 transition-all duration-300 ${
        scrolled
          ? "bg-white/60 backdrop-blur-md  shadow-lg z-40"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-[1350px] mx-auto h-full flex items-center justify-between px-5 md:px-8">
        {/* Logo */}
        <Link title="logo" href={"/"}>
          <Image
            src={scrolled ? "/logo/logo2.png" : "/logo/logo2white.png"}
            alt="logo"
            width={700}
            height={700}
            className="w-[110px]"
          />
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-8 font-semibold">
          <ul
            className={`flex items-center gap-8 text-sm ${
              scrolled ? "text-black" : "text-white"
            }`}
          >
            <li className="cursor-pointer hover:opacity-70 transition">Home</li>
            <li className="cursor-pointer hover:opacity-70 transition">
              About Us
            </li>
            <li className="cursor-pointer hover:opacity-70 transition">
              Package
            </li>
            <li className="cursor-pointer hover:opacity-70 transition">
              Gallery
            </li>
          </ul>
          <Button
            title="Contact Now"
            className={`text-sm ${
              scrolled
                ? "bg-black text-white hover:bg-gray-800 border-2 border-black"
                : "border-2 text-white hover:bg-white/10"
            }`}
            link="/contact"
          />
        </nav>

        {/* Hamburger Menu (Mobile) */}
        <div className="md:hidden flex items-center">
          {menuOpen ? (
            <IoClose
              size={28}
              onClick={toggleMenu}
              className={`cursor-pointer ${
                scrolled ? "text-black" : "text-white"
              }`}
            />
          ) : (
            <FiMenu
              size={28}
              onClick={toggleMenu}
              className={`cursor-pointer ${
                scrolled ? "text-black" : "text-white"
              }`}
            />
          )}
        </div>
      </div>

      {/* Mobile Slide Menu */}
      <div className={`fixed top-0 right-0 h-screen w-[70%] sm:w-[50%] bg-white backdrop-blur-md shadow-lg transform transition-transform duration-300 z-50 ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full p-6">
          <div className="flex justify-between items-center mb-8">
            <Image
              src="/logo/logo2.png"
              alt="logo"
              width={700}
              height={700}
              className="w-[100px]"
            />
            <IoClose
              size={26}
              className="cursor-pointer text-black"
              onClick={toggleMenu}
            />
          </div>

          <ul className="flex flex-col gap-6 text-lg font-semibold text-gray-800">
            <li
              onClick={toggleMenu}
              className="cursor-pointer hover:text-black transition"
            >
              Home
            </li>
            <li
              onClick={toggleMenu}
              className="cursor-pointer hover:text-black transition"
            >
              About Us
            </li>
            <li
              onClick={toggleMenu}
              className="cursor-pointer hover:text-black transition"
            >
              Package
            </li>
            <li
              onClick={toggleMenu}
              className="cursor-pointer hover:text-black transition"
            >
              Gallery
            </li>
          </ul>

          <div className="mt-auto pt-10">
            <Button
              title="Contact Now"
              className="bg-black text-white w-full py-3 hover:bg-gray-800"
              link=""
            />
          </div>
        </div>
      </div>

      {/* Overlay for smooth fade effect */}
      {menuOpen && (
        <div
          onClick={toggleMenu}
          className="fixed inset-0 bg-black/20 bg-opacity-40 z-30 transition-opacity"
        ></div>
      )}
    </header>
  );
};

export default Navbar;
