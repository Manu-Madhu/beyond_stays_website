'use client'
import { ButtonProps } from "@/types/Common";
import { cn } from "@/utils/Cn.utils";
import Link from "next/link";
import React from "react";
import { BiRightArrow } from "react-icons/bi";

const Button: React.FC<ButtonProps> = ({
  title,
  link,
  className,
  children
}) => {
  return (
    <Link title={title} href={link || ""}>
      <div
        className={cn(
          "relative overflow-hidden rounded-full p-2.5 px-5 text-[16px] leading-[19px] text-black transition-all duration-500 ease-out group",
          className
        )}
      >
        <span className="relative z-10 transition-colors duration-500 group-hover:text-white text-nowrap text-[16px] font-[600] flex items-center justify-center gap-2">
          {title} <BiRightArrow />
        </span>

        {children}

        <span className="absolute inset-0 bg-black translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out"></span>
      </div>
    </Link>
  );
};

export default Button;
