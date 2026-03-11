import React, { useState, useEffect } from 'react';
import api from '../api';
import { Calendar, Clock, Plus, Trash2, Check, X } from 'lucide-react';

export default function DoctorDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // slot form
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [apptsRes, slotsRes] = await Promise.all([
        api.get('/doctor/appointments'),
        // In a real app we'd fetch the logged-in doctor's slots specifically, 
        // assuming standard REST the doctor's self slots API would be here:
        api.get(`/public/doctors/${JSON.parse(localStorage.getItem('user')).id}/slots?fromDate=${today}`)
      ]);
      setAppointments(apptsRes.data);
      setSlots(slotsRes.data);
    } catch (err) {
      setError('Failed to load doctor data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSlot = async (e) => {
    e.preventDefault();
    try {
      if(startTime >= endTime) {
         alert("End time must be after start time");
         return;
      }
      await api.post('/doctor/slots', { date, startTime, endTime });
      setDate(''); setStartTime(''); setEndTime('');
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to add slot');
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.patch(`/doctor/appointments/${id}/status?status=${status}`);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update status');
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading your schedule...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Doctor Dashboard</h1>
        <p className="text-gray-500">Manage your availability and appointments.</p>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-4 rounded-md">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Availability Management */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar size={20} className="text-blue-500" /> Add Available Slot
            </h2>
            <form onSubmit={handleAddSlot} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <input type="date" required min={today} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" value={date} onChange={e => setDate(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Start Time</label>
                  <input type="time" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" value={startTime} onChange={e => setStartTime(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">End Time</label>
                  <input type="time" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" value={endTime} onChange={e => setEndTime(e.target.value)} />
                </div>
              </div>
              <button type="submit" className="w-full flex justify-center items-center gap-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <Plus size={16} /> Add Slot
              </button>
            </form>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Slots</h2>
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
              {slots.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">No upcoming slots found.</p>
              ) : (
                slots.map(slot => (
                  <div key={slot.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="text-sm">
                      <div className="font-medium text-gray-900">{slot.date}</div>
                      <div className="text-gray-500">{slot.startTime} - {slot.endTime}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Appointments List */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 min-h-full">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Clock size={20} className="text-blue-500" /> Your Appointments
            </h2>
            
            <div className="space-y-4">
              {appointments.length === 0 ? (
                <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                  No appointments scheduled.
                </div>
              ) : (
                appointments.map(apt => (
                  <div key={apt.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:border-blue-200 transition-colors gap-4">
                    <div>
                      <div className="font-semibold text-gray-900">{apt.patientName}</div>
                      <div className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                        <Calendar size={14} /> {apt.date} 
                        <Clock size={14} className="ml-2" /> {apt.startTime} - {apt.endTime}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                      <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                        apt.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                        apt.status === 'COMPLETED' ? 'bg-gray-100 text-gray-800' :
                        apt.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {apt.status}
                      </span>
                      
                      {apt.status === 'BOOKED' && (
                        <button onClick={() => handleUpdateStatus(apt.id, 'CONFIRMED')} className="text-sm flex items-center gap-1 text-green-600 hover:text-green-800 bg-green-50 px-3 py-1.5 rounded border border-green-200">
                          <Check size={14} /> Confirm
                        </button>
                      )}
                      
                      {apt.status === 'CONFIRMED' && (
                        <button onClick={() => handleUpdateStatus(apt.id, 'COMPLETED')} className="text-sm flex items-center gap-1 text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded border border-blue-200">
                          <Check size={14} /> Mark Complete
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
