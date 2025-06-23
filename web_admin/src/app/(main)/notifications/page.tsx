'use client';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Bell } from 'lucide-react';

interface Notification {
  id: string; // เปลี่ยนจาก number เป็น string เพื่อให้รองรับ UUID
  name: string;
  initials: string;
  type: string;
  service: string;
  date: string;
  timeAgo: string;
  isRead: boolean;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const observer = useRef<IntersectionObserver>();
  const loadingRef = useRef<HTMLDivElement>(null);
  const itemsPerLoad = 6;

  // ฟังก์ชันสำหรับสร้าง UUID แบบง่าย
  const generateUUID = () => {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  };

  const loadNotifications = useCallback(async () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    try {
      const newNotifications = await fetchNotifications(page, itemsPerLoad, generateUUID);
      
      setNotifications(prev => {
        // ตรวจสอบว่าไม่มีการซ้ำของ ID
        const existingIds = new Set(prev.map(n => n.id));
        const uniqueNewNotifications = newNotifications.filter(n => !existingIds.has(n.id));
        return [...prev, ...uniqueNewNotifications];
      });
      
      setHasMore(newNotifications.length === itemsPerLoad);
      setPage(prev => prev + 1);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore]);

  useEffect(() => {
    if (loading) return;
    
    const options = {
      root: null,
      rootMargin: '20px',
      threshold: 0.1,
    };

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        loadNotifications();
      }
    }, options);

    if (loadingRef.current) {
      observer.current.observe(loadingRef.current);
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [loadNotifications, loading, hasMore]);

  useEffect(() => {
    loadNotifications();
  }, []);

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? {...n, isRead: true} : n)
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-4xl mx-auto py-6 px-4">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h1 className="text-xl font-semibold flex items-center">
              <Bell className="h-5 w-5 mr-2" />
              Notifications
            </h1>
          </div>
          
          <div className="divide-y divide-gray-200">
            {notifications.map(notification => (
              <NotificationItem 
                key={notification.id} 
                notification={notification} 
                onMarkAsRead={markAsRead}
              />
            ))}
          </div>

          <div ref={loadingRef} className="p-4">
            {loading && (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            )}
            {!hasMore && notifications.length > 0 && (
              <div className="text-center text-gray-500 py-4">
                You've reached the end
              </div>
            )}
            {!hasMore && notifications.length === 0 && (
              <div className="text-center text-gray-500 py-4">
                No notifications available
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

const NotificationItem = React.memo(({ 
  notification,
  onMarkAsRead
}: { 
  notification: Notification;
  onMarkAsRead: (id: string) => void;
}) => (
  <div className={`p-4 ${!notification.isRead ? 'bg-blue-50' : 'bg-white'}`}>
    <div className="flex items-start">
      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-500 flex items-center justify-center text-white">
        <span>{notification.initials}</span>
      </div>
      <div className="ml-3 flex-1">
        <p className="text-sm font-medium text-gray-900">
          {notification.type} from {notification.name}
        </p>
        <p className="text-sm text-gray-500">
          {notification.service} - {notification.date}
        </p>
        <p className="text-xs text-gray-400 mt-1">{notification.timeAgo}</p>
      </div>
      {!notification.isRead && (
        <button 
          onClick={() => onMarkAsRead(notification.id)}
          className="text-xs text-blue-500 hover:text-blue-700"
        >
          Mark as read
        </button>
      )}
    </div>
  </div>
));

async function fetchNotifications(
  page: number, 
  limit: number,
  uuidGenerator: () => string
): Promise<Notification[]> {
  return new Promise(resolve => {
    setTimeout(() => {
      const mockData = Array.from({ length: limit }, (_, i) => {
        const index = (page - 1) * limit + i;
        return {
          id: uuidGenerator(), // ใช้ UUID generator แทน
          name: ['Lisa', 'Michael', 'Sarah', 'Tom', 'Emma'][index % 5],
          initials: ['LH', 'MJ', 'SR', 'TP', 'EW'][index % 5],
          type: ['New booking', 'Booking confirmation', 'Reminder', 'Cancellation'][index % 4],
          service: ['Haircut', 'Coloring', 'Treatment', 'Spa'][index % 4],
          date: new Date(Date.now() - index * 3600000).toLocaleString(),
          timeAgo: `${index + 1} hour${index > 0 ? 's' : ''} ago`,
          isRead: index > 2
        };
      });
      resolve(mockData);
    }, 800);
  });
}