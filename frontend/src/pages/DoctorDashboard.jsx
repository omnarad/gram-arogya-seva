import React, { useEffect, useState } from 'react';
import { api } from '../api/client.js';

const STATUS_STYLE = {
  pending: 'bg-marigold/15 text-marigold-dark',
  accepted: 'bg-teal-light text-teal-dark',
  rejected: 'bg-clay/15 text-clay',
  completed: 'bg-sage text-teal-dark'
};

const emptyMedicine = { name: '', dosage: '', frequency: '', duration: '' };

export default function DoctorDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openPrescriptionFor, setOpenPrescriptionFor] = useState(null);
  const [medicines, setMedicines] = useState([{ ...emptyMedicine }]);
  const [notes, setNotes] = useState('');
  const [message, setMessage] = useState('');

  function load() {
    setLoading(true);
    api.myAppointments().then((d) => setAppointments(d.appointments)).finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  async function setStatus(id, status) {
    try {
      await api.setAppointmentStatus(id, status);
      load();
    } catch (err) {
      setMessage(err.message);
    }
  }

  function openPrescription(appt) {
    setOpenPrescriptionFor(appt.id);
    setMedicines(appt.prescription?.medicines?.length ? appt.prescription.medicines : [{ ...emptyMedicine }]);
    setNotes(appt.prescription?.notes || '');
  }

  function updateMedicine(idx, field, value) {
    setMedicines((list) => list.map((m, i) => (i === idx ? { ...m, [field]: value } : m)));
  }

  function addMedicineRow() {
    setMedicines((list) => [...list, { ...emptyMedicine }]);
  }

  function removeMedicineRow(idx) {
    setMedicines((list) => list.filter((_, i) => i !== idx));
  }

  async function submitPrescription(appointmentId) {
    const cleaned = medicines.filter((m) => m.name.trim());
    if (cleaned.length === 0) {
      setMessage('Add at least one medicine before saving.');
      return;
    }
    try {
      await api.createPrescription({ appointmentId, medicines: cleaned, notes });
      setMessage('Prescription saved and appointment marked complete.');
      setOpenPrescriptionFor(null);
      load();
    } catch (err) {
      setMessage(err.message);
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-14">
      <h1 className="font-display text-3xl font-semibold text-teal-dark mb-2">Appointment requests</h1>
      <p className="text-ink/60 mb-8">Accept incoming requests, consult, then issue a digital prescription.</p>

      {message && <div className="mb-6 px-4 py-3 rounded-lg bg-teal-light text-teal-dark text-sm">{message}</div>}

      {loading ? (
        <p className="text-ink/50">Loading…</p>
      ) : appointments.length === 0 ? (
        <div className="bg-white rounded-xl2 border border-teal/10 p-10 text-center text-ink/60">
          No appointment requests yet.
        </div>
      ) : (
        <div className="space-y-5">
          {appointments.map((a) => (
            <div key={a.id} className="bg-white rounded-xl2 border border-teal/10 p-6">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <div>
                  <p className="font-semibold text-ink">{a.patientName}</p>
                  <p className="text-xs text-ink/50">{a.date} at {a.time}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${STATUS_STYLE[a.status]}`}>
                  {a.status}
                </span>
              </div>
              {a.reason && <p className="text-sm text-ink/70 mb-4">"{a.reason}"</p>}

              {a.status === 'pending' && (
                <div className="flex gap-3">
                  <button
                    onClick={() => setStatus(a.id, 'accepted')}
                    className="px-4 py-2 rounded-full bg-teal text-white text-sm font-medium hover:bg-teal-dark transition-colors"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => setStatus(a.id, 'rejected')}
                    className="px-4 py-2 rounded-full border border-clay text-clay text-sm font-medium hover:bg-clay/10 transition-colors"
                  >
                    Reject
                  </button>
                </div>
              )}

              {a.status === 'accepted' && openPrescriptionFor !== a.id && (
                <button
                  onClick={() => openPrescription(a)}
                  className="px-4 py-2 rounded-full bg-marigold text-white text-sm font-medium hover:bg-marigold-dark transition-colors"
                >
                  Generate prescription
                </button>
              )}

              {a.status === 'completed' && a.prescription && (
                <div className="text-sm text-ink/60">
                  Prescription issued on {new Date(a.prescription.createdAt).toLocaleDateString()}.
                </div>
              )}

              {openPrescriptionFor === a.id && (
                <div className="mt-4 border-t border-ink/10 pt-4">
                  <p className="text-sm font-semibold text-ink mb-3">Digital prescription</p>
                  <div className="space-y-3">
                    {medicines.map((m, i) => (
                      <div key={i} className="grid grid-cols-12 gap-2 items-center">
                        <input
                          placeholder="Medicine" value={m.name} onChange={(e) => updateMedicine(i, 'name', e.target.value)}
                          className="col-span-4 px-3 py-2 rounded-lg border border-ink/15 text-sm outline-none focus:border-teal"
                        />
                        <input
                          placeholder="Dosage" value={m.dosage} onChange={(e) => updateMedicine(i, 'dosage', e.target.value)}
                          className="col-span-3 px-3 py-2 rounded-lg border border-ink/15 text-sm outline-none focus:border-teal"
                        />
                        <input
                          placeholder="Frequency" value={m.frequency} onChange={(e) => updateMedicine(i, 'frequency', e.target.value)}
                          className="col-span-3 px-3 py-2 rounded-lg border border-ink/15 text-sm outline-none focus:border-teal"
                        />
                        <input
                          placeholder="Duration" value={m.duration} onChange={(e) => updateMedicine(i, 'duration', e.target.value)}
                          className="col-span-1 px-3 py-2 rounded-lg border border-ink/15 text-sm outline-none focus:border-teal"
                        />
                        <button onClick={() => removeMedicineRow(i)} className="col-span-1 text-clay text-sm">✕</button>
                      </div>
                    ))}
                  </div>
                  <button onClick={addMedicineRow} className="mt-2 text-sm text-teal-dark font-medium">+ Add medicine</button>

                  <textarea
                    rows={2}
                    placeholder="Additional notes for the patient…"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full mt-3 px-3 py-2 rounded-lg border border-ink/15 text-sm outline-none focus:border-teal resize-none"
                  />

                  <div className="flex gap-3 mt-3">
                    <button
                      onClick={() => submitPrescription(a.id)}
                      className="px-4 py-2 rounded-full bg-teal text-white text-sm font-medium hover:bg-teal-dark transition-colors"
                    >
                      Save & complete visit
                    </button>
                    <button
                      onClick={() => setOpenPrescriptionFor(null)}
                      className="px-4 py-2 rounded-full border border-ink/15 text-sm font-medium hover:border-ink/30"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
