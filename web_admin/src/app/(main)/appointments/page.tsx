'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { NextPage } from 'next';
import { mockAppointments } from '@/app/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/Card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
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
import { Plus, Search } from 'lucide-react';

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

type AppointmentStatus = Appointment['status'];
type FilterStatus = AppointmentStatus | 'all';

interface AppointmentPageProps {}

const AppointmentsPage: NextPage<AppointmentPageProps> = () => {
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredAppointments = useMemo(() => {
    return appointments.filter((appointment: Appointment) => {
      const matchesStatus = filterStatus === 'all' || appointment.status === filterStatus;
      const matchesSearch = 
        appointment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.serviceName.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [appointments, filterStatus, searchTerm]);

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
  }, []);

  const handleFilterChange = useCallback((value: FilterStatus): void => {
    setFilterStatus(value);
  }, []);

  const handleAddAppointment = useCallback((): void => {
    // TODO: Open add appointment modal
    console.log('Add appointment clicked');
  }, []);

  const handleEditAppointment = useCallback((appointmentId: string): void => {
    // TODO: Open edit appointment modal
    console.log('Edit appointment:', appointmentId);
  }, []);

  const handleDeleteAppointment = useCallback((appointmentId: string): void => {
    // TODO: Delete appointment with confirmation
    console.log('Delete appointment:', appointmentId);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Appointments</h1>
          <p className="text-muted-foreground">
            Manage all your appointments
          </p>
        </div>
        <Button onClick={handleAddAppointment}>
          <Plus className="mr-2 h-4 w-4" />
          Add Appointment
        </Button>
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
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
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
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAppointments.map((appointment: Appointment) => (
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
                      <Select
                        value={appointment.status}
                        onValueChange={(value: AppointmentStatus) => 
                          handleStatusChange(appointment.id, value)
                        }
                      >
                        <SelectTrigger className="w-32">
                          <Badge className={getStatusColor(appointment.status)}>
                            {appointment.status}
                          </Badge>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditAppointment(appointment.id)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteAppointment(appointment.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AppointmentsPage;