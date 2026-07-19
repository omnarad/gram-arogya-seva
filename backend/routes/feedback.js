const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { readDb, writeDb } = require('../db');
const { authRequired, requireRole } = require('../middleware');

const router = express.Router();

// POST /api/feedback - patient rates a completed appointment
router.post('/', authRequired, requireRole('patient'), (req, res) => {
  const { appointmentId, rating, comment } = req.body;
  if (!appointmentId || !rating) {
    return res.status(400).json({ error: 'appointmentId and rating are required' });
  }
  const db = readDb();
  const appt = db.appointments.find(a => a.id === appointmentId && a.patientId === req.user.id);
  if (!appt) return res.status(404).json({ error: 'Appointment not found' });

  const entry = {
    id: uuidv4(),
    appointmentId,
    patientId: req.user.id,
    doctorId: appt.doctorId,
    rating: Math.min(5, Math.max(1, Number(rating))),
    comment: comment || '',
    createdAt: new Date().toISOString()
  };
  db.feedback.push(entry);
  writeDb(db);
  res.status(201).json({ feedback: entry });
});

// GET /api/feedback/doctor/:doctorId - public ratings summary for a doctor
router.get('/doctor/:doctorId', (req, res) => {
  const db = readDb();
  const items = db.feedback.filter(f => f.doctorId === req.params.doctorId);
  const avg = items.length ? items.reduce((s, f) => s + f.rating, 0) / items.length : null;
  res.json({ count: items.length, average: avg, feedback: items });
});

module.exports = router;
