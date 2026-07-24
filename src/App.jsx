import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useAppContext } from './context/AppContext';

import Layout from './components/Layout';
import StudentLayout from './components/StudentLayout';

import Login from './pages/Login';
import AdminLogin from './pages/AdminLogin';
import Dashboard from './pages/Dashboard';
import StudentsList from './pages/StudentsList';
import StudentProfile from './pages/StudentProfile';
import AddStudent from './pages/AddStudent';
import { CalendarView } from './pages/CalendarView';
import { ReportsView } from './pages/PlaceholderViews';
import StudentPortal from './pages/StudentPortal';

const ProtectedRoute = ({ children, allowedRole }) => {
  const { currentUser, loading } = useAppContext();
  if (loading) return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100dvh',
      background: 'var(--color-bg-main)',
      color: 'var(--color-text-secondary)',
      fontWeight: 500
    }}>
      Loading portal…
    </div>
  );
  
  if (!currentUser) {
    return <Navigate to={allowedRole === 'admin' ? '/admin/login' : '/login'} replace />;
  }
  if (currentUser.role !== allowedRole) {
    return <Navigate to={currentUser.role === 'admin' ? '/' : '/portal'} replace />;
  }
  
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Separate Login Pages */}
      <Route path="/login" element={<Login />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      
      {/* Admin Routes */}
      <Route path="/" element={<ProtectedRoute allowedRole="admin"><Layout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="students" element={<StudentsList />} />
        <Route path="students/new" element={<AddStudent />} />
        <Route path="students/:id" element={<StudentProfile />} />
        <Route path="calendar" element={<CalendarView />} />
        <Route path="reports" element={<ReportsView />} />
      </Route>

      {/* Student Routes */}
      <Route path="/portal" element={<ProtectedRoute allowedRole="student"><StudentLayout /></ProtectedRoute>}>
        <Route index element={<StudentPortal />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

const App = () => {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  );
};

export default App;
