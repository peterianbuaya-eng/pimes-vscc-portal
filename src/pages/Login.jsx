import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAppContext();
  
  const [tab, setTab] = useState('admin'); // 'admin' or 'student'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    
    const success = login(tab, username, password);
    
    if (success) {
      if (tab === 'admin') navigate('/');
      else navigate('/portal');
    } else {
      setError('Invalid username or password');
    }
  };

  const switchTab = (newTab) => {
    setTab(newTab);
    setUsername('');
    setPassword('');
    setError('');
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: 'var(--color-bg-subtle)' }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '24px', fontSize: '24px' }}>PIMES VSCC Portal</h2>
        
        <div style={{ display: 'flex', borderBottom: '1px solid var(--color-border)', marginBottom: '24px' }}>
          <div 
            style={{ flex: 1, padding: '12px', cursor: 'pointer', fontWeight: '500', color: tab === 'admin' ? 'var(--color-primary)' : 'var(--color-text-secondary)', borderBottom: tab === 'admin' ? '2px solid var(--color-primary)' : '2px solid transparent' }}
            onClick={() => switchTab('admin')}
          >
            Admin Login
          </div>
          <div 
            style={{ flex: 1, padding: '12px', cursor: 'pointer', fontWeight: '500', color: tab === 'student' ? 'var(--color-primary)' : 'var(--color-text-secondary)', borderBottom: tab === 'student' ? '2px solid var(--color-primary)' : '2px solid transparent' }}
            onClick={() => switchTab('student')}
          >
            Student Login
          </div>
        </div>

        {error && <div style={{ color: 'var(--color-danger)', fontSize: '14px', marginBottom: '16px', padding: '8px', backgroundColor: 'rgba(226,68,92,0.1)', borderRadius: '4px' }}>{error}</div>}

        <form onSubmit={handleLogin} style={{ textAlign: 'left' }}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input type="text" className="form-control" value={username} onChange={(e) => setUsername(e.target.value)} required placeholder="Enter username" />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Enter password" />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '16px' }}>
            Login as {tab === 'admin' ? 'Admin' : 'Student'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
