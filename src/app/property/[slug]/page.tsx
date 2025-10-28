import BookingCTA from '@/components/property/booking-cta'
import NearbyAttractions from '@/components/property/nearby-attractions'
import PropertyAmenities from '@/components/property/property-amenities'
import PropertyBanner from '@/components/property/property-banner'
import PropertyDescription from '@/components/property/property-description'
import WhyChooseUs from '@/components/property/why-choose-us'
import { Metadata } from 'next'
import React from 'react'


const propertyData = {
    id: "1",
    name: "Sunset Lake Camping",
    category: "Camping",
    location: "Himachal Pradesh",
    price: 4999,
    rating: 4.8,
    reviews: 128,
    bannerImage: "/assets/images/packages/2.jpeg",
    description:
        "Experience the ultimate luxury camping experience at Sunset Lake. Nestled in the heart of nature with breathtaking views of pristine lakes and majestic mountains. Our carefully curated camping experience combines comfort with adventure, offering you an unforgettable stay.",
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
        {
            name: "Bonfire Nights",
            description: "Evening gatherings with music and stories",
            image: "/bonfire-night-camping.jpg",
        },
        {
            name: "Guided Treks",
            description: "Expert-led nature walks and hiking",
            image: "/mountain-hiking-trail.png",
        },
        {
            name: "Sunrise Views",
            description: "Wake up to stunning mountain vistas",
            image: "/sunrise-mountain-view.jpg",
        },
        {
            name: "Photography Tours",
            description: "Capture nature's beauty with our guides",
            image: "/nature-photography-landscape.jpg",
        },
    ],
    attractions: [
        { name: "Triund Trek", distance: "2 km", description: "Popular hiking trail with panoramic views" },
        { name: "Bhagsu Waterfall", distance: "3 km", description: "Scenic waterfall perfect for swimming" },
        { name: "Local Markets", distance: "5 km", description: "Traditional handicrafts and local cuisine" },
        { name: "Ancient Temple", distance: "4 km", description: "Historic spiritual site with cultural significance" },
    ],
    whyChoose: [
        {
            title: "Authentic Experience",
            description:
                "Immerse yourself in nature without compromising on comfort. Every moment is designed to connect you with the essence of the destination.",
        },
        {
            title: "Expert Guides",
            description:
                "Knowledgeable local guides who share stories and insights. They transform your journey into a cultural and natural discovery.",
        },
        {
            title: "Sustainable Tourism",
            description:
                "We prioritize environmental conservation and local community support. Travel responsibly while creating positive impact.",
        },
        {
            title: "All-Inclusive Packages",
            description:
                "Everything included - meals, activities, and transportation. No hidden costs, just pure luxury and convenience.",
        },
    ],
}

export const metadata: Metadata = {
    title: `${propertyData.name} | Beyond Stays - Luxury Travel Experience`,
    description: propertyData.description,
    keywords: ["luxury camping", "travel", "adventure", "nature", propertyData.location],
    openGraph: {
        title: propertyData.name,
        description: propertyData.description,
        images: [propertyData.bannerImage],
        type: "website",
    },
}

export default function PropertyPage() {
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

            <NearbyAttractions attractions={propertyData.attractions} />

            <WhyChooseUs reasons={propertyData.whyChoose} />

            <BookingCTA propertyName={propertyData.name} />
        </main>
    )
}
