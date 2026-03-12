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
    <div className="space-y-8 animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">System Administration</h1>
          <p className="text-gray-500 mt-1">Platform overview, revenue analytics, and performance reporting.</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 flex items-center gap-3">
          <XCircle size={20} /> {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-md hover:border-blue-100 transition-all cursor-default">
          <div className="p-4 bg-gradient-to-br from-blue-100 to-blue-200 text-blue-700 rounded-xl shadow-inner"><Users size={28} /></div>
          <div>
            <p className="text-sm font-bold text-gray-500 tracking-wide uppercase">Active Doctors</p>
            <p className="text-3xl font-black text-gray-900 mt-1">{reports.length}</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-md hover:green-100 transition-all cursor-default">
          <div className="p-4 bg-gradient-to-br from-green-100 to-emerald-200 text-emerald-700 rounded-xl shadow-inner"><BarChart size={28} /></div>
          <div>
            <p className="text-sm font-bold text-gray-500 tracking-wide uppercase">Total Appointments</p>
            <p className="text-3xl font-black text-gray-900 mt-1">
              {reports.reduce((sum, r) => sum + parseInt(r.appointmentCount || 0), 0)}
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-md hover:border-purple-100 transition-all cursor-default">
          <div className="p-4 bg-gradient-to-br from-purple-100 to-fuchsia-200 text-fuchsia-700 rounded-xl shadow-inner"><DollarSign size={28} /></div>
          <div>
            <p className="text-sm font-bold text-gray-500 tracking-wide uppercase">Estimated Revenue</p>
            <p className="text-3xl font-black text-gray-900 mt-1">
              ${reports.reduce((sum, r) => sum + parseInt(r.appointmentCount || 0), 0) * 150} {/* Dummy multiplier */}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <BarChart size={22} className="text-blue-600" /> Appointments per Doctor Report
          </h3>
          <span className="text-sm font-medium text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200 shadow-sm">
            Last 30 Days
          </span>
        </div>
        <div className="p-0">
          {reports.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <BarChart size={48} className="mb-4 opacity-20" />
                <p className="text-lg font-medium text-gray-600">No Data Available</p>
                <p className="text-sm">Reports will generate once appointments are booked.</p>
            </div>
          ) : (
            <div className="flex flex-col">
              <div className="overflow-x-auto">
                <div className="align-middle inline-block min-w-full">
                  <div className="overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-8 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                            Specialist Name
                          </th>
                          <th scope="col" className="px-8 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                            Total Volume
                          </th>
                          <th scope="col" className="px-8 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                            Revenue Contribution
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-100">
                        {reports.map((report, idx) => (
                          <tr key={idx} className="hover:bg-blue-50/30 transition-colors">
                            <td className="px-8 py-5 whitespace-nowrap text-sm font-bold text-gray-900 flex items-center gap-3">
                              <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 text-white flex items-center justify-center font-bold shadow-sm">
                                {report.doctorName.charAt(0)}
                              </div>
                              Dr. {report.doctorName}
                            </td>
                            <td className="px-8 py-5 whitespace-nowrap text-sm text-gray-600 font-medium">
                              {report.appointmentCount} <span className="text-gray-400 font-normal text-xs ml-1">visits</span>
                            </td>
                            <td className="px-8 py-5 whitespace-nowrap text-sm text-gray-900 font-bold">
                              <span className="text-emerald-600">${parseInt(report.appointmentCount) * 150}</span>
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
