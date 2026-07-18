import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialStudents, mockAttendance, mockPayments } from '../data/mockData';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem('pimes_students');
    const parsed = saved ? JSON.parse(saved) : initialStudents;
    // ensure old students get username/password if they don't have it
    return parsed.map(s => {
      if (s.username) return s;
      const nameParts = s.name.split(', ');
      const lastName = nameParts[0].toLowerCase().replace(/\s/g, '');
      const firstNameLetter = nameParts[1] ? nameParts[1].charAt(0).toLowerCase() : 'u';
      return { ...s, username: `${firstNameLetter}${lastName}`, password: '123' };
    });
  });

  const [adminCreds, setAdminCreds] = useState(() => {
    const saved = localStorage.getItem('pimes_admin_creds');
    return saved ? JSON.parse(saved) : { username: 'admin', password: 'admin123' };
  });

  const [attendance, setAttendance] = useState(() => {
    const saved = localStorage.getItem('pimes_attendance');
    return saved ? JSON.parse(saved) : mockAttendance;
  });

  const [payments, setPayments] = useState(() => {
    const saved = localStorage.getItem('pimes_payments');
    return saved ? JSON.parse(saved) : mockPayments;
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('pimes_user');
    return saved ? JSON.parse(saved) : null; // { role: 'admin' | 'student', id?: string }
  });

  const [reminders, setReminders] = useState(() => {
    const saved = localStorage.getItem('pimes_reminders');
    return saved ? JSON.parse(saved) : [
      { id: 'r1', title: 'Recital Prep', date: '2026-07-25', description: 'Mandatory rehearsal for all students.' }
    ];
  });

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('pimes_notifications');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('pimes_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('pimes_attendance', JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    localStorage.setItem('pimes_payments', JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem('pimes_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('pimes_reminders', JSON.stringify(reminders));
  }, [reminders]);

  useEffect(() => {
    localStorage.setItem('pimes_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('pimes_admin_creds', JSON.stringify(adminCreds));
  }, [adminCreds]);

  const addStudent = (student) => {
    setStudents([...students, { ...student, id: Date.now().toString() }]);
  };

  const updateStudent = (id, updatedData) => {
    setStudents(students.map(s => s.id === id ? { ...s, ...updatedData } : s));
  };

  const updateAdminCredentials = (username, password) => {
    setAdminCreds({ username, password });
  };

  const markAttendance = (studentId, date, status) => {
    setAttendance([...attendance, { id: Date.now().toString(), studentId, date, status }]);
  };

  const addPayment = (payment) => {
    setPayments([...payments, { ...payment, id: Date.now().toString() }]);
  };

  const removePayment = (paymentId) => {
    setPayments(payments.filter(p => p.id !== paymentId));
  };

  const login = (role, username, password) => {
    if (role === 'admin') {
      if (username === adminCreds.username && password === adminCreds.password) {
        setCurrentUser({ role, id: null });
        return true;
      }
      return false;
    } else {
      const student = students.find(s => s.username === username && s.password === password);
      if (student) {
        setCurrentUser({ role: 'student', id: student.id });
        return true;
      }
      return false;
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const addReminder = (reminder) => {
    setReminders([...reminders, { ...reminder, id: Date.now().toString() }]);
  };

  const updateReminder = (id, updatedData) => {
    setReminders(reminders.map(r => r.id === id ? { ...r, ...updatedData } : r));
  };

  const deleteReminder = (id) => {
    setReminders(reminders.filter(r => r.id !== id));
  };

  const addNotification = (studentId, message, type = 'warning') => {
    setNotifications([...notifications, { id: Date.now().toString(), studentId, message, type, read: false }]);
  };

  const markNotificationRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <AppContext.Provider value={{
      currentUser, login, logout,
      adminCreds, updateAdminCredentials,
      students, addStudent, updateStudent,
      attendance, markAttendance,
      payments, addPayment, removePayment,
      reminders, addReminder, updateReminder, deleteReminder,
      notifications, addNotification, markNotificationRead
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
