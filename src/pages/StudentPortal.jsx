import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { CreditCard, Calendar, Upload, AlertCircle } from 'lucide-react';

const StudentPortal = () => {
  const { currentUser, students, attendance, payments, reminders, notifications, markNotificationRead, updateStudent } = useAppContext();
  const [activeTab, setActiveTab] = useState('overview');
  
  const student = students.find(s => s.id === currentUser?.id);
  const [newPassword, setNewPassword] = useState('');

  if (!student) return <div>Loading...</div>;

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    if (newPassword.trim().length < 3) return alert('Password must be at least 3 characters.');
    updateStudent(student.id, { password: newPassword });
    alert('Password updated successfully!');
    setNewPassword('');
  };

  const studentAttendance = attendance.filter(a => a.studentId === student.id).sort((a, b) => new Date(b.date) - new Date(a.date));
  const studentPayments = payments.filter(p => p.studentId === student.id).sort((a, b) => new Date(b.date) - new Date(a.date));
  const myNotifications = notifications.filter(n => n.studentId === student.id && !n.read);

  return (
    <div>
      {myNotifications.map(n => (
        <div key={n.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(253, 171, 61, 0.1)', border: '1px solid var(--color-warning)', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#d68b28' }}>
            <AlertCircle size={20} />
            <div style={{ color: 'var(--color-text-main)', fontWeight: '500' }}>{n.message}</div>
          </div>
          <button className="btn btn-outline" style={{ padding: '6px 12px' }} onClick={() => markNotificationRead(n.id)}>Dismiss</button>
        </div>
      ))}
      <h1 style={{ fontSize: '28px', marginBottom: '24px' }}>Welcome back, {student.name.split(',')[1]?.trim() || student.name}!</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '24px' }}>
        {/* Left Column: Main Tabs */}
        <div className="card" style={{ padding: 0, height: 'fit-content' }}>
          <div style={{ display: 'flex', borderBottom: '1px solid var(--color-border)' }}>
            <div 
              style={{ padding: '16px 24px', cursor: 'pointer', fontWeight: '500', color: activeTab === 'overview' ? 'var(--color-primary)' : 'var(--color-text-secondary)', borderBottom: activeTab === 'overview' ? '2px solid var(--color-primary)' : '2px solid transparent' }}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </div>
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
            <div 
              style={{ padding: '16px 24px', cursor: 'pointer', fontWeight: '500', color: activeTab === 'settings' ? 'var(--color-primary)' : 'var(--color-text-secondary)', borderBottom: activeTab === 'settings' ? '2px solid var(--color-primary)' : '2px solid transparent' }}
              onClick={() => setActiveTab('settings')}
            >
              Settings
            </div>
          </div>

          <div style={{ padding: '24px' }}>
            {activeTab === 'overview' && (
              <div>
                <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>My Profile</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
                  <div>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>Full Name</div>
                    <div style={{ fontWeight: '500' }}>{student.name}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>Schedule</div>
                    <div style={{ fontWeight: '500' }}>{student.schedule}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>Contact Number</div>
                    <div style={{ fontWeight: '500' }}>{student.contactNumber}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>Monthly Fee</div>
                    <div style={{ fontWeight: '500' }}>₱{student.monthlyFee?.toLocaleString()}</div>
                  </div>
                </div>

                <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>How to Pay</h3>
                <div style={{ padding: '16px', backgroundColor: 'var(--color-bg-subtle)', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                  <div style={{ display: 'flex', gap: '24px' }}>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <CreditCard size={18} color="var(--color-primary)" /> Cash Payment
                      </h4>
                      <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>
                        Simply pay face-to-face during your scheduled lesson.
                      </p>
                    </div>
                    <div style={{ width: '1px', backgroundColor: 'var(--color-border)' }}></div>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <CreditCard size={18} color="var(--color-primary)" /> GCash
                      </h4>
                      <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: '12px' }}>
                        Scan the QR code below to pay via GCash. After paying, please send the receipt screenshot directly to the studio.
                      </p>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '12px', backgroundColor: 'var(--color-bg-main)', border: '1px solid var(--color-border)', borderRadius: '8px' }}>
                        <img 
                          src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=ReplaceThisWithYourQR" 
                          alt="GCash QR Code" 
                          style={{ width: '150px', height: '150px', marginBottom: '8px' }}
                        />
                        <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', textAlign: 'center', marginBottom: '16px' }}>
                          (Admin: Replace the src of this image with your actual GCash QR in the code later)
                        </div>
                        
                        <div style={{ width: '100%', padding: '12px', border: '1px dashed var(--color-primary)', borderRadius: '8px', textAlign: 'center', cursor: 'pointer', backgroundColor: 'rgba(0,115,234,0.05)' }}>
                          <Upload size={18} color="var(--color-primary)" style={{ marginBottom: '4px' }} />
                          <div style={{ fontSize: '12px', color: 'var(--color-primary)', fontWeight: '500' }}>Upload Receipt Screenshot</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'attendance' && (
              <div>
                <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Attendance Record</h3>
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
                <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Payment History</h3>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Amount</th>
                      <th>Method</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentPayments.length === 0 && <tr><td colSpan="4" style={{ textAlign: 'center', color: 'var(--color-text-secondary)' }}>No records found</td></tr>}
                    {studentPayments.map(record => (
                      <tr key={record.id}>
                        <td>{record.date}</td>
                        <td>₱{record.amount.toLocaleString()}</td>
                        <td>{record.method}</td>
                        <td>
                          <span className={`badge ${record.status === 'Paid' ? 'badge-success' : record.status === 'Partial' ? 'badge-warning' : 'badge-danger'}`}>
                            {record.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'settings' && (
              <div>
                <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Account Settings</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px', marginBottom: '32px' }}>
                  <div style={{ backgroundColor: 'var(--color-bg-subtle)', padding: '16px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>Your Username</div>
                    <div style={{ fontWeight: '500', fontSize: '16px' }}>{student.username}</div>
                  </div>
                </div>

                <h3 style={{ fontSize: '16px', marginBottom: '16px' }}>Change Password</h3>
                <form onSubmit={handleUpdatePassword} style={{ maxWidth: '300px' }}>
                  <div className="form-group">
                    <label className="form-label">New Password</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={newPassword} 
                      onChange={(e) => setNewPassword(e.target.value)} 
                      placeholder="Enter new password" 
                      required 
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">Update Password</button>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Reminders & Schedule */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="card">
            <h3 style={{ fontSize: '16px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={18} color="var(--color-primary)" /> Upcoming Reminders
            </h3>
            {reminders.length === 0 ? (
              <div style={{ fontSize: '14px', color: 'var(--color-text-secondary)', textAlign: 'center', padding: '16px 0' }}>
                No upcoming reminders.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {reminders.map(r => (
                  <div key={r.id} style={{ padding: '12px', borderLeft: '3px solid var(--color-primary)', backgroundColor: 'rgba(0,115,234,0.05)', borderRadius: '0 4px 4px 0' }}>
                    <div style={{ fontWeight: '600', fontSize: '14px', marginBottom: '4px' }}>{r.title}</div>
                    <div style={{ fontSize: '12px', color: 'var(--color-primary)', marginBottom: '8px', fontWeight: '500' }}>{r.date}</div>
                    <div style={{ fontSize: '13px', color: 'var(--color-text-main)' }}>{r.description}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentPortal;
