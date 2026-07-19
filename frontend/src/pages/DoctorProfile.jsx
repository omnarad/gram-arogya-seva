import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import StarRating from '../components/StarRating.jsx';

export default function DoctorProfile() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [ratings, setRatings] = useState({ average: null, count: 0 });
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [reason, setReason] = useState('');
  const [status, setStatus] = useState({ error: '', success: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.getDoctor(id).then((d) => setDoctor(d.doctor)).catch(() => {});
    api.doctorFeedback(id).then(setRatings).catch(() => {});
  }, [id]);

  async function handleBook(e) {
    e.preventDefault();
    setStatus({ error: '', success: '' });

    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role !== 'patient') {
      setStatus({ error: 'Only patient accounts can book appointments.', success: '' });
      return;
    }
    setLoading(true);
    try {
      await api.bookAppointment({ doctorId: id, date, time, reason });
      setStatus({ error: '', success: 'Appointment requested! The doctor will confirm shortly — check your dashboard.' });
      setDate(''); setTime(''); setReason('');
    } catch (err) {
      setStatus({ error: err.message, success: '' });
    } finally {
      setLoading(false);
    }
  }

  if (!doctor) {
    return <div className="max-w-3xl mx-auto px-6 py-20 text-ink/50">Loading doctor profile…</div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-14">
      <div className="bg-white rounded-xl2 border border-teal/10 p-8 mb-8">
        <div className="flex items-start gap-5">
          <div className="w-16 h-16 rounded-full bg-teal-light flex items-center justify-center text-teal-dark font-display text-2xl shrink-0">
            {doctor.name.charAt(0)}
          </div>
          <div>
            <h1 className="font-display text-2xl font-semibold text-ink">{doctor.name}</h1>
            <p className="text-marigold-dark font-medium text-sm mb-1">{doctor.specialization}</p>
            <p className="text-sm text-ink/60">{doctor.qualification} · {doctor.experienceYears} yrs experience</p>
            <div className="flex items-center gap-2 mt-2">
              <StarRating value={Math.round(ratings.average || 0)} readOnly size={16} />
              <span className="text-xs text-ink/50">
                {ratings.average ? `${ratings.average.toFixed(1)} (${ratings.count} reviews)` : 'No reviews yet'}
              </span>
            </div>
          </div>
        </div>
        {doctor.bio && <p className="mt-5 text-sm text-ink/70 leading-relaxed">{doctor.bio}</p>}
        <p className="mt-4 text-sm font-medium text-teal-dark">Consultation fee: ₹{doctor.fee || 0}</p>
      </div>

      <div className="bg-white rounded-xl2 border border-teal/10 p-8">
        <h2 className="font-display text-xl font-semibold text-teal-dark mb-5">Book an appointment</h2>

        {status.error && <div className="mb-5 px-4 py-3 rounded-lg bg-clay/10 text-clay text-sm">{status.error}</div>}
        {status.success && <div className="mb-5 px-4 py-3 rounded-lg bg-teal-light text-teal-dark text-sm">{status.success}</div>}

        <form onSubmit={handleBook} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-ink/70 mb-1.5">Date</label>
              <input
                type="date" required value={date} onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-2.5 rounded-lg border border-ink/15 focus:border-teal outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink/70 mb-1.5">Time</label>
              <input
                type="time" required value={time} onChange={(e) => setTime(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-ink/15 focus:border-teal outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-ink/70 mb-1.5">Reason for visit (optional)</label>
            <textarea
              value={reason} onChange={(e) => setReason(e.target.value)} rows={3}
              className="w-full px-4 py-2.5 rounded-lg border border-ink/15 focus:border-teal outline-none resize-none"
              placeholder="Briefly describe your symptoms…"
            />
          </div>
          <button
            type="submit" disabled={loading}
            className="w-full py-3 rounded-full bg-teal text-white font-medium hover:bg-teal-dark transition-colors disabled:opacity-60"
          >
            {loading ? 'Requesting…' : 'Request appointment'}
          </button>
        </form>
      </div>
    </div>
  );
}
