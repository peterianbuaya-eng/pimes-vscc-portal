import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useAppContext } from './context/AppContext';

import Layout from './components/Layout';
import StudentLayout from './components/StudentLayout';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import StudentsList from './pages/StudentsList';
import StudentProfile from './pages/StudentProfile';
import { CalendarView } from './pages/CalendarView';
import { ReportsView } from './pages/PlaceholderViews';
import StudentPortal from './pages/StudentPortal';

const ProtectedRoute = ({ children, allowedRole }) => {
  const { currentUser } = useAppContext();
  
  if (!currentUser) return <Navigate to="/login" replace />;
  if (currentUser.role !== allowedRole) {
    return <Navigate to={currentUser.role === 'admin' ? '/' : '/portal'} replace />;
  }
  
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      {/* Admin Routes */}
      <Route path="/" element={<ProtectedRoute allowedRole="admin"><Layout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="students" element={<StudentsList />} />
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
