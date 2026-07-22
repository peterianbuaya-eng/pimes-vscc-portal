import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const AddStudent = () => {
  const navigate = useNavigate();
  const { addStudent } = useAppContext();
  const [form, setForm] = useState({ name: '', contactNumber: '', parentGuardian: '', monthlyFee: '', schedule: '', dateEnrolled: new Date().toISOString().slice(0, 10), notes: '', photo: '' });
  const [error, setError] = useState('');
  const submit = async event => {
    event.preventDefault(); setError('');
    try { await addStudent({ ...form, monthlyFee: Number(form.monthlyFee) }); navigate('/students'); }
    catch (err) { setError(err.message); }
  };
  const field = (label, key, type = 'text') => <div className="form-group"><label className="form-label">{label}</label><input className="form-control" type={type} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} required={key === 'name'} /></div>;
  return <div style={{ maxWidth: '640px' }}><h1 style={{ fontSize: '24px', marginBottom: '24px' }}>Add Student</h1>{error && <p style={{ color: 'var(--color-danger)' }}>{error}</p>}<form className="card" onSubmit={submit}>{field('Full name', 'name')}{field('Contact number', 'contactNumber')}{field('Parent / guardian', 'parentGuardian')}{field('Monthly fee', 'monthlyFee', 'number')}{field('Schedule', 'schedule')}{field('Date enrolled', 'dateEnrolled', 'date')}<div className="form-group"><label className="form-label">Notes</label><textarea className="form-control" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} /></div><div style={{ display: 'flex', gap: '12px' }}><button type="button" className="btn btn-outline" onClick={() => navigate('/students')}>Cancel</button><button className="btn btn-primary" type="submit">Save student</button></div></form></div>;
};
export default AddStudent;
