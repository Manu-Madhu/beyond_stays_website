import { apiFetch } from './api.service';

/**
 * Service to orchestrate the backend administrator operations.
 * Separating API handlers from React components improves testability and readability.
 */
export const AdminService = {

    /**
     * Attempts to login to the admin portal
     */
    login: async (credentials: any) => {
        return await apiFetch('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials)
        });
    },

    /**
     * Publishes a new event to the backend API mapping
     */
    createEvent: async (eventData: any) => {
        return await apiFetch('/admin/events', {
            method: 'POST',
            body: JSON.stringify(eventData),
            requireAuth: true,
            version: 'v2'
        });
    },

    /**
     * Updates (patches) an existing event by ID
     */
    updateEvent: async (id: string, eventData: any) => {
        return await apiFetch(`/admin/events/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(eventData),
            requireAuth: true,
            version: 'v2'
        });
    },

    /**
     * Retrieves the paginated and filtered list of events from the admin router.
     */
    getEvents: async (params: { page?: number, limit?: number, status?: string } = {}) => {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append('page', params.page.toString());
        if (params.limit) queryParams.append('limit', params.limit.toString());
        if (params.status && params.status !== 'All Status') queryParams.append('status', params.status);

        return await apiFetch(`/admin/events?${queryParams.toString()}`, {
            method: 'GET',
            requireAuth: true,
            version: 'v2'
        });
    },

    /**
     * Retrieves a single event by its ID
     */
    getEventById: async (id: string) => {
        return await apiFetch(`/admin/events/${id}`, {
            method: 'GET',
            requireAuth: true,
            version: 'v2'
        });
    },

    /**
     * Retrieves registrations for a specific event with search and filter parameters
     */
    getEventRegistrations: async (eventId: string, params: { page?: number, limit?: number, status?: string, search?: string, date?: string } = {}) => {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append('page', params.page.toString());
        if (params.limit) queryParams.append('limit', params.limit.toString());
        if (params.status && params.status !== 'All Status') queryParams.append('status', params.status);
        if (params.search) queryParams.append('search', params.search);
        if (params.date) queryParams.append('date', params.date);

        return await apiFetch(`/admin/events/${eventId}/registrations?${queryParams.toString()}`, {
            method: 'GET',
            requireAuth: true,
            version: 'v2'
        });
    },

    /**
     * Retrieves event-related statistics for the admin dashboard
     */
    getEventStats: async () => {
        return await apiFetch('/admin/events/stats', {
            method: 'GET',
            requireAuth: true,
            version: 'v2'
        });
    },

    /**
     * Retrieves all registrations across all events
     */
    getAllRegistrations: async (params: { page?: number, limit?: number, status?: string, search?: string, paymentMethod?: string, date?: string } = {}) => {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append('page', params.page.toString());
        if (params.limit) queryParams.append('limit', params.limit.toString());
        if (params.status && params.status !== 'All Status') queryParams.append('status', params.status);
        if (params.search) queryParams.append('search', params.search);
        if (params.paymentMethod && params.paymentMethod !== 'All Methods') queryParams.append('paymentMethod', params.paymentMethod);
        if (params.date) queryParams.append('date', params.date);

        return await apiFetch(`/admin/events/registrations?${queryParams.toString()}`, {
            method: 'GET',
            requireAuth: true,
            version: 'v2'
        });
    },

    /**
     * Uploads a single file to the media backend
     */
    uploadSingleFile: async (fileData: FormData) => {
        return await apiFetch('/uploads/single', {
            method: 'POST',
            body: fileData,
            requireAuth: true
        });
    },

    /**
     * Uploads multiple files (up to limit) to the media backend
     */
    uploadMultipleFiles: async (filesData: FormData) => {
        return await apiFetch('/uploads/multiple', {
            method: 'POST',
            body: filesData,
            requireAuth: true
        });
    }

};
