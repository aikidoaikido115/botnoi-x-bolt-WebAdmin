export interface Appointment {
  id: string;
  customerName: string;
  customerLineId: string;
  serviceName: string;
  date: string;
  time: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  duration: number;
  price: number;
  notes?: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  isActive: boolean;
  promotionPrice?: number;
  category: string;
}

export interface Customer {
  id: string;
  name: string;
  lineId: string;
  email?: string;
  phone?: string;
  totalAppointments: number;
  lastVisit?: string;
}

export interface Promotion {
  id: string;
  name: string;
  description: string;
  discountPercent: number;
  validFrom: string;
  validUntil: string;
  isActive: boolean;
  applicableServices: string[];
}

export interface ScheduleSettings {
  id: string;
  dayOfWeek: number;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
  breakStart?: string;
  breakEnd?: string;
}

export interface StoreProfile {
  id: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  lineChannelId?: string;
  lineChannelSecret?: string;
  webhookUrl?: string;
  isLineConnected: boolean;
}