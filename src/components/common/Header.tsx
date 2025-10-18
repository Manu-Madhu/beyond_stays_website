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
    <div className={cn("flex items-center justify-between", className)}>
      <div>
        <h2 className="text-4xl font-bold">{title}</h2>
        <p className="text-gray-500">{description}</p>
      </div>

      <div>{children}</div>
    </div>
  );
};

export default Header;
