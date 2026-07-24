import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { LogOut, Home, Calendar, CreditCard, Settings } from 'lucide-react';

const StudentLayout = () => {
  const { logout, currentUser, students } = useAppContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const student = students.find(s => s.id === currentUser?.id);
  const firstName = student?.name 
    ? (student.name.includes(',') ? student.name.split(',')[1]?.trim() : student.name.split(' ')[0]) 
    : 'Student';

  return (
    <div className="app-container student-theme">
      <header className="student-topbar">
        <div className="student-topbar-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img src="/vscc_logo.png" alt="VSCC Logo" style={{ width: '24px', height: '24px', objectFit: 'contain' }} />
          <span>PIMES VSCC</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontWeight: '500', fontSize: '13px', color: 'var(--color-text-secondary)' }} className="mobile-student-name">
            {firstName}
          </span>
          <button className="btn btn-outline" onClick={handleLogout} style={{ padding: '6px 10px', fontSize: '12px' }}>
            <LogOut size={14} /> <span className="mobile-hide-text">Logout</span>
          </button>
        </div>
      </header>
      
      <main className="student-main">
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <Outlet />
        </div>
      </main>

      {/* Bottom Tab Bar — visible on mobile only via CSS */}
      <nav className="student-bottom-tabs" id="student-bottom-tabs">
        <button className="bottom-tab" data-tab="overview" onClick={() => window.dispatchEvent(new CustomEvent('student-tab-change', { detail: 'overview' }))}>
          <Home size={20} />
          <span>Overview</span>
        </button>
        <button className="bottom-tab" data-tab="attendance" onClick={() => window.dispatchEvent(new CustomEvent('student-tab-change', { detail: 'attendance' }))}>
          <Calendar size={20} />
          <span>Attendance</span>
        </button>
        <button className="bottom-tab" data-tab="payments" onClick={() => window.dispatchEvent(new CustomEvent('student-tab-change', { detail: 'payments' }))}>
          <CreditCard size={20} />
          <span>Payments</span>
        </button>
        <button className="bottom-tab" data-tab="settings" onClick={() => window.dispatchEvent(new CustomEvent('student-tab-change', { detail: 'settings' }))}>
          <Settings size={20} />
          <span>Settings</span>
        </button>
      </nav>
    </div>
  );
};

export default StudentLayout;
