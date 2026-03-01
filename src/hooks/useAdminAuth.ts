import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminService } from '../services/admin.service';
import toast from 'react-hot-toast';

/**
 * Custom React Hook for encapsulating Admin login flow and state side effects
 */
export const useAdminAuth = () => {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const loginAdmin = async (credentials: any) => {
        setIsLoading(true);

        try {
            const { data } = await AdminService.login(credentials);

            if (data?.success) {
                // Determine if user has appropriate Admin access
                if (data.data.userInfo.role === 'admin' || data.data.userInfo.role === 'employee') {
                    // Store access token for secured endpoints
                    localStorage.setItem('adminToken', data.data.accessToken);
                    toast.success('Login Successful!');
                    router.push('/admin');
                    return { success: true };
                } else {
                    toast.error('Unauthorized account role. Administrator access required.');
                    return { success: false, error: 'Unauthorized role' };
                }
            } else {
                const errorMsg = data?.message || 'Invalid credentials';
                toast.error(errorMsg);
                return { success: false, error: errorMsg };
            }
        } catch (error) {
            console.error('Login Error:', error);
            toast.error('Error communicating with server. Please try again.');
            return { success: false, error: 'Server error' };
        } finally {
            setIsLoading(false);
        }
    };

    return { loginAdmin, isLoading };
};
