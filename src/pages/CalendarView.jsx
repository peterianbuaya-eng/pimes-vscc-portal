import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Calendar as CalendarIcon, Plus, Trash2, Edit2 } from 'lucide-react';

export const CalendarView = () => {
  const { reminders, addReminder, deleteReminder, updateReminder } = useAppContext();
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px' }}>Schedule & Reminders</h1>
        {!isAdding && !editingId && (
          <button className="btn btn-primary" onClick={() => setIsAdding(true)}>
            <Plus size={16} /> Add Reminder
          </button>
        )}
      </div>

      {(isAdding || editingId) && (
        <div className="card" style={{ marginBottom: '24px', backgroundColor: 'var(--color-bg-subtle)' }}>
          <h3 style={{ marginBottom: '16px' }}>{editingId ? 'Edit Reminder' : 'New Reminder'}</h3>
          <form onSubmit={handleSave}>
            <div className="grid-mobile-stack" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
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
            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="submit" className="btn btn-primary">Save Reminder</button>
              <button type="button" className="btn btn-outline" onClick={cancelForm}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div style={{ display: 'grid', gap: '16px' }}>
        {reminders.length === 0 && (
          <div className="card" style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-secondary)' }}>
            <CalendarIcon size={48} style={{ opacity: 0.5, marginBottom: '16px', display: 'block', margin: '0 auto 16px' }} />
            <p>No reminders or schedules set. Click "Add Reminder" to create one.</p>
          </div>
        )}

        {reminders.map(r => (
          <div key={r.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h3 style={{ fontSize: '16px', marginBottom: '4px', color: 'var(--color-primary)' }}>{r.title}</h3>
              <div style={{ fontSize: '13px', fontWeight: '500', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>{r.date}</div>
              <p style={{ fontSize: '14px' }}>{r.description}</p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="btn btn-outline" style={{ padding: '6px' }} onClick={() => startEdit(r)}>
                <Edit2 size={14} />
              </button>
              <button className="btn btn-outline" style={{ padding: '6px', color: 'var(--color-danger)', borderColor: 'var(--color-danger)' }} onClick={() => deleteReminder(r.id)}>
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
