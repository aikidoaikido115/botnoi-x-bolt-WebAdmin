'use client'
import { useState, useEffect, ReactNode } from 'react';
import { Calendar, Users, Scissors, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';
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

// Mock data
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
    },
    {
        id: 5,
        customerName: 'Emily Brown',
        serviceName: 'Hair Wash',
        date: '2025-01-24',
        time: '16:00',
        duration: 30,
        price: 300,
        status: 'confirmed',
        notes: null
    },
    {
        id: 6,
        customerName: 'David Lee',
        serviceName: 'Haircut & Styling',
        date: '2025-01-24',
        time: '17:00',
        duration: 60,
        price: 800,
        status: 'pending',
        notes: 'Special request for styling'
    },
    {
        id: 7,
        customerName: 'Lisa Garcia',
        serviceName: 'Hair Coloring',
        date: '2025-01-24',
        time: '18:00',
        duration: 120,
        price: 2500,
        status: 'confirmed',
        notes: 'Root touch-up'
    },
    {
        id: 8,
        customerName: 'Tom Anderson',
        serviceName: 'Beard Trim',
        date: '2025-01-24',
        time: '19:00',
        duration: 30,
        price: 400,
        status: 'completed',
        notes: null
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

// Pagination Component for all screen sizes
const AppPagination = ({ 
    currentPage, 
    totalPages, 
    onPageChange 
}: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}) => {
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    return (
        <div className="flex justify-end mt-4">
            <div className="flex items-center space-x-1.5">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`p-1.5 rounded-md ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                    <ChevronLeft className="h-4 w-4" />
                </button>

                {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((page) => (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`w-8 h-8 rounded-md text-sm ${currentPage === page ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                        {page}
                    </button>
                ))}

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`p-1.5 rounded-md ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                    <ChevronRight className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
};

export default function DashboardPage() {
    const [currentDate, setCurrentDate] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4; // 4 appointments per page for all screen sizes

    useEffect(() => {
        setCurrentDate(new Date().toLocaleDateString('th-TH', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }));
    }, []);

    const todayAppointments = mockAppointments.filter(
        (apt) => apt.date === '2025-01-24'
    );

    // Pagination logic for all screens
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentAppointments = todayAppointments.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(todayAppointments.length / itemsPerPage);

    const todayRevenue = todayAppointments.reduce((sum, apt) => sum + apt.price, 0);

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

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-sm md:text-base text-gray-600">
                        {currentDate}
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">Today's Appointments</CardTitle>
                            <Calendar className="h-4 w-4 text-gray-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-xl md:text-2xl font-bold text-gray-900">{todayAppointments.length}</div>
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
                            <div className="text-xl md:text-2xl font-bold text-gray-900">฿{todayRevenue.toLocaleString()}</div>
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
                            <div className="text-xl md:text-2xl font-bold text-gray-900">{mockCustomers.length}</div>
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
                            <div className="text-xl md:text-2xl font-bold text-gray-900">
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
                            {currentAppointments.length === 0 ? (
                                <p className="text-gray-500 text-center py-8">No appointments scheduled for today</p>
                            ) : (
                                currentAppointments.map((appointment) => (
                                    <div
                                        key={appointment.id}
                                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="space-y-1 mb-2 sm:mb-0">
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 space-y-1 sm:space-y-0">
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
                                        <div className="text-left sm:text-right space-y-1">
                                            <p className="font-medium text-gray-900">{appointment.time}</p>
                                            <div className="flex sm:block justify-between">
                                                <p className="text-sm text-gray-600 sm:mb-1">
                                                    {appointment.duration} min
                                                </p>
                                                <p className="text-sm font-medium text-gray-900">
                                                    ฿{appointment.price.toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Pagination for all screen sizes */}
                        {todayAppointments.length > itemsPerPage && (
                            <AppPagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={(page) => setCurrentPage(page)}
                            />
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}