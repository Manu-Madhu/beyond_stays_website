import AboutUsSection from "@/components/home/aboutUs/AboutUsSection";
import GallerySection from "@/components/home/gallery/GallerySection";
import HeroSection from "@/components/home/HeroSection";
import PackagesSection from "@/components/home/PackagesSection";

export default function Home() {
  return (
    <>
      {/* Banner Section */}
      <HeroSection />

      {/* Packages */}
      <PackagesSection />

      {/* About Us */}
      <AboutUsSection />

      {/* Gallery Part */}
      <GallerySection />
    </>
  );
}
