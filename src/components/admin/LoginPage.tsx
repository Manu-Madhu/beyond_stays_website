"use client";
import React, { useState } from 'react';
import { FiEye, FiEyeOff, FiMail, FiLock } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

export const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API call and loading state
        setTimeout(() => {
            setIsLoading(false);
            router.push('/admin');
        }, 1500);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-900 font-sans p-4">
            <div className="max-w-md w-full mx-auto bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
                <div className="text-center mb-8">
                    <div className="mx-auto h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                        <FiLock className="h-6 w-6 text-blue-600" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">Admin Portal</h1>
                    <p className="text-gray-500 text-sm">Sign in to manage beyond stays events</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="email">
                            Email Address
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                <FiMail size={18} />
                            </div>
                            <input
                                id="email"
                                type="email"
                                className="block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm transition-all outline-none bg-gray-50 focus:bg-white"
                                placeholder="admin@beyondstays.com"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-medium text-gray-700" htmlFor="password">
                                Password
                            </label>
                            <a href="#" className="text-sm font-semibold text-blue-600 hover:text-blue-500 transition-colors">
                                Forgot password?
                            </a>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                <FiLock size={18} />
                            </div>
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                className="block w-full pl-11 pr-11 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm transition-all outline-none bg-gray-50 focus:bg-white"
                                placeholder="••••••••"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition-all disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-[0.98]"
                    >
                        {isLoading ? (
                            <div className="flex items-center space-x-2">
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                <span>Signing in...</span>
                            </div>
                        ) : (
                            "Sign In"
                        )}
                    </button>

                    <div className="mt-6 text-center text-xs text-gray-500">
                        <p>Secure login with standard encryption.</p>
                    </div>
                </form>
            </div>
        </div>
    );
};