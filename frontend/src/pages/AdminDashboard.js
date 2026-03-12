import React, { useState, useEffect } from 'react';
import api from '../api';
import { BarChart, DollarSign, Users, XCircle } from 'lucide-react';

export default function AdminDashboard() {
  const [reports, setReports] = useState([]);
  const [appointments, setAppointments] = useState([]); // Simplified: in a real app, pagination/filtering is needed
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // For demo purposes, we're fetching reports and appointments
      // We didn't build a separate GET /admin/appointments in the backend plan specifically, but we can reuse the doctor one
      // We'll focus on the reports API requested in the prompt
      const { data } = await api.get('/admin/reports/appointments-per-doctor');
      setReports(data);
    } catch (err) {
      setError('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex h-[80vh] items-center justify-center text-blue-500"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

  return (
    <div className="space-y-8 animate-fade-in pb-12 pt-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">System Administration</h1>
          <p className="text-gray-400 mt-1">Platform overview, revenue analytics, and performance reporting.</p>
        </div>
      </div>

      {error && (
        <div className="bg-rose-500/10 text-rose-400 p-4 rounded-xl border border-rose-500/20 flex items-center gap-3">
          <XCircle size={20} /> {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800/80 backdrop-blur-md p-6 rounded-2xl shadow-[0_4px_25px_rgba(0,0,0,0.3)] border border-gray-700/50 flex items-center gap-5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)] hover:border-blue-500/30 transition-all cursor-default">
          <div className="p-4 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-xl shadow-[0_0_15px_rgba(79,70,229,0.4)]"><Users size={28} /></div>
          <div>
            <p className="text-sm font-bold text-gray-400 tracking-wide uppercase">Active Doctors</p>
            <p className="text-3xl font-black text-white mt-1">{reports.length}</p>
          </div>
        </div>
        
        <div className="bg-gray-800/80 backdrop-blur-md p-6 rounded-2xl shadow-[0_4px_25px_rgba(0,0,0,0.3)] border border-gray-700/50 flex items-center gap-5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)] hover:border-emerald-500/30 transition-all cursor-default">
          <div className="p-4 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.4)]"><BarChart size={28} /></div>
          <div>
            <p className="text-sm font-bold text-gray-400 tracking-wide uppercase">Total Appointments</p>
            <p className="text-3xl font-black text-white mt-1">
              {reports.reduce((sum, r) => sum + parseInt(r.appointmentCount || 0), 0)}
            </p>
          </div>
        </div>

        <div className="bg-gray-800/80 backdrop-blur-md p-6 rounded-2xl shadow-[0_4px_25px_rgba(0,0,0,0.3)] border border-gray-700/50 flex items-center gap-5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)] hover:border-purple-500/30 transition-all cursor-default">
          <div className="p-4 bg-gradient-to-br from-purple-600 to-fuchsia-600 text-white rounded-xl shadow-[0_0_15px_rgba(168,85,247,0.4)]"><DollarSign size={28} /></div>
          <div>
            <p className="text-sm font-bold text-gray-400 tracking-wide uppercase">Estimated Revenue</p>
            <p className="text-3xl font-black text-white mt-1">
              ${reports.reduce((sum, r) => sum + parseInt(r.appointmentCount || 0), 0) * 150} {/* Dummy multiplier */}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-[0_4px_25px_rgba(0,0,0,0.3)] border border-gray-700/50 overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-700/50 bg-gray-900/50 flex justify-between items-center">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <BarChart size={22} className="text-blue-400" /> Appointments per Doctor Report
          </h3>
          <span className="text-sm font-medium text-blue-300 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20 shadow-sm">
            Last 30 Days
          </span>
        </div>
        <div className="p-0">
          {reports.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                <BarChart size={48} className="mb-4 opacity-20" />
                <p className="text-lg font-medium text-gray-400">No Data Available</p>
                <p className="text-sm mt-1 text-gray-500">Reports will generate once appointments are booked.</p>
            </div>
          ) : (
            <div className="flex flex-col">
              <div className="overflow-x-auto">
                <div className="align-middle inline-block min-w-full">
                  <div className="overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-700/50">
                      <thead className="bg-gray-900/40">
                        <tr>
                          <th scope="col" className="px-8 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                            Specialist Name
                          </th>
                          <th scope="col" className="px-8 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                            Total Volume
                          </th>
                          <th scope="col" className="px-8 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                            Revenue Contribution
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-700/30">
                        {reports.map((report, idx) => (
                          <tr key={idx} className="hover:bg-gray-700/20 transition-colors">
                            <td className="px-8 py-5 whitespace-nowrap text-sm font-bold text-gray-100 flex items-center gap-4">
                              <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold shadow-[0_0_10px_rgba(79,70,229,0.3)]">
                                {report.doctorName.charAt(0)}
                              </div>
                              Dr. {report.doctorName}
                            </td>
                            <td className="px-8 py-5 whitespace-nowrap text-sm text-blue-300 font-bold">
                              {report.appointmentCount} <span className="text-gray-500 font-medium text-xs ml-1">visits</span>
                            </td>
                            <td className="px-8 py-5 whitespace-nowrap text-sm text-gray-100 font-bold">
                              <span className="text-emerald-400 font-black tracking-wide">${parseInt(report.appointmentCount) * 150}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
