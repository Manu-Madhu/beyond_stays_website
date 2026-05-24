// This base URL allows the frontend to hit the backend without hardcoding localhost explicitly everywhere
const API_ROOT = (process.env.NEXT_PUBLIC_ADMIN_API_URL || 'http://127.0.0.1:8080/api/v1').replace('/v1', '');

export const getAuthToken = (): string | null => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('adminToken');
    }
    return null;
};

export const getRefreshToken = (): string | null => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('adminRefreshToken');
    }
    return null;
};

/**
 * Clears all admin auth tokens and forces a redirect to the login page.
 * Displays a toast notification if react-hot-toast is available.
 */
export const forceLogout = (message = 'Session expired. Please log in again.') => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminRefreshToken');

        // Dynamic import to avoid circular deps — fire-and-forget
        import('react-hot-toast').then(({ default: toast }) => {
            toast.error(message);
        }).catch(() => { /* toast unavailable, proceed silently */ });

        window.location.href = '/admin/login';
    }
};

// ---- Refresh Token Queue Mechanism ----
// Ensures only ONE refresh request is in-flight at a time.
// Any additional 401 callers wait for the single refresh to resolve.
let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

const subscribeTokenRefresh = (cb: (token: string) => void) => {
    refreshSubscribers.push(cb);
};

const onTokenRefreshed = (newToken: string) => {
    refreshSubscribers.forEach(cb => cb(newToken));
    refreshSubscribers = [];
};

/**
 * Attempts to refresh the access token using the stored refresh token.
 * Returns the new access token on success, or null on failure.
 */
const attemptTokenRefresh = async (): Promise<string | null> => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) return null;

    try {
        const url = `${API_ROOT}/v1/auth/regenerate-token`;
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken }),
        });

        const data = await response.json();

        if (data?.success && data.data?.accessToken) {
            localStorage.setItem('adminToken', data.data.accessToken);
            if (data.data.refreshToken) {
                localStorage.setItem('adminRefreshToken', data.data.refreshToken);
            }
            return data.data.accessToken;
        }

        return null;
    } catch {
        return null;
    }
};

interface FetchOptions extends RequestInit {
    requireAuth?: boolean;
    version?: 'v1' | 'v2';
    _isRetry?: boolean; // Internal flag to prevent infinite retry loops
}

/**
 * A wrapper over native fetch that automatically handles the base URL,
 * authorization headers, and transparent token refresh on 401 responses.
 */
export const apiFetch = async (endpoint: string, options: FetchOptions = {}): Promise<{ response: Response; data: any }> => {
    const { requireAuth = false, version = 'v1', _isRetry = false, headers, ...restOptions } = options;

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
    const url = `${API_ROOT}/${version}${cleanEndpoint}`.replace(/([^:])\/\/+/g, "$1/");

    try {
        const response = await fetch(url, {
            ...restOptions,
            headers: reqHeaders,
        });

        const data = await response.json();

        // ---- Handle 401 on authenticated requests ----
        if (response.status === 401 && requireAuth && !_isRetry) {
            // If a refresh is already in progress, wait for it
            if (isRefreshing) {
                return new Promise<{ response: Response; data: any }>((resolve) => {
                    subscribeTokenRefresh((newToken: string) => {
                        reqHeaders['Authorization'] = `Bearer ${newToken}`;
                        fetch(url, { ...restOptions, headers: reqHeaders })
                            .then(r => r.json().then(d => resolve({ response: r, data: d })))
                            .catch(() => resolve({
                                response: { ok: false, status: 500 } as Response,
                                data: { success: false, message: 'Retry failed after token refresh' }
                            }));
                    });
                });
            }

            // Start a new refresh cycle
            isRefreshing = true;
            const newToken = await attemptTokenRefresh();
            isRefreshing = false;

            if (newToken) {
                // Notify all queued subscribers with the new token
                onTokenRefreshed(newToken);

                // Retry the original request with the fresh token
                return apiFetch(endpoint, {
                    ...options,
                    _isRetry: true,
                });
            } else {
                // Refresh failed — session is truly expired
                forceLogout();
                return { response, data };
            }
        }

        return { response, data };
    } catch (err: any) {
        console.warn(`apiFetch failed for ${url}:`, err);
        return { 
            response: { ok: false, status: 500 } as Response, 
            data: { success: false, message: err.message || "Failed to fetch" } 
        };
    }
};
