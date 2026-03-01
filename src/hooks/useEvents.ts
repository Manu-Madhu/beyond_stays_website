import { useState } from 'react';
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
