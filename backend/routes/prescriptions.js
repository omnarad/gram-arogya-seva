const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { readDb, writeDb } = require('../db');
const { authRequired, requireRole } = require('../middleware');

const router = express.Router();

// POST /api/prescriptions - doctor generates a digital prescription for an appointment
router.post('/', authRequired, requireRole('doctor'), (req, res) => {
  const { appointmentId, medicines, notes } = req.body;
  if (!appointmentId || !medicines) {
    return res.status(400).json({ error: 'appointmentId and medicines are required' });
  }
  const db = readDb();
  const appt = db.appointments.find(a => a.id === appointmentId && a.doctorId === req.user.id);
  if (!appt) return res.status(404).json({ error: 'Appointment not found' });

  const existingIdx = db.prescriptions.findIndex(p => p.appointmentId === appointmentId);
  const prescription = {
    id: existingIdx > -1 ? db.prescriptions[existingIdx].id : uuidv4(),
    appointmentId,
    medicines, // array of { name, dosage, frequency, duration }
    notes: notes || '',
    createdAt: new Date().toISOString()
  };

  if (existingIdx > -1) db.prescriptions[existingIdx] = prescription;
  else db.prescriptions.push(prescription);

  appt.status = 'completed';
  writeDb(db);
  res.status(201).json({ prescription });
});

// GET /api/prescriptions/:appointmentId
router.get('/:appointmentId', authRequired, (req, res) => {
  const db = readDb();
  const appt = db.appointments.find(a => a.id === req.params.appointmentId);
  if (!appt) return res.status(404).json({ error: 'Appointment not found' });
  if (appt.patientId !== req.user.id && appt.doctorId !== req.user.id) {
    return res.status(403).json({ error: 'Not authorized to view this prescription' });
  }
  const prescription = db.prescriptions.find(p => p.appointmentId === req.params.appointmentId);
  if (!prescription) return res.status(404).json({ error: 'No prescription yet for this appointment' });
  res.json({ prescription });
});

module.exports = router;
