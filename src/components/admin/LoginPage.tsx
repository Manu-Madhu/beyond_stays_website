"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiEye, FiEyeOff, FiMail, FiLock } from 'react-icons/fi';
import { useAdminAuth } from '../../hooks/useAdminAuth';
import Image from 'next/image';

export const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('admin@gmail.com');
    const [password, setPassword] = useState('123123');
    const { loginAdmin, isLoading } = useAdminAuth();
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (token) {
            router.push('/admin');
        }
    }, [router]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        await loginAdmin({ email, password });
    };

    return (
        <div className="min-h-screen flex bg-white text-gray-900 font-sans overflow-hidden">
            {/* Left side Image - Hidden on mobile, visible on desktop */}
            <div className="hidden lg:flex w-1/2 relative bg-gray-900">
                <Image
                    src="/assets/travel_admin_login.png"
                    alt="Beyond Stays Luxury Resort"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-12 lg:p-16">
                    <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4 drop-shadow-md tracking-tight">Discover<br />Extraordinary Stays</h2>
                    <p className="text-lg text-gray-200 max-w-md drop-shadow-sm font-medium">Manage premium properties and extraordinary travel experiences seamlessly through the administration portal.</p>
                </div>
            </div>

            {/* Right side Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
                {/* Optional decorative background touch */}
                <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-blue-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

                <div className="max-w-md w-full mx-auto bg-white p-8 lg:p-10 rounded shadow-[0_8px_30px_rgb(0,0,0,0.08)] sm:border border-gray-100 relative z-10">
                    <div className="text-center mb-8">
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
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full pl-11 pr-4 py-3 border border-gray-200 rounded text-sm transition-all outline-none bg-gray-50 "
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
                                <a href="#" className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors">
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
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-11 pr-11 py-3 border border-gray-200 rounded text-sm transition-all outline-none bg-gray-50 focus:bg-white"
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                                >
                                    {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="bg-primary hover:bg-primary/90 w-full flex justify-center items-center cursor-pointer py-3 px-4 border border-transparent rounded shadow-sm text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/80 transition-all disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-[0.98]"
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
        </div>
    );
};