import React from 'react';
<<<<<<< HEAD
import { BookingContextProvider } from '@/context/BookingContext';
=======
import { FaXTwitter, FaFacebookF, FaLinkedinIn } from 'react-icons/fa6';
>>>>>>> 0a854cfb9bb2d18187daa62d8c710a954ed4fad5

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-blue-600 to-blue-300">
      {/* Custom Header for Auth Pages */}
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <span className="text-blue-600 font-bold text-xl">B</span>
              </div>
              <span className="text-white font-semibold text-xl">BookingHub</span>
            </div>
            {/* <nav className="hidden md:flex space-x-6">
              {/* <a href="/" className="text-white/80 hover:text-white transition-colors">
                Home
              </a>
              <a href="/about" className="text-white/80 hover:text-white transition-colors">
                About
              </a>
              <a href="/contact" className="text-white/80 hover:text-white transition-colors">
                Contact
              </a>
            </nav> */}
            <div className="flex items-center space-x-4">
              <a
                href="/login"
                className="bg-white text-blue-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-purple-100 transition"
              >
                Login
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* <BookingContextProvider>
            {children}
        </BookingContextProvider> */}
        {children}
      </main>

      {/* Custom Footer for Auth Pages */}
      <footer className="bg-black/20 backdrop-blur-sm border-t border-white/10 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-3 md:text-left sm:ml-14 md:ml-16 lg:ml-42">
            <div>
              <h3 className="text-white font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><a href="/help-center" className="text-white/70 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="/contact-us" className="text-white/70 hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="/faq" className="text-white/70 hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div className="md:ml-6 lg:ml-10">
              <h3 className="text-white font-semibold mb-4 ">Legal</h3>
              <ul className="space-y-2">
                <li><a href="/privacy-policy" className="text-white/70 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="/terms-of-service" className="text-white/70 hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="/cookie-policy" className="text-white/70 hover:text-white transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
            <div className="col-span-2 md:col-span-1 flex justify-center md:justify-start">
              <div className="md:ml-12 lg:ml-22">
                <h3 className="text-white sm:text-center md:text-left lg:text-left font-semibold mb-4 ">Connect</h3>
                <div className="flex justify-center space-x-6">
                  <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white transition-colors">
                    <span className="sr-only">X (Twitter)</span>
                    <FaXTwitter size={24} />
                  </a>
                  <a href="https://facebook.com/" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white transition-colors">
                    <span className="sr-only">Facebook</span>
                    <FaFacebookF size={24} />
                  </a>
                  <a href="https://linkedin.com/" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white transition-colors">
                    <span className="sr-only">LinkedIn</span>
                    <FaLinkedinIn size={24} />
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 mt-8 pt-8 text-center">
            <p className="text-white/60">&copy; 2025 BookingHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
