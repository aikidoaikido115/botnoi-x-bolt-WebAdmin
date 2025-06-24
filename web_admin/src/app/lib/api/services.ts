
import { Service } from '../../types'; 

const BASE_URL = 'http://localhost:8000'; 

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
