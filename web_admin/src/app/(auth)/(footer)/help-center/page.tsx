'use client';

import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

const faqs = [
  {
    question: "How do I book an appointment?",
    answer: "Navigate to the booking page, select your desired service, choose a time slot, and complete the payment process."
  },
  {
    question: "Can I cancel or reschedule my booking?",
    answer: "Yes, you can cancel or reschedule up to 24 hours before your appointment from your account dashboard."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards, PayPal, and select mobile payment options."
  },
  {
    question: "How do I contact customer support?",
    answer: "You can reach us 24/7 via live chat, email at support@bookinghub.com, or phone at +1 (800) 123-4567."
  }
];

export default function HelpCenter() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 relative">
      <Link href="/" className="absolute left-0 top-8 ml-4 inline-flex items-center text-white hover:text-purple-200">
        <ChevronLeft className="mr-1" size={20} />
        Back
      </Link>

      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-white">Help Center</h1>
        <p className="text-white/80 mt-2">Frequently asked questions and support resources</p>
      </header>

      <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-white/10 text-white">
        <div className="space-y-8">
          {faqs.map((faq, index) => (
            <section key={index} className="pb-6 border-b border-white/10 last:border-0">
              <h2 className="text-xl font-semibold mb-2 text-purple-300">{faq.question}</h2>
              <p className="text-white/80">{faq.answer}</p>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}