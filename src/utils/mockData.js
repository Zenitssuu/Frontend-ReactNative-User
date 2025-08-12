// // Mock doctors data
// export const mockDoctor = {
//   id: '1',
//   name: 'Dr. Sarah Johnson',
//   email: 'sarah.johnson@example.com',
//   phone: '+1 (555) 123-4567',
//   avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
//   specialty: 'Cardiologist',
//   experience: '12 years',
//   bio: 'Board-certified cardiologist with over a decade of experience specializing in cardiac electrophysiology and interventional procedures. Graduate of Johns Hopkins School of Medicine.',
//   address: '123 Medical Plaza, New York, NY',
//   rating: 4.9,
//   totalPatients: 1482,
//   totalAppointments: 10250,
//   averageRating: 4.9,
//   licenseNumber: 'NY12345678',
//   nmcNumber: 'NMC-2010-25476',
// };

// // Generate a list of mock patients
// export const mockPatients = [
//   {
//     id: 'pat-001',
//     name: 'John Smith',
//     age: 45,
//     gender: 'Male',
//     avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
//     phone: '+1 (555) 234-5678',
//     email: 'john.smith@example.com',
//     bloodGroup: 'A+',
//     allergies: ['Penicillin', 'Shellfish'],
//     medicalHistory: ['Hypertension', 'Type 2 Diabetes'],
//     firstVisit: '2023-01-15',
//   },
//   {
//     id: 'pat-002',
//     name: 'Emily Wilson',
//     age: 32,
//     gender: 'Female',
//     avatar: 'https://randomuser.me/api/portraits/women/28.jpg',
//     phone: '+1 (555) 345-6789',
//     email: 'emily.wilson@example.com',
//     bloodGroup: 'O-',
//     allergies: ['Pollen'],
//     medicalHistory: ['Asthma'],
//     firstVisit: '2023-02-20',
//   },
//   {
//     id: 'pat-003',
//     name: 'David Chen',
//     age: 58,
//     gender: 'Male',
//     avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
//     phone: '+1 (555) 456-7890',
//     email: 'david.chen@example.com',
//     bloodGroup: 'B+',
//     allergies: ['Nuts'],
//     medicalHistory: ['High Cholesterol', 'Arthritis'],
//     firstVisit: '2023-03-10',
//   },
//   {
//     id: 'pat-004',
//     name: 'Lisa Rodriguez',
//     age: 29,
//     gender: 'Female',
//     avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
//     phone: '+1 (555) 567-8901',
//     email: 'lisa.rodriguez@example.com',
//     bloodGroup: 'AB+',
//     allergies: [],
//     medicalHistory: ['Anxiety'],
//     firstVisit: '2023-04-05',
//   },
//   {
//     id: 'pat-005',
//     name: 'Michael Taylor',
//     age: 52,
//     gender: 'Male',
//     avatar: 'https://randomuser.me/api/portraits/men/62.jpg',
//     phone: '+1 (555) 678-9012',
//     email: 'michael.taylor@example.com',
//     bloodGroup: 'A-',
//     allergies: ['Sulfa Drugs'],
//     medicalHistory: ['GERD', 'Sleep Apnea'],
//     firstVisit: '2023-05-17',
//   },
// ];

// // Create appointment statuses
// const APPOINTMENT_STATUS = {
//   PENDING: 'pending',
//   CONFIRMED: 'confirmed',
//   COMPLETED: 'completed',
//   CANCELLED: 'cancelled',
// };

// // Generate today's date and a few relative dates
// const today = moment().format(APP_CONSTANTS.DATE_FORMAT);
// const yesterday = moment().subtract(1, 'day').format(APP_CONSTANTS.DATE_FORMAT);
// const tomorrow = moment().add(1, 'day').format(APP_CONSTANTS.DATE_FORMAT);
// const nextWeek = moment().add(7, 'day').format(APP_CONSTANTS.DATE_FORMAT);
// const lastWeek = moment().subtract(7, 'day').format(APP_CONSTANTS.DATE_FORMAT);
// const lastMonth = moment().subtract(30, 'day').format(APP_CONSTANTS.DATE_FORMAT);

