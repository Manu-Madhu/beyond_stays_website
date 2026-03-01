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
            requireAuth: true // Automatically injects Authorization Bearer Header
        });
    }

};
