import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'BookingHub - LINE Booking System',
  description: 'Complete booking system for small businesses with LINE integration',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">
          <main className="">
            <div className="w-full">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}

