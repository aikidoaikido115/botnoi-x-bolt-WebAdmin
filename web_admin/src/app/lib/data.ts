import { Appointment, Service, Customer, Promotion, ScheduleSettings, StoreProfile } from '../types';

// Mock data for development
export const mockAppointments: Appointment[] = [
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

export const mockServices: Service[] = [
  {
    id: '1',
    name: 'ตัดผมชาย',
    description: 'ตัดผมสำหรับผู้ชาย รวมสระ',
    duration: 30,
    price: 150,
    isActive: true,
    category: 'ผู้ชาย'
  },
  {
    id: '2',
    name: 'ตัดผมหญิง',
    description: 'ตัดผมสำหรับผู้หญิง รวมสระและเป่า',
    duration: 60,
    price: 300,
    isActive: true,
    category: 'ผู้หญิง'
  },
  {
    id: '3',
    name: 'ทำสีผม',
    description: 'ทำสีผมครบวงจร รวมสระและเป่า',
    duration: 120,
    price: 2500,
    isActive: true,
    promotionPrice: 2000,
    category: 'สีผม'
  }
];

export const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'สมใจ ใจดี',
    lineId: 'user123',
    email: 'somjai@email.com',
    phone: '081-234-5678',
    totalAppointments: 15,
    lastVisit: '2025-01-20'
  },
  {
    id: '2',
    name: 'นางสาว มานี มีสุข',
    lineId: 'user456',
    totalAppointments: 8,
    lastVisit: '2025-01-18'
  }
];

export const mockPromotions: Promotion[] = [
  {
    id: '1',
    name: 'ลด 20% ทำสีผม',
    description: 'ลดราคาทำสีผมทุกประเภท 20%',
    discountPercent: 20,
    validFrom: '2025-01-01',
    validUntil: '2025-01-31',
    isActive: true,
    applicableServices: ['3']
  }
];

export const mockSchedule: ScheduleSettings[] = [
  { id: '1', dayOfWeek: 1, isOpen: true, openTime: '09:00', closeTime: '19:00' },
  { id: '2', dayOfWeek: 2, isOpen: true, openTime: '09:00', closeTime: '19:00' },
  { id: '3', dayOfWeek: 3, isOpen: true, openTime: '09:00', closeTime: '19:00' },
  { id: '4', dayOfWeek: 4, isOpen: true, openTime: '09:00', closeTime: '19:00' },
  { id: '5', dayOfWeek: 5, isOpen: true, openTime: '09:00', closeTime: '19:00' },
  { id: '6', dayOfWeek: 6, isOpen: true, openTime: '09:00', closeTime: '18:00' },
  { id: '7', dayOfWeek: 0, isOpen: false, openTime: '10:00', closeTime: '17:00' }
];

export const mockStoreProfile: StoreProfile = {
  id: '1',
  name: 'ร้านตัดผม Happy Hair',
  description: 'ร้านตัดผมสำหรับทุกเพศทุกวัย บริการดี ราคาถูก',
  address: '123 ถนนสุขุมวิท กรุงเทพ 10110',
  phone: '02-123-4567',
  email: 'info@happyhair.com',
  lineChannelId: 'YOUR_CHANNEL_ID',
  lineChannelSecret: 'YOUR_CHANNEL_SECRET',
  webhookUrl: 'https://your-domain.com/api/line/webhook',
  isLineConnected: true
};