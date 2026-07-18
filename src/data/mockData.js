const rawStudents = [
  { id: '1', name: 'Alvarez, Louisa Socorro R.', photo: 'https://ui-avatars.com/api/?name=Louisa+Alvarez&background=random', contactNumber: '0917-000-0001', parentGuardian: 'Mrs. Alvarez', monthlyFee: 2500, schedule: 'Monday 4:00 PM', dateEnrolled: '2026-01-10', notes: '' },
  { id: '2', name: 'Baluyot, Raffy Chino A.', photo: 'https://ui-avatars.com/api/?name=Raffy+Baluyot&background=random', contactNumber: '0917-000-0002', parentGuardian: 'Mr. Baluyot', monthlyFee: 2500, schedule: 'Tuesday 5:00 PM', dateEnrolled: '2026-01-15', notes: '' },
  { id: '3', name: 'Biado, Kiffer Andrae A.', photo: 'https://ui-avatars.com/api/?name=Kiffer+Biado&background=random', contactNumber: '0917-000-0003', parentGuardian: 'Mr. Biado', monthlyFee: 2500, schedule: 'Wednesday 3:00 PM', dateEnrolled: '2026-01-20', notes: '' },
  { id: '4', name: 'Buaya, Franchesca Brielle', photo: 'https://ui-avatars.com/api/?name=Franchesca+Buaya&background=random', contactNumber: '0917-000-0004', parentGuardian: 'Mrs. Buaya', monthlyFee: 2500, schedule: 'Thursday 4:00 PM', dateEnrolled: '2026-01-25', notes: '' },
  { id: '5', name: 'Demegillo, Marie Ysabelle Labassano', photo: 'https://ui-avatars.com/api/?name=Marie+Demegillo&background=random', contactNumber: '0917-000-0005', parentGuardian: 'Mrs. Demegillo', monthlyFee: 2500, schedule: 'Friday 4:00 PM', dateEnrolled: '2026-02-01', notes: '' },
  { id: '6', name: 'Espanola, Xiamara Louise', photo: 'https://ui-avatars.com/api/?name=Xiamara+Espanola&background=random', contactNumber: '0917-000-0006', parentGuardian: 'Mr. Espanola', monthlyFee: 2500, schedule: 'Monday 5:00 PM', dateEnrolled: '2026-02-05', notes: '' },
  { id: '7', name: 'Fusingan, Rain Johanne S.', photo: 'https://ui-avatars.com/api/?name=Rain+Fusingan&background=random', contactNumber: '0917-000-0007', parentGuardian: 'Mrs. Fusingan', monthlyFee: 2500, schedule: 'Tuesday 6:00 PM', dateEnrolled: '2026-02-10', notes: '' },
  { id: '8', name: 'Pantinople, Jessica Reese', photo: 'https://ui-avatars.com/api/?name=Jessica+Pantinople&background=random', contactNumber: '0917-000-0008', parentGuardian: 'Mrs. Pantinople', monthlyFee: 2500, schedule: 'Wednesday 4:00 PM', dateEnrolled: '2026-02-15', notes: '' },
  { id: '9', name: 'Te, Ken Jee Mari', photo: 'https://ui-avatars.com/api/?name=Ken+Te&background=random', contactNumber: '0917-000-0009', parentGuardian: 'Mr. Te', monthlyFee: 2500, schedule: 'Thursday 5:00 PM', dateEnrolled: '2026-02-20', notes: '' },
  { id: '10', name: 'Locsin, Reign Justus U.', photo: 'https://ui-avatars.com/api/?name=Reign+Locsin&background=random', contactNumber: '0917-000-0010', parentGuardian: 'Mrs. Locsin', monthlyFee: 2500, schedule: 'Friday 5:00 PM', dateEnrolled: '2026-02-25', notes: '' },
  { id: '11', name: 'Locsin, Sovran Hari U.', photo: 'https://ui-avatars.com/api/?name=Sovran+Locsin&background=random', contactNumber: '0917-000-0011', parentGuardian: 'Mrs. Locsin', monthlyFee: 2500, schedule: 'Friday 6:00 PM', dateEnrolled: '2026-03-01', notes: '' },
  { id: '12', name: 'Hernani, Luke', photo: 'https://ui-avatars.com/api/?name=Luke+Hernani&background=random', contactNumber: '0917-000-0012', parentGuardian: 'Mr. Hernani', monthlyFee: 2500, schedule: 'Monday 3:00 PM', dateEnrolled: '2026-03-05', notes: '' },
  { id: '13', name: 'Obeso, Ryker Seven', photo: 'https://ui-avatars.com/api/?name=Ryker+Obeso&background=random', contactNumber: '0917-000-0013', parentGuardian: 'Mr. Obeso', monthlyFee: 2500, schedule: 'Tuesday 4:00 PM', dateEnrolled: '2026-03-10', notes: '' },
  { id: '14', name: 'Padapat, Zyle Lord T.', photo: 'https://ui-avatars.com/api/?name=Zyle+Padapat&background=random', contactNumber: '0917-000-0014', parentGuardian: 'Mrs. Padapat', monthlyFee: 2500, schedule: 'Wednesday 5:00 PM', dateEnrolled: '2026-03-15', notes: '' },
  { id: '15', name: 'Sarmiento, Viana Yzabel B.', photo: 'https://ui-avatars.com/api/?name=Viana+Sarmiento&background=random', contactNumber: '0917-000-0015', parentGuardian: 'Mr. Sarmiento', monthlyFee: 2500, schedule: 'Thursday 6:00 PM', dateEnrolled: '2026-03-20', notes: '' },
  { id: '16', name: 'Sonoy, Aquila Ellise', photo: 'https://ui-avatars.com/api/?name=Aquila+Sonoy&background=random', contactNumber: '0917-000-0016', parentGuardian: 'Mrs. Sonoy', monthlyFee: 2500, schedule: 'Saturday 9:00 AM', dateEnrolled: '2026-03-25', notes: '' },
  { id: '17', name: 'Sonoy, Kris Xandria Lou D.', photo: 'https://ui-avatars.com/api/?name=Kris+Sonoy&background=random', contactNumber: '0917-000-0017', parentGuardian: 'Mrs. Sonoy', monthlyFee: 2500, schedule: 'Saturday 10:00 AM', dateEnrolled: '2026-04-01', notes: '' },
  { id: '18', name: 'Te, Victoria Marie', photo: 'https://ui-avatars.com/api/?name=Victoria+Te&background=random', contactNumber: '0917-000-0018', parentGuardian: 'Mr. Te', monthlyFee: 2500, schedule: 'Saturday 11:00 AM', dateEnrolled: '2026-04-05', notes: '' },
  { id: '19', name: 'Tecson, Aniyah', photo: 'https://ui-avatars.com/api/?name=Aniyah+Tecson&background=random', contactNumber: '0917-000-0019', parentGuardian: 'Mrs. Tecson', monthlyFee: 2500, schedule: 'Saturday 1:00 PM', dateEnrolled: '2026-04-10', notes: '' }
];

export const initialStudents = rawStudents.map(student => {
  const nameParts = student.name.split(', ');
  const lastName = nameParts[0].toLowerCase().replace(/\s/g, '');
  const firstNameLetter = nameParts[1] ? nameParts[1].charAt(0).toLowerCase() : 'u';
  const username = `${firstNameLetter}${lastName}`;
  return {
    ...student,
    username,
    password: '123'
  };
});

export const mockAttendance = [
  // A few sample attendance records
  { id: 'a1', studentId: '1', date: '2026-07-15', status: 'Present' },
  { id: 'a2', studentId: '2', date: '2026-07-15', status: 'Present' },
  { id: 'a3', studentId: '3', date: '2026-07-15', status: 'Absent' },
];

export const mockPayments = [
  // A few sample payments
  { id: 'p1', studentId: '1', date: '2026-07-01', amount: 2500, method: 'GCash', status: 'Paid', receipt: 'R-001' },
  { id: 'p2', studentId: '2', date: '2026-07-01', amount: 2500, method: 'Cash', status: 'Paid', receipt: 'R-002' },
  { id: 'p3', studentId: '3', date: '2026-07-01', amount: 1000, method: 'Bank Transfer', status: 'Partial', receipt: 'R-003' }
];
