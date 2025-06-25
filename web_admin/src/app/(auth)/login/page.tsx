'use client'

import { useState } from 'react';
import { Eye, EyeOff, User, Mail, Lock, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useBooking } from '@/context/BookingContext';

interface FormData {
    admin_name: string;
    admin_password: string;
}

interface FormErrors {
    admin_name?: string;
    admin_password?: string;
}

export default function LoginPage(): React.JSX.Element {

    const context = useBooking();
    const {store_id , setStore_id} = context;
    const router = useRouter();
    
    const [formData, setFormData] = useState<FormData>({
        admin_name: '',
        admin_password: ''
    });

    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [errors, setErrors] = useState<FormErrors>({});
    const [isLoading, setIsLoading] = useState<boolean>(false);
    
    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.admin_name.trim()) {
            newErrors.admin_name = 'Admin name is required';
        } else if (formData.admin_name.trim().length < 2) {
            newErrors.admin_name = 'Admin name must be at least 2 characters';
        }

        if (!formData.admin_password) {
            newErrors.admin_password = 'Password is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        if (errors[name as keyof FormErrors]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLButtonElement>): Promise<void> => {
        e.preventDefault();
        

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            // Call FastAPI admin login endpoint
            const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
            const response = await fetch(`${API_BASE_URL}/admins/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    admin_name: formData.admin_name,
                    admin_password: formData.admin_password
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Login failed');
            }

            const data = await response.json();


            if (data.access_token) {
                
                setStore_id(data.store_id);
                localStorage.setItem('access_token', data.access_token);
                localStorage.setItem('token_type', data.token_type || 'bearer');
            }

            console.log('Login successful:', data);
            alert('Login successful!');

            if (data.access_token) {
                router.push('/dashboard');
            } else {
                alert('Login successful, but no access token received.');
            }


        } catch (error) {
            console.error('Login failed:', error);

            
            if (error instanceof Error) {
                alert(`Login failed: ${error.message}`);
            } else {
                alert('Login failed. Please check your credentials.');
            }

            
            setFormData({ admin_name: '', admin_password: '' });

        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="py-20 bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 border border-gray-100">
                <div className="text-center mb-8">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-300 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <User className="text-white w-8 h-8" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Login</h1>
                    <p className="text-gray-600">Sign in to admin panel</p>
                </div>

                <div className="space-y-6">
                    {/* Admin Name Input */}
                    <div>
                        <label htmlFor="admin_name" className="block text-sm font-medium text-gray-700 mb-2">
                            Admin Name
                        </label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                id="admin_name"
                                name="admin_name"
                                value={formData.admin_name}
                                onChange={handleInputChange}
                                className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.admin_name ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                    }`}
                                placeholder="Enter your admin name"
                            />
                        </div>
                        {errors.admin_name && (
                            <p className="mt-1 text-sm text-red-600 flex items-center">
                                <X className="w-4 h-4 mr-1" />
                                {errors.admin_name}
                            </p>
                        )}
                    </div>

                    {/* Password Input */}
                    <div>
                        <label htmlFor="admin_password" className="block text-sm font-medium text-gray-700 mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="admin_password"
                                name="admin_password"
                                value={formData.admin_password}
                                onChange={handleInputChange}
                                className={`w-full pl-12 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.admin_password ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                    }`}
                                placeholder="Enter your password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                        {errors.admin_password && (
                            <p className="mt-1 text-sm text-red-600 flex items-center">
                                <X className="w-4 h-4 mr-1" />
                                {errors.admin_password}
                            </p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-300 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-400 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                Signing in...
                            </div>
                        ) : (
                            'Sign In'
                        )}
                    </button>
                </div>

                <div className="mt-6 text-center">
                    <p className="text-gray-600">
                        Don't have an account?{' '}
                        <a href="/register" className="text-blue-600 hover:text-blue-800 font-medium">
                            Sign up
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}