const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { readDb, writeDb } = require('../db');
const { authRequired, requireRole } = require('../middleware');

const router = express.Router();

function enrich(appt, db) {
  const patientUser = db.users.find(u => u.id === appt.patientId);
  const doctorUser = db.users.find(u => u.id === appt.doctorId);
  const doctorProfile = db.doctors.find(d => d.userId === appt.doctorId);
  const prescription = db.prescriptions.find(p => p.appointmentId === appt.id) || null;
  return {
    ...appt,
    patientName: patientUser ? patientUser.name : 'Unknown',
    doctorName: doctorUser ? doctorUser.name : 'Unknown',
    specialization: doctorProfile ? doctorProfile.specialization : '',
    prescription
  };
}

// POST /api/appointments - patient books an appointment
router.post('/', authRequired, requireRole('patient'), (req, res) => {
  const { doctorId, date, time, reason } = req.body;
  if (!doctorId || !date || !time) {
    return res.status(400).json({ error: 'doctorId, date and time are required' });
  }
  const db = readDb();
  const doctor = db.doctors.find(d => d.userId === doctorId);
  if (!doctor) return res.status(404).json({ error: 'Doctor not found' });

  const appt = {
    id: uuidv4(),
    patientId: req.user.id,
    doctorId,
    date,
    time,
    reason: reason || '',
    status: 'pending', // pending -> accepted/rejected -> completed
    createdAt: new Date().toISOString()
  };
  db.appointments.push(appt);
  writeDb(db);
  res.status(201).json({ appointment: enrich(appt, db) });
});

// GET /api/appointments/mine - role-aware list for the logged-in user
router.get('/mine', authRequired, (req, res) => {
  const db = readDb();
  const list = db.appointments
    .filter(a => req.user.role === 'patient' ? a.patientId === req.user.id : a.doctorId === req.user.id)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .map(a => enrich(a, db));
  res.json({ appointments: list });
});

// PUT /api/appointments/:id/status - doctor accepts/rejects/completes
router.put('/:id/status', authRequired, requireRole('doctor'), (req, res) => {
  const { status } = req.body;
  if (!['accepted', 'rejected', 'completed'].includes(status)) {
    return res.status(400).json({ error: 'status must be accepted, rejected or completed' });
  }
  const db = readDb();
  const idx = db.appointments.findIndex(a => a.id === req.params.id && a.doctorId === req.user.id);
  if (idx === -1) return res.status(404).json({ error: 'Appointment not found' });

  db.appointments[idx].status = status;
  writeDb(db);
  res.json({ appointment: enrich(db.appointments[idx], db) });
});

module.exports = router;
