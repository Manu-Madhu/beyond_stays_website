import ContactUsSection from "@/components/contactPage/ContactUsSection";
import AboutUsSection from "@/components/home/aboutUs/AboutUsSection";
import GallerySection from "@/components/home/gallery/GallerySection";
import HeroSection from "@/components/home/HeroSection";
import StaysSection from "@/components/home/StaysSection";
import StorySection from "@/components/home/story/StorySection";
import { PublicService } from "@/services/public.service";

export default async function Home() {
  let initialEvents = [];
  try {
    const { data } = await PublicService.getPublishedEvents({ limit: 10, upcoming: true });
    if (data?.success) {
      initialEvents = data.data.map((event: any) => ({
        id: event._id,
        slug: event.slug || event._id,
        title: event.title,
        category: event.ageRestriction,
        description: event.description,
        images: [
          event.listingBanner?.url || event.listingBanner?.location || event.mainBanner?.url || event.mainBanner?.location || "/assets/travel_placeholder.png"
        ],
        type: 'event',
        itinerary: event.itinerary,
        inclusions: event.inclusions,
        exclusions: event.exclusions,
        whoCanJoin: event.whoCanJoin,
        whyJoin: event.whyJoin
      }));
    }
  } catch (error) {
    console.warn("Server-side event fetch failed:", error);
  }

  return (
    <>
      {/* Banner Section */}
      <HeroSection />

      {/* Stays */}
      <StaysSection initialEvents={initialEvents} />

      {/* About Us */}
      <AboutUsSection />

      {/* Story Connect */}
      <StorySection />

      {/* Gallery Part */}
      <GallerySection />
    </>
  );
}
