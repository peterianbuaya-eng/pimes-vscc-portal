import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { CreditCard, Calendar, Upload, AlertCircle } from 'lucide-react';

const StudentPortal = () => {
  const { currentUser, students, attendance, payments, reminders, notifications, markNotificationRead, updatePassword, completeStudentSetup, addPayment, updateStudent } = useAppContext();
  const [activeTab, setActiveTab] = useState('overview');
  
  const student = students.find(s => s.id === currentUser?.id);
  const [newPassword, setNewPassword] = useState('');
  
  const [setupForm, setSetupForm] = useState({ email: '', password: '', confirmPassword: '' });
  const [setupError, setSetupError] = useState('');
  const [isSubmittingSetup, setIsSubmittingSetup] = useState(false);

  // States for GCash upload receipt
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(student ? student.monthlyFee || '' : '');
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  
  // State for modal receipt preview
  const [viewingReceipt, setViewingReceipt] = useState(null);

  // States and handler for profile photo upload
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  // Listen for bottom tab changes from StudentLayout
  useEffect(() => {
    const handler = (e) => {
      setActiveTab(e.detail);
    };
    window.addEventListener('student-tab-change', handler);
    return () => window.removeEventListener('student-tab-change', handler);
  }, []);

  // Sync the bottom tab bar active states
  useEffect(() => {
    const tabs = document.querySelectorAll('#student-bottom-tabs .bottom-tab');
    tabs.forEach(tab => {
      if (tab.dataset.tab === activeTab) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });
  }, [activeTab]);

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploadingPhoto(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const base64Photo = reader.result;
        await updateStudent(student.id, {
          ...student,
          photo: base64Photo
        });
        alert('Profile picture updated successfully!');
      } catch (err) {
        alert('Error updating profile picture: ' + err.message);
      } finally {
        setIsUploadingPhoto(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleUploadReceipt = async (e) => {
    e.preventDefault();
    if (!selectedFile) return alert('Please select a receipt screenshot.');
    setIsUploading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      await addPayment({
        studentId: student.id,
        date: today,
        amount: Number(paymentAmount),
        method: 'GCash',
        status: 'Unpaid',
        receipt: imagePreview
      });
      alert('Receipt uploaded successfully! Your payment is pending verification by the studio.');
      setShowUploadModal(false);
      setSelectedFile(null);
      setImagePreview('');
    } catch (err) {
      alert('Error uploading receipt: ' + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  if (!student) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '50vh', color: 'var(--color-text-secondary)' }}>
      Loading...
    </div>
  );

  if (currentUser?.mustChangePassword) {
    const handleCompleteSetup = async (e) => {
      e.preventDefault();
      setSetupError('');
      
      if (!setupForm.email.includes('@')) {
        return setSetupError('Please enter a valid email address.');
      }
      if (setupForm.password.length < 8) {
        return setSetupError('Password must be at least 8 characters long.');
      }
      if (setupForm.password !== setupForm.confirmPassword) {
        return setSetupError('Passwords do not match.');
      }
      
      setIsSubmittingSetup(true);
      try {
        await completeStudentSetup(setupForm.email.trim(), setupForm.password);
      } catch (err) {
        setSetupError(err.message || 'Failed to activate account. Please try again.');
      } finally {
        setIsSubmittingSetup(false);
      }
    };

    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh', padding: '20px' }}>
        <div className="card animate-in" style={{ maxWidth: '480px', boxShadow: 'var(--shadow-lg)', borderRadius: 'var(--radius-lg)', padding: '32px', borderTop: '3px solid var(--color-secondary)' }}>
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--color-text-main)', marginBottom: '8px' }}>Activate Your Account</h2>
            <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
              Welcome to the PIMES VSCC Portal! Please set up your email address and update your pre-made password to continue.
            </p>
          </div>

          {setupError && (
            <div style={{ color: 'var(--color-danger)', fontSize: '13px', marginBottom: '20px', padding: '10px 14px', backgroundColor: 'rgba(255,82,82,0.1)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid rgba(255,82,82,0.2)' }}>
              <AlertCircle size={16} />
              <div>{setupError}</div>
            </div>
          )}

          <form onSubmit={handleCompleteSetup}>
            <div className="form-group">
              <label className="form-label">Contact Email Address</label>
              <input 
                type="email" 
                className="form-control" 
                required 
                placeholder="name@example.com" 
                value={setupForm.email}
                onChange={e => setSetupForm({ ...setupForm, email: e.target.value })}
                disabled={isSubmittingSetup}
              />
              <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', display: 'block', marginTop: '4px' }}>
                Used for account notifications and password recovery.
              </span>
            </div>

            <div className="form-group">
              <label className="form-label">New Password</label>
              <input 
                type="password" 
                className="form-control" 
                required 
                placeholder="Minimum 8 characters" 
                value={setupForm.password}
                onChange={e => setSetupForm({ ...setupForm, password: e.target.value })}
                disabled={isSubmittingSetup}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '24px' }}>
              <label className="form-label">Confirm New Password</label>
              <input 
                type="password" 
                className="form-control" 
                required 
                placeholder="Re-enter new password" 
                value={setupForm.confirmPassword}
                onChange={e => setSetupForm({ ...setupForm, confirmPassword: e.target.value })}
                disabled={isSubmittingSetup}
              />
            </div>

            <button type="submit" className="btn" style={{ width: '100%', padding: '12px', fontSize: '14px', backgroundColor: 'var(--color-secondary)', color: '#0a0a0a' }} disabled={isSubmittingSetup}>
              {isSubmittingSetup ? 'Activating...' : 'Activate Account & Enter'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (newPassword.trim().length < 8) return alert('Password must be at least 8 characters.');
    const { error } = await updatePassword(newPassword);
    if (error) return alert(error.message);
    alert('Password updated successfully.');
    setNewPassword('');
  };

  const studentAttendance = attendance.filter(a => a.studentId === student.id).sort((a, b) => new Date(b.date) - new Date(a.date));
  const studentPayments = payments.filter(p => p.studentId === student.id).sort((a, b) => new Date(b.date) - new Date(a.date));
  const myNotifications = notifications.filter(n => n.studentId === student.id && !n.read);

  return (
    <div>
      {/* Notifications */}
      {myNotifications.map(n => (
        <div key={n.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(255, 171, 64, 0.1)', border: '1px solid var(--color-warning)', padding: '12px', borderRadius: 'var(--radius-sm)', marginBottom: '12px', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
            <AlertCircle size={18} color="var(--color-warning)" style={{ flexShrink: 0 }} />
            <div style={{ color: 'var(--color-text-main)', fontWeight: '500', fontSize: '13px' }}>{n.message}</div>
          </div>
          <button className="btn btn-outline" style={{ padding: '4px 10px', fontSize: '11px', flexShrink: 0 }} onClick={() => markNotificationRead(n.id)}>Dismiss</button>
        </div>
      ))}

      {/* Unpaid reminder banner */}
      {(() => {
        const currentMonthPrefix = new Date().toISOString().slice(0, 7);
        const sp = payments.filter(p => p.studentId === student?.id);
        const hasPaidCurrentMonth = sp.some(p => p.date.startsWith(currentMonthPrefix));
        if (!hasPaidCurrentMonth) {
          return (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(255, 171, 64, 0.1)', border: '1px solid var(--color-warning)', padding: '12px', borderRadius: 'var(--radius-sm)', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                <AlertCircle size={20} color="var(--color-warning)" style={{ flexShrink: 0 }} />
                <div>
                  <strong style={{ color: 'var(--color-text-main)', fontSize: '13px' }}>Monthly Tuition Due</strong>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                    Payment is due on the 1st. Settle in class or upload your GCash receipt.
                  </div>
                </div>
              </div>
              <button 
                className="btn" 
                style={{ padding: '6px 12px', fontSize: '12px', whiteSpace: 'nowrap', backgroundColor: 'var(--color-secondary)', color: '#0a0a0a' }} 
                onClick={() => {
                  setActiveTab('overview');
                  setPaymentAmount(student?.monthlyFee || '');
                  setShowUploadModal(true);
                }}
              >
                Upload Receipt
              </button>
            </div>
          );
        }
        return null;
      })()}

      {/* Desktop Tab Bar (hidden on mobile via bottom tabs) */}
      <div className="tab-bar tabs-scroll-mobile" style={{ marginBottom: '16px', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
        {['overview', 'attendance', 'payments', 'settings'].map(tab => (
          <div 
            key={tab}
            className={`tab-item ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </div>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="animate-in">
          {/* Compact Profile + Schedule */}
          <div className="card" style={{ marginBottom: '16px' }}>
            <h3 style={{ fontSize: '15px', marginBottom: '12px', fontWeight: 700, color: 'var(--color-primary)' }}>My Profile</h3>
            <div className="grid-mobile-stack" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Full Name</div>
                <div style={{ fontWeight: '600', fontSize: '14px' }}>{student.name}</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Schedule</div>
                <div style={{ fontWeight: '600', fontSize: '14px' }}>{student.schedule}</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Contact</div>
                <div style={{ fontWeight: '600', fontSize: '14px' }}>{student.contactNumber}</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Monthly Fee</div>
                <div style={{ fontWeight: '600', fontSize: '14px', color: 'var(--color-primary)' }}>₱{student.monthlyFee?.toLocaleString()}</div>
              </div>
            </div>

            <h3 style={{ fontSize: '15px', marginBottom: '12px', fontWeight: 700, color: 'var(--color-secondary)' }}>How to Pay</h3>
            <div style={{ padding: '14px', backgroundColor: 'var(--color-bg-subtle)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}>
              <div className="flex-mobile-stack" style={{ display: 'flex', gap: '20px' }}>
                <div style={{ flex: 1 }}>
                  <h4 style={{ marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 700 }}>
                    <CreditCard size={16} color="var(--color-primary)" /> Cash
                  </h4>
                  <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                    Pay face-to-face during your scheduled lesson.
                  </p>
                </div>
                <div className="mobile-divider" style={{ width: '1px', backgroundColor: 'var(--color-border)' }}></div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 700 }}>
                    <CreditCard size={16} color="var(--color-secondary)" /> GCash
                  </h4>
                  <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '10px' }}>
                    Scan the QR code below and upload your receipt.
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px', backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)' }}>
                    <img 
                      src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=ReplaceThisWithYourQR" 
                      alt="GCash QR Code" 
                      style={{ width: '120px', height: '120px', marginBottom: '8px', borderRadius: '4px' }}
                    />
                    <div style={{ fontSize: '10px', color: 'var(--color-text-muted)', textAlign: 'center', marginBottom: '10px' }}>
                      (Replace QR with actual GCash code)
                    </div>
                    
                    <div 
                      onClick={() => {
                        setPaymentAmount(student.monthlyFee || '');
                        setShowUploadModal(true);
                      }}
                      style={{ width: '100%', padding: '10px', border: '1px dashed var(--color-secondary)', borderRadius: 'var(--radius-sm)', textAlign: 'center', cursor: 'pointer', backgroundColor: 'var(--color-secondary-dim)', transition: 'background-color 0.2s' }}
                    >
                      <Upload size={16} color="var(--color-secondary)" style={{ marginBottom: '2px' }} />
                      <div style={{ fontSize: '11px', color: 'var(--color-secondary)', fontWeight: '600' }}>Upload Receipt Screenshot</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Reminders */}
          <div className="card">
            <h3 style={{ fontSize: '15px', marginBottom: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={16} color="var(--color-primary)" /> Upcoming Reminders
            </h3>
            {reminders.length === 0 ? (
              <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', textAlign: 'center', padding: '16px 0' }}>
                No upcoming reminders.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {reminders.map(r => (
                  <div key={r.id} style={{ padding: '10px', borderLeft: '3px solid var(--color-primary)', backgroundColor: 'var(--color-primary-dim)', borderRadius: '0 var(--radius-sm) var(--radius-sm) 0' }}>
                    <div style={{ fontWeight: '700', fontSize: '13px', marginBottom: '2px' }}>{r.title}</div>
                    <div style={{ fontSize: '11px', color: 'var(--color-primary)', marginBottom: '4px', fontWeight: '600' }}>{r.date}</div>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>{r.description}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'attendance' && (
        <div className="card animate-in">
          <h3 style={{ fontSize: '15px', marginBottom: '12px', fontWeight: 700 }}>Attendance Record</h3>
          <div className="table-responsive">
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
        </div>
      )}

      {activeTab === 'payments' && (
        <div className="card animate-in">
          <h3 style={{ fontSize: '15px', marginBottom: '12px', fontWeight: 700 }}>Payment History</h3>
          <div style={{ display: 'grid', gap: '12px' }}>
            {studentPayments.length === 0 && <div style={{ textAlign: 'center', color: 'var(--color-text-secondary)', padding: '20px' }}>No records found</div>}
            {studentPayments.map(record => (
              <div key={record.id} style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '12px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-bg-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: '600', fontSize: '14px', color: 'var(--color-text-main)' }}>{record.date}</span>
                  <span className={`badge ${record.status === 'Paid' ? 'badge-success' : record.status === 'Partial' ? 'badge-warning' : 'badge-danger'}`}>
                    {record.status}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>Amount:</span>
                  <span style={{ fontWeight: '700', fontSize: '14px', color: 'var(--color-primary)' }}>₱{record.amount.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>Method:</span>
                  <span style={{ fontSize: '13px', color: 'var(--color-text-main)' }}>{record.method}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>Receipt:</span>
                  {record.receipt && (record.receipt.startsWith('data:image/') || record.receipt.startsWith('http')) ? (
                    <button 
                      onClick={() => setViewingReceipt(record.receipt)} 
                      style={{ background: 'none', border: 'none', padding: 0, color: 'var(--color-secondary)', textDecoration: 'underline', fontWeight: '600', cursor: 'pointer', fontSize: '13px' }}
                    >
                      View Receipt
                    </button>
                  ) : (
                    <span style={{ fontSize: '13px', color: 'var(--color-text-main)' }}>{record.receipt || '-'}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="card animate-in">
          <h3 style={{ fontSize: '15px', marginBottom: '16px', fontWeight: 700 }}>Account Settings</h3>
          
          {/* Profile Picture */}
          <div style={{ backgroundColor: 'var(--color-bg-subtle)', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <img 
              src={student.photo || 'https://api.dicebear.com/7.x/bottts/svg?seed=' + encodeURIComponent(student.name)} 
              alt={student.name} 
              style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--color-primary)', display: 'block' }}
            />
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '4px' }}>Profile Picture</h4>
              <label className="btn btn-outline" style={{ fontSize: '12px', padding: '5px 10px', cursor: 'pointer', display: 'inline-flex' }}>
                {isUploadingPhoto ? 'Uploading...' : 'Choose Photo'}
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handlePhotoChange} 
                  style={{ display: 'none' }} 
                  disabled={isUploadingPhoto}
                />
              </label>
            </div>
          </div>

          {/* Email */}
          <div style={{ backgroundColor: 'var(--color-bg-subtle)', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', marginBottom: '16px' }}>
            <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '4px' }}>Email</div>
            <div style={{ fontWeight: '600', fontSize: '14px' }}>{currentUser.email}</div>
          </div>

          {/* Change Password */}
          <h4 style={{ fontSize: '14px', marginBottom: '12px', fontWeight: 700 }}>Change Password</h4>
          <form onSubmit={handleUpdatePassword} style={{ maxWidth: '300px' }}>
            <div className="form-group">
              <label className="form-label">New Password</label>
              <input 
                type="password" 
                className="form-control" 
                value={newPassword} 
                onChange={(e) => setNewPassword(e.target.value)} 
                placeholder="Enter new password" 
                required 
              />
            </div>
            <button type="submit" className="btn" style={{ backgroundColor: 'var(--color-secondary)', color: '#0a0a0a' }}>Update Password</button>
          </form>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '16px', backdropFilter: 'blur(4px)' }}>
          <div className="card animate-in" style={{ maxWidth: '400px', boxShadow: 'var(--shadow-lg)' }}>
            <h3 style={{ fontSize: '16px', marginBottom: '16px', fontWeight: 700 }}>Submit GCash Receipt</h3>
            <form onSubmit={handleUploadReceipt}>
              <div className="form-group">
                <label className="form-label">Amount Paid (₱)</label>
                <input 
                  type="number" 
                  className="form-control" 
                  value={paymentAmount} 
                  onChange={e => setPaymentAmount(e.target.value)} 
                  required 
                  min="1"
                />
              </div>
              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label className="form-label">Receipt Screenshot</label>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange} 
                  required 
                  style={{ display: 'block', width: '100%', fontSize: '13px' }}
                />
              </div>

              {imagePreview && (
                <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginBottom: '6px' }}>Preview:</div>
                  <img src={imagePreview} alt="Receipt Preview" style={{ maxHeight: '120px', borderRadius: '4px', border: '1px solid var(--color-border)' }} />
                </div>
              )}

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-outline" onClick={() => { setShowUploadModal(false); setSelectedFile(null); setImagePreview(''); }} disabled={isUploading}>
                  Cancel
                </button>
                <button type="submit" className="btn" style={{ backgroundColor: 'var(--color-secondary)', color: '#0a0a0a' }} disabled={isUploading}>
                  {isUploading ? 'Submitting...' : 'Submit Payment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Receipt Viewer */}
      {viewingReceipt && (
        <div 
          style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.9)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '16px' }}
          onClick={() => setViewingReceipt(null)}
        >
          <div style={{ position: 'relative', maxWidth: '90%', maxHeight: '90%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <img 
              src={viewingReceipt} 
              alt="Receipt" 
              style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain', borderRadius: '8px', boxShadow: 'var(--shadow-lg)' }} 
            />
            <div style={{ textAlign: 'center', marginTop: '12px', color: 'white', fontWeight: '500', fontSize: '13px', backgroundColor: 'rgba(0,0,0,0.6)', padding: '6px 12px', borderRadius: 'var(--radius-pill)' }}>
              Click anywhere to close
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentPortal;

