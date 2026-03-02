// This base URL allows the frontend to hit the backend without hardcoding localhost explicitly everywhere
const API_BASE_URL = process.env.NEXT_PUBLIC_ADMIN_API_URL || 'http://127.0.0.1:8080/api/v1';

export const getAuthToken = (): string | null => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('adminToken');
    }
    return null;
};

interface FetchOptions extends RequestInit {
    requireAuth?: boolean;
}

/**
 * A wrapper over native fetch that automatically handles the base URL and authorization headers.
 */
export const apiFetch = async (endpoint: string, options: FetchOptions = {}) => {
    const { requireAuth = false, headers, ...restOptions } = options;

    const reqHeaders: Record<string, string> = {
        ...(headers as any),
    };

    // If body is NOT FormData, default to application/json
    if (!(restOptions.body instanceof FormData)) {
        reqHeaders['Content-Type'] = 'application/json';
    }

    if (requireAuth) {
        const token = getAuthToken();
        if (token) {
            reqHeaders['Authorization'] = `Bearer ${token}`;
        }
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...restOptions,
        headers: reqHeaders,
    });

    const data = await response.json();
    return { response, data };
};
