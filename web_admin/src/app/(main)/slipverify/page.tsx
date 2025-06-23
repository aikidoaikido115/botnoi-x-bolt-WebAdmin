'use client'
// pages/dashboard.tsx (or app/dashboard/page.tsx for App Router)
import { useState, useEffect, ReactNode } from 'react';
import { Calendar, Users, Scissors, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/Card';

// Types
interface ComponentProps {
    children: ReactNode;
    className?: string;
}

interface Appointment {
    id: number;
    customerName: string;
    serviceName: string;
    date: string;
    time: string;
    duration: number;
    price: number;
    status: string;
    notes?: string | null;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api';

//mock status

// Badge Component
const Badge = ({ children, className = '' }: ComponentProps) => (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}>
        {children}
    </span>
);

export default function DashboardPage() {

    const statusOptions = ['pending', 'confirmed', 'cancelled'];
    const [status, setStatus] = useState('pending');

    const handleSave = () => {
        // คุณสามารถเพิ่ม logic สำหรับการบันทึก API ตรงนี้
        console.log('Saved status:', status);
    };

    const getStatusColor = (status: String) => {
        switch (status) {
            case 'confirmed':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            case 'completed':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };


    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex items-center justify-start">
                    <h1 className="text-3xl font-bold text-gray-900">Slip Verify</h1>
                </div>
                <div className='flex flex-row'>
                    <Card className='w-full aspect-square'>
                        <img
                            src="https://thunder.in.th/wp-content/uploads/2024/06/%E0%B8%AA%E0%B8%A5%E0%B8%B4%E0%B8%9B%E0%B9%82%E0%B8%AD%E0%B8%99%E0%B9%80%E0%B8%87%E0%B8%B4%E0%B8%99.webp"
                            alt="Dashboard Image"
                            className="object-cover w-full h-full"
                        />
                    </Card>
                    <div className='w-full flex flex-col justify-center items-center space-y-4 space-x-4 ml-4'>
                        <label htmlFor="status" className="text-sm font-medium text-gray-700">Change Status</label>
                        {/* Dropdown + Badge Preview */}
                        <div className="flex items-center space-x-4">
                            <select
                                id="status"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="border border-gray-300 rounded-md px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                            >
                                {statusOptions.map((option) => (
                                    <option key={option} value={option}>
                                        {option.charAt(0).toUpperCase() + option.slice(1)}
                                    </option>
                                ))}
                            </select>

                            {/* แสดง Badge สีตามสถานะ */}
                            <Badge className={getStatusColor(status)}>
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                            </Badge>
                        </div>

                        {/* ปุ่ม Save */}
                        <button
                            onClick={handleSave}
                            className="mt-2 w-fit px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                        >
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}