'use client';

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { NextPage } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/Card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { useRouter } from 'next/navigation';
import { useBooking } from '@/context/BookingContext';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table';
import {  Search, ChevronLeft, ChevronRight, Filter, X } from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mybooking.ngrok.pizza';

// Type definitions
interface Appointment {
  id: string;
  customerName: string;
  customerLineId: string;
  serviceName: string;
  date: string;
  time: string;
  duration: number;
  price: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}

interface RawBooking {
  id: string;
  booking_time: string;
  status: string;
  users: {
    user_name: string;
    tel: string;
  };
  booking_services: {
    service_id: string;
    booking_id: string;
    service: {
      id: string;
      title: string;
      description: string;
      store_id: string;
      duration_minutes: number;
      prices: number;
      stores: {
        store_name: string;
        description: string;
        created_at: string;
        id: string;
      };
    };
  }[];
}

type AppointmentStatus = Appointment['status'];
type FilterStatus = AppointmentStatus | 'all';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

const AppPagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange
}) => {
  const maxVisiblePages = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  const firstItem = (currentPage - 1) * itemsPerPage + 1;
  const lastItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex items-center justify-between mt-4">
      <div className="text-sm text-muted-foreground">
        Showing {firstItem}-{lastItem} of {totalItems} appointments
      </div>
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

const AppointmentsPage: NextPage = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState<Appointment | null>(null);
  const [editedAppointment, setEditedAppointment] = useState<Partial<Appointment> | null>(null);
  const router = useRouter();
  const appointmentsPerPage = 7;
  const context = useBooking();
  const { store_id, setStore_id } = context;

  const fetchAppointmentsFromAPI = async () => {
    try {

      const response = await fetch(`${API_BASE_URL}/booking-appointments?store_id=${store_id}`);
      if (!response.ok) throw new Error('Failed to fetch');
      const data: RawBooking | RawBooking[] = await response.json();

      const bookings: RawBooking[] = Array.isArray(data) ? data : [data];

      const parsedAppointments: Appointment[] = bookings.map((item) => ({
        id: item.id,
        customerName: item.users?.user_name || 'N/A',
        customerLineId: item.users?.tel || '-',
        serviceName: item.booking_services?.[0]?.service?.title || '-',
        date: item.booking_time.split('T')[0],
        time: item.booking_time.split('T')[1].slice(0, 5),
        duration: item.booking_services?.[0]?.service?.duration_minutes || 0,
        price: item.booking_services?.[0]?.service?.prices || 0,
        status: mapStatus(item.status),
      }));

      return parsedAppointments;
    } catch (error) {
      console.error('Error fetching appointments:', error);
      return [];
    }
  };

  const mapStatus = (status: string): AppointmentStatus => {
    switch (status) {
      case 'not confirm': return 'pending';
      case 'confirmed': return 'confirmed';
      case 'completed': return 'completed';
      case 'cancelled': return 'cancelled';
      default: return 'pending';
    }
  };

  useEffect(() => {
    const loadAppointments = async () => {
      const results = await fetchAppointmentsFromAPI();
      setAppointments(results);
    };
    loadAppointments();
  }, []);



  const filteredAppointments = useMemo(() => {
    return appointments.filter((appointment: Appointment) => {
      const matchesStatus = filterStatus === 'all' || appointment.status === filterStatus;
      const matchesSearch =
        appointment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.serviceName.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [appointments, filterStatus, searchTerm]);

  // Pagination logic
  const indexOfLastAppointment = currentPage * appointmentsPerPage;
  const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage;
  const currentAppointments = filteredAppointments.slice(
    indexOfFirstAppointment,
    indexOfLastAppointment
  );
  const totalPages = Math.ceil(filteredAppointments.length / appointmentsPerPage);

  const getStatusColor = useCallback((status: AppointmentStatus): string => {
    const statusColors: Record<AppointmentStatus, string> = {
      confirmed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      cancelled: 'bg-red-100 text-red-800',
      completed: 'bg-blue-100 text-blue-800',
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  }, []);

  const handleStatusChange = useCallback((appointmentId: string, newStatus: AppointmentStatus): void => {
    setAppointments(prevAppointments =>
      prevAppointments.map(apt =>
        apt.id === appointmentId
          ? { ...apt, status: newStatus }
          : apt
      )
    );
    // TODO: Update appointment status via API
  }, []);

  const handleSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset to first page when search changes
  }, []);

  const handleFilterChange = useCallback((value: FilterStatus): void => {
    setFilterStatus(value);
    setCurrentPage(1); // Reset to first page when filter changes
  }, []);

  const handleDeleteClick = useCallback((appointmentId: string): void => {
    const appointment = appointments.find(a => a.id === appointmentId);
    if (appointment) {
      setCurrentAppointment(appointment);
      setDeleteDialogOpen(true);
    }
  }, [appointments]);

  const handleDeleteConfirm = useCallback(async (): Promise<void> => {
    if (currentAppointment) {
      try {
        const response = await fetch(`${API_BASE_URL}/bookings/delete`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ booking_id: currentAppointment.id }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.detail || 'Failed to delete booking');
        }

        // ลบสำเร็จ อัปเดต UI
        setAppointments(prev => prev.filter(a => a.id !== currentAppointment.id));
        setDeleteDialogOpen(false);
        setCurrentAppointment(null);
      } catch (error) {
        console.error('Error deleting appointment:', error);
        alert(`ไม่สามารถยกเลิกการจองได้: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  }, [currentAppointment]);

  return (
    <div className="space-y-6 relative">
      {/* Delete Confirmation Overlay */}
      {deleteDialogOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Confirm Deletion</h3>
              <button
                onClick={() => setDeleteDialogOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="mb-6">
              Are you sure you want to Cancel the appointment for {currentAppointment?.customerName}?
              This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setDeleteDialogOpen(false)}
                className="bg-white hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteConfirm}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mt-6 font-bold">Appointments</h1>
          <p className="text-muted-foreground">
            Manage all your appointments
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>
            Filter appointments by status or search by customer name
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by customer or service..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <Label htmlFor="status">Status</Label>
              <Select value={filterStatus} onValueChange={handleFilterChange}>
                <SelectTrigger className="bg-white hover:bg-gray-50">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem className="hover:bg-gray-50" value="all">All Status</SelectItem>
                  <SelectItem className="hover:bg-gray-50" value="confirmed">Confirmed</SelectItem>
                  <SelectItem className="hover:bg-gray-50" value="pending">Pending</SelectItem>
                  <SelectItem className="hover:bg-gray-50" value="completed">Completed</SelectItem>
                  <SelectItem className="hover:bg-gray-50" value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Appointments List</CardTitle>
          <CardDescription>
            {filteredAppointments.length} appointment{filteredAppointments.length !== 1 ? 's' : ''} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredAppointments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <Filter className="h-12 w-12 text-gray-400" />
              <p className="text-gray-500 text-lg">No appointments found</p>
              <p className="text-gray-400 text-sm">
                {filterStatus !== 'all' ? `No ${filterStatus} appointments` : 'No appointments match your search'}
              </p>
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentAppointments.map((appointment) => (
                      <TableRow key={appointment.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{appointment.customerName}</div>
                            <div className="text-sm text-muted-foreground">
                              {appointment.customerLineId}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{appointment.serviceName}</TableCell>
                        <TableCell>
                          <div>
                            <div>{appointment.date}</div>
                            <div className="text-sm text-muted-foreground">
                              {appointment.time}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{appointment.duration} min</TableCell>
                        <TableCell>฿{appointment.price.toLocaleString()}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Badge className={`${getStatusColor(appointment.status)}`}>
                              {appointment.status}
                            </Badge>
                            <Select
                              value={appointment.status}
                              onValueChange={(value: AppointmentStatus) =>
                                handleStatusChange(appointment.id, value)
                              }
                            >
                              <SelectTrigger className="w-8 h-8 p-0 border-0 bg-transparent hover:bg-gray-100"></SelectTrigger>
                              <SelectContent className="min-w-[120px] bg-white">
                                <SelectItem className="hover:bg-gray-50" value="pending">Pending</SelectItem>
                                <SelectItem className="hover:bg-gray-50" value="confirmed">Confirmed</SelectItem>
                                <SelectItem className="hover:bg-gray-50" value="completed">Completed</SelectItem>
                                <SelectItem className="hover:bg-gray-50" value="cancelled">Cancelled</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-red-600 text-red-600 hover:bg-red-50"
                              onClick={() => handleDeleteClick(appointment.id)}
                            >
                              Cancel
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-yellow-600 text-yellow-600 hover:bg-yellow-50"
                              onClick={() => router.push(`/slipverify/${appointment.id}`)}
                            >
                              Slip Verify
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {filteredAppointments.length > appointmentsPerPage && (
                <AppPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={filteredAppointments.length}
                  itemsPerPage={appointmentsPerPage}
                  onPageChange={setCurrentPage}
                />
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AppointmentsPage;