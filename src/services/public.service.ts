import { apiFetch } from "./api.service";

/**
 * Service for public-facing data fetching (packages, events, etc.)
 */
export const PublicService = {
    /**
     * Get published events for listing on homepage/events page
     */
    getPublishedEvents: async (params: { page?: number, limit?: number, upcoming?: boolean } = {}) => {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append('page', params.page.toString());
        if (params.limit) queryParams.append('limit', params.limit.toString());
        if (params.upcoming !== undefined) queryParams.append('upcoming', params.upcoming.toString());
        
        return await apiFetch(`/events?${queryParams.toString()}`, {
            method: 'GET',
            requireAuth: false,
            version: 'v2'
        });
    },

    /**
     * Get a single published event by ID
     */
    getEventById: async (id: string) => {
        return await apiFetch(`/events/${id}`, {
            method: 'GET',
            requireAuth: false,
            version: 'v2'
        });
    },

    /**
     * Register for an event
     */
    registerForEvent: async (id: string, payload: any) => {
        return await apiFetch(`/events/${id}/register`, {
            method: 'POST',
            body: JSON.stringify(payload),
            requireAuth: false,
            version: 'v2'
        });
    }
};
