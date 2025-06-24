'use client'

import { useState, useEffect } from 'react';
import { Eye, EyeOff, Plus, Store, User, Mail, Lock, Check, X } from 'lucide-react';

interface Store {
    id: string;
    store_name: string;
}

interface FormData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    selectedStore: string;
}

interface FormErrors {
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    selectedStore?: string;
}

export default function RegisterPage(): React.JSX.Element {
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        selectedStore: ''
    });

    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
    const [errors, setErrors] = useState<FormErrors>({});
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [showCreateStore, setShowCreateStore] = useState<boolean>(false);
    const [newStoreName, setNewStoreName] = useState<string>('');
    const [newStoreDescription, setNewStoreDescription] = useState<string>('');
    const [isLoadingStores, setIsLoadingStores] = useState<boolean>(false);
    const [isCreatingStore, setIsCreatingStore] = useState<boolean>(false);
    const [storeNameError, setStoreNameError] = useState<string>('');
    const [storeDescriptionError, setStoreDescriptionError] = useState<string>('');

    const [stores, setStores] = useState<Store[]>([]);

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

    // Function to fetch stores from database
    const fetchStores = async (): Promise<void> => {
        setIsLoadingStores(true);
        try {
            const response = await fetch(`${API_BASE_URL}/stores/all`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.ok) {
                const storesData = await response.json();
                console.log(storesData);
                setStores(storesData);
            } else {
                console.error('Failed to fetch stores');
                // Fallback to empty array if API fails
                setStores([]);
            }
        } catch (error) {
            console.error('Error fetching stores:', error);
            // Fallback to empty array if API fails
            setStores([]);
        } finally {
            setIsLoadingStores(false);
        }
    };

    // Function to check if store name already exists
    const checkStoreNameExists = async (storeName: string): Promise<boolean> => {
        try {
            const response = await fetch(`${API_BASE_URL}/store`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    store_name: storeName.trim()
                })
            });

            if (response.ok) {
                const result = await response.json();
                return result.exists; // Assuming API returns { exists: boolean }
            } else {
                console.error('Failed to check store name');
                return false;
            }
        } catch (error) {
            console.error('Error checking store name:', error);
            return false;
        }
    };

    // Function to create new store in database
    const createStoreInDatabase = async (storeName: string, storeDescription: string): Promise<Store | null> => {
        try {
            const response = await fetch(`${API_BASE_URL}/stores/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    store_name: storeName.trim(),
                    description: storeDescription.trim()
                })
            });

            if (response.ok) {
                const newStore = await response.json();
                return newStore; // Assuming API returns the created store object
            } else {
                console.error('Failed to create store');
                return null;
            }
        } catch (error) {
            console.error('Error creating store:', error);
            return null;
        }
    };

    // Load stores when component mounts
    useEffect(() => {
        fetchStores();
    }, []);

     
    useEffect(() => {
    if (showCreateStore) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
    return () => {
        document.body.style.overflow = '';
    };
}, [showCreateStore]);

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        } else if (formData.name.trim().length < 2) {
            newErrors.name = 'Name must be at least 2 characters';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
            newErrors.password = 'Password must contain uppercase, lowercase, and number';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (!formData.selectedStore) {
            newErrors.selectedStore = 'Please select a store';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
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

    const validateStoreName = (name: string, description: string): boolean => {
        let isValid = true;
        
        if (!name.trim()) {
            setStoreNameError('Store name is required');
            isValid = false;
        } else if (name.trim().length < 2) {
            setStoreNameError('Store name must be at least 2 characters');
            isValid = false;
        } else {
            setStoreNameError('');
        }

        if (!description.trim()) {
            setStoreDescriptionError('Store description is required');
            isValid = false;
        } else if (description.trim().length < 10) {
            setStoreDescriptionError('Store description must be at least 10 characters');
            isValid = false;
        } else {
            setStoreDescriptionError('');
        }

        return isValid;
    };

    const handleCreateStore = async (): Promise<void> => {
        if (!validateStoreName(newStoreName, newStoreDescription)) {
            return;
        }

        setIsCreatingStore(true);

        try {
            // Check if store name already exists
            const nameExists = await checkStoreNameExists(newStoreName);
            
            if (nameExists) {
                setStoreNameError('Store name already exists. Please choose a different name.');
                setIsCreatingStore(false);
                return;
            }

            // Create new store in database
            const newStore = await createStoreInDatabase(newStoreName, newStoreDescription);
            
            if (newStore) {
                // Add to local stores list
                setStores(prev => [...prev, newStore]);
                
                // Select the newly created store
                setFormData(prev => ({
                    ...prev,
                    selectedStore: newStore.id.toString()
                }));
                
                // Reset and close modal
                setNewStoreName('');
                setNewStoreDescription('');
                setShowCreateStore(false);
                setStoreNameError('');
                setStoreDescriptionError('');
                
                alert('Store created successfully!');
            } else {
                setStoreNameError('Failed to create store. Please try again.');
            }
        } catch (error) {
            console.error('Error in handleCreateStore:', error);
            setStoreNameError('An error occurred. Please try again.');
        } finally {
            setIsCreatingStore(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLButtonElement>): Promise<void> => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            // Register user
            console.log(formData)
            const response = await fetch(`${API_BASE_URL}/admins/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    admin_name: formData.name,
                    admin_password: formData.password,
                    store_id: formData.selectedStore
                })
            });

            console.log(response + 'ฟฟฟฟฟ');

            if (response.ok) {
                alert('Registration successful!');
                // Optionally redirect to login page
                // window.location.href = '/login';
            } else {
                const errorData = await response.json();
                alert(errorData.message || 'Registration failed. Please try again.');
            }
        } catch (error) {
            console.error('Registration failed:', error);
            alert('Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const getPasswordStrength = (password: string): number => {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        if (/[^a-zA-Z\d]/.test(password)) strength++;
        return strength;
    };

    const getPasswordStrengthLabel = (strength: number): string => {
        if (strength <= 2) return 'Weak';
        if (strength <= 3) return 'Medium';
        return 'Strong';
    };

    const passwordStrength = getPasswordStrength(formData.password);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 border border-gray-100">
                <div className="text-center mb-8">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-300 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <User className="text-white w-8 h-8" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h1>
                    <p className="text-gray-600">Join us and start your journey</p>
                </div>

                <div className="space-y-6">
                    {/* Name Input */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                            Username
                        </label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                    }`}
                                placeholder="Enter your Username"
                            />
                        </div>
                        {errors.name && (
                            <p className="mt-1 text-sm text-red-600 flex items-center">
                                <X className="w-4 h-4 mr-1" />
                                {errors.name}
                            </p>
                        )}
                    </div>

                    {/* Email Input */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                    }`}
                                placeholder="Enter your email"
                            />
                        </div>
                        {errors.email && (
                            <p className="mt-1 text-sm text-red-600 flex items-center">
                                <X className="w-4 h-4 mr-1" />
                                {errors.email}
                            </p>
                        )}
                    </div>

                    {/* Password Input */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                className={`w-full pl-12 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.password ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                    }`}
                                placeholder="Create a strong password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>

                        {/* Password Strength Indicator */}
                        {formData.password && (
                            <div className="mt-2">
                                <div className="flex space-x-1">
                                    {[1, 2, 3, 4, 5].map((level: number) => (
                                        <div
                                            key={level}
                                            className={`h-1 flex-1 rounded ${passwordStrength >= level
                                                    ? passwordStrength <= 2
                                                        ? 'bg-red-500'
                                                        : passwordStrength <= 3
                                                            ? 'bg-yellow-500'
                                                            : 'bg-green-500'
                                                    : 'bg-gray-200'
                                                }`}
                                        />
                                    ))}
                                </div>
                                <p className="text-xs text-gray-600 mt-1">
                                    Password strength: {getPasswordStrengthLabel(passwordStrength)}
                                </p>
                            </div>
                        )}

                        {errors.password && (
                            <p className="mt-1 text-sm text-red-600 flex items-center">
                                <X className="w-4 h-4 mr-1" />
                                {errors.password}
                            </p>
                        )}
                    </div>

                    {/* Confirm Password Input */}
                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                className={`w-full pl-12 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.confirmPassword ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                    }`}
                                placeholder="Confirm your password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                        {formData.confirmPassword && formData.password === formData.confirmPassword && (
                            <p className="mt-1 text-sm text-green-600 flex items-center">
                                <Check className="w-4 h-4 mr-1" />
                                Passwords match
                            </p>
                        )}
                        {errors.confirmPassword && (
                            <p className="mt-1 text-sm text-red-600 flex items-center">
                                <X className="w-4 h-4 mr-1" />
                                {errors.confirmPassword}
                            </p>
                        )}
                    </div>

                    {/* Store Selection */}
                    <div>
                        <label htmlFor="selectedStore" className="block text-sm font-medium text-gray-700 mb-2">
                            Select Store
                        </label>
                        <div className="flex space-x-2">
                            <div className="relative flex-1">
                                <Store className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <select
                                    id="selectedStore"
                                    name="selectedStore"
                                    value={formData.selectedStore}
                                    onChange={handleInputChange}
                                    disabled={isLoadingStores}
                                    className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white ${errors.selectedStore ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                        } ${isLoadingStores ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    <option value="">
                                        {isLoadingStores ? 'Loading stores...' : 'Choose a store'}
                                    </option>
                                    {stores.map((store: Store) => (
                                        <option key={store.id} value={store.id}>
                                            {store.store_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowCreateStore(true)}
                                disabled={isLoadingStores}
                                className="cursor-pointer duration-700 hover:duration-700 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Create new store"
                            >
                                <Plus className="w-5 h-5" />
                            </button>
                        </div>
                        {errors.selectedStore && (
                            <p className="mt-1 text-sm text-red-600 flex items-center">
                                <X className="w-4 h-4 mr-1" />
                                {errors.selectedStore}
                            </p>
                        )}
                    </div>

                    {/* Create Store Modal */}
                    {showCreateStore && (
                        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
                            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-bold text-gray-800 flex items-center">
                                        <Store className="w-6 h-6 mr-2 text-green-600" />
                                        Create New Store
                                    </h3> 
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowCreateStore(false);
                                            setNewStoreName('');
                                            setNewStoreDescription('');
                                            setStoreNameError('');
                                            setStoreDescriptionError('');
                                        }}
                                        disabled={isCreatingStore}
                                        className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {/* Store Name Input */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Store Name *
                                        </label>
                                        <input
                                            type="text"
                                            value={newStoreName}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                setNewStoreName(e.target.value);
                                                if (storeNameError) {
                                                    setStoreNameError('');
                                                }
                                            }}
                                            placeholder="Enter store name"
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${storeNameError ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                                }`}
                                            disabled={isCreatingStore}
                                        />
                                        {storeNameError && (
                                            <p className="mt-1 text-sm text-red-600 flex items-center">
                                                <X className="w-4 h-4 mr-1" />
                                                {storeNameError}
                                            </p>
                                        )}
                                    </div>

                                    {/* Store Description Input */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Store Description *
                                        </label>
                                        <textarea
                                            value={newStoreDescription}
                                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                                                setNewStoreDescription(e.target.value);
                                                if (storeDescriptionError) {
                                                    setStoreDescriptionError('');
                                                }
                                            }}
                                            placeholder="Describe your store (minimum 10 characters)"
                                            rows={4}
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none ${storeDescriptionError ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                                }`}
                                            disabled={isCreatingStore}
                                        />
                                        <div className="flex justify-between items-center mt-1">
                                            {storeDescriptionError ? (
                                                <p className="text-sm text-red-600 flex items-center">
                                                    <X className="w-4 h-4 mr-1" />
                                                    {storeDescriptionError}
                                                </p>
                                            ) : (
                                                <div></div>
                                            )}
                                            <p className={`text-xs ${newStoreDescription.length < 10 ? 'text-red-500' : 'text-gray-500'}`}>
                                                {newStoreDescription.length}/10 characters
                                            </p>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex space-x-3 pt-4">
                                        <button
                                            type="button"
                                            onClick={handleCreateStore}
                                            disabled={!newStoreName.trim() || !newStoreDescription.trim() || isCreatingStore}
                                            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-lg font-medium hover:from-green-600 hover:to-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all flex items-center justify-center"
                                        >
                                            {isCreatingStore ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                    Creating Store...
                                                </>
                                            ) : (
                                                <>
                                                    <Plus className="w-4 h-4 mr-2" />
                                                    Create Store
                                                </>
                                            )}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowCreateStore(false);
                                                setNewStoreName('');
                                                setNewStoreDescription('');
                                                setStoreNameError('');
                                                setStoreDescriptionError('');
                                            }}
                                            disabled={isCreatingStore}
                                            className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

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
                                Creating Account...
                            </div>
                        ) : (
                            'Create Account'
                        )}
                    </button>
                </div>

                <div className="mt-6 text-center">
                    <p className="text-gray-600">
                        Already have an account?{' '}
                        <a href="/login" className="text-blue-600 hover:text-blue-800 font-medium">
                            Sign in
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}