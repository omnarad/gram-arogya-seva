import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';

const SPECIALIZATIONS = [
  'General Physician', 'Pediatrician', 'Gynecologist', 'Dermatologist',
  'Cardiologist', 'Orthopedic', 'Psychiatrist', 'ENT Specialist'
];

export default function Register() {
  const [params] = useSearchParams();
  const initialRole = params.get('role') === 'doctor' ? 'doctor' : 'patient';
  const [role, setRole] = useState(initialRole);
  const [form, setForm] = useState({
    name: '', email: '', password: '', phone: '',
    age: '', gender: '', address: '',
    specialization: SPECIALIZATIONS[0], qualification: '', experienceYears: '', fee: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginSuccess } = useAuth();
  const navigate = useNavigate();

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = {
        role,
        name: form.name,
        email: form.email,
        password: form.password,
        phone: form.phone,
        ...(role === 'patient'
          ? { age: form.age ? Number(form.age) : null, gender: form.gender, address: form.address }
          : {
              specialization: form.specialization,
              qualification: form.qualification,
              experienceYears: form.experienceYears ? Number(form.experienceYears) : 0,
              fee: form.fee ? Number(form.fee) : 0
            })
      };
      const data = await api.register(payload);
      loginSuccess(data);
      navigate(role === 'doctor' ? '/doctor/dashboard' : '/patient/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const inputClass = 'w-full px-4 py-2.5 rounded-lg border border-ink/15 focus:border-teal outline-none';
  const labelClass = 'block text-sm font-medium text-ink/70 mb-1.5';

  return (
    <div className="max-w-lg mx-auto px-6 py-16">
      <h1 className="font-display text-3xl font-semibold text-teal-dark mb-2">Create your account</h1>
      <p className="text-ink/60 mb-6">Join as a patient seeking care, or a doctor offering it.</p>

      <div className="flex gap-2 mb-8 bg-white border border-ink/10 rounded-full p-1 w-fit">
        {['patient', 'doctor'].map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setRole(r)}
            className={`px-5 py-2 rounded-full text-sm font-medium capitalize transition-colors ${
              role === r ? 'bg-teal text-white' : 'text-ink/60 hover:text-ink'
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      {error && <div className="mb-6 px-4 py-3 rounded-lg bg-clay/10 text-clay text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Full name</label>
            <input required className={inputClass} value={form.name} onChange={(e) => update('name', e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Phone</label>
            <input className={inputClass} value={form.phone} onChange={(e) => update('phone', e.target.value)} />
          </div>
        </div>
        <div>
          <label className={labelClass}>Email</label>
          <input type="email" required className={inputClass} value={form.email} onChange={(e) => update('email', e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Password</label>
          <input type="password" required minLength={6} className={inputClass} value={form.password} onChange={(e) => update('password', e.target.value)} />
        </div>

        {role === 'patient' ? (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Age</label>
              <input type="number" min="0" className={inputClass} value={form.age} onChange={(e) => update('age', e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Gender</label>
              <select className={inputClass} value={form.gender} onChange={(e) => update('gender', e.target.value)}>
                <option value="">Select</option>
                <option>Female</option>
                <option>Male</option>
                <option>Other</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className={labelClass}>Address / village</label>
              <input className={inputClass} value={form.address} onChange={(e) => update('address', e.target.value)} />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className={labelClass}>Specialization</label>
              <select className={inputClass} value={form.specialization} onChange={(e) => update('specialization', e.target.value)}>
                {SPECIALIZATIONS.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Qualification</label>
              <input className={inputClass} placeholder="MBBS, MD" value={form.qualification} onChange={(e) => update('qualification', e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Experience (years)</label>
              <input type="number" min="0" className={inputClass} value={form.experienceYears} onChange={(e) => update('experienceYears', e.target.value)} />
            </div>
            <div className="col-span-2">
              <label className={labelClass}>Consultation fee (₹)</label>
              <input type="number" min="0" className={inputClass} value={form.fee} onChange={(e) => update('fee', e.target.value)} />
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-full bg-teal text-white font-medium hover:bg-teal-dark transition-colors disabled:opacity-60"
        >
          {loading ? 'Creating account…' : `Register as ${role}`}
        </button>
      </form>

      <p className="mt-6 text-sm text-ink/60">
        Already have an account? <Link to="/login" className="text-teal-dark font-medium">Log in</Link>
      </p>
    </div>
  );
}
