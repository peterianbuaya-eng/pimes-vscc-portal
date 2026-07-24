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
    const { data: profile, error: profileError } = await supabase.from('profiles').select('role, student_id, username, must_change_password, contact_email').eq('id', user.id).single();
    if (profileError) throw profileError;
    setCurrentUser({
      id: profile.student_id,
      authId: user.id,
      role: profile.role,
      email: user.email,
      username: profile.username,
      mustChangePassword: profile.must_change_password,
      contactEmail: profile.contact_email
    });
    const promises = [
      supabase.from('students').select('*').order('name'),
      supabase.from('attendance').select('*').order('date', { ascending: false }),
      supabase.from('payments').select('*').order('date', { ascending: false }),
      supabase.from('reminders').select('*').order('date'),
      supabase.from('notifications').select('*').order('created_at', { ascending: false })
    ];
    if (profile.role === 'admin') {
      promises.push(supabase.from('profiles').select('*'));
    }
    const results = await Promise.all(promises);
    const resultError = results.find(result => result.error)?.error;
    if (resultError) throw resultError;

    const [studentsResult, attendanceResult, paymentsResult, remindersResult, notificationsResult, profilesResult] = results;
    const profilesMap = new Map();
    if (profile.role === 'admin' && profilesResult?.data) {
      profilesResult.data.forEach(p => {
        if (p.student_id) profilesMap.set(p.student_id, p);
      });
    }

    setStudents(studentsResult.data.map(row => {
      const studentObj = toStudent(row);
      const prof = profilesMap.get(row.id);
      if (prof) {
        studentObj.username = prof.username;
        studentObj.hasAccount = true;
        studentObj.mustChangePassword = prof.must_change_password;
        studentObj.accountEmail = prof.contact_email;
      } else {
        studentObj.hasAccount = false;
      }
      return studentObj;
    }));
    setAttendance(attendanceResult.data.map(toAttendance));
    setPayments(paymentsResult.data.map(toPayment));
    setReminders(remindersResult.data);
    setNotifications(notificationsResult.data.map(toNotification));

    // Auto-create 1st of the month payment reminder if missing for admin
    if (profile.role === 'admin') {
      const todayStr = new Date().toISOString().slice(0, 7);
      const firstOfMonthDate = `${todayStr}-01`;
      const monthName = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
      const hasFirstOfMonthReminder = remindersResult.data?.some(r => r.date === firstOfMonthDate && r.title.includes('Tuition'));
      if (!hasFirstOfMonthReminder) {
        await supabase.from('reminders').insert({
          title: `Monthly Tuition Payment Due (${monthName})`,
          date: firstOfMonthDate,
          description: `Friendly reminder: Monthly tuition fee is due on the 1st of the month. Please settle in class or upload your GCash receipt in the portal.`
        });
      }
    }
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

  const login = async (emailOrUsername, password) => {
    const email = emailOrUsername.includes('@')
      ? emailOrUsername
      : `${emailOrUsername.toLowerCase().trim()}@students.pimes.local`;
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
  const updatePaymentStatus = (id, status) => write(supabase.from('payments').update({ status }).eq('id', id));
  const removePayment = id => write(supabase.from('payments').delete().eq('id', id));
  const addReminder = reminder => write(supabase.from('reminders').insert({ title: reminder.title, date: reminder.date, description: reminder.description }));
  const updateReminder = (id, reminder) => write(supabase.from('reminders').update({ title: reminder.title, date: reminder.date, description: reminder.description }).eq('id', id));
  const deleteReminder = id => write(supabase.from('reminders').delete().eq('id', id));
  const addNotification = (studentId, message, type = 'warning') => write(supabase.from('notifications').insert({ student_id: studentId, message, type }));
  const markNotificationRead = id => write(supabase.from('notifications').update({ read: true }).eq('id', id));
  const updatePassword = password => supabase.auth.updateUser({ password });

  const createStudentWithAccount = async (student, username) => {
    const { data, error: functionError } = await supabase.functions.invoke('create-student-account', {
      body: { student, username }
    });
    if (functionError) throw functionError;
    if (data.error) throw new Error(data.error);
    await refresh();
    return data;
  };

  const completeStudentSetup = async (email, password) => {
    const { error: passwordError } = await supabase.auth.updateUser({ password });
    if (passwordError) throw passwordError;
    const { error: rpcError } = await supabase.rpc('complete_student_setup', { student_email: email });
    if (rpcError) throw rpcError;
    await refresh();
  };

  const broadcastMonthlyPaymentReminders = async () => {
    const today = new Date();
    const currentMonthPrefix = today.toISOString().slice(0, 7);
    const firstOfMonthDate = `${currentMonthPrefix}-01`;
    const monthName = today.toLocaleString('default', { month: 'long', year: 'numeric' });

    const { data: currentReminders } = await supabase.from('reminders').select('*');
    const existingReminder = currentReminders?.find(r => r.date === firstOfMonthDate && r.title.includes('Tuition'));
    if (!existingReminder) {
      await supabase.from('reminders').insert({
        title: `Monthly Tuition Payment Due (${monthName})`,
        date: firstOfMonthDate,
        description: `Friendly reminder: Monthly tuition fee is due on the 1st of the month. Please settle in class or upload your GCash receipt in the portal.`
      });
    }

    const paidStudentIds = new Set(
      payments
        .filter(p => p.date.startsWith(currentMonthPrefix) && (p.status === 'Paid' || p.status === 'Partial'))
        .map(p => p.studentId)
    );

    const unpaidStudents = students.filter(s => !paidStudentIds.has(s.id));

    if (unpaidStudents.length > 0) {
      const notificationRows = unpaidStudents.map(s => ({
        student_id: s.id,
        message: `Payment Reminder: Your monthly tuition fee for ${monthName} (₱${(s.monthlyFee || 0).toLocaleString()}) is due today (1st of the month). Please settle via Cash or upload your GCash receipt.`,
        type: 'warning'
      }));
      await supabase.from('notifications').insert(notificationRows);
    }

    await refresh();
    return unpaidStudents.length;
  };

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

  const import2026PdfRoster = async () => {
    if (students.length) throw new Error('The shared student list is not empty. This import is locked to prevent duplicate records.');
    const roster = [
      ['Alvarez, Louisa Socorro R.', ['01','02','03','04','05']], ['Baluyot, Raffy Chino A.', ['01','02','03','04','05']],
      ['Biado, Kiffer Andrae A.', ['01','02','03']], ['Buaya, Franchesca Brielle', ['01','02','03','04']],
      ['Demegillo, Marie Ysabelle Labassano', ['01','02','03','04','05']], ['Espanola, Xiamara Louise', ['01','02','03','04','05']],
      ['Fusingan, Rain Johanne S.', ['01','02','03','04','05']], ['Pantinople, Jessica Reese', ['01','02','03','04']],
      ['Te, Ken Jee Mari', ['01','02','03','04','05']], ['Locsin, Reign Justus U.', ['01','02','03','04']],
      ['Locsin, Sovran Hari U.', ['01','02','03','04']], ['Hernani, Luke', ['01','02']],
      ['Obeso, Ryker Seven', ['01','02','03','04']], ['Padapat, Zyle Lord T.', ['01','02','03']],
      ['Sarmiento, Viana Yzabel B.', ['01','02','03','04','05']], ['Sonoy, Aquila Ellise', ['01','02','03','04','05']],
      ['Sonoy, Kris Xandria Lou D.', ['01','02','03','04','05']], ['Te, Victoria Marie', ['01','02','03','04','05']],
      ['Tecson, Aniyah', ['01','02','03','04']]
    ];
    const paymentRows = [];
    for (const [name, paidMonths] of roster) {
      const { data, error: insertError } = await supabase.from('students').insert({ name, monthly_fee: 2500, date_enrolled: '2026-01-01' }).select('id').single();
      if (insertError) throw insertError;
      paidMonths.forEach(month => paymentRows.push({ student_id: data.id, date: `2026-${month}-01`, amount: 2500, method: 'Imported from 2026 VSCC sheet', status: 'Paid', receipt: `VSCC-2026-${month}` }));
    }
    const { error: paymentError } = await supabase.from('payments').insert(paymentRows);
    if (paymentError) throw paymentError;
    await refresh();
  };

  return <AppContext.Provider value={{ currentUser, students, attendance, payments, reminders, notifications, loading, error, login, logout, addStudent, updateStudent, markAttendance, addPayment, updatePaymentStatus, removePayment, addReminder, updateReminder, deleteReminder, addNotification, markNotificationRead, updatePassword, importLocalData, import2026PdfRoster, refresh, createStudentWithAccount, completeStudentSetup, broadcastMonthlyPaymentReminders }}>{children}</AppContext.Provider>;
};
export const useAppContext = () => useContext(AppContext);
