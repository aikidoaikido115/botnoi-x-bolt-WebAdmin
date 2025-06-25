'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { NextPage } from 'next';
import { mockAppointments } from '@/app/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/Card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { useRouter } from 'next/navigation';
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
import { Plus, Search, ChevronLeft, ChevronRight, ChevronDown, Filter, X } from 'lucide-react';

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
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState<Appointment | null>(null);
  const [editedAppointment, setEditedAppointment] = useState<Partial<Appointment> | null>(null);
  const router = useRouter();
  const appointmentsPerPage = 7;

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

  const handleAddAppointment = useCallback((): void => {
    // TODO: Open add appointment modal
    console.log('Add appointment clicked');
  }, []);

  const handleEditClick = useCallback((appointmentId: string): void => {
    const appointment = appointments.find(a => a.id === appointmentId);
    if (appointment) {
      setCurrentAppointment(appointment);
      setEditedAppointment({...appointment});
      setEditDialogOpen(true);
    }
  }, [appointments]);

  const handleDeleteClick = useCallback((appointmentId: string): void => {
    const appointment = appointments.find(a => a.id === appointmentId);
    if (appointment) {
      setCurrentAppointment(appointment);
      setDeleteDialogOpen(true);
    }
  }, [appointments]);

  const handleDeleteConfirm = useCallback((): void => {
    if (currentAppointment) {
      setAppointments(prev => prev.filter(a => a.id !== currentAppointment.id));
      setDeleteDialogOpen(false);
      setCurrentAppointment(null);
    }
  }, [currentAppointment]);

  const handleEditSave = useCallback((): void => {
    if (editedAppointment && currentAppointment) {
      setAppointments(prev => 
        prev.map(a => 
          a.id === currentAppointment.id ? {...a, ...editedAppointment} : a
        )
      );
      setEditDialogOpen(false);
      setCurrentAppointment(null);
      setEditedAppointment(null);
    }
  }, [editedAppointment, currentAppointment]);

  const handleEditFieldChange = useCallback((field: keyof Appointment, value: string | number): void => {
    setEditedAppointment(prev => ({...prev, [field]: value}));
  }, []);

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
              Are you sure you want to delete the appointment for {currentAppointment?.customerName}?
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
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Appointment Overlay */}
      {editDialogOpen && currentAppointment && editedAppointment && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Edit Appointment</h3>
              <button 
                onClick={() => setEditDialogOpen(false)} 
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="space-y-2">
                <Label>Customer</Label>
                <Input 
                  value={currentAppointment.customerName} 
                  disabled 
                  className="bg-gray-100"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Service</Label>
                <Input 
                  value={editedAppointment.serviceName || ''}
                  onChange={(e) => handleEditFieldChange('serviceName', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Date</Label>
                <Input 
                  type="date"
                  value={editedAppointment.date || ''}
                  onChange={(e) => handleEditFieldChange('date', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Time</Label>
                <Input 
                  type="time"
                  value={editedAppointment.time || ''}
                  onChange={(e) => handleEditFieldChange('time', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Duration (minutes)</Label>
                <Input 
                  type="number"
                  value={editedAppointment.duration || ''}
                  onChange={(e) => handleEditFieldChange('duration', parseInt(e.target.value))}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Price</Label>
                <Input 
                  type="number"
                  value={editedAppointment.price || ''}
                  onChange={(e) => handleEditFieldChange('price', parseFloat(e.target.value))}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={editedAppointment.status}
                  onValueChange={(value) => handleEditFieldChange('status', value as AppointmentStatus)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem className="hover:bg-gray-50" value="pending">Pending</SelectItem>
                    <SelectItem className="hover:bg-gray-50" value="confirmed">Confirmed</SelectItem>
                    <SelectItem className="hover:bg-gray-50" value="completed">Completed</SelectItem>
                    <SelectItem className="hover:bg-gray-50" value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <Button 
                variant="outline" 
                onClick={() => setEditDialogOpen(false)}
                className="bg-white hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleEditSave}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Save Changes
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
                              className="border-blue-600 text-blue-600 hover:bg-blue-50"
                              onClick={() => handleEditClick(appointment.id)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-red-600 text-red-600 hover:bg-red-50"
                              onClick={() => handleDeleteClick(appointment.id)}
                            >
                              Delete
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