// // Generate appointment requests
// export const mockAppointmentRequests = [
//   {
//     id: '101',
//     patient: {
//       id: '106',
//       name: 'Thomas Wilson',
//       age: 58,
//       gender: 'Male',
//       avatar: 'https://randomuser.me/api/portraits/men/62.jpg',
//       phone: '+1 (555) 789-0123',
//     },
//     requestedDate: moment().add(3, 'days').format('YYYY-MM-DD'),
//     requestedTime: '10:00',
//     type: 'In-Person',
//     reason: 'Shortness of breath after minimal exertion',
//     notes: 'Long history of smoking, quit 2 years ago',
//     requestedOn: moment().subtract(1, 'days').format('YYYY-MM-DD'),
//   },
//   {
//     id: '102',
//     patient: {
//       id: '107',
//       name: 'Olivia Martinez',
//       age: 42,
//       gender: 'Female',
//       avatar: 'https://randomuser.me/api/portraits/women/52.jpg',
//       phone: '+1 (555) 890-1234',
//     },
//     requestedDate: moment().add(4, 'days').format('YYYY-MM-DD'),
//     requestedTime: '14:00',
//     type: 'Video',
//     reason: 'Heart palpitations during exercise',
//     notes: 'Family history of arrhythmias',
//     requestedOn: moment().subtract(2, 'days').format('YYYY-MM-DD'),
//   },
//   {
//     id: '103',
//     patient: {
//       id: '108',
//       name: 'William Anderson',
//       age: 75,
//       gender: 'Male',
//       avatar: 'https://randomuser.me/api/portraits/men/72.jpg',
//       phone: '+1 (555) 901-2345',
//     },
//     requestedDate: moment().add(5, 'days').format('YYYY-MM-DD'),
//     requestedTime: '11:30',
//     type: 'In-Person',
//     reason: 'Follow-up after heart attack',
//     notes: 'Suffered a mild heart attack 6 weeks ago',
//     requestedOn: moment().subtract(1, 'days').format('YYYY-MM-DD'),
//   },
// ];

// // Generate appointments for various dates
// export const mockAppointments = [
//   // Today's appointments
//   {
//     id: '1',
//     patient: {
//       id: '101',
//       name: 'Robert Smith',
//       age: 45,
//       gender: 'Male',
//       avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
//       phone: '+1 (555) 234-5678',
//     },
//     date: today,
//     time: '09:00',
//     duration: 30, // in minutes
//     type: 'In-Person',
//     status: 'confirmed',
//     reason: 'Chest pain and shortness of breath',
//     notes: 'Patient has a history of hypertension',
//   },
//   {
//     id: '2',
//     patient: {
//       id: '102',
//       name: 'Emily Johnson',
//       age: 35,
//       gender: 'Female',
//       avatar: 'https://randomuser.me/api/portraits/women/32.jpg',
//       phone: '+1 (555) 345-6789',
//     },
//     date: today,
//     time: '11:30',
//     duration: 30, // in minutes
//     type: 'Video',
//     status: 'confirmed',
//     reason: 'Follow-up after medication change',
//     notes: 'Increased dosage of lisinopril last month',
//   },
//   {
//     id: '3',
//     patient: {
//       id: '103',
//       name: 'Michael Davis',
//       age: 52,
//       gender: 'Male',
//       avatar: 'https://randomuser.me/api/portraits/men/42.jpg',
//       phone: '+1 (555) 456-7890',
//     },
//     date: today,
//     time: '10:00',
//     duration: 45, // in minutes
//     type: 'In-Person',
//     status: 'confirmed',
//     reason: 'Annual cardiac checkup',
//     notes: 'Previous heart valve surgery 3 years ago',
//   },

//   // Upcoming appointments
//   {
//     id: '4',
//     patient: {
//       id: '104',
//       name: 'Jessica Williams',
//       age: 29,
//       gender: 'Female',
//       avatar: 'https://randomuser.me/api/portraits/women/42.jpg',
//       phone: '+1 (555) 567-8901',
//     },
//     date: tomorrow,
//     time: '14:30',
//     duration: 30, // in minutes
//     type: 'Video',
//     status: 'confirmed',
//     reason: 'Palpitations and dizziness',
//     notes: 'No previous heart conditions',
//   },
//   {
//     id: '5',
//     patient: {
//       id: '105',
//       name: 'David Brown',
//       age: 67,
//       gender: 'Male',
//       avatar: 'https://randomuser.me/api/portraits/men/52.jpg',
//       phone: '+1 (555) 678-9012',
//     },
//     date: tomorrow,
//     time: '09:30',
//     duration: 30, // in minutes
//     type: 'In-Person',
//     status: 'confirmed',
//     reason: 'Chest pain evaluation',
//     notes: 'History of coronary artery disease',
//   },
//   {
//     id: 'appt-006',
//     patientId: 'pat-002',
//     patientName: 'Emily Wilson',
//     patientAvatar: 'https://randomuser.me/api/portraits/women/28.jpg',
//     date: nextWeek,
//     time: '11:00',
//     duration: 30,
//     reason: 'Allergy shot',
//     status: APPOINTMENT_STATUS.CONFIRMED,
//   },

