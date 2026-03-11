import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Navbar from './components/Navbar';

const PrivateRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  // hello
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to respective dashboard if unauthorized for this route
    if (user.role === 'ADMIN') return <Navigate to="/admin" />;
    if (user.role === 'DOCTOR') return <Navigate to="/doctor" />;
    return <Navigate to="/patient" />;
  }
  
  return children;
};

function AppRoutes() {
  const { user } = useAuth();

  return (
    <>
      {user && <Navbar />}
      <div className="container mx-auto p-4 max-w-7xl">
        <Routes>
          <Route path="/" element={<Navigate to={user ? `/${user.role.toLowerCase()}` : "/login"} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/patient/*" element={
            <PrivateRoute allowedRoles={['PATIENT']}>
              <PatientDashboard />
            </PrivateRoute>
          } />
          
          <Route path="/doctor/*" element={
            <PrivateRoute allowedRoles={['DOCTOR']}>
              <DoctorDashboard />
            </PrivateRoute>
          } />
          
          <Route path="/admin/*" element={
            <PrivateRoute allowedRoles={['ADMIN']}>
              <AdminDashboard />
            </PrivateRoute>
          } />
        </Routes>
      </div>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
