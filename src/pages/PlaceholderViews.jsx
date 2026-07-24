import React from 'react';
import { FileBarChart } from 'lucide-react';

export const ReportsView = () => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <div style={{ textAlign: 'center', color: 'var(--color-text-secondary)' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'var(--color-primary-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
          <FileBarChart size={28} color="var(--color-primary)" />
        </div>
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-text-main)', marginBottom: '8px' }}>Reports View</h2>
        <p style={{ fontSize: '13px' }}>Advanced PDF generation and reports coming soon.</p>
      </div>
    </div>
  );
};
