import React, { useState, useEffect } from 'react';
import api from '../api';
import { Calendar, Clock, User, CheckCircle } from 'lucide-react';

export default function PatientDashboard() {
  const [doctors, setDoctors] = useState([]);
  const [myAppointments, setMyAppointments] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [doctorSlots, setDoctorSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // booking state
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [docsRes, apptsRes] = await Promise.all([
        api.get('/public/doctors'),
        api.get('/patient/appointments')
      ]);
      setDoctors(docsRes.data);
      setMyAppointments(apptsRes.data);
    } catch (err) {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectDoctor = async (doctorId) => {
    setSelectedDoctor(doctorId);
    setSelectedSlot(null);
    try {
      const { data } = await api.get(`/public/doctors/${doctorId}/slots?fromDate=${new Date().toISOString().split('T')[0]}`);
      setDoctorSlots(data);
    } catch (err) {
      alert("Failed to load doctor's slots");
    }
  };

  const handleBook = async () => {
    if (!selectedSlot) return;
    setBookingLoading(true);
    try {
      await api.post('/patient/appointments', {
        doctorId: selectedDoctor,
        date: selectedSlot.date,
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime
      });
      alert('Appointment booked successfully!');
      setSelectedSlot(null);
      setSelectedDoctor(null);
      fetchInitialData(); // Refresh appointments list
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to book appointment');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return <div className="flex h-[80vh] items-center justify-center text-blue-500"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Patient Portal</h1>
          <p className="text-gray-500 mt-1">Discover specialists, book appointments, and manage your health journey.</p>
        </div>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Book Appointment Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2 border-b pb-4">
            <Calendar size={22} className="text-blue-600" /> Book an Appointment
          </h2>
          
          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">1. Select a Specialist</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto custom-scrollbar p-1">
              {doctors.length === 0 ? <p className="text-gray-400 italic">No doctors available.</p> : doctors.map(doc => (
                <div 
                  key={doc.id}
                  onClick={() => handleSelectDoctor(doc.id)}
                  className={`relative p-4 rounded-xl cursor-pointer transition-all duration-200 border-2 ${selectedDoctor === doc.id ? 'border-blue-500 bg-blue-50 shadow-md transform -translate-y-1' : 'border-gray-100 bg-white hover:border-blue-200 hover:shadow-sm hover:-translate-y-0.5'}`}
                >
                  <div className="font-bold text-gray-900 flex justify-between items-start">
                    <span>Dr. {doc.name}</span>
                    {selectedDoctor === doc.id && <CheckCircle size={20} className="text-blue-600 absolute top-3 right-3 animate-pulse" />}
                  </div>
                  <div className="text-sm font-medium text-blue-600/80 mt-1 bg-white/50 inline-block px-2 py-0.5 rounded-full">{doc.specialization}</div>
                </div>
              ))}
            </div>
          </div>

          {selectedDoctor && (
            <div className="mt-8 pt-6 border-t border-gray-100 animate-slide-up">
              <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">2. Choose Available Time</label>
              {doctorSlots.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-xl border border-dashed border-gray-200 text-gray-500">
                    <Clock size={32} className="mb-2 opacity-30" />
                    <p>No open slots for this specialist.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-56 overflow-y-auto custom-scrollbar p-1">
                  {doctorSlots.map(slot => {
                    const isSelected = selectedSlot?.id === slot.id;
                    return (
                      <div 
                        key={slot.id}
                        onClick={() => setSelectedSlot(slot)}
                        className={`p-3 rounded-xl cursor-pointer text-center transition-all duration-200 border-2 ${isSelected ? 'border-blue-600 bg-blue-600 text-white shadow-lg transform scale-105' : 'border-gray-100 bg-white text-gray-700 hover:border-blue-300 hover:shadow-sm'}`}
                      >
                        <div className="text-xs font-bold uppercase tracking-wider mb-1 opacity-80">{slot.date}</div>
                        <div className="font-medium">{slot.startTime}</div>
                      </div>
                    );
                  })}
                </div>
              )}

              {selectedSlot && (
                <div className="mt-8 animate-fade-in">
                    <button
                    onClick={handleBook}
                    disabled={bookingLoading}
                    className="w-full relative overflow-hidden group flex justify-center items-center gap-2 py-4 px-4 rounded-xl shadow-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all font-bold text-lg disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                    {bookingLoading ? (
                        <div className="flex items-center gap-2"><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> Processing...</div>
                    ) : (
                        'Confirm Appointment'
                    )}
                    <div className="absolute inset-0 h-full w-full bg-white/20 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 ease-out"></div>
                    </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* My Appointments List */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2 border-b pb-4">
            <Clock size={22} className="text-blue-600" /> Appointment History
          </h2>
          
          <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2 custom-scrollbar">
            {myAppointments.length === 0 ? (
              <div className="text-center py-16 text-gray-500 bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-200">
                <Calendar size={48} className="mx-auto mb-4 opacity-20" />
                <p className="font-medium text-lg">Your itinerary is clear.</p>
                <p className="text-sm mt-1">Book an appointment on the left to get started.</p>
              </div>
            ) : (
              myAppointments.map(apt => (
                <div key={apt.id} className="relative group p-5 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all overflow-hidden space-y-3">
                  <div className={`absolute left-0 top-0 bottom-0 w-1.5 transition-colors ${
                      apt.status === 'CONFIRMED' ? 'bg-green-500' :
                      apt.status === 'COMPLETED' ? 'bg-blue-500' :
                      apt.status === 'CANCELLED' ? 'bg-red-500' :
                      'bg-yellow-400'
                    }`} />
                    
                  <div className="pl-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <div className="font-bold text-gray-900 text-lg flex items-center gap-2">
                        Dr. {apt.doctorName}
                      </div>
                      <div className="text-sm text-gray-600 mt-2 flex flex-wrap gap-4">
                        <div className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-md border border-gray-100"><Calendar size={14} className="text-blue-500" /> <span className="font-medium">{apt.date}</span></div>
                        <div className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-md border border-gray-100"><Clock size={14} className="text-blue-500" /> <span className="font-medium">{apt.startTime} - {apt.endTime}</span></div>
                      </div>
                    </div>
                    
                    <span className={`px-4 py-1.5 text-xs font-bold tracking-wider uppercase rounded-full shadow-sm ${
                      apt.status === 'CONFIRMED' ? 'bg-green-100 text-green-800 border border-green-200' :
                      apt.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                      apt.status === 'CANCELLED' ? 'bg-red-100 text-red-800 border border-red-200' :
                      'bg-yellow-100 text-yellow-800 border border-yellow-200'
                    }`}>
                      {apt.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
