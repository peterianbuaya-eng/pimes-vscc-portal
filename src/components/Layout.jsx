import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, CalendarDays, FileBarChart, LogOut, Settings, Menu, X } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, importLocalData, import2026PdfRoster } = useAppContext();
  
  const [showSettings, setShowSettings] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const handleImport = async () => {
    try { await importLocalData(); alert('Old browser data has been copied to the shared database.'); setShowSettings(false); }
    catch (err) { alert(err.message); }
  };

  const handlePdfImport = async () => {
    try { await import2026PdfRoster(); alert('The 2026 roster and January-May payment history were imported.'); setShowSettings(false); }
    catch (err) { alert(err.message); }
  };

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Dashboard';
    if (path.startsWith('/students/new')) return 'Add Student';
    if (path.startsWith('/students/')) return 'Student Profile';
    if (path === '/students') return 'Students';
    if (path === '/calendar') return 'Calendar';
    if (path === '/reports') return 'Reports';
    return 'Dashboard';
  };

  return (
    <div className="app-container admin-theme">
      {isSidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>
      )}
      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header" style={{ justifyContent: 'center', width: '100%' }}>
          <img src="/vscc_logo.png" alt="VSCC Logo" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
          {/* Mobile close button */}
          <button 
            className="mobile-menu-toggle btn btn-outline" 
            style={{ padding: '4px 8px', borderColor: 'transparent', position: 'absolute', top: '16px', right: '12px' }} 
            onClick={() => setIsSidebarOpen(false)}
          >
            <X size={18} />
          </button>
        </div>
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px', width: '100%', alignItems: 'center' }}>
          <NavLink to="/admin" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} end title="Dashboard">
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/admin/students" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} title="Students">
            <Users size={20} />
            <span>Students</span>
          </NavLink>
          <NavLink to="/admin/calendar" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} title="Calendar">
            <CalendarDays size={20} />
            <span>Calendar</span>
          </NavLink>
          <NavLink to="/admin/reports" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} title="Reports">
            <FileBarChart size={20} />
            <span>Reports</span>
          </NavLink>
        </nav>
        
        {/* Mobile sidebar logout */}
        <div className="sidebar-logout-area">
          <button className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }} onClick={handleLogout}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>
      
      <main className="main-content">
        <header className="topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button className="btn btn-outline mobile-menu-toggle" style={{ padding: '6px', borderColor: 'transparent' }} onClick={() => setIsSidebarOpen(true)}>
              <Menu size={20} />
            </button>
            <div className="topbar-title">
              {getPageTitle()}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button 
              className="btn btn-outline" 
              style={{ padding: '6px 12px', fontSize: '12px' }} 
              onClick={handleLogout} 
              title="Logout"
            >
              <LogOut size={16} /> <span className="mobile-hide-text">Logout</span>
            </button>
            <button 
              className="btn btn-outline" 
              style={{ padding: '6px' }} 
              onClick={() => setShowSettings(true)} 
              title="Settings"
            >
              <Settings size={18} />
            </button>
            <div 
              className="avatar" 
              style={{ 
                backgroundColor: 'var(--color-primary)', 
                color: '#0a0a0a', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontWeight: '800',
                fontSize: '13px',
                border: 'none'
              }}
            >
              A
            </div>
          </div>
        </header>
        <div className="page-container">
          <Outlet />
        </div>
      </main>

      {showSettings && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
          <div className="card animate-in" style={{ width: '90%', maxWidth: '400px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--color-border)', paddingBottom: '16px' }}>
              <h2 style={{ fontSize: '18px', margin: 0, fontWeight: 700 }}>Admin Settings</h2>
              <button className="btn btn-outline" style={{ padding: '4px 8px', borderColor: 'transparent' }} onClick={() => setShowSettings(false)}>✕</button>
            </div>
            <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6, fontSize: '13px', marginBottom: '20px' }}>Your account is secured by Supabase. Use the password reset option in the login service if you need to change the administrator password.</p>
            <button className="btn btn-outline" style={{ width: '100%', marginBottom: '12px' }} onClick={handleImport}>Import old browser data</button>
            <button className="btn btn-primary" style={{ width: '100%' }} onClick={handlePdfImport}>Import 2026 roster and payments</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;
