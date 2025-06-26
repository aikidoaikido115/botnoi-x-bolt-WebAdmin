'use client';

import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

const faqCategories = [
  {
    title: "Booking Process",
    questions: [
      {
        question: "How do I make a booking?",
        answer: "Select your service, choose a time slot, and complete the payment process."
      },
      {
        question: "Can I book multiple services?",
        answer: "Yes, you can add multiple services to your cart before checkout."
      }
    ]
  },
  {
    title: "Payments",
    questions: [
      {
        question: "What payment methods are accepted?",
        answer: "We accept credit cards, PayPal, and select mobile payment options."
      },
      {
        question: "Is my payment information secure?",
        answer: "Yes, we use industry-standard encryption for all transactions."
      }
    ]
  }
];

export default function FAQ() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 relative">
      <Link href="/" className="absolute left-0 top-8 ml-4 inline-flex items-center text-white hover:text-purple-200">
        <ChevronLeft className="mr-1" size={20} />
        Back
      </Link>

      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-white">Frequently Asked Questions</h1>
        <p className="text-white/80 mt-2">Find answers to common questions</p>
      </header>

      <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-white/10 text-white">
        <div className="space-y-8">
          {faqCategories.map((category, index) => (
            <section key={index}>
              <h2 className="text-2xl font-semibold mb-4 text-purple-300">{category.title}</h2>
              <div className="space-y-4 pl-4">
                {category.questions.map((item, qIndex) => (
                  <div key={qIndex} className="pb-4 border-b border-white/10 last:border-0">
                    <h3 className="text-lg font-medium mb-2">{item.question}</h3>
                    <p className="text-white/80">{item.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}