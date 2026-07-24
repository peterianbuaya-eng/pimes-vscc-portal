import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Check, Copy, UserCheck } from 'lucide-react';
import { generateUsername } from '../lib/utils';

const AddStudent = () => {
  const navigate = useNavigate();
  const { addStudent, createStudentWithAccount } = useAppContext();
  const [form, setForm] = useState({ name: '', contactNumber: '', parentGuardian: '', monthlyFee: '', schedule: '', dateEnrolled: new Date().toISOString().slice(0, 10), notes: '', photo: '' });
  const [createAccount, setCreateAccount] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [createdCredentials, setCreatedCredentials] = useState(null);
  const [copied, setCopied] = useState(false);

  const username = generateUsername(form.name);

  const submit = async event => {
    event.preventDefault(); 
    setError('');
    setIsLoading(true);
    try {
      if (createAccount) {
        if (!username) throw new Error('Please enter a valid student name to generate a username.');
        const result = await createStudentWithAccount(
          { ...form, monthlyFee: Number(form.monthlyFee) },
          username
        );
        setCreatedCredentials({
          username: result.username,
          password: result.temporaryPassword,
          studentName: form.name
        });
      } else {
        await addStudent({ ...form, monthlyFee: Number(form.monthlyFee) });
        navigate('/admin/students');
      }
    } catch (err) { 
      setError(err.message); 
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!createdCredentials) return;
    const text = `Hi ${createdCredentials.studentName.split(',')[1]?.trim() || createdCredentials.studentName}! Here are your credentials for the PIMES VSCC Portal:\n\nUsername: ${createdCredentials.username}\nPassword: ${createdCredentials.password}\n\nPlease change your password when you first log in!`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const field = (label, key, type = 'text') => (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <input 
        className="form-control" 
        type={type} 
        value={form[key]} 
        onChange={e => setForm({ ...form, [key]: e.target.value })} 
        required={key === 'name'} 
      />
    </div>
  );

  if (createdCredentials) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div className="card animate-in" style={{ maxWidth: '480px', textAlign: 'center', border: '1px solid var(--color-success)', padding: '32px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'rgba(0, 230, 118, 0.15)', color: 'var(--color-success)', marginBottom: '16px' }}>
            <UserCheck size={28} />
          </div>
          
          <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '8px' }}>Account Created!</h2>
          <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '20px' }}>
            A student record and portal login have been created for <strong style={{ color: 'var(--color-text-main)' }}>{createdCredentials.studentName}</strong>.
          </p>

          <div style={{ backgroundColor: 'var(--color-bg-subtle)', borderRadius: 'var(--radius-md)', padding: '16px', textAlign: 'left', border: '1px solid var(--color-border)', marginBottom: '20px' }}>
            <div style={{ marginBottom: '10px' }}>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-secondary)', fontWeight: '700' }}>Username</div>
              <div style={{ fontSize: '15px', fontWeight: '700', color: 'var(--color-primary)' }}>{createdCredentials.username}</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-secondary)', fontWeight: '700' }}>Temporary Password</div>
              <div style={{ fontSize: '15px', fontWeight: '700', color: 'var(--color-text-main)', fontFamily: 'monospace' }}>{createdCredentials.password}</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button className="btn btn-outline" style={{ minWidth: '130px', fontSize: '13px' }} onClick={handleCopy}>
              {copied ? <Check size={15} color="var(--color-success)" /> : <Copy size={15} />}
              {copied ? 'Copied!' : 'Copy Info'}
            </button>
            <button className="btn btn-primary" style={{ minWidth: '130px', fontSize: '13px' }} onClick={() => navigate('/admin/students')}>
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '600px' }}>
      <h1 style={{ fontSize: '22px', marginBottom: '20px', fontWeight: 800, letterSpacing: '-0.03em' }}>Add Student</h1>
      {error && (
        <div style={{ color: 'var(--color-danger)', fontSize: '13px', marginBottom: '16px', padding: '10px', backgroundColor: 'rgba(255,82,82,0.1)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,82,82,0.2)' }}>
          {error}
        </div>
      )}
      
      <form className="card" onSubmit={submit}>
        {field('Full Name', 'name')}
        
        {form.name && (
          <div style={{ backgroundColor: 'var(--color-primary-dim)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(124, 235, 60, 0.2)', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)', fontWeight: '600' }}>Generated Username:</span>
            <strong style={{ color: 'var(--color-primary)', fontFamily: 'monospace', fontSize: '13px' }}>{username}</strong>
          </div>
        )}

        <div className="grid-mobile-stack" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {field('Contact Number', 'contactNumber')}
          {field('Parent / Guardian', 'parentGuardian')}
        </div>

        <div className="grid-mobile-stack" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {field('Monthly Fee', 'monthlyFee', 'number')}
          {field('Schedule', 'schedule')}
        </div>

        {field('Date Enrolled', 'dateEnrolled', 'date')}

        <div className="form-group">
          <label className="form-label">Notes</label>
          <textarea className="form-control" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} style={{ minHeight: '72px' }} />
        </div>

        <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '16px', marginTop: '4px', marginBottom: '16px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontWeight: '600', color: 'var(--color-text-main)', fontSize: '14px' }}>
            <input 
              type="checkbox" 
              checked={createAccount} 
              onChange={e => setCreateAccount(e.target.checked)} 
              style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: 'var(--color-primary)' }}
            />
            Create Student Portal Account
          </label>
          <p style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginLeft: '26px', marginTop: '4px' }}>
            If checked, a portal account will be set up with the generated username and a default password ({username ? username + '123' : 'username123'}).
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="button" className="btn btn-outline" style={{ fontSize: '13px' }} onClick={() => navigate('/admin/students')} disabled={isLoading}>
            Cancel
          </button>
          <button className="btn btn-primary" type="submit" style={{ fontSize: '13px' }} disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Student'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddStudent;
