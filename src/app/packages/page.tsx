import AboutContentOne from "@/components/about/AboutContentOne";
import CommonHeroSection from "@/components/common/CommonHeroSection";
import React from "react";

const PackagePage = () => {
  return (
    <div>
      {/* Hero section  */}
      <CommonHeroSection
        banner="/assets/images/packages/4.jpg"
        title="Packages"
      />

      {/* About Content one */}
      <AboutContentOne />
    </div>
  );
};

export default PackagePage;
