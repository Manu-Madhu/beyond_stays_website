import ContactUsSection from "@/components/contactPage/ContactUsSection";
import AboutUsSection from "@/components/home/aboutUs/AboutUsSection";
import GallerySection from "@/components/home/gallery/GallerySection";
import HeroSection from "@/components/home/HeroSection";
import PackagesSection from "@/components/home/PackagesSection";
import StorySection from "@/components/home/story/StorySection";

export default function Home() {
  return (
    <>
      {/* Banner Section */}
      <HeroSection />

      {/* Packages */}
      <PackagesSection />

      {/* About Us */}
      <AboutUsSection />

      {/* Story Connect */}
      <StorySection />

      {/* Session */}
      <ContactUsSection />

      {/* Gallery Part */}
      <GallerySection />
    </>
  );
}
