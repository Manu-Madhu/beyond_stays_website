// This base URL allows the frontend to hit the backend without hardcoding localhost explicitly everywhere
const API_ROOT = (process.env.NEXT_PUBLIC_ADMIN_API_URL || 'http://127.0.0.1:8080/api/v1').replace('/v1', '');

export const getAuthToken = (): string | null => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('adminToken');
    }
    return null;
};

interface FetchOptions extends RequestInit {
    requireAuth?: boolean;
    version?: 'v1' | 'v2';
}

/**
 * A wrapper over native fetch that automatically handles the base URL and authorization headers.
 */
export const apiFetch = async (endpoint: string, options: FetchOptions = {}) => {
    const { requireAuth = false, version = 'v1', headers, ...restOptions } = options;

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

    // Ensure no double slashes in URL
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${API_ROOT}/${version}${cleanEndpoint}`.replace(/([^:]\/)\/+/g, "$1");

    const response = await fetch(url, {
        ...restOptions,
        headers: reqHeaders,
    });

    const data = await response.json();
    return { response, data };
};