//   // Previous appointments
//   {
//     id: 'appt-007',
//     patientId: 'pat-003',
//     patientName: 'David Chen',
//     patientAvatar: 'https://randomuser.me/api/portraits/men/45.jpg',
//     date: lastWeek,
//     time: '14:00',
//     duration: 30,
//     reason: 'Arthritis check',
//     status: APPOINTMENT_STATUS.COMPLETED,
//     notes: 'Patient reports improvement with new medication. Continue current treatment.',
//   },
//   {
//     id: 'appt-008',
//     patientId: 'pat-001',
//     patientName: 'John Smith',
//     patientAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
//     date: lastMonth,
//     time: '09:30',
//     duration: 30,
//     reason: 'Blood pressure check',
//     status: APPOINTMENT_STATUS.COMPLETED,
//     notes: 'Blood pressure elevated. Adjusted medication dosage.',
//   }
// ];

// // Generate ongoing treatment sessions
// export const mockOngoingTreatments = [
//   {
//     id: 'treat-001',
//     patientId: 'pat-001',
//     patientName: 'John Smith',
//     patientAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
//     startDate: lastMonth,
//     diagnosis: 'Hypertension, Diabetes Type 2',
//     status: 'active',
//     nextAppointment: {
//       date: tomorrow,
//       time: '10:00'
//     },
//     totalSessions: 3,
//     completedSessions: 2,
//   },
//   {
//     id: 'treat-002',
//     patientId: 'pat-004',
//     patientName: 'Lisa Rodriguez',
//     patientAvatar: 'https://randomuser.me/api/portraits/women/65.jpg',
//     startDate: lastWeek,
//     diagnosis: 'Generalized Anxiety Disorder',
//     status: 'active',
//     nextAppointment: {
//       date: tomorrow,
//       time: '15:30'
//     },
//     totalSessions: 6,
//     completedSessions: 1,
//   },
//   {
//     id: 'treat-003',
//     patientId: 'pat-002',
//     patientName: 'Emily Wilson',
//     patientAvatar: 'https://randomuser.me/api/portraits/women/28.jpg',
//     startDate: lastWeek,
//     diagnosis: 'Allergic Rhinitis, Mild Asthma',
//     status: 'active',
//     nextAppointment: {
//       date: today,
//       time: '09:00'
//     },
//     totalSessions: 4,
//     completedSessions: 1,
//   },
// ];

// // Generate prescriptions
// export const mockPrescriptions = [
//   {
//     id: '1',
//     patientId: '101',
//     patientName: 'Robert Smith',
//     medications: [
//       {
//         name: 'Lisinopril',
//         dosage: '10mg',
//         frequency: 'Once daily',
//         duration: '30 days',
//         instructions: 'Take in the morning with water',
//       },
//       {
//         name: 'Aspirin',
//         dosage: '81mg',
//         frequency: 'Once daily',
//         duration: '30 days',
//         instructions: 'Take with food',
//       },
//     ],
//     date: moment().subtract(2, 'days').format('YYYY-MM-DD'),
//     notes: 'Follow up in 1 month',
//   },
//   {
//     id: '2',
//     patientId: '102',
//     patientName: 'Emily Johnson',
//     medications: [
//       {
//         name: 'Atorvastatin',
//         dosage: '20mg',
//         frequency: 'Once daily',
//         duration: '90 days',
//         instructions: 'Take at bedtime',
//       },
//     ],
//     date: moment().subtract(5, 'days').format('YYYY-MM-DD'),
//     notes: 'Check cholesterol levels in 3 months',
//   },
//   {
//     id: 'pres-003',
//     patientId: 'pat-002',
//     patientName: 'Emily Wilson',
//     date: lastWeek,
//     medications: [
//       { name: 'Fluticasone', dosage: '50mcg', frequency: '2 sprays each nostril daily', duration: '30 days' },
//       { name: 'Albuterol', dosage: '90mcg', frequency: '2 puffs as needed for shortness of breath', duration: '30 days' },
//     ],
//     instructions: 'Use fluticasone daily even when symptoms improve. Use albuterol for acute symptoms.',
//     followUp: '1 month',
//     doctorNotes: 'Patient to avoid known allergens. Consider allergy testing at next visit.',
//   },
// ];

