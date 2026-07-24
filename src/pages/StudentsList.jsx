import React from 'react';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';

const StudentsList = () => {
  const { students } = useAppContext();
  const navigate = useNavigate();
  const [query, setQuery] = React.useState('');

  const filtered = students.filter(s =>
    s.name?.toLowerCase().includes(query.toLowerCase()) ||
    s.contactNumber?.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', gap: '12px', flexWrap: 'wrap' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 800, letterSpacing: '-0.03em' }}>Students Directory</h1>
        <button className="btn btn-primary" onClick={() => navigate('/admin/students/new')}>
          <Plus size={16} /> Add Student
        </button>
      </div>

      <div className="card" style={{ padding: '0' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--color-bg-subtle)', padding: '8px 12px', borderRadius: 'var(--radius-sm)', maxWidth: '320px' }}>
            <Search size={15} color="var(--color-text-muted)" />
            <input
              type="text"
              placeholder="Search students..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '13px', color: 'var(--color-text-main)' }}
            />
          </div>
        </div>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Contact</th>
                <th>Parent/Guardian</th>
                <th>Schedule</th>
                <th>Monthly Fee</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan="6" style={{ textAlign: 'center', color: 'var(--color-text-secondary)', padding: '32px' }}>No students found</td></tr>
              )}
              {filtered.map(student => (
                <tr key={student.id} onClick={() => navigate(`/students/${student.id}`)} style={{ cursor: 'pointer' }}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img src={student.photo} alt={student.name} className="avatar" />
                      <span style={{ fontWeight: '600', fontSize: '14px' }}>{student.name}</span>
                    </div>
                  </td>
                  <td style={{ fontSize: '13px' }}>{student.contactNumber}</td>
                  <td style={{ fontSize: '13px' }}>{student.parentGuardian}</td>
                  <td style={{ fontSize: '13px' }}>{student.schedule}</td>
                  <td style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-primary)' }}>₱{student.monthlyFee?.toLocaleString()}</td>
                  <td><span className="badge badge-success">Active</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentsList;
