'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/(main)/components/card';
import { Button } from '@/app/(main)/components/button';
import { Badge } from '@/app/(main)/components/badge';
import { Input } from '@/app/(main)/components/input';
import { Label } from '@/app/(main)/components/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/(main)/components/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/(main)/components/table';
import { Plus, Search } from 'lucide-react';
import { Appointment, AppointmentStatus } from '@/app/(main)/types';

const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: '1',
    customerName: 'สมใจ ใจดี',
    customerLineId: 'user123',
    serviceName: 'ตัดผมชาย',
    date: '2025-01-24',
    time: '10:00',
    status: 'confirmed',
    duration: 30,
    price: 150,
    notes: 'ตัดสั้น ไม่ใช้เจล'
  },
  {
    id: '2',
    customerName: 'นางสาว มานี มีสุข',
    customerLineId: 'user456',
    serviceName: 'ทำสีผม',
    date: '2025-01-24',
    time: '14:00',
    status: 'pending',
    duration: 120,
    price: 2500,
    notes: 'สีน้ำตาลอ่อน'
  },
  {
    id: '3',
    customerName: 'คุณ วิชัย ร่วมใจ',
    customerLineId: 'user789',
    serviceName: 'ตัดผม + สระ',
    date: '2025-01-24',
    time: '16:30',
    status: 'confirmed',
    duration: 45,
    price: 250
  }
];

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Status' },
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
] as const;

const STATUS_COLORS: Record<AppointmentStatus, string> = {
  confirmed: 'bg-green-100 text-green-800',
  pending: 'bg-yellow-100 text-yellow-800',
  cancelled: 'bg-red-100 text-red-800',
  completed: 'bg-blue-100 text-blue-800',
};

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAppointments = appointments.filter((appointment) => {
    const matchesStatus = filterStatus === 'all' || appointment.status === filterStatus;
    const matchesSearch = 
      appointment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.serviceName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleStatusChange = (appointmentId: string, newStatus: AppointmentStatus) => {
    setAppointments(appointments.map(apt => 
      apt.id === appointmentId ? { ...apt, status: newStatus } : apt
    ));
    // TODO: Update appointment status via API
  };

  const handleAddAppointment = () => {
    // TODO: Open add appointment modal
  };

  const handleEditAppointment = (appointmentId: string) => {
    // TODO: Open edit appointment modal
  };

  const handleDeleteAppointment = (appointmentId: string) => {
    // TODO: Delete appointment
  };

  return (
    <div className="space-y-6">
      <PageHeader onAddAppointment={handleAddAppointment} />
      
      <FiltersCard 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterStatus={filterStatus}
        onStatusChange={setFilterStatus}
      />
      
      <AppointmentsTable 
        appointments={filteredAppointments}
        onStatusChange={handleStatusChange}
        onEdit={handleEditAppointment}
        onDelete={handleDeleteAppointment}
      />
    </div>
  );
}

type PageHeaderProps = {
  onAddAppointment: () => void;
};

function PageHeader({ onAddAppointment }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold">Appointments</h1>
        <p className="text-muted-foreground">Manage all your appointments</p>
      </div>
      <Button onClick={onAddAppointment}>
        <Plus className="mr-2 h-4 w-4" />
        Add Appointment
      </Button>
    </div>
  );
}

type FiltersCardProps = {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterStatus: string;
  onStatusChange: (value: string) => void;
};

function FiltersCard({ 
  searchTerm, 
  onSearchChange, 
  filterStatus, 
  onStatusChange 
}: FiltersCardProps) {
  return (
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
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="w-full md:w-48">
            <Label htmlFor="status">Status</Label>
            <Select value={filterStatus} onValueChange={onStatusChange}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

type AppointmentsTableProps = {
  appointments: Appointment[];
  onStatusChange: (id: string, status: AppointmentStatus) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
};

function AppointmentsTable({ 
  appointments, 
  onStatusChange, 
  onEdit, 
  onDelete 
}: AppointmentsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Appointments List</CardTitle>
        <CardDescription>{appointments.length} appointments found</CardDescription>
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
              {appointments.map((appointment) => (
                <AppointmentRow 
                  key={appointment.id}
                  appointment={appointment}
                  onStatusChange={onStatusChange}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

type AppointmentRowProps = {
  appointment: Appointment;
  onStatusChange: (id: string, status: AppointmentStatus) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
};

function AppointmentRow({ 
  appointment, 
  onStatusChange, 
  onEdit, 
  onDelete 
}: AppointmentRowProps) {
  return (
    <TableRow>
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
          onValueChange={(value) => onStatusChange(appointment.id, value as AppointmentStatus)}
        >
          <SelectTrigger className="w-32">
            <Badge className={STATUS_COLORS[appointment.status]}>
              {appointment.status}
            </Badge>
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.filter(opt => opt.value !== 'all').map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(appointment.id)}
          >
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(appointment.id)}
          >
            Delete
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}