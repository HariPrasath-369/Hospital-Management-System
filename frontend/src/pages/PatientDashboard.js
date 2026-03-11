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

  if (loading) return <div className="p-8 text-center text-gray-500">Loading your profile...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Patient Dashboard</h1>
        <p className="text-gray-500">Book new appointments and manage existing ones.</p>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-4 rounded-md">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Book Appointment Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar size={20} className="text-blue-500" /> Book an Appointment
          </h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select a Doctor</label>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {doctors.map(doc => (
                <div 
                  key={doc.id}
                  onClick={() => handleSelectDoctor(doc.id)}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${selectedDoctor === doc.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}
                >
                  <div className="font-medium text-gray-900 flex justify-between">
                    Dr. {doc.name} 
                    {selectedDoctor === doc.id && <CheckCircle size={18} className="text-blue-500" />}
                  </div>
                  <div className="text-sm text-gray-500">{doc.specialization}</div>
                </div>
              ))}
            </div>
          </div>

          {selectedDoctor && (
            <div className="mt-6 border-t pt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Available Slots</label>
              {doctorSlots.length === 0 ? (
                <p className="text-sm text-gray-500 italic bg-gray-50 p-3 rounded-md">No slots available for this doctor.</p>
              ) : (
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                  {doctorSlots.map(slot => {
                    const isSelected = selectedSlot?.id === slot.id;
                    return (
                      <div 
                        key={slot.id}
                        onClick={() => setSelectedSlot(slot)}
                        className={`p-2 border rounded-md cursor-pointer text-center text-sm transition-all ${isSelected ? 'border-blue-600 bg-blue-600 text-white shadow-md' : 'border-gray-200 hover:border-blue-400 bg-white'}`}
                      >
                        <div className="font-semibold">{slot.date}</div>
                        <div>{slot.startTime} - {slot.endTime}</div>
                      </div>
                    );
                  })}
                </div>
              )}

              {selectedSlot && (
                <button
                  onClick={handleBook}
                  disabled={bookingLoading}
                  className="mt-6 w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-300"
                >
                  {bookingLoading ? 'Booking...' : 'Confirm Appointment'}
                </button>
              )}
            </div>
          )}
        </div>

        {/* My Appointments List */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <Clock size={20} className="text-blue-500" /> My Appointments
          </h2>
          
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
            {myAppointments.length === 0 ? (
              <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                You have no appointments yet.
              </div>
            ) : (
              myAppointments.map(apt => (
                <div key={apt.id} className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm relative overflow-hidden">
                  {/* Color stripe for status indication */}
                  <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                      apt.status === 'CONFIRMED' ? 'bg-green-500' :
                      apt.status === 'COMPLETED' ? 'bg-blue-500' :
                      apt.status === 'CANCELLED' ? 'bg-red-500' :
                      'bg-yellow-500'
                    }`} />
                    
                  <div className="pl-3 flex justify-between items-start">
                    <div>
                      <div className="font-semibold text-gray-900 text-lg flex items-center gap-2">
                        <User size={16} className="text-gray-400"/> Dr. {apt.doctorName}
                      </div>
                      <div className="text-sm text-gray-600 mt-2 grid grid-cols-2 gap-x-4 gap-y-1">
                        <div className="flex items-center gap-1.5"><Calendar size={14}/> {apt.date}</div>
                        <div className="flex items-center gap-1.5"><Clock size={14}/> {apt.startTime} - {apt.endTime}</div>
                      </div>
                    </div>
                    
                    <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                      apt.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                      apt.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' :
                      apt.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
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
