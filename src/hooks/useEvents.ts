import { useState, useCallback, useEffect } from 'react';
import { AdminService } from '../services/admin.service';
import toast from 'react-hot-toast';

/**
 * Custom React Hook for encapsulating Admin Event creation logic and server integration
 */
export const useEvents = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const publishEvent = async (eventPayload: any) => {
        setIsSubmitting(true);
        try {
            const { data } = await AdminService.createEvent(eventPayload);

            if (data?.success) {
                toast.success('Event successfully created and published!');
                return { success: true, eventId: data.data._id }; // Assuming data structure
            } else {
                const message = data?.message || 'Failed to submit event.';
                toast.error(`Error saving event: ${message}`);
                return { success: false, error: message };
            }
        } catch (error) {
            console.error('Submission Error:', error);
            toast.error('An error occurred while creating the event.');
            return { success: false, error: 'Server error' };
        } finally {
            setIsSubmitting(false);
        }
    };

    return { publishEvent, isSubmitting };
};

/**
 * Custom React Hook for fetching the paginated and filtered list of events.
 */
export const useEventList = () => {
    const [events, setEvents] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [meta, setMeta] = useState({
        totalItems: 0,
        totalPages: 1,
        currentPage: 1,
        itemsPerPage: 10
    });

    const fetchEvents = useCallback(async (params: { page?: number, limit?: number, status?: string } = {}) => {
        setIsLoading(true);
        try {
            const { data } = await AdminService.getEvents(params);

            if (data?.success) {
                setEvents(data.data || []);
                if (data.meta) {
                    setMeta(data.meta);
                }
            } else {
                toast.error(data?.message || 'Failed to fetch events');
            }
        } catch (error) {
            console.error('Error fetching events:', error);
            toast.error('Server connection failed while loading events.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    return { events, meta, isLoading, fetchEvents };
};

/**
 * Custom React Hook for fetching a single event's details.
 */
export const useEventDetails = (id: string | null) => {
    const [event, setEvent] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchEvent = useCallback(async () => {
        if (!id) return;
        setIsLoading(true);
        try {
            const { data } = await AdminService.getEventById(id);
            if (data?.success) {
                setEvent(data.data);
            } else {
                toast.error(data?.message || 'Failed to fetch event details');
            }
        } catch (error) {
            console.error('Error fetching event details:', error);
            toast.error('Server connection failed while loading event details.');
        } finally {
            setIsLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchEvent();
    }, [fetchEvent]);

    return { event, isLoading, fetchEvent };
};
