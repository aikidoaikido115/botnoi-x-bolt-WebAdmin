'use client';

import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function TermsOfService() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 relative">
      <Link href="/" className="absolute left-0 top-8 ml-4 inline-flex items-center text-white hover:text-purple-200">
        <ChevronLeft className="mr-1" size={20} />
        Back
      </Link>

      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-white">Terms of Service</h1>
        <p className="text-white/80 mt-2">Effective from June 2024</p>
      </header>

      <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-white/10 text-white">
        <div className="space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-3 text-purple-300">1. User Responsibilities</h2>
            <p className="text-white/80">
              By using our platform, you agree to provide accurate information and to respect 
              appointment times and cancellation policies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-purple-300">2. Booking Policy</h2>
            <p className="text-white/80">
              Appointments can be rescheduled or cancelled up to 24 hours in advance. 
              Late cancellations may incur fees as specified by the service provider.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-purple-300">3. Limitation of Liability</h2>
            <p className="text-white/80">
              BookingHub acts as an intermediary and is not responsible for service quality. 
              Any disputes should be resolved directly with the service provider.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}