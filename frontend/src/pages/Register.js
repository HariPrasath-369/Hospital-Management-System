import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { Activity } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'PATIENT',
    specialization: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    
    try {
      await api.post('/auth/register', formData);
      setSuccess('Registration successful! Redirecting...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex bg-gray-900 flex-col justify-center items-center min-h-screen px-6 py-12 lg:px-8 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 -translate-x-1/4" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none translate-y-1/2 translate-x-1/4" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center mb-6">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-2xl shadow-[0_0_25px_rgba(79,70,229,0.5)]">
            <Activity size={48} className="text-white" />
          </div>
        </div>
        <h2 className="text-center text-3xl font-bold leading-9 tracking-tight text-white">
          Create a new account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-400">
          Join CareConnect today
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md relative z-10 bg-gray-800/80 backdrop-blur-xl p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.5)] border border-gray-700/50">
        <form className="space-y-5" onSubmit={handleRegister}>
          {error && <div className="text-rose-400 text-sm p-4 bg-rose-500/10 rounded-xl border border-rose-500/20">{error}</div>}
          {success && <div className="text-emerald-400 text-sm p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20">{success}</div>}
          
          <div>
            <label className="block text-sm font-medium leading-6 text-gray-300">Full Name</label>
            <div className="mt-1.5">
              <input type="text" name="name" required className="block w-full rounded-xl border-0 py-2.5 px-4 bg-gray-900/50 text-white shadow-sm ring-1 ring-inset ring-gray-700 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm transition-all" value={formData.name} onChange={handleChange} placeholder="John Doe" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium leading-6 text-gray-300">Email address</label>
            <div className="mt-1.5">
              <input type="email" name="email" required className="block w-full rounded-xl border-0 py-2.5 px-4 bg-gray-900/50 text-white shadow-sm ring-1 ring-inset ring-gray-700 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm transition-all" value={formData.email} onChange={handleChange} placeholder="john@example.com" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium leading-6 text-gray-300">Password</label>
            <div className="mt-1.5">
              <input type="password" name="password" required className="block w-full rounded-xl border-0 py-2.5 px-4 bg-gray-900/50 text-white shadow-sm ring-1 ring-inset ring-gray-700 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm transition-all" value={formData.password} onChange={handleChange} placeholder="••••••••" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium leading-6 text-gray-300">Role</label>
            <div className="mt-1.5 relative group">
              <select name="role" className="block w-full rounded-xl border-0 py-2.5 px-4 bg-gray-900 text-white shadow-sm ring-1 ring-inset ring-gray-700 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm transition-all appearance-none cursor-pointer" value={formData.role} onChange={handleChange}>
                <option value="PATIENT">Patient</option>
                <option value="DOCTOR">Doctor</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
          </div>

          {formData.role === 'DOCTOR' && (
            <div className="animate-fade-in">
              <label className="block text-sm font-medium leading-6 text-gray-300">Specialization</label>
              <div className="mt-1.5">
                <input type="text" name="specialization" required className="block w-full rounded-xl border-0 py-2.5 px-4 bg-gray-900/50 text-white shadow-sm ring-1 ring-inset ring-gray-700 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm transition-all" value={formData.specialization} onChange={handleChange} placeholder="Cardiology" />
              </div>
            </div>
          )}

          <div className="pt-2">
            <button type="submit" disabled={loading} className="mt-4 flex w-full justify-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)] hover:from-blue-500 hover:to-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50 disabled:shadow-none transition-all duration-300">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </div>
        </form>

        <p className="mt-8 text-center text-sm text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-blue-400 hover:text-blue-300 hover:underline transition-all">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
