'use client'
import { useState, useEffect, ReactNode } from 'react';
import { Calendar, Users, Scissors, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/Card';
import { useBooking } from '@/context/BookingContext';

// Interface สำหรับ Component Props
interface ComponentProps {
    children: ReactNode;
    className?: string;
}

// Interface สำหรับ Service
interface Service {
    id: string;
    title: string;
    description: string;
    store_id: string;
    duration_minutes: number;
    prices: number;
    store_name: string;
}

// Interface สำหรับ Customer/User
interface Customer {
    id: string;
    user_name: string;
    tel: string;
}

// Interface สำหรับ Appointment
interface Appointment {
    id: string;
    booking_time: string;
    status: string;
    note: string;
    user_id: string;
    created_at: string;
    prices: number,
    serviceName: string,
    customerName: string,
    notes: string,
    date:string

}

// Interface สำหรับ Mock Appointment (ใช้กับ mock data)
interface MockAppointment {
    id: number;
    customerName: string;
    serviceName: string;
    date: string;
    time: string;
    duration: number;
    price: number;
    status: string;
    notes: string | null;
}

// Interface สำหรับ Mock Service
interface MockService {
    id: number;
    name: string;
    isActive: boolean;
}

// Interface สำหรับ Mock Customer
interface MockCustomer {
    id: number;
    name: string;
}

// Interface สำหรับ Booking API Response
interface BookingResponse {
    id: string;
    booking_time: string;
    status: string;
    note: string;
    user_id: string;
    created_at: string;
    users?: {
        id: string;
        user_name: string;
        tel: string;
    };
    booking_services?: Array<{
        service: {
            id: string;
            title: string;
            description: string;
            store_id: string;
            duration_minutes: number;
            prices: number;
            stores?: {
                store_name: string;
            };
        };
    }>;
}

// Status type union
type AppointmentStatus = 'confirmed' | 'pending' | 'cancelled' | 'completed';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mybooking.ngrok.pizza';

// Mock data with proper typing
const mockAppointments: MockAppointment[] = [
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

const mockServices: MockService[] = [
    { id: 1, name: 'Haircut & Styling', isActive: true },
    { id: 2, name: 'Hair Coloring', isActive: true },
    { id: 3, name: 'Beard Trim', isActive: true },
    { id: 4, name: 'Perm Treatment', isActive: true },
    { id: 5, name: 'Hair Wash', isActive: false }
];

const mockCustomers: MockCustomer[] = [
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Smith' },
    { id: 3, name: 'Mike Johnson' },
    { id: 4, name: 'Sarah Wilson' },
    { id: 5, name: 'Emily Brown' },
    { id: 6, name: 'David Lee' },
    { id: 7, name: 'Lisa Garcia' },
    { id: 8, name: 'Tom Anderson' }
];

// Badge Component with proper typing
const Badge: React.FC<ComponentProps> = ({ children, className = '' }) => (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}>
        {children}
    </span>
);

const DashboardPage: React.FC = () => {
    const [currentDate, setCurrentDate] = useState<string>('');
    const [LstBooking, setLstBooking] = useState<BookingResponse[]>([]);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    const [isLoadingAppointments, setIsLoadingAppointments] = useState<boolean>(false);
    
    const context = useBooking();
    const { store_id, setStore_id } = context;

    useEffect(() => {
        setCurrentDate(new Date().toLocaleDateString('th-TH', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }));
    }, []);

    const formatData = async (): Promise<void> => {
        const appointmentList: Appointment[] = [];
        const customerMap = new Map<string, Customer>();
        const serviceMap = new Map<string, Service>();

        for (const booking of LstBooking) {
            // Appointments
            appointmentList.push({
                id: booking.id,
                booking_time: booking.booking_time,
                status: booking.status,
                note: booking.note,
                user_id: booking.user_id,
                created_at: booking.created_at,
                prices: booking.booking_services?.[0]?.service?.prices || 0,
                serviceName: booking.booking_services?.[0]?.service?.title || '',
                customerName: booking.users?.user_name || '',
                notes: booking.note || '',
                date:booking.created_at.split('T')[0],
            });

            // Customers
            if (booking.users && !customerMap.has(booking.user_id)) {
                customerMap.set(booking.user_id, {
                    id: booking.users.id,
                    user_name: booking.users.user_name,
                    tel: booking.users.tel,
                });
            }

            // Services
            for (const bs of booking.booking_services || []) {
                const service = bs.service;
                if (service && !serviceMap.has(service.id)) {
                    serviceMap.set(service.id, {
                        id: service.id,
                        title: service.title,
                        description: service.description,
                        store_id: service.store_id,
                        duration_minutes: service.duration_minutes,
                        prices: service.prices,
                        store_name: service.stores?.store_name || '',
                    });
                }
            }
        }

        setAppointments(appointmentList);
        setCustomers(Array.from(customerMap.values()));
        setServices(Array.from(serviceMap.values()));

        console.log(appointments);
        
    };

    const fetchBooking = async (): Promise<void> => {
        setIsLoadingAppointments(true);
        try {
            const response = await fetch(`${API_BASE_URL}/booking-appointments?store_id=${store_id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            console.log('Fetching appointments for store_id:', store_id);

            if (response.ok) {
                const LstData: BookingResponse[] = await response.json();
                setLstBooking(LstData); // ✅ ให้ useEffect ที่ watch LstBooking ทำหน้าที่นี้
                console.log('Fetched appointments:', LstData);
            } else {
                console.error('Failed to fetch appointments');
                setLstBooking([]);
            }
        } catch (error) {
            console.error('Error fetching appointments:', error);
            setLstBooking([]);
        } finally {
            setIsLoadingAppointments(false);
        }
    };



    useEffect(() => {
        // if (store_id) {
            fetchBooking();
        // }
    }, []);

    useEffect(() => {
        if (LstBooking.length > 0) {
            formatData();
        }
    }, [LstBooking]);

    // const todayAppointments: MockAppointment[] = appointments.length > 0
    //     ? [] // TODO: Transform real appointments to display format
    //     : mockAppointments.filter((apt) => apt.date === '2025-01-24');

    const today = new Date().toISOString().split('T')[0]; // ได้ "2025-06-25" แบบ YYYY-MM-DD
    const todayAppointments = appointments.filter((apt) => apt.date === today);
    const todayRevenue: number = todayAppointments.reduce((sum, apt) => sum + apt.prices, 0);

    const getStatusColor = (status: string): string => {
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
                            <div className="text-2xl font-bold text-gray-900">{customers.length || mockCustomers.length}</div>
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
                                {services.length || mockServices.filter(s => s.isActive).length}
                            </div>
                            <p className="text-xs text-gray-600">
                                {services.length || mockServices.length} total services
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
                                            <p className="font-medium text-gray-900">{appointment.created_at}</p>
                                            <p className="text-sm text-gray-600">
                                                30 min
                                            </p>
                                            <p className="text-sm font-medium text-gray-900">
                                                ฿{appointment.prices.toLocaleString()}
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
};

export default DashboardPage;