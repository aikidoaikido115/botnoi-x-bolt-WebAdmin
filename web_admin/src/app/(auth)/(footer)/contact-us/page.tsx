'use client';

import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function ContactUs() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 relative"> {/* เพิ่ม relative */}
      {/* ปุ่ม Back ที่อยู่มุมซ้ายสุด */}
      <Link
        href="/"
        className="absolute left-0 top-8 ml-4 inline-flex items-center text-white hover:text-purple-200"
      >
        <ChevronLeft className="mr-1" size={20} />
        Back
      </Link>

      {/* Header */}
      <header className="mb-8 text-center"> {/* ปรับเป็น text-center */}
        <h1 className="text-3xl font-bold text-white">Contact Us</h1>
      </header>

      {/* Main Content */}
      <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-white/10 text-white">
        <div className="space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-3">Customer Support</h2>
            <p className="text-white/80">
              Our customer support team is available 24/7 to assist you with any booking-related inquiries.
            </p>
            <ul className="mt-4 space-y-2 text-white/80">
              <li>Email: support@bookinghub.com</li>
              <li>Phone: +1 (800) 123-4567</li>
              <li>Live Chat: Available on our website</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Business Hours</h2>
            <p className="text-white/80">
              Monday - Friday: 9:00 AM - 6:00 PM (GMT+7)
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Visit Us</h2>
            <p className="text-white/80">
              123 Booking Street<br />
              Digital District, Bangkok 10110<br />
              Thailand
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}