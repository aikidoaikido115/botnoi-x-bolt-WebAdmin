'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Calendar,
  Scissors,
  Users,
  Gift,
  Clock,
  MessageSquare,
  Settings,
  BarChart3
} from 'lucide-react';

const sidebarItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Appointments',
    href: '/appointments',
    icon: Calendar,
  },
  {
    title: 'Services',
    href: '/services',
    icon: Scissors,
  },
  {
    title: 'Customers',
    href: '/customers',
    icon: Users,
  },
  {
    title: 'Promotions',
    href: '/promotions',
    icon: Gift,
  },
  {
    title: 'Schedule',
    href: '/schedule',
    icon: Clock,
  },
  {
    title: 'LINE Preview',
    href: '/line-preview',
    icon: MessageSquare,
  },
  // {
  //   title: 'Analytics',
  //   href: '/analytics',
  //   icon: BarChart3,
  // },
  // {
  //   title: 'Settings',
  //   href: '/settings',
  //   icon: Settings,
  // },
];

export function Sidebar() {
  const pathname = usePathname();

  const getNavItemClasses = (href: string) => {
    const baseClasses = 'flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors hover:bg-gray-100';
    const activeClasses = 'bg-blue-50 text-blue-700 border-r-2 border-blue-700';
    const inactiveClasses = 'text-gray-700 hover:text-gray-900';
    
    return pathname === href 
      ? `${baseClasses} ${activeClasses}`
      : `${baseClasses} ${inactiveClasses}`;
  };

  return (
    <div className="hidden md:flex w-64 flex-col fixed inset-y-0 z-50">
      <div className="flex flex-col flex-grow pt-16 bg-white overflow-y-auto border-r border-gray-200">
        <div className="flex flex-col flex-grow px-4 py-4">
          <nav className="flex-1 space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={getNavItemClasses(item.href)}
                >
                  <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                  <span className="truncate">{item.title}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}