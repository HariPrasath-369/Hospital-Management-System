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
    <nav className={`fixed w-full z-50 top-0 transition-all duration-300 ${scrolled ? 'bg-gray-900/80 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.1)] border-b border-gray-800 py-3' : 'bg-transparent py-4'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-12">
          
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-xl font-bold flex items-center gap-2 group">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-xl group-hover:from-blue-500 group-hover:to-indigo-500 transition-all shadow-[0_0_15px_rgba(79,70,229,0.5)]">
                <Activity size={24} className="text-white" />
              </div>
              <span className={`tracking-tight text-white transition-colors`}>
                CareConnect
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <div className={`flex items-center gap-3 px-4 py-2 rounded-full ${scrolled ? 'bg-gray-800/80 text-gray-300 border border-gray-700' : 'bg-gray-800/50 text-gray-200 border border-gray-700/50'}`}>
              <User size={16} className="text-emerald-400" />
              <div className="text-sm">
                <span className="font-semibold text-white">{user?.name}</span>
                <span className="mx-2 opacity-40">|</span>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">{user?.role}</span>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="group flex items-center gap-2 bg-gray-800 hover:bg-rose-500/10 text-rose-400 border border-gray-700 hover:border-rose-500/50 px-4 py-2 rounded-xl transition-all font-medium text-sm shadow-sm"
            >
              <LogOut size={16} className="group-hover:text-rose-500 transition-colors" />
              <span>Logout</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-300 hover:text-white focus:outline-none p-2"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute w-full bg-gray-900 border-b border-gray-800 shadow-2xl animate-slide-up">
          <div className="px-4 pt-2 pb-6 space-y-4">
            <div className="flex items-center gap-3 p-4 bg-gray-800/50 border border-gray-700/50 rounded-xl mb-4">
              <div className="bg-emerald-500/20 p-2 rounded-full text-emerald-400">
                <User size={20} />
              </div>
              <div>
                <p className="font-semibold text-white">{user?.name}</p>
                <p className="text-sm text-emerald-400 font-bold uppercase tracking-wider">{user?.role}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 bg-gray-800 hover:bg-rose-500/10 text-rose-400 border border-gray-700 hover:border-rose-500/50 px-4 py-3 rounded-xl font-medium transition-all"
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
