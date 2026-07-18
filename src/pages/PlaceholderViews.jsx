import React from 'react';
import { Calendar as CalendarIcon, FileBarChart } from 'lucide-react';

export const CalendarView = () => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
      <div style={{ textAlign: 'center', color: 'var(--color-text-secondary)' }}>
        <CalendarIcon size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
        <h2>Calendar View</h2>
        <p>Full calendar module coming soon.</p>
      </div>
    </div>
  );
};

export const ReportsView = () => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
      <div style={{ textAlign: 'center', color: 'var(--color-text-secondary)' }}>
        <FileBarChart size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
        <h2>Reports View</h2>
        <p>Advanced PDF generation and reports coming soon.</p>
      </div>
    </div>
  );
};
