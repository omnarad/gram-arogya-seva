const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { readDb, writeDb } = require('../db');
const { JWT_SECRET } = require('../middleware');

const router = express.Router();

function publicUser(u) {
  const { passwordHash, ...rest } = u;
  return rest;
}

function signToken(user) {
  return jwt.sign(
    { id: user.id, role: user.role, name: user.name, email: user.email },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// POST /api/auth/register
router.post('/register', (req, res) => {
  const { role, name, email, password, phone, ...profile } = req.body;

  if (!role || !['patient', 'doctor'].includes(role)) {
    return res.status(400).json({ error: 'Role must be "patient" or "doctor"' });
  }
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email and password are required' });
  }

  const db = readDb();
  const existing = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(409).json({ error: 'An account with this email already exists' });
  }

  const user = {
    id: uuidv4(),
    role,
    name,
    email,
    phone: phone || '',
    passwordHash: bcrypt.hashSync(password, 10),
    createdAt: new Date().toISOString()
  };
  db.users.push(user);

  if (role === 'patient') {
    db.patients.push({
      userId: user.id,
      age: profile.age || null,
      gender: profile.gender || '',
      address: profile.address || ''
    });
  } else {
    db.doctors.push({
      userId: user.id,
      specialization: profile.specialization || 'General Physician',
      qualification: profile.qualification || '',
      experienceYears: profile.experienceYears || 0,
      fee: profile.fee || 0,
      bio: profile.bio || '',
      availability: profile.availability || []
    });
  }

  writeDb(db);
  const token = signToken(user);
  res.status(201).json({ token, user: publicUser(user) });
});

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  const db = readDb();
  const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }
  const token = signToken(user);
  res.json({ token, user: publicUser(user) });
});

// GET /api/auth/me  (used to refresh profile on app load)
router.get('/me', (req, res) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Missing token' });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const db = readDb();
    const user = db.users.find(u => u.id === payload.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user: publicUser(user) });
  } catch (e) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
});

module.exports = router;
