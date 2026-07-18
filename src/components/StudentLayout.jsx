import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { LogOut } from 'lucide-react';

const StudentLayout = () => {
  const { logout, currentUser, students } = useAppContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const student = students.find(s => s.id === currentUser?.id);

  return (
    <div className="app-container" style={{ flexDirection: 'column' }}>
      <header className="topbar" style={{ justifyContent: 'space-between' }}>
        <div className="topbar-title">PIMES VSCC Portal</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontWeight: '500' }}>{student?.name}</span>
          <button className="btn btn-outline" onClick={handleLogout} style={{ padding: '6px 12px' }}>
            <LogOut size={14} /> Logout
          </button>
        </div>
      </header>
      <main className="page-container" style={{ flex: 1, backgroundColor: 'var(--color-bg-subtle)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default StudentLayout;
