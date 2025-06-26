const BASE_URL = 'http://localhost:8000';

export interface Store {
  id: string;
  store_name: string;
  created_at: string;
}

export async function getLatestStore(): Promise<Store | null> {
  try {
    const response = await fetch(`${BASE_URL}/stores/all`, {
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
