import { Metadata } from 'next';
import { PublicService } from '@/services/public.service';
import EventDetailsClient from './EventDetailsClient';
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
        if (id.length === 24) { // Only try ID if it looks like a Mongo ID
            const { data: idData } = await PublicService.getEventById(id);
            if (idData?.success) return idData.data;
        }
    } catch (error) {
        console.error("Failed to fetch event:", error);
    }
    return null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const event = await getEvent(id);

    if (!event) {
        return {
            title: 'Event Not Found | Beyond Stays',
            description: 'The event you are looking for does not exist or has been removed.'
        };
    }

    const description = event.description?.substring(0, 160) || "Join us for this exciting adventure with Beyond Stays.";
    const imageUrl = event.mainBanner?.url || event.mainBanner?.location || "https://www.travelwithbeyondstays.com/logo/logov2.png";

    return {
        title: `${event.title} | Beyond Stays`,
        description: description,
        openGraph: {
            title: event.title,
            description: description,
            images: [{ url: imageUrl }],
            type: 'website',
            url: `https://www.travelwithbeyondstays.com/events/${event.slug || event._id}`,
        },
        twitter: {
            card: 'summary_large_image',
            title: event.title,
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

    return <EventDetailsClient event={event} />;
}
