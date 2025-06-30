'use client';

import { useState, useEffect, ReactNode, use } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Users, Scissors, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/Card';

// Types
interface ComponentProps {
    children: ReactNode;
    className?: string;
}

interface PageProps {
    params: Promise<{ id: string }>;
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



// Badge Component
const Badge = ({ children, className = '' }: ComponentProps) => (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}>
        {children}
    </span>
);

export default function SlipVerifyPage({ params }: PageProps) {
    const API_BASE_URL ='https://mybooking.ngrok.pizza';
    // Properly unwrap the params promise
    const unwrappedParams = use(params);
    const { id } = unwrappedParams;

    const router = useRouter();
    const statusOptions = ['pending', 'confirmed', 'cancelled', 'completed'];
    const [status, setStatus] = useState('pending');
    const [appointment, setAppointment] = useState<Appointment | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [slipUrl, setSlipUrl] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [slipRes, bookingRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/payment?booking_id=${id}`),
                    fetch(`${API_BASE_URL}/booking?booking_id=${id}`)
                ]);

                if (!slipRes.ok) throw new Error('Failed to fetch slip');
                if (!bookingRes.ok) throw new Error('Failed to fetch booking');

                const slipData = await slipRes.json();
                const bookingData = await bookingRes.json();

                setSlipUrl(slipData.slip);
                setAppointment(bookingData);
                setStatus(bookingData.status);
            } catch (err: any) {
                console.error('Error fetching data:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);


    const handleSave = async () => {
        if (!id || typeof id !== 'string') return;
        try {
            const response = await fetch(`${API_BASE_URL}/bookings/edit`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    booking_id: id,
                    status: status
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Failed to update status.');
            }

            alert('Status updated successfully!');
        } catch (err: any) {
            console.error('Error saving status:', err);
            alert(`Error saving status: ${err.message}`);
        }
    };

    const getStatusColor = (status: string) => {
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

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    if (error) {
        return <div className="min-h-screen flex items-center justify-center text-red-600">{error}</div>;
    }

    if (!slipUrl) {
        return <div className="min-h-screen flex items-center justify-center">Payment not found.</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex items-center justify-start">
                    <h1 className="text-3xl font-bold text-gray-900">Slip Verify for Appointment #{id}</h1>
                </div>
                <div className='flex flex-row gap-4'>
                    <Card className='w-full aspect-square'>
                        {slipUrl ? (
                            <img
                                src={slipUrl}
                                alt="Slip Verification Image"
                                className="object-cover w-full h-full rounded-md"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-500">
                                No slip uploaded
                            </div>
                        )}
                    </Card>
                    <div className='w-full flex flex-col justify-center items-center space-y-4 ml-4'>
                        {/* <Card className="w-full">
                            <CardHeader>
                                <CardTitle>Appointment Details</CardTitle>
                                <CardDescription>Information for appointment ID: {appointment.id}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <p><strong>Customer:</strong> {appointment.customerName}</p>
                                <p><strong>Service:</strong> {appointment.serviceName}</p>
                                <p><strong>Date:</strong> {appointment.date}</p>
                                <p><strong>Time:</strong> {appointment.time}</p>
                                <p><strong>Duration:</strong> {appointment.duration} minutes</p>
                                <p><strong>Price:</strong> ${appointment.price.toFixed(2)}</p>
                                <p><strong>Notes:</strong> {appointment.notes || 'N/A'}</p>
                                <div className="flex items-center space-x-2">
                                    <p><strong>Current Status:</strong></p>
                                    <Badge className={getStatusColor(appointment.status)}>
                                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card> */}

                        <div className="flex flex-col items-center space-y-4 w-full">
                            <label htmlFor="status-select" className="text-sm font-medium text-gray-700">Change Status</label>
                            <div className="flex items-center space-x-4">
                                <select
                                    id="status-select"
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

                                <Badge className={getStatusColor(status)}>
                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                </Badge>
                            </div>

                            <button
                                onClick={handleSave}
                                className="mt-2 w-fit px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                            >
                                Save Status
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}