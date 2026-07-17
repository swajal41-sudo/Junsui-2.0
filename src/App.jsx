import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Setup from './pages/Setup';
import Call from './pages/Call';
import Report from './pages/Report';
import History from './pages/History';
import MonthlyTable from './pages/MonthlyTable';
import './styles/global.css';

// Protected Route Wrapper
function PrivateRoute({ children }) {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route 
            path="/" 
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } 
          />
          <Route path="/setup" element={<PrivateRoute><Setup /></PrivateRoute>} />
          <Route path="/call" element={<PrivateRoute><Call /></PrivateRoute>} />
          <Route path="/report" element={<PrivateRoute><Report /></PrivateRoute>} />
          <Route path="/history" element={<PrivateRoute><History /></PrivateRoute>} />
          <Route path="/monthly" element={<PrivateRoute><MonthlyTable /></PrivateRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
