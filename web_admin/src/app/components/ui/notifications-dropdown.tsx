'use client';
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, BellOff } from 'lucide-react';

interface Notification {
  id: number;
  name: string;
  initials: string;
  type: string;
  service: string;
  date: string;
  timeAgo: string;
  isRead: boolean;
}

export function NotificationDropdown() {
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const isNotificationPage = pathname === '/notifications';
  
  const notifications: Notification[] = [
    {
      id: 1,
      name: 'Lisa',
      initials: 'LH',
      type: 'New booking',
      service: 'Haircut & Coloring',
      date: 'June 25, 2:00 PM',
      timeAgo: '2 hours ago',
      isRead: false
    },
    {
      id: 2,
      name: 'Michael',
      initials: 'MJ',
      type: 'Booking confirmation',
      service: "Men's Haircut",
      date: 'June 24, 5:30 PM',
      timeAgo: '1 day ago',
      isRead: false
    },
    {
      id: 3,
      name: 'Sarah',
      initials: 'SR',
      type: 'Booking reminder',
      service: 'Hair Treatment',
      date: 'Tomorrow, 10:00 AM',
      timeAgo: '3 days ago',
      isRead: true
    },
    {
      id: 4,
      name: 'Tom',
      initials: 'TP',
      type: 'Booking cancelled',
      service: 'Hair Spa',
      date: 'June 26, 3:00 PM',
      timeAgo: '4 days ago',
      isRead: true
    },
    {
      id: 5,
      name: 'Emma',
      initials: 'EW',
      type: 'New booking',
      service: 'Blowout',
      date: 'June 27, 11:00 AM',
      timeAgo: '5 hours ago',
      isRead: false
    }
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifOpen(false);
      }
    };

    if (notifOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [notifOpen]);

  if (isNotificationPage) {
    return (
      <div className="relative" ref={notifRef}>
        <div className="relative rounded-md p-2 text-gray-400 cursor-default" title="คุณอยู่ในหน้าการแจ้งเตือนแล้ว">
          <BellOff className="h-5 w-5" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative" ref={notifRef}>
      <button
        onClick={() => setNotifOpen(!notifOpen)}
        className="relative rounded-md p-2 hover:bg-gray-100"
        aria-label="Notifications"
        disabled={isNotificationPage}
      >
        <Bell className="h-5 w-5" />
        {notifications.some(n => !n.isRead) && (
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500" />
        )}
      </button>

      {notifOpen && (
        <div className="absolute right-0 mt-2 w-80 rounded-md border border-gray-200 bg-gray-50 shadow-lg z-90">
          <div className="p-3 border-b border-gray-200">
            <h3 className="font-semibold text-gray-800">Notifications</h3>
          </div>
          <div className="overflow-y-auto max-h-96">
            <ul className="divide-y divide-gray-200">
              {notifications.map(notif => (
                <li 
                  key={notif.id} 
                  className={`px-4 py-3 hover:bg-gray-100 cursor-pointer ${!notif.isRead ? 'bg-blue-50' : ''}`}
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-500 flex items-center justify-center text-white">
                      <span>{notif.initials}</span>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        {notif.type} from {notif.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {notif.service} - {notif.date}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">{notif.timeAgo}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="p-3 border-t border-gray-200 text-center">
            <Link 
              href="/notifications"
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              onClick={() => setNotifOpen(false)}
            >
              View all notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}