# GRAM Arogya Seva

A telemedicine portal connecting rural patients with doctors — registration, doctor
search, appointment booking, video consultation, digital prescriptions, medicine
reminders, and feedback — built to match the GRAM Arogya Seva app architecture.

## Stack

| Layer        | Technology                                  |
|--------------|----------------------------------------------|
| Frontend     | React + Vite + Tailwind CSS + React Router   |
| Backend      | Node.js + Express                            |
| Database     | File-based JSON store (zero setup, swap for MySQL/PostgreSQL later) |
| Auth         | JWT + bcrypt password hashing                |

No external database server is required to run this locally — the backend persists
data to `backend/data/db.json`, which is created automatically on first run.

## Project structure

```
gram-arogya-seva/
├── backend/
│   ├── routes/          # auth, doctors, appointments, prescriptions, feedback
│   ├── data/             # db.json is generated here at runtime
│   ├── db.js             # tiny JSON read/write helper
│   ├── middleware.js      # JWT auth guard
│   └── server.js          # Express app entry point
└── frontend/
    └── src/
        ├── api/            # fetch client
        ├── context/         # auth state
        ├── components/       # NavBar, ProtectedRoute, StarRating
        └── pages/             # Home, Login, Register, DoctorList, DoctorProfile,
                                 # PatientDashboard, DoctorDashboard
```

## Getting started

### 1. Backend

```bash
cd backend
cp .env.example .env      # optionally edit JWT_SECRET
npm install
npm start                  # runs on http://localhost:5000
```

### 2. Frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev                 # runs on http://localhost:5173
```

Open **http://localhost:5173** — the Vite dev server proxies `/api` calls to the
backend automatically (see `frontend/vite.config.js`).

### 3. Try it out

1. Register a **doctor** account (`/register?role=doctor`) — set a specialization and fee.
2. Register a **patient** account in another browser/incognito window.
3. As the patient, go to **Find a doctor**, open the doctor's profile, and request an appointment.
4. As the doctor, open the **Dashboard**, accept the request, then generate a digital prescription.
5. As the patient, view the prescription on your dashboard and leave a star rating.

## API overview

| Method | Route                              | Description                          |
|--------|-------------------------------------|---------------------------------------|
| POST   | `/api/auth/register`                | Create a patient or doctor account    |
| POST   | `/api/auth/login`                   | Log in, returns a JWT                 |
| GET    | `/api/auth/me`                      | Current user from token               |
| GET    | `/api/doctors`                      | List/search doctors                   |
| GET    | `/api/doctors/:userId`               | Doctor profile                        |
| PUT    | `/api/doctors/me/profile`            | Doctor updates own profile (auth)     |
| POST   | `/api/appointments`                  | Patient books an appointment (auth)   |
| GET    | `/api/appointments/mine`             | Role-aware appointment list (auth)    |
| PUT    | `/api/appointments/:id/status`        | Doctor accepts/rejects/completes (auth)|
| POST   | `/api/prescriptions`                  | Doctor issues a prescription (auth)   |
| GET    | `/api/prescriptions/:appointmentId`    | View a prescription (auth)            |
| POST   | `/api/feedback`                        | Patient rates a completed visit (auth)|
| GET    | `/api/feedback/doctor/:doctorId`        | Public rating summary for a doctor    |

## Deploying to production

- Swap `backend/db.js` for a real MySQL/PostgreSQL connection (the table shapes in
  `DEFAULT_SHAPE` map directly to the schema in the project's architecture doc:
  Users, Doctors, Patients, Appointments, Prescriptions, Payments, Feedback).
- Add a real video layer (WebRTC, Agora, or a Zoom/Twilio SDK) where the UI currently
  shows the "confirmed — join your consultation" placeholder.
- Put the frontend build (`npm run build` in `frontend/`) behind a CDN/static host,
  and the backend behind a process manager (pm2/Docker) with HTTPS.

## Pushing to Git

```bash
git init
git add .
git commit -m "Initial commit: GRAM Arogya Seva portal"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

`backend/data/db.json` and `.env` are gitignored so no real user data or secrets are
committed.
