'use client';

import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 relative">
      <Link href="/" className="absolute left-0 top-8 ml-4 inline-flex items-center text-white hover:text-purple-200">
        <ChevronLeft className="mr-1" size={20} />
        Back
      </Link>

      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-white">Privacy Policy</h1>
        <p className="text-white/80 mt-2">Last updated: June 2024</p>
      </header>

      <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-white/10 text-white">
        <div className="space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-3 text-purple-300">1. Information We Collect</h2>
            <p className="text-white/80">
              We collect personal information you provide when making bookings, including name, contact details, 
              payment information, and appointment preferences.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-purple-300">2. How We Use Your Information</h2>
            <ul className="list-disc pl-5 space-y-2 text-white/80">
              <li>To process and manage your bookings</li>
              <li>To communicate appointment details</li>
              <li>To improve our services</li>
              <li>For security and fraud prevention</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-purple-300">3. Data Protection</h2>
            <p className="text-white/80">
              We implement industry-standard security measures to protect your personal information 
              and never sell your data to third parties.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}