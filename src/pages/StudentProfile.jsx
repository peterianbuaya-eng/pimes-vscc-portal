import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { ArrowLeft, Check, X, Clock, RefreshCw, CreditCard, Edit2, Save } from 'lucide-react';
import { generateUsername } from '../lib/utils';

const StudentProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { students, attendance, payments, markAttendance, addPayment, removePayment, updateStudent, createStudentWithAccount, updatePaymentStatus } = useAppContext();
  const [activeTab, setActiveTab] = useState('attendance');

  const student = students.find(s => s.id === id);

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(student || {});

  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [createdCreds, setCreatedCreds] = useState(null);
  const [copied, setCopied] = useState(false);
  const [viewingReceipt, setViewingReceipt] = useState(null);

  const handleCreateAccount = async () => {
    const username = generateUsername(student.name);
    if (!username) return alert('Invalid name format for generating username.');
    setIsCreatingAccount(true);
    try {
      const result = await createStudentWithAccount(
        { id: student.id, name: student.name, contactNumber: student.contactNumber, parentGuardian: student.parentGuardian, monthlyFee: student.monthlyFee, schedule: student.schedule, dateEnrolled: student.dateEnrolled, notes: student.notes },
        username
      );
      setCreatedCreds({ username: result.username, password: result.temporaryPassword });
    } catch (err) {
      alert('Error creating account: ' + err.message);
    } finally {
      setIsCreatingAccount(false);
    }
  };

  const handleCopyCreds = () => {
    if (!createdCreds) return;
    const text = `Hi ${student.name.split(',')[1]?.trim() || student.name}! Here are your credentials for the PIMES VSCC Portal:\n\nUsername: ${createdCreds.username}\nPassword: ${createdCreds.password}\n\nPlease change your password when you first log in!`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    if (student) setEditForm(student);
  }, [student]);

  if (!student) return <div style={{ padding: '32px', color: 'var(--color-text-secondary)' }}>Student not found</div>;

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
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <button className="btn btn-outline" onClick={() => navigate('/students')} style={{ padding: '7px' }}>
          <ArrowLeft size={16} />
        </button>
        <h1 style={{ fontSize: '22px', margin: 0, fontWeight: 800, letterSpacing: '-0.03em' }}>Student Profile</h1>
      </div>

      <div className="grid-mobile-stack" style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '16px' }}>
        {/* Profile Sidebar */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', height: 'fit-content' }}>
          <img 
            src={student.photo} 
            alt={student.name} 
            className="avatar" 
            style={{ width: '80px', height: '80px', marginBottom: '12px', border: '2px solid var(--color-primary)' }} 
          />
          {isEditing ? (
            <input type="text" className="form-control" value={editForm.name} onChange={(e) => setEditForm({...editForm, name: e.target.value})} style={{ marginBottom: '8px', textAlign: 'center' }} />
          ) : (
            <h2 style={{ fontSize: '16px', marginBottom: '4px', fontWeight: 700 }}>{student.name}</h2>
          )}
          
          {isEditing ? (
            <input type="text" className="form-control" value={editForm.schedule} onChange={(e) => setEditForm({...editForm, schedule: e.target.value})} style={{ marginBottom: '12px', textAlign: 'center' }} />
          ) : (
            <div className="badge badge-primary" style={{ marginBottom: '16px' }}>{student.schedule}</div>
          )}
          
          <div style={{ width: '100%', textAlign: 'left', marginBottom: '12px' }}>
            {[
              { label: 'Contact', key: 'contactNumber', type: 'text' },
              { label: 'Parent/Guardian', key: 'parentGuardian', type: 'text' },
              { label: 'Monthly Fee', key: 'monthlyFee', type: 'number' },
              { label: 'Date Enrolled', key: 'dateEnrolled', type: 'date' },
            ].map(({ label, key, type }) => (
              <div key={key} style={{ marginBottom: '10px' }}>
                <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</div>
                {isEditing 
                  ? <input type={type} className="form-control" value={editForm[key]} onChange={(e) => setEditForm({...editForm, [key]: type === 'number' ? Number(e.target.value) : e.target.value})} style={{ marginTop: '4px' }} />
                  : <div style={{ fontSize: '13px', fontWeight: '500', marginTop: '2px', color: key === 'monthlyFee' ? 'var(--color-primary)' : 'var(--color-text-main)' }}>
                      {key === 'monthlyFee' ? `₱${student.monthlyFee?.toLocaleString()}` : student[key]}
                    </div>
                }
              </div>
            ))}
          </div>
          
          {isEditing ? (
            <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
              <button className="btn btn-outline" style={{ flex: 1, fontSize: '12px' }} onClick={() => { setIsEditing(false); setEditForm(student); }}>Cancel</button>
              <button className="btn btn-primary" style={{ flex: 1, fontSize: '12px' }} onClick={() => { updateStudent(id, editForm); setIsEditing(false); }}>
                <Save size={14} /> Save
              </button>
            </div>
          ) : (
            <button className="btn btn-outline" style={{ width: '100%', fontSize: '12px' }} onClick={() => setIsEditing(true)}>
              <Edit2 size={14} /> Edit Profile
            </button>
          )}

          {!isEditing && (
            <div style={{ borderTop: '1px solid var(--color-border)', width: '100%', marginTop: '16px', paddingTop: '16px', textAlign: 'left' }}>
              <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Portal Account</div>
              {student.hasAccount ? (
                <div>
                  <div style={{ fontSize: '13px', marginBottom: '4px' }}>
                    <span style={{ color: 'var(--color-text-secondary)' }}>User: </span>
                    <code style={{ color: 'var(--color-primary)', fontSize: '12px', fontWeight: '700' }}>{student.username}</code>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                    Status: {student.mustChangePassword 
                      ? <span style={{ color: 'var(--color-warning)', fontWeight: '600' }}>Pending setup</span>
                      : <span style={{ color: 'var(--color-success)', fontWeight: '600' }}>Active</span>
                    }
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '10px' }}>No portal account yet.</div>
                  {createdCreds ? (
                    <div style={{ backgroundColor: 'rgba(0, 230, 118, 0.08)', border: '1px solid var(--color-success)', borderRadius: 'var(--radius-sm)', padding: '10px', marginBottom: '10px' }}>
                      <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--color-success)', marginBottom: '4px' }}>Account Created!</div>
                      <div style={{ fontSize: '11px', color: 'var(--color-text-main)', wordBreak: 'break-all' }}>
                        User: <strong>{createdCreds.username}</strong><br />
                        Pass: <strong>{createdCreds.password}</strong>
                      </div>
                      <button className="btn btn-outline" style={{ width: '100%', marginTop: '8px', padding: '4px 8px', fontSize: '11px' }} onClick={handleCopyCreds}>
                        {copied ? 'Copied!' : 'Copy Credentials'}
                      </button>
                    </div>
                  ) : (
                    <button 
                      className="btn btn-primary" 
                      style={{ width: '100%', fontSize: '12px', padding: '7px' }} 
                      onClick={handleCreateAccount}
                      disabled={isCreatingAccount}
                    >
                      {isCreatingAccount ? 'Creating...' : 'Create Account'}
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="card" style={{ padding: 0 }}>
          <div className="tab-bar">
            <div className={`tab-item ${activeTab === 'attendance' ? 'active' : ''}`} onClick={() => setActiveTab('attendance')}>Attendance</div>
            <div className={`tab-item ${activeTab === 'payments' ? 'active' : ''}`} onClick={() => setActiveTab('payments')}>Payments</div>
          </div>

          <div style={{ padding: '20px' }}>
            {activeTab === 'attendance' && (
              <div>
                <h3 style={{ fontSize: '14px', marginBottom: '12px', fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>One-Tap Attendance (Today)</h3>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
                  <button className="btn btn-outline" style={{ color: 'var(--color-success)', borderColor: 'var(--color-success)', fontSize: '12px' }} onClick={() => handleMarkAttendance('Present')}>
                    <Check size={14} /> Present
                  </button>
                  <button className="btn btn-outline" style={{ color: 'var(--color-danger)', borderColor: 'var(--color-danger)', fontSize: '12px' }} onClick={() => handleMarkAttendance('Absent')}>
                    <X size={14} /> Absent
                  </button>
                  <button className="btn btn-outline" style={{ color: 'var(--color-warning)', borderColor: 'var(--color-warning)', fontSize: '12px' }} onClick={() => handleMarkAttendance('Late')}>
                    <Clock size={14} /> Late
                  </button>
                  <button className="btn btn-outline" style={{ color: 'var(--color-primary)', borderColor: 'var(--color-primary)', fontSize: '12px' }} onClick={() => handleMarkAttendance('Make-up')}>
                    <RefreshCw size={14} /> Make-up
                  </button>
                </div>

                <h3 style={{ fontSize: '14px', marginBottom: '12px', fontWeight: 700 }}>History</h3>
                <div className="table-responsive">
                  <table className="data-table">
                    <thead><tr><th>Date</th><th>Status</th></tr></thead>
                    <tbody>
                      {studentAttendance.length === 0 && <tr><td colSpan="2" style={{ textAlign: 'center', color: 'var(--color-text-secondary)' }}>No records found</td></tr>}
                      {studentAttendance.map(record => (
                        <tr key={record.id}>
                          <td style={{ fontSize: '13px' }}>{record.date}</td>
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
              </div>
            )}

            {activeTab === 'payments' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
                  <h3 style={{ fontSize: '14px', fontWeight: 700 }}>Payment History</h3>
                  <button className="btn btn-primary" style={{ fontSize: '12px', padding: '6px 12px' }} onClick={handleAddPayment}>
                    <CreditCard size={14} /> Record Payment
                  </button>
                </div>
                
                <div className="table-responsive">
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
                          <td style={{ fontSize: '13px' }}>{record.date}</td>
                          <td style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-primary)' }}>₱{record.amount.toLocaleString()}</td>
                          <td style={{ fontSize: '13px' }}>{record.method}</td>
                          <td>
                            {record.receipt && (record.receipt.startsWith('data:image/') || record.receipt.startsWith('http')) ? (
                              <button onClick={() => setViewingReceipt(record.receipt)} style={{ background: 'none', border: 'none', padding: 0, color: 'var(--color-primary)', textDecoration: 'underline', fontWeight: '600', cursor: 'pointer', fontSize: '12px' }}>
                                View
                              </button>
                            ) : (
                              <span style={{ fontSize: '12px' }}>{record.receipt || '-'}</span>
                            )}
                          </td>
                          <td>
                            <span className={`badge ${record.status === 'Paid' ? 'badge-success' : record.status === 'Partial' ? 'badge-warning' : 'badge-danger'}`}>
                              {record.status}
                            </span>
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                              {record.status !== 'Paid' && (
                                <button 
                                  className="btn btn-primary" 
                                  style={{ padding: '3px 8px', fontSize: '11px', backgroundColor: 'var(--color-success)' }}
                                  onClick={async () => { await updatePaymentStatus(record.id, 'Paid'); alert('GCash payment approved!'); }}
                                >
                                  <Check size={12} /> Approve
                                </button>
                              )}
                              <button 
                                className="btn btn-outline" 
                                style={{ padding: '3px 8px', fontSize: '11px', color: 'var(--color-danger)', borderColor: 'var(--color-danger)' }}
                                onClick={() => removePayment(record.id)}
                              >
                                <X size={12} /> Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {viewingReceipt && (
        <div 
          style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.9)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '16px' }}
          onClick={() => setViewingReceipt(null)}
        >
          <img src={viewingReceipt} alt="Receipt" style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain', borderRadius: '8px' }} />
          <div style={{ textAlign: 'center', marginTop: '12px', color: 'white', fontSize: '13px', backgroundColor: 'rgba(0,0,0,0.6)', padding: '6px 12px', borderRadius: '999px' }}>
            Click anywhere to close
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentProfile;
