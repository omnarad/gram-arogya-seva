// Lightweight file-based JSON "database".
// Chosen instead of a native SQL driver so the project runs anywhere with
// just `npm install && npm start` - no external DB server, no native builds.
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

const DEFAULT_SHAPE = {
  users: [],        // { id, role, name, email, passwordHash, phone, createdAt }
  patients: [],      // { userId, age, gender, address }
  doctors: [],        // { userId, specialization, qualification, experienceYears, fee, bio, availability: [{day, slots:[]}] }
  appointments: [],    // { id, patientId, doctorId, date, time, status, reason, createdAt }
  prescriptions: [],   // { id, appointmentId, medicines, notes, createdAt }
  feedback: []         // { id, appointmentId, patientId, doctorId, rating, comment, createdAt }
};

function ensureDb() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(DEFAULT_SHAPE, null, 2));
  }
}

function readDb() {
  ensureDb();
  const raw = fs.readFileSync(DB_FILE, 'utf-8');
  try {
    return JSON.parse(raw);
  } catch (e) {
    return JSON.parse(JSON.stringify(DEFAULT_SHAPE));
  }
}

function writeDb(data) {
  ensureDb();
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

module.exports = { readDb, writeDb };
