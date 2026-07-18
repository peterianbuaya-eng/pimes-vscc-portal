import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { ArrowLeft, Check, X, Clock, RefreshCw, CreditCard, Edit2, Save } from 'lucide-react';

const StudentProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { students, attendance, payments, markAttendance, addPayment, removePayment, updateStudent } = useAppContext();
  const [activeTab, setActiveTab] = useState('attendance');

  const student = students.find(s => s.id === id);

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(student || {});

  useEffect(() => {
    if (student) setEditForm(student);
  }, [student]);

  if (!student) return <div>Student not found</div>;

  const studentAttendance = attendance.filter(a => a.studentId === id).sort((a, b) => new Date(b.date) - new Date(a.date));
  const studentPayments = payments.filter(p => p.studentId === id).sort((a, b) => new Date(b.date) - new Date(a.date));

  const handleMarkAttendance = (status) => {
    const today = new Date().toISOString().split('T')[0];
    markAttendance(id, today, status);
  };

  const handleAddPayment = () => {
    const today = new Date().toISOString().split('T')[0];
    addPayment({
      studentId: id,
      date: today,
      amount: student.monthlyFee,
      method: 'Cash',
      status: 'Paid',
      receipt: `R-${Math.floor(Math.random() * 10000)}`
    });
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <button className="btn btn-outline" onClick={() => navigate('/students')} style={{ padding: '8px' }}>
          <ArrowLeft size={16} />
        </button>
        <h1 style={{ fontSize: '24px', margin: 0 }}>Student Profile</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '24px' }}>
        {/* Profile Sidebar */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <img src={student.photo} alt={student.name} className="avatar" style={{ width: '100px', height: '100px', marginBottom: '16px' }} />
          {isEditing ? (
            <input type="text" className="form-control" value={editForm.name} onChange={(e) => setEditForm({...editForm, name: e.target.value})} style={{ marginBottom: '8px', textAlign: 'center' }} />
          ) : (
            <h2 style={{ fontSize: '18px', marginBottom: '4px' }}>{student.name}</h2>
          )}
          
          {isEditing ? (
            <input type="text" className="form-control" value={editForm.schedule} onChange={(e) => setEditForm({...editForm, schedule: e.target.value})} style={{ marginBottom: '16px', textAlign: 'center' }} />
          ) : (
            <div className="badge badge-primary" style={{ marginBottom: '24px' }}>{student.schedule}</div>
          )}
          
          <div style={{ width: '100%', textAlign: 'left', marginBottom: '16px' }}>
            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', fontWeight: '500' }}>Contact</div>
              {isEditing ? <input type="text" className="form-control" value={editForm.contactNumber} onChange={(e) => setEditForm({...editForm, contactNumber: e.target.value})} /> : <div style={{ fontSize: '14px' }}>{student.contactNumber}</div>}
            </div>
            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', fontWeight: '500' }}>Parent/Guardian</div>
              {isEditing ? <input type="text" className="form-control" value={editForm.parentGuardian} onChange={(e) => setEditForm({...editForm, parentGuardian: e.target.value})} /> : <div style={{ fontSize: '14px' }}>{student.parentGuardian}</div>}
            </div>
            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', fontWeight: '500' }}>Monthly Fee</div>
              {isEditing ? <input type="number" className="form-control" value={editForm.monthlyFee} onChange={(e) => setEditForm({...editForm, monthlyFee: Number(e.target.value)})} /> : <div style={{ fontSize: '14px' }}>₱{student.monthlyFee?.toLocaleString()}</div>}
            </div>
            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', fontWeight: '500' }}>Date Enrolled</div>
              {isEditing ? <input type="date" className="form-control" value={editForm.dateEnrolled} onChange={(e) => setEditForm({...editForm, dateEnrolled: e.target.value})} /> : <div style={{ fontSize: '14px' }}>{student.dateEnrolled}</div>}
            </div>
          </div>
          
          {isEditing ? (
            <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
              <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => { setIsEditing(false); setEditForm(student); }}>Cancel</button>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => { updateStudent(id, editForm); setIsEditing(false); }}>
                <Save size={16} /> Save
              </button>
            </div>
          ) : (
            <button className="btn btn-outline" style={{ width: '100%' }} onClick={() => setIsEditing(true)}>
              <Edit2 size={16} /> Edit Profile
            </button>
          )}
        </div>

        {/* Main Content */}
        <div className="card" style={{ padding: 0 }}>
          <div style={{ display: 'flex', borderBottom: '1px solid var(--color-border)' }}>
            <div 
              style={{ padding: '16px 24px', cursor: 'pointer', fontWeight: '500', color: activeTab === 'attendance' ? 'var(--color-primary)' : 'var(--color-text-secondary)', borderBottom: activeTab === 'attendance' ? '2px solid var(--color-primary)' : '2px solid transparent' }}
              onClick={() => setActiveTab('attendance')}
            >
              Attendance
            </div>
            <div 
              style={{ padding: '16px 24px', cursor: 'pointer', fontWeight: '500', color: activeTab === 'payments' ? 'var(--color-primary)' : 'var(--color-text-secondary)', borderBottom: activeTab === 'payments' ? '2px solid var(--color-primary)' : '2px solid transparent' }}
              onClick={() => setActiveTab('payments')}
            >
              Payments
            </div>
          </div>

          <div style={{ padding: '24px' }}>
            {activeTab === 'attendance' && (
              <div>
                <h3 style={{ fontSize: '16px', marginBottom: '16px' }}>One-Tap Attendance (Today)</h3>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
                  <button className="btn btn-outline" style={{ color: 'var(--color-success)', borderColor: 'var(--color-success)' }} onClick={() => handleMarkAttendance('Present')}>
                    <Check size={16} /> Present
                  </button>
                  <button className="btn btn-outline" style={{ color: 'var(--color-danger)', borderColor: 'var(--color-danger)' }} onClick={() => handleMarkAttendance('Absent')}>
                    <X size={16} /> Absent
                  </button>
                  <button className="btn btn-outline" style={{ color: 'var(--color-warning)', borderColor: 'var(--color-warning)' }} onClick={() => handleMarkAttendance('Late')}>
                    <Clock size={16} /> Late
                  </button>
                  <button className="btn btn-outline" style={{ color: 'var(--color-primary)', borderColor: 'var(--color-primary)' }} onClick={() => handleMarkAttendance('Make-up')}>
                    <RefreshCw size={16} /> Make-up
                  </button>
                </div>

                <h3 style={{ fontSize: '16px', marginBottom: '16px' }}>Attendance History</h3>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentAttendance.length === 0 && <tr><td colSpan="2" style={{ textAlign: 'center', color: 'var(--color-text-secondary)' }}>No records found</td></tr>}
                    {studentAttendance.map(record => (
                      <tr key={record.id}>
                        <td>{record.date}</td>
                        <td>
                          <span className={`badge ${record.status === 'Present' ? 'badge-success' : record.status === 'Absent' ? 'badge-danger' : record.status === 'Late' ? 'badge-warning' : 'badge-primary'}`}>
                            {record.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'payments' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '16px' }}>Payment History</h3>
                  <button className="btn btn-primary" onClick={handleAddPayment}>
                    <CreditCard size={16} /> Record Payment (Today)
                  </button>
                </div>
                
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Amount</th>
                      <th>Method</th>
                      <th>Receipt</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentPayments.length === 0 && <tr><td colSpan="6" style={{ textAlign: 'center', color: 'var(--color-text-secondary)' }}>No records found</td></tr>}
                    {studentPayments.map(record => (
                      <tr key={record.id}>
                        <td>{record.date}</td>
                        <td>₱{record.amount.toLocaleString()}</td>
                        <td>{record.method}</td>
                        <td>{record.receipt}</td>
                        <td>
                          <span className={`badge ${record.status === 'Paid' ? 'badge-success' : record.status === 'Partial' ? 'badge-warning' : 'badge-danger'}`}>
                            {record.status}
                          </span>
                        </td>
                        <td>
                          <button 
                            className="btn btn-outline" 
                            style={{ padding: '4px 8px', fontSize: '12px', color: 'var(--color-danger)', borderColor: 'var(--color-danger)' }}
                            onClick={() => removePayment(record.id)}
                            title="Undo Payment"
                          >
                            <X size={14} style={{ marginRight: '4px' }} /> Undo
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
