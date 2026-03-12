import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { LogOut, User, Menu, X, Activity } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className={`fixed w-full z-50 top-0 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100 py-3' : 'bg-transparent py-4'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-12">
          
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-xl font-bold flex items-center gap-2 group">
              <div className="bg-blue-600 p-2 rounded-xl group-hover:bg-blue-700 transition-colors shadow-sm">
                <Activity size={24} className="text-white" />
              </div>
              <span className={`tracking-tight ${scrolled ? 'text-gray-900' : 'text-gray-900'} transition-colors`}>
                CareConnect
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <div className={`flex items-center gap-3 px-4 py-2 rounded-full ${scrolled ? 'bg-gray-100/80 text-gray-700' : 'bg-gray-100 text-gray-800'}`}>
              <User size={16} className="text-blue-600" />
              <div className="text-sm">
                <span className="font-semibold">{user?.name}</span>
                <span className="mx-2 opacity-40">|</span>
                <span className="text-xs font-medium uppercase tracking-wider">{user?.role}</span>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-rose-50 hover:bg-rose-100 text-rose-600 px-4 py-2 rounded-xl transition-all font-medium text-sm shadow-sm"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-600 hover:text-gray-900 focus:outline-none p-2"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute w-full bg-white shadow-xl border-b border-gray-100 animate-slide-up">
          <div className="px-4 pt-2 pb-6 space-y-4">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl mb-4">
              <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                <User size={20} />
              </div>
              <div>
                <p className="font-semibold text-gray-900">{user?.name}</p>
                <p className="text-sm text-gray-500 uppercase">{user?.role}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 bg-rose-50 text-rose-600 px-4 py-3 rounded-xl font-medium"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
