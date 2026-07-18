import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, CalendarDays, FileBarChart, LogOut, Settings } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, adminCreds, updateAdminCredentials } = useAppContext();
  
  const [showSettings, setShowSettings] = useState(false);
  const [newUsername, setNewUsername] = useState(adminCreds.username);
  const [newPassword, setNewPassword] = useState(adminCreds.password);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    updateAdminCredentials(newUsername, newPassword);
    alert('Admin credentials updated successfully!');
    setShowSettings(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-title">PIMES VSCC Portal</div>
        </div>
        <nav style={{ flex: 1 }}>
          <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} end>
            <LayoutDashboard size={18} />
            Dashboard
          </NavLink>
          <NavLink to="/students" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Users size={18} />
            Students
          </NavLink>
          <NavLink to="/calendar" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <CalendarDays size={18} />
            Calendar
          </NavLink>
          <NavLink to="/reports" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <FileBarChart size={18} />
            Reports
          </NavLink>
        </nav>
        <div style={{ padding: '20px' }}>
          <button className="btn btn-outline" style={{ width: '100%' }} onClick={handleLogout}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>
      
      <main className="main-content">
        <header className="topbar">
          <div className="topbar-title" style={{ textTransform: 'capitalize' }}>
            {location.pathname === '/' ? 'Dashboard' : location.pathname.substring(1)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button className="btn btn-outline" style={{ padding: '6px' }} onClick={() => setShowSettings(true)}>
              <Settings size={18} />
            </button>
            <div className="avatar" style={{ backgroundColor: 'var(--color-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>A</div>
          </div>
        </header>
        <div className="page-container">
          <Outlet />
        </div>
      </main>

      {showSettings && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="card" style={{ width: '400px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--color-border)', paddingBottom: '16px' }}>
              <h2 style={{ fontSize: '18px', margin: 0 }}>Admin Settings</h2>
              <button className="btn btn-outline" style={{ padding: '4px 8px', borderColor: 'transparent' }} onClick={() => setShowSettings(false)}>✕</button>
            </div>
            <form onSubmit={handleSaveSettings}>
              <div className="form-group">
                <label className="form-label">Admin Username</label>
                <input type="text" className="form-control" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Admin Password</label>
                <input type="text" className="form-control" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '16px' }}>Save Changes</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;
