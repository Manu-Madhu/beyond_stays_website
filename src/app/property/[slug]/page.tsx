import { packagesData } from "@/data/packagesData";
import { Metadata } from "next";
import BookingCTA from "@/components/property/booking-cta";
import NearbyAttractions from "@/components/property/nearby-attractions";
import PropertyAmenities from "@/components/property/property-amenities";
import PropertyBanner from "@/components/property/property-banner";
import PropertyDescription from "@/components/property/property-description";
import WhyChooseUs from "@/components/property/why-choose-us";
import PropertyGallery from "@/components/property/property-gallery";


type Props = {
    params: Promise<{
      slug: string;
    }>;
  };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const property = packagesData.find((pkg) => pkg.slug === slug);

  if (!property) {
    return {
      title: "Package Not Found | Beyond Stays",
      description: "The package you are looking for does not exist.",
    };
  }

  return {
    title: `${property.title} | Beyond Stays`,
    description: property.meta.description,
    keywords: property.meta.keywords,
    openGraph: {
      title: property.meta.title,
      description: property.meta.description,
      images: property.images?.length ? [property.images[0]] : [],
      type: "website",
    },
  };
}

export default async function PropertyPage({ params }: Props) {
  const { slug } = await params;
  const property = packagesData.find((pkg) => pkg.slug === slug);

  if (!property) {
    return (
      <main className="flex h-screen items-center justify-center">
        <h1 className="text-xl font-semibold text-gray-600">
          Package not found.
        </h1>
      </main>
    );
  }

  const propertyData = {
    id: property.id,
    name: property.title,
    category: property.category,
    location: "Himachal Pradesh",
    price: 4999,
    rating: 4.8,
    reviews: 128,
    bannerImage: property.images[0],
    description: property.description,
    amenities: [
      {
        name: "Luxury Tents",
        description: "Premium equipped tents with comfortable bedding",
        image: "/luxury-tent-accommodation.jpg",
      },
      {
        name: "Gourmet Meals",
        description: "Farm-to-table dining experience",
        image: "/gourmet-dining-outdoor.jpg",
      },
    ],
    attractions: [
      {
        name: "Triund Trek",
        distance: "2 km",
        description: "Popular hiking trail with panoramic views",
      },
      {
        name: "Bhagsu Waterfall",
        distance: "3 km",
        description: "Scenic waterfall perfect for swimming",
      },
    ],
    whyChoose: [
      {
        title: "Authentic Experience",
        description:
          "Immerse yourself in nature without compromising on comfort.",
      },
      {
        title: "Expert Guides",
        description:
          "Knowledgeable local guides who share stories and insights.",
      },
      {
        title: "Sustainable Tourism",
        description:
          "We prioritize environmental conservation and local community support.",
      },
      {
        title: "All-Inclusive Packages",
        description:
          "Everything included - meals, activities, and transportation.",
      },
    ],
  };

  return (
    <main className="bg-white">
      <PropertyBanner
        image={propertyData.bannerImage}
        name={propertyData.name}
        category={propertyData.category}
        location={propertyData.location}
        rating={propertyData.rating}
        reviews={propertyData.reviews}
      />
      <PropertyDescription description={propertyData.description} price={propertyData.price} />
      <PropertyAmenities amenities={propertyData.amenities} />
      <PropertyGallery images={[...property.images, ...(property.roomImages || [])]} />
      <NearbyAttractions attractions={propertyData.attractions} />
      <WhyChooseUs reasons={propertyData.whyChoose} />
      <BookingCTA propertyName={propertyData.name} />
    </main>
  );
}
