import React from 'react';

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* Custom Header for Auth Pages */}
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <span className="text-purple-600 font-bold text-xl">S</span>
              </div>
              <span className="text-white font-semibold text-xl">StoreApp</span>
            </div>
            <nav className="hidden md:flex space-x-6">
              {/* <a href="/" className="text-white/80 hover:text-white transition-colors">
                Home
              </a>
              <a href="/about" className="text-white/80 hover:text-white transition-colors">
                About
              </a>
              <a href="/contact" className="text-white/80 hover:text-white transition-colors">
                Contact
              </a> */}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Custom Footer for Auth Pages */}
      <footer className="bg-black/20 backdrop-blur-sm border-t border-white/10 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-white font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><a href="/help" className="text-white/70 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="/contact" className="text-white/70 hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="/faq" className="text-white/70 hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="/privacy" className="text-white/70 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="/terms" className="text-white/70 hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="/cookies" className="text-white/70 hover:text-white transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Connect</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-white/70 hover:text-white transition-colors">
                  <span className="sr-only">Twitter</span>
                  <div className="w-6 h-6 bg-white/20 rounded"></div>
                </a>
                <a href="#" className="text-white/70 hover:text-white transition-colors">
                  <span className="sr-only">Facebook</span>
                  <div className="w-6 h-6 bg-white/20 rounded"></div>
                </a>
                <a href="#" className="text-white/70 hover:text-white transition-colors">
                  <span className="sr-only">LinkedIn</span>
                  <div className="w-6 h-6 bg-white/20 rounded"></div>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 mt-8 pt-8 text-center">
            <p className="text-white/60">&copy; 2024 StoreApp. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
