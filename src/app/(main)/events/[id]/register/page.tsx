import { Metadata } from 'next';
import { PublicService } from '@/services/public.service';
import RegistrationClient from './RegistrationClient';
import Link from 'next/link';

type Props = {
    params: Promise<{ id: string }>;
};

async function getEvent(id: string) {
    try {
        // Try slug first
        const { data: slugData } = await PublicService.getEventBySlug(id);
        if (slugData?.success) return slugData.data;

        // Fallback to ID
        if (id.length === 24) {
            const { data: idData } = await PublicService.getEventById(id);
            if (idData?.success) return idData.data;
        }
    } catch (error) {
        console.error("Failed to fetch event for registration SEO:", error);
    }
    return null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const event = await getEvent(id);

    if (!event) {
        return {
            title: 'Event Registration | Beyond Stays',
            description: 'Register for your next adventure with Beyond Stays.'
        };
    }

    const title = `Register: ${event.title} | Beyond Stays`;
    const description = `Secure your spot for ${event.title}. ${event.description?.substring(0, 100)}...`;
    const imageUrl = event.mainBanner?.url || event.mainBanner?.location || "https://www.travelwithbeyondstays.com/logo/logov2.png";

    return {
        title: title,
        description: description,
        openGraph: {
            title: title,
            description: description,
            images: [{ url: imageUrl }],
            type: 'website',
            url: `https://www.travelwithbeyondstays.com/events/${event.slug || event._id}/register`,
        },
        twitter: {
            card: 'summary_large_image',
            title: title,
            description: description,
            images: [imageUrl],
        }
    };
}

export default async function Page({ params }: Props) {
    const { id } = await params;
    const event = await getEvent(id);

    if (!event) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6 text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Event Not Found</h1>
                <Link href="/" className="text-primary font-semibold hover:underline">Return to Home</Link>
            </div>
        );
    }

    return <RegistrationClient initialEvent={event} />;
}
