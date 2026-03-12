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

  if (loading) return <div className="flex h-[80vh] items-center justify-center text-blue-500"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Doctor Workspace</h1>
          <p className="text-gray-500 mt-1">Manage your schedule, availability, and upcoming patient visits.</p>
        </div>
        <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full font-medium text-sm">
          <Calendar size={16} /> 
          {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 flex items-center gap-3">
          <X size={20} /> {error}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Availability Management */}
        <div className="xl:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2 border-b pb-4">
              <Calendar size={20} className="text-blue-500" /> Allocate Time Slots
            </h2>
            <form onSubmit={handleAddSlot} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input 
                  type="date" 
                  required 
                  min={today} 
                  className="block w-full rounded-lg border-gray-200 bg-gray-50 px-4 py-2.5 text-gray-900 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none" 
                  value={date} 
                  onChange={e => setDate(e.target.value)} 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                  <input 
                    type="time" 
                    required 
                    className="block w-full rounded-lg border-gray-200 bg-gray-50 px-4 py-2.5 text-gray-900 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none" 
                    value={startTime} 
                    onChange={e => setStartTime(e.target.value)} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                  <input 
                    type="time" 
                    required 
                    className="block w-full rounded-lg border-gray-200 bg-gray-50 px-4 py-2.5 text-gray-900 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none" 
                    value={endTime} 
                    onChange={e => setEndTime(e.target.value)} 
                  />
                </div>
              </div>
              <button 
                type="submit" 
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all active:scale-[0.98]"
              >
                <Plus size={18} /> Publish Slot
              </button>
            </form>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-4 border-b">Upcoming Provided Slots</h2>
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {slots.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                  <Calendar size={40} className="mb-3 opacity-20" />
                  <p className="text-sm">No unbooked slots.</p>
                </div>
              ) : (
                slots.map(slot => (
                  <div key={slot.id} className="group relative flex justify-between items-center p-4 bg-gray-50/50 hover:bg-blue-50/50 rounded-xl border border-gray-100 hover:border-blue-100 transition-all">
                    <div className="text-sm">
                      <div className="font-semibold text-gray-900 flex items-center gap-2">
                        {slot.date}
                      </div>
                      <div className="text-gray-500 mt-1 flex items-center gap-1.5">
                         <Clock size={14}/> {slot.startTime} - {slot.endTime}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Appointments List */}
        <div className="xl:col-span-2">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 min-h-full">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2 pb-4 border-b">
              <Clock size={20} className="text-blue-500" /> Patient Appointments
            </h2>
            
            <div className="space-y-4 max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">
              {appointments.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-gray-400 border-2 border-dashed border-gray-100 rounded-2xl">
                  <Clock size={48} className="mb-4 opacity-20" />
                  <p className="text-lg font-medium text-gray-600">Clear Schedule</p>
                  <p className="text-sm">You have no booked appointments right now.</p>
                </div>
              ) : (
                appointments.map(apt => (
                  <div key={apt.id} className="relative overflow-hidden group flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all gap-4">
                    {/* Status accent border */}
                    <div className={`absolute left-0 top-0 bottom-0 w-1.5 transition-colors ${
                      apt.status === 'CONFIRMED' ? 'bg-green-500' :
                      apt.status === 'COMPLETED' ? 'bg-blue-500' :
                      apt.status === 'CANCELLED' ? 'bg-red-500' :
                      'bg-yellow-400'
                    }`} />
                    
                    <div className="pl-2">
                      <div className="font-bold text-gray-900 text-lg">{apt.patientName}</div>
                      <div className="text-sm text-gray-500 mt-1 flex items-center gap-4">
                        <span className="flex items-center gap-1.5"><Calendar size={14} className="text-blue-500" /> {apt.date}</span>
                        <span className="flex items-center gap-1.5"><Clock size={14} className="text-blue-500" /> {apt.startTime} - {apt.endTime}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto mt-2 sm:mt-0">
                      <span className={`px-3 py-1 text-xs font-bold tracking-wide uppercase rounded-full ${
                        apt.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                        apt.status === 'COMPLETED' ? 'bg-blue-100 text-blue-700' :
                        apt.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {apt.status}
                      </span>
                      
                      {apt.status === 'BOOKED' && (
                        <button onClick={() => handleUpdateStatus(apt.id, 'CONFIRMED')} className="text-sm flex items-center gap-1.5 text-white font-medium bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg shadow-sm hover:shadow transition-all active:scale-95">
                          <Check size={16} /> Confirm
                        </button>
                      )}
                      
                      {apt.status === 'CONFIRMED' && (
                        <button onClick={() => handleUpdateStatus(apt.id, 'COMPLETED')} className="text-sm flex items-center gap-1.5 text-white font-medium bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg shadow-sm hover:shadow transition-all active:scale-95">
                          <Check size={16} /> Complete
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
