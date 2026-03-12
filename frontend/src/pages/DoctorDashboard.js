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
    <div className="space-y-8 animate-fade-in pb-12 pt-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Doctor Workspace</h1>
          <p className="text-gray-400 mt-1">Manage your schedule, availability, and upcoming patient visits.</p>
        </div>
        <div className="flex items-center gap-2 bg-blue-500/10 text-blue-400 px-4 py-2 rounded-full font-medium text-sm border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
          <Calendar size={16} /> 
          {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
        </div>
      </div>

      {error && (
        <div className="bg-rose-500/10 text-rose-400 p-4 rounded-xl border border-rose-500/20 flex items-center gap-3">
          <X size={20} /> {error}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Availability Management */}
        <div className="xl:col-span-1 space-y-6">
          <div className="bg-gray-800/80 backdrop-blur-md p-6 rounded-2xl shadow-[0_4px_25px_rgba(0,0,0,0.3)] border border-gray-700/50 hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)] transition-all">
            <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2 border-b border-gray-700/50 pb-4">
              <Calendar size={20} className="text-blue-400" /> Allocate Time Slots
            </h2>
            <form onSubmit={handleAddSlot} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Date</label>
                <input 
                  type="date" 
                  required 
                  min={today} 
                  className="block w-full rounded-xl border-0 bg-gray-900/50 px-4 py-3 text-white shadow-sm ring-1 ring-inset ring-gray-700 focus:ring-2 focus:ring-blue-500 transition-all outline-none" 
                  value={date} 
                  onChange={e => setDate(e.target.value)} 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Start Time</label>
                  <input 
                    type="time" 
                    required 
                    className="block w-full rounded-xl border-0 bg-gray-900/50 px-4 py-3 text-white shadow-sm ring-1 ring-inset ring-gray-700 focus:ring-2 focus:ring-blue-500 transition-all outline-none" 
                    value={startTime} 
                    onChange={e => setStartTime(e.target.value)} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">End Time</label>
                  <input 
                    type="time" 
                    required 
                    className="block w-full rounded-xl border-0 bg-gray-900/50 px-4 py-3 text-white shadow-sm ring-1 ring-inset ring-gray-700 focus:ring-2 focus:ring-blue-500 transition-all outline-none" 
                    value={endTime} 
                    onChange={e => setEndTime(e.target.value)} 
                  />
                </div>
              </div>
              <button 
                type="submit" 
                className="w-full relative overflow-hidden group flex justify-center items-center gap-2 py-3 px-4 rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.3)] text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] focus:outline-none focus:ring-4 focus:ring-emerald-500/50 transition-all duration-300 font-medium active:scale-[0.98]"
              >
                <Plus size={18} /> Publish Slot
              </button>
            </form>
          </div>

          <div className="bg-gray-800/80 backdrop-blur-md p-6 rounded-2xl shadow-[0_4px_25px_rgba(0,0,0,0.3)] border border-gray-700/50">
            <h2 className="text-lg font-semibold text-white mb-4 pb-4 border-b border-gray-700/50">Upcoming Provided Slots</h2>
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {slots.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-gray-500">
                  <Calendar size={40} className="mb-3 opacity-20" />
                  <p className="text-sm">No unbooked slots.</p>
                </div>
              ) : (
                slots.map(slot => (
                  <div key={slot.id} className="group relative flex justify-between items-center p-4 bg-gray-900/50 hover:bg-gray-900 rounded-xl border border-gray-700/50 hover:border-blue-500/30 hover:shadow-[0_0_15px_rgba(59,130,246,0.1)] transition-all">
                    <div className="text-sm">
                      <div className="font-semibold text-gray-200 flex items-center gap-2">
                        {slot.date}
                      </div>
                      <div className="text-blue-400 mt-1 flex items-center gap-1.5 font-medium">
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
          <div className="bg-gray-800/80 backdrop-blur-md p-6 rounded-2xl shadow-[0_4px_25px_rgba(0,0,0,0.3)] border border-gray-700/50 min-h-full hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)] transition-all">
            <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2 pb-4 border-b border-gray-700/50">
              <Clock size={20} className="text-blue-400" /> Patient Appointments
            </h2>
            
            <div className="space-y-4 max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">
              {appointments.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-gray-500 border-2 border-dashed border-gray-700 rounded-2xl">
                  <Clock size={48} className="mb-4 opacity-20" />
                  <p className="text-lg font-medium text-gray-400">Clear Schedule</p>
                  <p className="text-sm mt-1">You have no booked appointments right now.</p>
                </div>
              ) : (
                appointments.map(apt => (
                  <div key={apt.id} className="relative overflow-hidden group flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 bg-gray-900/60 rounded-xl border border-gray-700/50 hover:border-blue-500/30 hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] transition-all gap-4 duration-300">
                    {/* Status accent border */}
                    <div className={`absolute left-0 top-0 bottom-0 w-1.5 transition-colors ${
                      apt.status === 'CONFIRMED' ? 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]' :
                      apt.status === 'COMPLETED' ? 'bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.5)]' :
                      apt.status === 'CANCELLED' ? 'bg-rose-400 shadow-[0_0_10px_rgba(251,113,133,0.5)]' :
                      'bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.5)]'
                    }`} />
                    
                    <div className="pl-2">
                      <div className="font-bold text-gray-100 text-lg">{apt.patientName}</div>
                      <div className="text-sm mt-2 flex items-center gap-4">
                        <span className="flex items-center gap-1.5 bg-gray-800 px-2.5 py-1 rounded-md border border-gray-700/50 text-gray-300"><Calendar size={14} className="text-blue-400" /> {apt.date}</span>
                        <span className="flex items-center gap-1.5 bg-gray-800 px-2.5 py-1 rounded-md border border-gray-700/50 text-gray-300"><Clock size={14} className="text-blue-400" /> {apt.startTime} - {apt.endTime}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto mt-2 sm:mt-0">
                      <span className={`px-4 py-1.5 text-xs font-bold tracking-wider uppercase rounded-full shadow-sm ${
                        apt.status === 'CONFIRMED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        apt.status === 'COMPLETED' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                        apt.status === 'CANCELLED' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                        'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        {apt.status}
                      </span>
                      
                      {apt.status === 'BOOKED' && (
                        <button onClick={() => handleUpdateStatus(apt.id, 'CONFIRMED')} className="text-sm flex items-center gap-1.5 text-white font-medium bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 px-4 py-2 rounded-lg shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] transition-all active:scale-95">
                          <Check size={16} /> Confirm
                        </button>
                      )}
                      
                      {apt.status === 'CONFIRMED' && (
                        <button onClick={() => handleUpdateStatus(apt.id, 'COMPLETED')} className="text-sm flex items-center gap-1.5 text-white font-medium bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 px-4 py-2 rounded-lg shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:shadow-[0_0_20px_rgba(79,70,229,0.5)] transition-all active:scale-95">
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
