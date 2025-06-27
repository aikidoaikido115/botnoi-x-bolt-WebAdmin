import { useBooking } from '@/context/BookingContext';

const BASE_URL = 'http://localhost:8000';

export interface Store {
  id: string;
  store_name: string;
  created_at: string;
}

export async function getLatestStore(): Promise<Store | null> {
  const context = useBooking();
  const { store_id, setStore_id } = context;

  try {
    const response = await fetch(`${BASE_URL}/store?store_id=${store_id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) return null;

    const stores: Store[] = await response.json();

    // เรียง store ล่าสุด (created_at มากสุด)
    const sorted = stores.sort((a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    return sorted[0] || null;
  } catch (error) {
    console.error('Error fetching latest store:', error);
    return null;
  }
}
