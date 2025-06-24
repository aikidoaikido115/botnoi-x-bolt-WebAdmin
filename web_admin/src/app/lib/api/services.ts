// api/services.ts

import { Service } from '../../types'; // ตรวจสอบให้แน่ใจว่า import Path ถูกต้อง

const BASE_URL = 'http://localhost:8000'; // Base URL ของ API ของคุณ

interface CreateServicePayload {
  title: string;
  duration_minutes: number;
  prices: number;
  description: string;
  store_id: string;
}

interface UpdateServicePayload {
  service_id: string;
  title?: string;
  duration_minutes?: number;
  prices?: number;
  description?: string;
}

/**
 * สร้างบริการใหม่
 * @param payload ข้อมูลสำหรับสร้างบริการใหม่
 * @returns ข้อมูลบริการที่สร้างขึ้น
 */
export async function createService(payload: CreateServicePayload): Promise<Service> {
  try {
    const response = await fetch(`${BASE_URL}/services/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to create service');
    }

    const data: Service = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating service:', error);
    throw error;
  }
}

/**
 * ดึงข้อมูลบริการทั้งหมดสำหรับร้านค้าที่กำหนด
 * @param storeId ID ของร้านค้า
 * @returns รายการบริการสำหรับร้านค้านั้น
 */
export async function getAllServices(storeId: string): Promise<Service[]> {
  try {
    const response = await fetch(`${BASE_URL}/services/all?store_id=${storeId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to fetch services');
    }

    const data: Service[] = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching all services:', error);
    throw error;
  }
}

/**
 * ดึงข้อมูลบริการเดียวตาม ID
 * @param serviceId ID ของบริการ
 * @returns ข้อมูลบริการ
 */
export async function getServiceById(serviceId: string): Promise<Service> {
  try {
    const response = await fetch(`${BASE_URL}/service?service_id=${serviceId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to fetch service by ID');
    }

    const data: Service = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching service by ID:', error);
    throw error;
  }
}

/**
 * อัปเดตบริการที่มีอยู่
 * @param payload ข้อมูลที่จะอัปเดตสำหรับบริการ
 * @returns ข้อมูลบริการที่อัปเดตแล้ว
 */
export async function updateService(payload: UpdateServicePayload): Promise<Service> {
  try {
    const response = await fetch(`${BASE_URL}/services/edit`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to update service');
    }

    const data: Service = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating service:', error);
    throw error;
  }
}

/**
 * ลบบริการ
 * @param serviceId ID ของบริการที่จะลบ
 * @returns ข้อมูลบริการที่ถูกลบ
 */
export async function deleteService(serviceId: string): Promise<Service> {
  try {
    const response = await fetch(`${BASE_URL}/services/delete`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ service_id: serviceId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to delete service');
    }

    const data: Service = await response.json();
    return data;
  } catch (error) {
    console.error('Error deleting service:', error);
    throw error;
  }
}