// // Generate medical reports
// export const mockReports = [
//   {
//     id: '1',
//     patientId: '101',
//     patientName: 'Robert Smith',
//     type: 'ECG',
//     date: moment().subtract(7, 'days').format('YYYY-MM-DD'),
//     result: 'Normal sinus rhythm',
//     file: 'report1.pdf',
//     notes: 'No abnormalities detected',
//   },
//   {
//     id: '2',
//     patientId: '103',
//     patientName: 'Michael Davis',
//     type: 'Echocardiogram',
//     date: moment().subtract(14, 'days').format('YYYY-MM-DD'),
//     result: 'Mild aortic regurgitation',
//     file: 'report2.pdf',
//     notes: 'Follow up in 6 months',
//   },
//   {
//     id: 'rep-001',
//     patientId: 'pat-001',
//     patientName: 'John Smith',
//     date: lastMonth,
//     type: 'Blood Test',
//     results: [
//       { name: 'HbA1c', value: '7.2%', normalRange: '4.0-5.6%', status: 'high' },
//       { name: 'Blood Pressure', value: '145/90 mmHg', normalRange: '120/80 mmHg', status: 'high' },
//       { name: 'Cholesterol', value: '210 mg/dL', normalRange: '<200 mg/dL', status: 'high' },
//       { name: 'HDL', value: '45 mg/dL', normalRange: '>40 mg/dL', status: 'normal' },
//       { name: 'LDL', value: '130 mg/dL', normalRange: '<100 mg/dL', status: 'high' },
//     ],
//     summary: 'Values indicate poorly controlled diabetes and hypertension.',
//     fileUrl: 'https://example.com/reports/bloodtest-pat001.pdf',
//   },
//   {
//     id: 'rep-002',
//     patientId: 'pat-002',
//     patientName: 'Emily Wilson',
//     date: lastMonth,
//     type: 'Pulmonary Function Test',
//     results: [
//       { name: 'FEV1', value: '78%', normalRange: '>80%', status: 'low' },
//       { name: 'FVC', value: '85%', normalRange: '>80%', status: 'normal' },
//       { name: 'FEV1/FVC', value: '0.75', normalRange: '>0.75', status: 'normal' },
//     ],
//     summary: 'Mild airflow limitation consistent with mild asthma.',
//     fileUrl: 'https://example.com/reports/pft-pat002.pdf',
//   },
//   {
//     id: 'rep-003',
//     patientId: 'pat-003',
//     patientName: 'David Chen',
//     date: lastMonth,
//     type: 'Lipid Panel',
//     results: [
//       { name: 'Cholesterol', value: '245 mg/dL', normalRange: '<200 mg/dL', status: 'high' },
//       { name: 'HDL', value: '38 mg/dL', normalRange: '>40 mg/dL', status: 'low' },
//       { name: 'LDL', value: '165 mg/dL', normalRange: '<100 mg/dL', status: 'high' },
//       { name: 'Triglycerides', value: '190 mg/dL', normalRange: '<150 mg/dL', status: 'high' },
//     ],
//     summary: 'Elevated lipid levels with increased cardiovascular risk.',
//     fileUrl: 'https://example.com/reports/lipid-pat003.pdf',
//   },
// ];

// Generate advertisements for dashboard banner
export const mockAdvertisements = [
  {
    id: "1",
    title: "New Medical Equipment Sale",
    image:
      "https://images.unsplash.com/photo-1581595219315-a187dd40c322?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    link: "https://example.com/medical-equipment",
    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  },
  {
    id: "2",
    title: "Medical Conference 2023",
    image:
      "https://images.unsplash.com/photo-1576089172869-4f5f6f315620?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    link: "https://example.com/conference",
    expiryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  },
  {
    id: "3",
    title: "New Research Collaboration Opportunity",
    image:
      "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    link: "https://example.com/research",
    expiryDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  },
];

// Export statuses as constants
// export const STATUSES = {
//   APPOINTMENT: APPOINTMENT_STATUS,
// };

// Statistics for dashboard
export const mockStatistics = {
  todayAppointments: 8,
  pendingRequests: 5,
  completedToday: 4,
  cancelledToday: 1,
  totalPatients: 1482,
  newPatientsThisMonth: 27,
  totalAppointmentsThisMonth: 142,
  revenue: {
    today: 1200,
    thisWeek: 7800,
    thisMonth: 32000,
  },
};
