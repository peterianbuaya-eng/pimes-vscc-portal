import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AppContext = createContext();
const toStudent = row => ({ ...row, contactNumber: row.contact_number, parentGuardian: row.parent_guardian, monthlyFee: Number(row.monthly_fee), dateEnrolled: row.date_enrolled });
const toPayment = row => ({ ...row, studentId: row.student_id, amount: Number(row.amount) });
const toAttendance = row => ({ ...row, studentId: row.student_id });
const toNotification = row => ({ ...row, studentId: row.student_id });

export const AppProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [payments, setPayments] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = async (user) => {
    if (!user) { setStudents([]); setAttendance([]); setPayments([]); setReminders([]); setNotifications([]); return; }
    const { data: profile, error: profileError } = await supabase.from('profiles').select('role, student_id').eq('id', user.id).single();
    if (profileError) throw profileError;
    setCurrentUser({ id: profile.student_id, authId: user.id, role: profile.role, email: user.email });
    const [studentsResult, attendanceResult, paymentsResult, remindersResult, notificationsResult] = await Promise.all([
      supabase.from('students').select('*').order('name'), supabase.from('attendance').select('*').order('date', { ascending: false }),
      supabase.from('payments').select('*').order('date', { ascending: false }), supabase.from('reminders').select('*').order('date'),
      supabase.from('notifications').select('*').order('created_at', { ascending: false })
    ]);
    const resultError = [studentsResult, attendanceResult, paymentsResult, remindersResult, notificationsResult].find(result => result.error)?.error;
    if (resultError) throw resultError;
    setStudents(studentsResult.data.map(toStudent)); setAttendance(attendanceResult.data.map(toAttendance));
    setPayments(paymentsResult.data.map(toPayment)); setReminders(remindersResult.data); setNotifications(notificationsResult.data.map(toNotification));
  };

  useEffect(() => {
    const initialise = async () => {
      try { const { data: { user } } = await supabase.auth.getUser(); await loadData(user); }
      catch (err) { setError(err.message); } finally { setLoading(false); }
    };
    initialise();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!session?.user) { setCurrentUser(null); await loadData(null); return; }
      try { await loadData(session.user); } catch (err) { setError(err.message); }
    });
    return () => subscription.unsubscribe();
  }, []);

  const refresh = async () => { const { data: { user } } = await supabase.auth.getUser(); await loadData(user); };
  const login = async (email, password) => {
    const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) return { success: false, message: signInError.message };
    try { await loadData(data.user); return { success: true }; } catch (err) { return { success: false, message: err.message }; }
  };
  const logout = () => supabase.auth.signOut();
  const write = async (operation) => { const { error: writeError } = await operation; if (writeError) throw writeError; await refresh(); };

  const addStudent = student => write(supabase.from('students').insert({ name: student.name, photo: student.photo, contact_number: student.contactNumber, parent_guardian: student.parentGuardian, monthly_fee: student.monthlyFee, schedule: student.schedule, date_enrolled: student.dateEnrolled, notes: student.notes }));
  const updateStudent = (id, student) => write(supabase.from('students').update({ name: student.name, photo: student.photo, contact_number: student.contactNumber, parent_guardian: student.parentGuardian, monthly_fee: student.monthlyFee, schedule: student.schedule, date_enrolled: student.dateEnrolled, notes: student.notes }).eq('id', id));
  const markAttendance = (studentId, date, status) => write(supabase.from('attendance').insert({ student_id: studentId, date, status }));
  const addPayment = payment => write(supabase.from('payments').insert({ student_id: payment.studentId, date: payment.date, amount: payment.amount, method: payment.method, status: payment.status, receipt: payment.receipt }));
  const removePayment = id => write(supabase.from('payments').delete().eq('id', id));
  const addReminder = reminder => write(supabase.from('reminders').insert({ title: reminder.title, date: reminder.date, description: reminder.description }));
  const updateReminder = (id, reminder) => write(supabase.from('reminders').update({ title: reminder.title, date: reminder.date, description: reminder.description }).eq('id', id));
  const deleteReminder = id => write(supabase.from('reminders').delete().eq('id', id));
  const addNotification = (studentId, message, type = 'warning') => write(supabase.from('notifications').insert({ student_id: studentId, message, type }));
  const markNotificationRead = id => write(supabase.from('notifications').update({ read: true }).eq('id', id));
  const updatePassword = password => supabase.auth.updateUser({ password });
  const importLocalData = async () => {
    const savedStudents = JSON.parse(localStorage.getItem('pimes_students') || '[]');
    if (!savedStudents.length) throw new Error('No old browser data was found on this device.');
    if (students.length) throw new Error('Import is only available while the shared student list is empty, to prevent duplicates.');
    const idMap = new Map();
    for (const student of savedStudents) {
      const { data, error: insertError } = await supabase.from('students').insert({ name: student.name, photo: student.photo, contact_number: student.contactNumber, parent_guardian: student.parentGuardian, monthly_fee: student.monthlyFee || 0, schedule: student.schedule, date_enrolled: student.dateEnrolled, notes: student.notes }).select('id').single();
      if (insertError) throw insertError;
      idMap.set(student.id, data.id);
    }
    const oldAttendance = JSON.parse(localStorage.getItem('pimes_attendance') || '[]').map(row => ({ student_id: idMap.get(row.studentId), date: row.date, status: row.status })).filter(row => row.student_id);
    const oldPayments = JSON.parse(localStorage.getItem('pimes_payments') || '[]').map(row => ({ student_id: idMap.get(row.studentId), date: row.date, amount: row.amount, method: row.method, status: row.status, receipt: row.receipt })).filter(row => row.student_id);
    const oldReminders = JSON.parse(localStorage.getItem('pimes_reminders') || '[]').map(row => ({ title: row.title, date: row.date, description: row.description }));
    const oldNotifications = JSON.parse(localStorage.getItem('pimes_notifications') || '[]').map(row => ({ student_id: idMap.get(row.studentId), message: row.message, type: row.type, read: row.read })).filter(row => row.student_id);
    for (const [table, rows] of [['attendance', oldAttendance], ['payments', oldPayments], ['reminders', oldReminders], ['notifications', oldNotifications]]) {
      if (rows.length) { const { error: importError } = await supabase.from(table).insert(rows); if (importError) throw importError; }
    }
    await refresh();
  };

  return <AppContext.Provider value={{ currentUser, students, attendance, payments, reminders, notifications, loading, error, login, logout, addStudent, updateStudent, markAttendance, addPayment, removePayment, addReminder, updateReminder, deleteReminder, addNotification, markNotificationRead, updatePassword, importLocalData, refresh }}>{children}</AppContext.Provider>;
};
export const useAppContext = () => useContext(AppContext);
