const express = require('express');
const { readDb, writeDb } = require('../db');
const { authRequired, requireRole } = require('../middleware');

const router = express.Router();

function toPublicDoctor(doctorProfile, user) {
  return {
    userId: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    specialization: doctorProfile.specialization,
    qualification: doctorProfile.qualification,
    experienceYears: doctorProfile.experienceYears,
    fee: doctorProfile.fee,
    bio: doctorProfile.bio,
    availability: doctorProfile.availability
  };
}

// GET /api/doctors?search=&specialization=
router.get('/', (req, res) => {
  const db = readDb();
  const { search = '', specialization = '' } = req.query;

  let list = db.doctors.map(d => {
    const user = db.users.find(u => u.id === d.userId);
    return user ? toPublicDoctor(d, user) : null;
  }).filter(Boolean);

  if (search) {
    const s = search.toLowerCase();
    list = list.filter(d =>
      d.name.toLowerCase().includes(s) ||
      d.specialization.toLowerCase().includes(s)
    );
  }
  if (specialization) {
    list = list.filter(d => d.specialization.toLowerCase() === specialization.toLowerCase());
  }

  res.json({ doctors: list });
});

// GET /api/doctors/specializations - distinct list for filter dropdown
router.get('/specializations', (req, res) => {
  const db = readDb();
  const set = new Set(db.doctors.map(d => d.specialization).filter(Boolean));
  res.json({ specializations: Array.from(set) });
});

// GET /api/doctors/:userId
router.get('/:userId', (req, res) => {
  const db = readDb();
  const d = db.doctors.find(d => d.userId === req.params.userId);
  if (!d) return res.status(404).json({ error: 'Doctor not found' });
  const user = db.users.find(u => u.id === d.userId);
  res.json({ doctor: toPublicDoctor(d, user) });
});

// PUT /api/doctors/me - doctor updates own profile/availability
router.put('/me/profile', authRequired, requireRole('doctor'), (req, res) => {
  const db = readDb();
  const idx = db.doctors.findIndex(d => d.userId === req.user.id);
  if (idx === -1) return res.status(404).json({ error: 'Doctor profile not found' });

  const { specialization, qualification, experienceYears, fee, bio, availability } = req.body;
  db.doctors[idx] = {
    ...db.doctors[idx],
    ...(specialization !== undefined && { specialization }),
    ...(qualification !== undefined && { qualification }),
    ...(experienceYears !== undefined && { experienceYears }),
    ...(fee !== undefined && { fee }),
    ...(bio !== undefined && { bio }),
    ...(availability !== undefined && { availability })
  };
  writeDb(db);
  res.json({ doctor: db.doctors[idx] });
});

module.exports = router;
