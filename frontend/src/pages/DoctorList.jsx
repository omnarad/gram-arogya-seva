import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client.js';

export default function DoctorList() {
  const [doctors, setDoctors] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [search, setSearch] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.specializations().then((d) => setSpecializations(d.specializations)).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (search) params.search = search;
    if (specialization) params.specialization = specialization;
    api.listDoctors(params)
      .then((d) => setDoctors(d.doctors))
      .finally(() => setLoading(false));
  }, [search, specialization]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-14">
      <h1 className="font-display text-3xl font-semibold text-teal-dark mb-2">Find a doctor</h1>
      <p className="text-ink/60 mb-8">Search by name or specialty and book a video consultation.</p>

      <div className="flex flex-col sm:flex-row gap-4 mb-10">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or specialty…"
          className="flex-1 px-4 py-2.5 rounded-lg border border-ink/15 focus:border-teal outline-none"
        />
        <select
          value={specialization}
          onChange={(e) => setSpecialization(e.target.value)}
          className="px-4 py-2.5 rounded-lg border border-ink/15 focus:border-teal outline-none"
        >
          <option value="">All specializations</option>
          {specializations.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {loading ? (
        <p className="text-ink/50">Loading doctors…</p>
      ) : doctors.length === 0 ? (
        <div className="bg-white rounded-xl2 border border-teal/10 p-10 text-center">
          <p className="text-ink/60">No doctors match yet. Try a different search, or check back soon as more doctors join.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((d) => (
            <div key={d.userId} className="bg-white rounded-xl2 border border-teal/10 p-6 flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-teal-light flex items-center justify-center text-teal-dark font-display text-lg">
                  {d.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-ink">{d.name}</p>
                  <p className="text-xs text-marigold-dark font-medium">{d.specialization}</p>
                </div>
              </div>
              <p className="text-sm text-ink/60 mb-1">{d.qualification || 'Qualification not listed'}</p>
              <p className="text-sm text-ink/60 mb-4">{d.experienceYears || 0} yrs experience · ₹{d.fee || 0} fee</p>
              <Link
                to={`/doctors/${d.userId}`}
                className="mt-auto text-center px-4 py-2.5 rounded-full bg-teal text-white text-sm font-medium hover:bg-teal-dark transition-colors"
              >
                View & book
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
