import { packagesData, whyChoose } from "@/data/packagesData";
import { Metadata } from "next";
import BookingCTA from "@/components/property/booking-cta";
import NearbyAttractions from "@/components/property/nearby-attractions";
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
      description: "The package you are looking for does not exist."
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
      type: "website"
    }
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

  return (
    <main className="bg-white">
      <PropertyBanner
        image={property?.images[0]}
        name={property?.title}
        category={property?.category}
        location={property?.location || ""}
      />
      <PropertyDescription
        description={property?.about || ""}
        expect={property?.whatExpect || []}
        activity={property?.activities || []}
        inclusions={property?.inclusions || []}
        pricing={property?.pricing}
      />
      <PropertyGallery
        images={[...property.images, ...(property.roomImages || [])]}
      />
      <NearbyAttractions attractions={property?.nearToVisit || []} />
      <WhyChooseUs reasons={whyChoose} />
      <BookingCTA propertyName={property.title} />
      {/* <PropertyAmenities amenities={property.amenities} /> */}
    </main>
  );
}
