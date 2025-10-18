import { HeaderProps } from "@/types/Common";
import { cn } from "@/utils/Cn.utils";
import React from "react";

const Header: React.FC<HeaderProps> = ({
  title,
  description,
  children,
  className
}) => {
  return (
    <div className={cn("flex ", className)}>
      <div>
        <h2 className="titleHeader text-[40px] md:text-[45px] leading-11 md:leading-12 font-bold uppercase">{title}</h2>
        <p className="text-gray-500 mt-2">{description}</p>
      </div>

      <div>{children}</div>
    </div>
  );
};

export default Header;
