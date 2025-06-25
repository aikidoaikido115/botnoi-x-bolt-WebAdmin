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

// Mock data - in a real app, this would come from an API or database
const mockAppointments = [
    {
        id: 1,
        customerName: 'John Doe',
        serviceName: 'Haircut & Styling',
        date: '2025-01-24',
        time: '09:00',
        duration: 60,
        price: 800,
        status: 'confirmed',
        notes: 'Regular customer, prefers short sides'
    },
    {
        id: 2,
        customerName: 'Jane Smith',
        serviceName: 'Hair Coloring',
        date: '2025-01-24',
        time: '10:30',
        duration: 120,
        price: 2500,
        status: 'pending',
        notes: null
    },
    {
        id: 3,
        customerName: 'Mike Johnson',
        serviceName: 'Beard Trim',
        date: '2025-01-24',
        time: '14:00',
        duration: 30,
        price: 400,
        status: 'completed',
        notes: 'First time customer'
    },
    {
        id: 4,
        customerName: 'Sarah Wilson',
        serviceName: 'Perm Treatment',
        date: '2025-01-24',
        time: '15:00',
        duration: 180,
        price: 3200,
        status: 'cancelled',
        notes: 'Rescheduled to next week'
    }
];

const mockServices = [
    { id: 1, name: 'Haircut & Styling', isActive: true },
    { id: 2, name: 'Hair Coloring', isActive: true },
    { id: 3, name: 'Beard Trim', isActive: true },
    { id: 4, name: 'Perm Treatment', isActive: true },
    { id: 5, name: 'Hair Wash', isActive: false }
];

const mockCustomers = [
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Smith' },
    { id: 3, name: 'Mike Johnson' },
    { id: 4, name: 'Sarah Wilson' },
    { id: 5, name: 'Emily Brown' },
    { id: 6, name: 'David Lee' },
    { id: 7, name: 'Lisa Garcia' },
    { id: 8, name: 'Tom Anderson' }
];

// Badge Component
const Badge = ({ children, className = '' }: ComponentProps) => (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}>
        {children}
    </span>
);

export default function DashboardPage() {
    const [currentDate, setCurrentDate] = useState('');
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [customers, setCustomers] = useState<Appointment[]>([]);
    const [isLoadingAppointments, setIsLoadingAppointments] = useState(false);

    useEffect(() => {
        setCurrentDate(new Date().toLocaleDateString('th-TH', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }));
    }, []);

    const fetchAppointments = async (): Promise<void> => {
        setIsLoadingAppointments(true);
        try {
            const response = await fetch(`${API_BASE_URL}/appointments`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            if (response.ok) {
                const appointmentsData = await response.json();
                setAppointments(appointmentsData);
            } else {
                console.error('Failed to fetch appointments');
                // Fallback to empty array if API fails
                setAppointments([]);
            }
        } catch (error) {
            console.error('Error fetching appointments:', error);
            // Fallback to empty array if API fails
            setAppointments([]);
        } finally {
            setIsLoadingAppointments(false);
        }
    };

    const fetchCustomer = async (): Promise<void> => {
        try {
            const response = await fetch(`${API_BASE_URL}/customer`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            if (response.ok) {
                const CustomersData = await response.json();
                setCustomers(CustomersData);
            } else {
                console.error('Failed to fetch appointments');
                // Fallback to empty array if API fails
                setCustomers([]);
            }
        } catch (error) {
            console.error('Error fetching appointments:', error);
            // Fallback to empty array if API fails
            setCustomers([]);
        } 
    };

    const fetchServices = async (): Promise<void> => {
        try {
            const response = await fetch(`${API_BASE_URL}/customer`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            if (response.ok) {
                const CustomersData = await response.json();
                setCustomers(CustomersData);
            } else {
                console.error('Failed to fetch appointments');
                // Fallback to empty array if API fails
                setCustomers([]);
            }
        } catch (error) {
            console.error('Error fetching appointments:', error);
            // Fallback to empty array if API fails
            setCustomers([]);
        } 
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    const todayAppointments = appointments.length > 0 
        ? appointments.filter((apt) => apt.date === '2025-01-24')
        : mockAppointments.filter((apt) => apt.date === '2025-01-24');

    const todayRevenue = todayAppointments.reduce((sum, apt) => sum + apt.price, 0);

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

    if (isLoadingAppointments) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-7xl mx-auto flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading dashboard...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-600">
                        {currentDate}
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">Today's Appointments</CardTitle>
                            <Calendar className="h-4 w-4 text-gray-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-gray-900">{todayAppointments.length}</div>
                            <p className="text-xs text-gray-600">
                                +20.1% from yesterday
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">Today's Revenue</CardTitle>
                            <TrendingUp className="h-4 w-4 text-gray-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-gray-900">฿{todayRevenue.toLocaleString()}</div>
                            <p className="text-xs text-gray-600">
                                +15% from yesterday
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">Total Customers</CardTitle>
                            <Users className="h-4 w-4 text-gray-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-gray-900">{mockCustomers.length}</div>
                            <p className="text-xs text-gray-600">
                                +5 new this week
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">Active Services</CardTitle>
                            <Scissors className="h-4 w-4 text-gray-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-gray-900">
                                {mockServices.filter(s => s.isActive).length}
                            </div>
                            <p className="text-xs text-gray-600">
                                {mockServices.length} total services
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Today's Appointments */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-gray-900">Today's Appointments</CardTitle>
                        <CardDescription>
                            All appointments scheduled for today
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {todayAppointments.length === 0 ? (
                                <p className="text-gray-500 text-center py-8">No appointments scheduled for today</p>
                            ) : (
                                todayAppointments.map((appointment) => (
                                    <div
                                        key={appointment.id}
                                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="space-y-1">
                                            <div className="flex items-center space-x-2">
                                                <h4 className="font-medium text-gray-900">{appointment.customerName}</h4>
                                                <Badge className={getStatusColor(appointment.status)}>
                                                    {appointment.status}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-gray-600">
                                                {appointment.serviceName}
                                            </p>
                                            {appointment.notes && (
                                                <p className="text-xs text-gray-500">
                                                    Note: {appointment.notes}
                                                </p>
                                            )}
                                        </div>
                                        <div className="text-right space-y-1">
                                            <p className="font-medium text-gray-900">{appointment.time}</p>
                                            <p className="text-sm text-gray-600">
                                                {appointment.duration} min
                                            </p>
                                            <p className="text-sm font-medium text-gray-900">
                                                ฿{appointment.price.toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}