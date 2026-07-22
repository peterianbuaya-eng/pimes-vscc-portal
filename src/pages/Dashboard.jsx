import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Users, BookOpen, AlertCircle, TrendingUp, Bell } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const Modal = ({ title, onClose, children }) => (
  <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
    <div className="card" style={{ width: '90%', maxWidth: '500px', maxHeight: '80vh', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--color-border)', paddingBottom: '16px' }}>
        <h2 style={{ fontSize: '18px', margin: 0 }}>{title}</h2>
        <button className="btn btn-outline" style={{ padding: '4px 8px', borderColor: 'transparent' }} onClick={onClose}>✕</button>
      </div>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {children}
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const { students, payments, attendance, addNotification } = useAppContext();
  const [showLessonsModal, setShowLessonsModal] = useState(false);
  const [showUnpaidModal, setShowUnpaidModal] = useState(false);

  // Simple aggregations
  const totalStudents = students.length;
  
  // Mock today's lessons (for demo, just picking Monday schedule)
  const todaysLessonsList = students.filter(s => s.schedule && s.schedule.includes('Monday'));
  const todaysLessons = todaysLessonsList.length;
  
  // Mock unpaid students
  const unpaidStudentsList = students.filter(s => {
    const studentPayments = payments.filter(p => p.studentId === s.id);
    return !studentPayments.some(p => p.status === 'Paid');
  });
  const unpaidStudents = unpaidStudentsList.length;

  const handleSendNotification = (studentId) => {
    addNotification(studentId, "You have unpaid fees for this month. Please settle them via Cash or GCash.", "warning");
    alert("Notification sent to student portal!");
  };

  const monthlyIncome = payments.filter(p => p.status === 'Paid' || p.status === 'Partial')
                                 .reduce((sum, p) => sum + p.amount, 0);

  const mockChartData = [
    { name: 'Jan', income: 32000 },
    { name: 'Feb', income: 35000 },
    { name: 'Mar', income: 40000 },
    { name: 'Apr', income: 41000 },
    { name: 'May', income: 38000 },
    { name: 'Jun', income: 43000 },
    { name: 'Jul', income: monthlyIncome },
  ];

  return (
    <div>
      <h1 style={{ marginBottom: '24px', fontSize: '24px' }}>Dashboard Overview</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '12px', backgroundColor: 'rgba(0, 115, 234, 0.1)', borderRadius: '8px', color: 'var(--color-primary)' }}>
            <Users size={24} />
          </div>
          <div>
            <div style={{ color: 'var(--color-text-secondary)', fontSize: '14px', fontWeight: '500' }}>Total Students</div>
            <div style={{ fontSize: '28px', fontWeight: '700' }}>{totalStudents}</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer', transition: 'box-shadow 0.2s' }} onClick={() => setShowLessonsModal(true)}>
          <div style={{ padding: '12px', backgroundColor: 'rgba(0, 200, 117, 0.1)', borderRadius: '8px', color: 'var(--color-success)' }}>
            <BookOpen size={24} />
          </div>
          <div>
            <div style={{ color: 'var(--color-text-secondary)', fontSize: '14px', fontWeight: '500' }}>Today's Lessons</div>
            <div style={{ fontSize: '28px', fontWeight: '700' }}>{todaysLessons}</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer', transition: 'box-shadow 0.2s' }} onClick={() => setShowUnpaidModal(true)}>
          <div style={{ padding: '12px', backgroundColor: 'rgba(226, 68, 92, 0.1)', borderRadius: '8px', color: 'var(--color-danger)' }}>
            <AlertCircle size={24} />
          </div>
          <div>
            <div style={{ color: 'var(--color-text-secondary)', fontSize: '14px', fontWeight: '500' }}>Unpaid Fees</div>
            <div style={{ fontSize: '28px', fontWeight: '700' }}>{unpaidStudents}</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '12px', backgroundColor: 'rgba(253, 171, 61, 0.1)', borderRadius: '8px', color: 'var(--color-warning)' }}>
            <TrendingUp size={24} />
          </div>
          <div>
            <div style={{ color: 'var(--color-text-secondary)', fontSize: '14px', fontWeight: '500' }}>Monthly Income</div>
            <div style={{ fontSize: '28px', fontWeight: '700' }}>₱{monthlyIncome.toLocaleString()}</div>
          </div>
        </div>
      </div>

      <div className="card" style={{ height: '400px' }}>
        <h3 style={{ marginBottom: '24px', fontSize: '16px' }}>Income Overview (2026)</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={mockChartData}>
            <XAxis dataKey="name" stroke="var(--color-text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="var(--color-text-secondary)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₱${val/1000}k`} />
            <Tooltip cursor={{fill: 'var(--color-bg-subtle)'}} contentStyle={{ borderRadius: '8px', border: '1px solid var(--color-border)' }} />
            <Bar dataKey="income" fill="var(--color-primary)" radius={[4, 4, 0, 0]} barSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {showLessonsModal && (
        <Modal title="Today's Lessons" onClose={() => setShowLessonsModal(false)}>
          {todaysLessonsList.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--color-text-secondary)', padding: '20px' }}>No lessons scheduled for today.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {todaysLessonsList.map(s => (
                <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', border: '1px solid var(--color-border)', borderRadius: '8px' }}>
                  <img src={s.photo} alt={s.name} className="avatar" />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '500' }}>{s.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>{s.schedule}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Modal>
      )}

      {showUnpaidModal && (
        <Modal title="Students with Unpaid Fees" onClose={() => setShowUnpaidModal(false)}>
          {unpaidStudentsList.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--color-text-secondary)', padding: '20px' }}>All students have paid their fees!</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {unpaidStudentsList.map(s => (
                <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', border: '1px solid var(--color-border)', borderRadius: '8px' }}>
                  <img src={s.photo} alt={s.name} className="avatar" />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '500' }}>{s.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>₱{s.monthlyFee?.toLocaleString()} Due</div>
                  </div>
                  <button className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => handleSendNotification(s.id)}>
                    <Bell size={14} /> Remind
                  </button>
                </div>
              ))}
            </div>
          )}
        </Modal>
      )}
    </div>
  );
};

export default Dashboard;
