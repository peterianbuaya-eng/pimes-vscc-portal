import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Calendar as CalendarIcon, Plus, Trash2, Edit2 } from 'lucide-react';

export const CalendarView = () => {
  const { reminders, addReminder, deleteReminder, updateReminder, broadcastMonthlyPaymentReminders } = useAppContext();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ title: '', date: '', description: '' });

  const handleSave = (e) => {
    e.preventDefault();
    if (editingId) {
      updateReminder(editingId, formData);
      setEditingId(null);
    } else {
      addReminder(formData);
      setIsAdding(false);
    }
    setFormData({ title: '', date: '', description: '' });
  };

  const startEdit = (reminder) => {
    setFormData(reminder);
    setEditingId(reminder.id);
    setIsAdding(false);
  };

  const cancelForm = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({ title: '', date: '', description: '' });
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 800, letterSpacing: '-0.03em' }}>Schedule & Reminders</h1>
        {!isAdding && !editingId && (
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button 
              className="btn btn-outline"
              style={{ fontSize: '12px' }}
              onClick={async () => {
                const count = await broadcastMonthlyPaymentReminders();
                alert(`1st of Month Payment Reminder sent to ${count} unpaid student(s)!`);
              }}
            >
              Send Monthly Reminders
            </button>
            <button className="btn btn-primary" style={{ fontSize: '12px' }} onClick={() => setIsAdding(true)}>
              <Plus size={15} /> Add Reminder
            </button>
          </div>
        )}
      </div>

      {(isAdding || editingId) && (
        <div className="card animate-in" style={{ marginBottom: '16px', backgroundColor: 'var(--color-bg-subtle)', border: '1px solid var(--color-border)' }}>
          <h3 style={{ marginBottom: '14px', fontSize: '14px', fontWeight: 700 }}>{editingId ? 'Edit Reminder' : 'New Reminder'}</h3>
          <form onSubmit={handleSave}>
            <div className="grid-mobile-stack" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Title / Event</label>
                <input type="text" className="form-control" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required placeholder="e.g., Recital Rehearsal" />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Date</label>
                <input type="date" className="form-control" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} required />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Description / Meetup Details</label>
              <textarea className="form-control" rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required placeholder="Detailed information for the students..." />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" className="btn btn-primary" style={{ fontSize: '13px' }}>Save Reminder</button>
              <button type="button" className="btn btn-outline" style={{ fontSize: '13px' }} onClick={cancelForm}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div style={{ display: 'grid', gap: '12px' }}>
        {reminders.length === 0 && (
          <div className="card" style={{ textAlign: 'center', padding: '48px', color: 'var(--color-text-secondary)' }}>
            <CalendarIcon size={40} style={{ opacity: 0.3, marginBottom: '12px', display: 'block', margin: '0 auto 12px' }} />
            <p style={{ fontSize: '14px' }}>No reminders set. Click "Add Reminder" to create one.</p>
          </div>
        )}

        {reminders.map(r => (
          <div key={r.id} className="card animate-in" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', borderLeft: '3px solid var(--color-primary)' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h3 style={{ fontSize: '15px', marginBottom: '3px', color: 'var(--color-primary)', fontWeight: 700 }}>{r.title}</h3>
              <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--color-text-secondary)', marginBottom: '6px' }}>{r.date}</div>
              <p style={{ fontSize: '13px', color: 'var(--color-text-main)' }}>{r.description}</p>
            </div>
            <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
              <button className="btn btn-outline" style={{ padding: '5px 8px' }} onClick={() => startEdit(r)}>
                <Edit2 size={13} />
              </button>
              <button className="btn btn-outline" style={{ padding: '5px 8px', color: 'var(--color-danger)', borderColor: 'var(--color-danger)' }} onClick={() => deleteReminder(r.id)}>
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
