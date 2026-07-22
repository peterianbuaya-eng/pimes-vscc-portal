import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, CalendarDays, FileBarChart, LogOut, Settings, Menu } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, importLocalData } = useAppContext();
  
  const [showSettings, setShowSettings] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location]);


  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleImport = async () => {
    try { await importLocalData(); alert('Old browser data has been copied to the shared database.'); setShowSettings(false); }
    catch (err) { alert(err.message); }
  };

  return (
    <div className="app-container">
      {isSidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>
      )}
      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="sidebar-title">PIMES VSCC Portal</div>
          <button className="btn btn-outline mobile-menu-toggle" style={{ padding: '4px 8px', borderColor: 'transparent' }} onClick={() => setIsSidebarOpen(false)}>✕</button>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button className="btn btn-outline mobile-menu-toggle" style={{ padding: '6px' }} onClick={() => setIsSidebarOpen(true)}>
              <Menu size={18} />
            </button>
            <div className="topbar-title" style={{ textTransform: 'capitalize' }}>
              {location.pathname === '/' ? 'Dashboard' : location.pathname.substring(1)}
            </div>
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
          <div className="card" style={{ width: '90%', maxWidth: '400px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--color-border)', paddingBottom: '16px' }}>
              <h2 style={{ fontSize: '18px', margin: 0 }}>Admin Settings</h2>
              <button className="btn btn-outline" style={{ padding: '4px 8px', borderColor: 'transparent' }} onClick={() => setShowSettings(false)}>✕</button>
            </div>
            <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>Your account is secured by Supabase. Use the password reset option in the login service if you need to change the administrator password.</p>
            <button className="btn btn-outline" onClick={handleImport}>Import old browser data</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;
