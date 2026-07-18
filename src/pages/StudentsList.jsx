import React from 'react';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';

const StudentsList = () => {
  const { students } = useAppContext();
  const navigate = useNavigate();

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px' }}>Students Directory</h1>
        <button className="btn btn-primary" onClick={() => navigate('/students/new')}>
          <Plus size={16} /> Add Student
        </button>
      </div>

      <div className="card" style={{ padding: '0' }}>
        <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--color-bg-subtle)', padding: '8px 12px', borderRadius: '4px', width: '300px' }}>
            <Search size={16} color="var(--color-text-secondary)" />
            <input type="text" placeholder="Search students..." style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%' }} />
          </div>
        </div>
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
            {students.map(student => (
              <tr key={student.id} onClick={() => navigate(`/students/${student.id}`)} style={{ cursor: 'pointer' }}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img src={student.photo} alt={student.name} className="avatar" />
                    <span style={{ fontWeight: '500' }}>{student.name}</span>
                  </div>
                </td>
                <td>{student.contactNumber}</td>
                <td>{student.parentGuardian}</td>
                <td>{student.schedule}</td>
                <td>₱{student.monthlyFee?.toLocaleString()}</td>
                <td>
                  <span className="badge badge-success">Active</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentsList;
