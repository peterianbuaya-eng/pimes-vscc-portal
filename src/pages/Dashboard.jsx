import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Users, BookOpen, AlertCircle, TrendingUp, Bell, X } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const Modal = ({ title, onClose, children }) => (
  <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)', padding: '16px' }}>
    <div className="card animate-in" style={{ width: '100%', maxWidth: '500px', maxHeight: '80vh', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--color-border)', paddingBottom: '16px' }}>
        <h2 style={{ fontSize: '18px', margin: 0, fontWeight: 700 }}>{title}</h2>
        <button className="btn btn-outline" style={{ padding: '4px 8px', borderColor: 'transparent' }} onClick={onClose}>
          <X size={16} />
        </button>
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
  
  const todayName = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date());
  const todaysLessonsList = students.filter(s => s.schedule && s.schedule.includes(todayName));
  const todaysLessons = todaysLessonsList.length;

  const today = new Date();
  const selectedYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const paidPayments = payments.filter(payment => payment.status === 'Paid' || payment.status === 'Partial');
  const monthlyChartData = monthNames.map((name, monthIndex) => ({
    name,
    income: paidPayments.filter(payment => {
      const paymentDate = new Date(`${payment.date}T00:00:00`);
      return paymentDate.getFullYear() === selectedYear && paymentDate.getMonth() === monthIndex;
    }).reduce((sum, payment) => sum + payment.amount, 0)
  }));
  const currentMonthIncome = monthlyChartData[currentMonth].income;

  const unpaidStudentsList = students.filter(s => {
    const paidThisMonth = paidPayments.filter(payment => {
      const paymentDate = new Date(`${payment.date}T00:00:00`);
      return payment.studentId === s.id && paymentDate.getFullYear() === selectedYear && paymentDate.getMonth() === currentMonth;
    }).reduce((sum, payment) => sum + payment.amount, 0);
    return paidThisMonth < s.monthlyFee;
  });
  const unpaidStudents = unpaidStudentsList.length;

  const handleSendNotification = (studentId) => {
    addNotification(studentId, "You have unpaid fees for this month. Please settle them via Cash or GCash.", "warning");
    alert("Notification sent to student portal!");
  };

  return (
    <div>
      <h1 style={{ marginBottom: '20px', fontSize: '22px', fontWeight: 800, letterSpacing: '-0.03em' }}>Dashboard Overview</h1>
      
      {/* Stat Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        {/* Total Students */}
        <div className="card stat-card">
          <div className="stat-icon stat-icon-green">
            <Users size={22} />
          </div>
          <div>
            <div className="stat-label">Total Students</div>
            <div className="stat-value">{totalStudents}</div>
          </div>
        </div>

        {/* Today's Lessons */}
        <div className="card stat-card" style={{ cursor: 'pointer' }} onClick={() => setShowLessonsModal(true)}>
          <div className="stat-icon stat-icon-orange">
            <BookOpen size={22} />
          </div>
          <div>
            <div className="stat-label">{todayName}'s Lessons</div>
            <div className="stat-value">{todaysLessons}</div>
          </div>
        </div>

        {/* Unpaid Fees */}
        <div className="card stat-card" style={{ cursor: 'pointer' }} onClick={() => setShowUnpaidModal(true)}>
          <div className="stat-icon stat-icon-red">
            <AlertCircle size={22} />
          </div>
          <div>
            <div className="stat-label">Unpaid This Month</div>
            <div className="stat-value">{unpaidStudents}</div>
          </div>
        </div>

        {/* Month Income */}
        <div className="card stat-card">
          <div className="stat-icon stat-icon-green">
            <TrendingUp size={22} />
          </div>
          <div>
            <div className="stat-label">{monthNames[currentMonth]} Income</div>
            <div className="stat-value" style={{ fontSize: '22px' }}>₱{currentMonthIncome.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* Chart Card */}
      <div className="card" style={{ height: '360px' }}>
        <h3 style={{ marginBottom: '16px', fontSize: '15px', fontWeight: 700, color: 'var(--color-text-main)' }}>
          Income Overview ({selectedYear})
        </h3>
        <ResponsiveContainer width="100%" height="85%">
          <BarChart data={monthlyChartData}>
            <XAxis 
              dataKey="name" 
              stroke="var(--color-text-muted)" 
              fontSize={11} 
              tickLine={false} 
              axisLine={false} 
            />
            <YAxis 
              stroke="var(--color-text-muted)" 
              fontSize={11} 
              tickLine={false} 
              axisLine={false} 
              tickFormatter={(val) => `₱${val/1000}k`} 
            />
            <Tooltip 
              cursor={{ fill: 'rgba(124, 235, 60, 0.05)' }} 
              contentStyle={{ 
                borderRadius: '12px', 
                border: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-bg-card)',
                color: 'var(--color-text-main)',
                boxShadow: 'var(--shadow-md)'
              }}
              labelStyle={{ color: 'var(--color-text-secondary)' }}
            />
            <Bar 
              dataKey="income" 
              fill="var(--color-primary)" 
              radius={[8, 8, 8, 8]} 
              barSize={32}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {showLessonsModal && (
        <Modal title="Today's Lessons" onClose={() => setShowLessonsModal(false)}>
          {todaysLessonsList.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--color-text-secondary)', padding: '20px' }}>No lessons scheduled for today.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {todaysLessonsList.map(s => (
                <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-bg-subtle)' }}>
                  <img src={s.photo} alt={s.name} className="avatar" />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600', fontSize: '14px' }}>{s.name}</div>
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {unpaidStudentsList.map(s => (
                <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-bg-subtle)' }}>
                  <img src={s.photo} alt={s.name} className="avatar" />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600', fontSize: '14px' }}>{s.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>₱{s.monthlyFee?.toLocaleString()} Due</div>
                  </div>
                  <button className="btn btn-outline" style={{ padding: '6px 10px', fontSize: '11px' }} onClick={() => handleSendNotification(s.id)}>
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

