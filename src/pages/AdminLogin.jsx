import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Shield, AlertCircle } from 'lucide-react';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login } = useAppContext();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    const result = await login(email, password);
    
    if (result.success) {
      navigate('/admin');
    } else {
      setError(result.message || 'Invalid credentials');
    }
    setIsLoading(false);
  };

  return (
    <div className="login-page">
      <div className="login-card login-card-admin animate-in">
        <div className="login-logo" style={{ background: 'none', width: '72px', height: '72px', borderRadius: '0', marginBottom: '24px' }}>
          <img src="/vscc_logo.png" alt="VSCC Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </div>
        <h2>Admin Portal</h2>
        <div className="login-subtitle">PIMES VSCC Management System</div>

        {error && (
          <div style={{ 
            color: 'var(--color-danger)', 
            fontSize: '13px', 
            marginBottom: '20px', 
            padding: '10px 14px', 
            backgroundColor: 'rgba(255,82,82,0.1)', 
            borderRadius: 'var(--radius-sm)', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            border: '1px solid rgba(255,82,82,0.2)'
          }}>
            <AlertCircle size={16} />
            <div>{error}</div>
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input 
              type="email" 
              className="form-control" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              placeholder="admin@pimes.com"
              disabled={isLoading}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              className="form-control" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              placeholder="Enter password"
              disabled={isLoading}
            />
          </div>
          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', padding: '12px', fontSize: '14px', marginTop: '8px' }}
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <a 
            href="/login" 
            style={{ color: 'var(--color-text-secondary)', fontSize: '13px', textDecoration: 'none' }}
            onClick={(e) => { e.preventDefault(); navigate('/login'); }}
          >
            Student? Login here →
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
