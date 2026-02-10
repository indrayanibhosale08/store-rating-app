import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import StoreDashboard from './pages/StoreDashboard';

const ProtectedRoute = ({ children, roleRequired }) => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (!token || (roleRequired && role !== roleRequired)) return <Navigate to="/login" />;
    return children;
};

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/admin" element={<ProtectedRoute roleRequired="Admin"><AdminDashboard /></ProtectedRoute>} />
                <Route path="/dashboard" element={<ProtectedRoute roleRequired="User"><UserDashboard /></ProtectedRoute>} />
                <Route path="/store" element={<ProtectedRoute roleRequired="StoreOwner"><StoreDashboard /></ProtectedRoute>} />
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </Router>
    );
}