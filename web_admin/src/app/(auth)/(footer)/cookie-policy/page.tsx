'use client';

import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function CookiePolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 relative">
      <Link href="/" className="absolute left-0 top-8 ml-4 inline-flex items-center text-white hover:text-purple-200">
        <ChevronLeft className="mr-1" size={20} />
        Back
      </Link>

      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-white">Cookie Policy</h1>
        <p className="text-white/80 mt-2">How we use cookies on our platform</p>
      </header>

      <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-white/10 text-white">
        <div className="space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-3 text-purple-300">What Are Cookies</h2>
            <p className="text-white/80">
              Cookies are small text files stored on your device that help enhance your 
              browsing experience and remember your preferences.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-purple-300">How We Use Cookies</h2>
            <ul className="list-disc pl-5 space-y-2 text-white/80">
              <li>Session management for logged-in users</li>
              <li>Remembering booking preferences</li>
              <li>Analyzing website traffic patterns</li>
              <li>Improving service functionality</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-purple-300">Managing Cookies</h2>
            <p className="text-white/80">
              You can control cookie settings through your browser. Disabling cookies may 
              affect certain features of our booking system.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}