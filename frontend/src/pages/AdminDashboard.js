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

  if (loading) return <div className="p-8 text-center text-gray-500">Loading admin dashboard...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-500">System overview and reporting.</p>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-4 rounded-md">{error}</div>}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg"><Users size={24} /></div>
          <div>
            <p className="text-sm font-medium text-gray-500">Active Doctors</p>
            <p className="text-2xl font-bold text-gray-900">{reports.length}</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-green-100 text-green-600 rounded-lg"><BarChart size={24} /></div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Appointments</p>
            <p className="text-2xl font-bold text-gray-900">
              {reports.reduce((sum, r) => sum + parseInt(r.appointmentCount || 0), 0)}
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-purple-100 text-purple-600 rounded-lg"><DollarSign size={24} /></div>
          <div>
            <p className="text-sm font-medium text-gray-500">Estimated Revenue</p>
            <p className="text-2xl font-bold text-gray-900">
              ${reports.reduce((sum, r) => sum + parseInt(r.appointmentCount || 0), 0) * 150} {/* Dummy multiplier */}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50">
          <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center gap-2">
            <BarChart size={20} className="text-blue-500" /> Appointments per Doctor Report
          </h3>
        </div>
        <div className="p-6">
          {reports.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No report data available.</p>
          ) : (
            <div className="flex flex-col">
              <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                  <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Doctor Name
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Total Appointments
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Revenue Contribution (Est.)
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {reports.map((report, idx) => (
                          <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              Dr. {report.doctorName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {report.appointmentCount}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              ${parseInt(report.appointmentCount) * 150}
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
