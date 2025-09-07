export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gradient-to-r from-blue-50 to-white border-t-2 border-blue-100 mt-auto">
      <div className="container mx-auto px-6 py-8">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          
          {/* Logo & Description */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                IITG Voting
              </span>
            </div>
            <p className="text-sm text-gray-600 max-w-sm mx-auto md:mx-0">
              Empowering democratic participation in the IITG community through secure and transparent elections.
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-center">
            <h3 className="font-semibold text-gray-800 mb-3">Quick Links</h3>
            <div className="space-y-2">
              <a href="/dashboard" className="block text-sm text-gray-600 hover:text-blue-600 transition-colors">
                Dashboard
              </a>
              <a href="/request-poll" className="block text-sm text-gray-600 hover:text-blue-600 transition-colors">
                Request Poll
              </a>
              <a href="/profile" className="block text-sm text-gray-600 hover:text-blue-600 transition-colors">
                Profile
              </a>
            </div>
          </div>

          {/* Contact & Info */}
          <div className="text-center md:text-right">
            <h3 className="font-semibold text-gray-800 mb-3">Contact</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p className="flex items-center justify-center md:justify-end gap-2">
                <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                </svg>
                m.mansoori@iitg.ac.in
              </p>
              <p className="flex items-center justify-center md:justify-end gap-2">
                <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                </svg>
                IITG Campus, Guwahati
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-blue-100 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            
            {/* Copyright */}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              <span>&copy; {currentYear} IITG Voting System. All Rights Reserved.</span>
            </div>

            {/* Additional Links */}
            <div className="flex items-center gap-4 text-sm">
              <a href="/privacy" className="text-gray-600 hover:text-blue-600 transition-colors">
                Privacy Policy
              </a>
              <span className="text-gray-300">|</span>
              <a href="/terms" className="text-gray-600 hover:text-blue-600 transition-colors">
                Terms of Service
              </a>
              <span className="text-gray-300">|</span>
              <a href="/help" className="text-gray-600 hover:text-blue-600 transition-colors">
                Help & Support
              </a>
            </div>
          </div>

          {/* Tech Stack Badge */}
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500 flex items-center justify-center gap-2">
              <span>Built with</span>
              <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"/>
              </svg>
              <span>Next.js • Firebase • Tailwind CSS</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
