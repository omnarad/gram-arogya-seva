import React, { useEffect, useState } from 'react';
import { api } from '../api/client.js';
import StarRating from '../components/StarRating.jsx';

const STATUS_STYLE = {
  pending: 'bg-marigold/15 text-marigold-dark',
  accepted: 'bg-teal-light text-teal-dark',
  rejected: 'bg-clay/15 text-clay',
  completed: 'bg-sage text-teal-dark'
};

export default function PatientDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedbackDraft, setFeedbackDraft] = useState({}); // appointmentId -> {rating, comment}
  const [message, setMessage] = useState('');

  function load() {
    setLoading(true);
    api.myAppointments().then((d) => setAppointments(d.appointments)).finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  function updateDraft(id, field, value) {
    setFeedbackDraft((prev) => ({ ...prev, [id]: { ...prev[id], [field]: value } }));
  }

  async function submitFeedback(appointmentId) {
    const draft = feedbackDraft[appointmentId] || {};
    if (!draft.rating) return;
    try {
      await api.submitFeedback({ appointmentId, rating: draft.rating, comment: draft.comment || '' });
      setMessage('Thanks for your feedback!');
      load();
    } catch (err) {
      setMessage(err.message);
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-14">
      <h1 className="font-display text-3xl font-semibold text-teal-dark mb-2">Your appointments</h1>
      <p className="text-ink/60 mb-8">Track requests, join consultations and view prescriptions.</p>

      {message && <div className="mb-6 px-4 py-3 rounded-lg bg-teal-light text-teal-dark text-sm">{message}</div>}

      {loading ? (
        <p className="text-ink/50">Loading…</p>
      ) : appointments.length === 0 ? (
        <div className="bg-white rounded-xl2 border border-teal/10 p-10 text-center text-ink/60">
          No appointments yet. Head to <a href="/doctors" className="text-teal-dark font-medium">Find a doctor</a> to book your first visit.
        </div>
      ) : (
        <div className="space-y-5">
          {appointments.map((a) => (
            <div key={a.id} className="bg-white rounded-xl2 border border-teal/10 p-6">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <div>
                  <p className="font-semibold text-ink">Dr. {a.doctorName}</p>
                  <p className="text-xs text-ink/50">{a.specialization} · {a.date} at {a.time}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${STATUS_STYLE[a.status]}`}>
                  {a.status}
                </span>
              </div>
              {a.reason && <p className="text-sm text-ink/70 mb-3">"{a.reason}"</p>}

              {a.status === 'accepted' && (
                <div className="text-sm text-teal-dark bg-teal-light rounded-lg px-4 py-3">
                  Confirmed — join your video consultation at the scheduled time.
                </div>
              )}

              {a.prescription && (
                <div className="mt-4 border-t border-ink/10 pt-4">
                  <p className="text-sm font-semibold text-ink mb-2">Digital prescription</p>
                  <ul className="text-sm text-ink/70 space-y-1 mb-2">
                    {a.prescription.medicines.map((m, i) => (
                      <li key={i}>• {m.name} — {m.dosage}, {m.frequency}, {m.duration}</li>
                    ))}
                  </ul>
                  {a.prescription.notes && <p className="text-sm text-ink/60 italic">Note: {a.prescription.notes}</p>}
                </div>
              )}

              {a.status === 'completed' && (
                <div className="mt-4 border-t border-ink/10 pt-4">
                  <p className="text-sm font-semibold text-ink mb-2">Rate this consultation</p>
                  <StarRating
                    value={feedbackDraft[a.id]?.rating || 0}
                    onChange={(v) => updateDraft(a.id, 'rating', v)}
                  />
                  <textarea
                    rows={2}
                    placeholder="Optional comment…"
                    value={feedbackDraft[a.id]?.comment || ''}
                    onChange={(e) => updateDraft(a.id, 'comment', e.target.value)}
                    className="w-full mt-2 px-3 py-2 rounded-lg border border-ink/15 text-sm outline-none focus:border-teal resize-none"
                  />
                  <button
                    onClick={() => submitFeedback(a.id)}
                    className="mt-2 px-4 py-2 rounded-full bg-teal text-white text-sm font-medium hover:bg-teal-dark transition-colors"
                  >
                    Submit feedback
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
