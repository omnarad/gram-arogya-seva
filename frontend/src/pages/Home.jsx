import React from 'react';
import { Link } from 'react-router-dom';

const STEPS = [
  { label: 'Register', detail: 'Patients and doctors sign up with a phone number or email — no clinic visit needed to get started.' },
  { label: 'Search & book', detail: 'Find a doctor by specialization, check availability, and book a slot in a few taps.' },
  { label: 'Doctor accepts', detail: 'The doctor reviews the request and confirms the appointment time.' },
  { label: 'Video consultation', detail: 'Connect over live video from home — no travel to a town clinic.' },
  { label: 'Digital prescription', detail: 'The doctor issues a prescription instantly, saved to the patient\'s record.' },
  { label: 'Follow-up & feedback', detail: 'Medicine reminders keep care on track; patients rate the visit afterward.' }
];

const MODULES = [
  {
    title: 'Patient module',
    items: ['Registration & login', 'Search doctors by specialty', 'Book appointments', 'Upload medical reports', 'Video / chat consultation', 'Medicine reminders', 'Digital prescriptions', 'Feedback & rating']
  },
  {
    title: 'Doctor module',
    items: ['Registration & login', 'Manage availability', 'Accept / reject requests', 'View patient history', 'Video consultation', 'Generate digital prescriptions', 'Upload reports', 'Monitor follow-ups']
  }
];

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-20 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-marigold-dark mb-4">
            Rural telemedicine, made simple
          </p>
          <h1 className="font-display text-5xl leading-[1.05] font-semibold text-teal-dark mb-6">
            One line connects a village patient to the nearest doctor.
          </h1>
          <p className="text-lg text-ink/70 mb-8 max-w-md">
            GRAM Arogya Seva links patients and doctors end-to-end — registration,
            booking, video consultation, prescription and follow-up — so healthcare
            reaches homes that clinics can't.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/register" className="px-6 py-3 rounded-full bg-teal text-white font-medium hover:bg-teal-dark transition-colors">
              Register as a patient
            </Link>
            <Link to="/register?role=doctor" className="px-6 py-3 rounded-full border border-teal text-teal-dark font-medium hover:bg-teal-light transition-colors">
              Join as a doctor
            </Link>
          </div>
        </div>

        {/* Signature connectivity visual */}
        <div className="relative bg-white rounded-xl2 border border-teal/10 shadow-sm p-8">
          <div className="flex justify-between items-start mb-6">
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-sage flex items-center justify-center mx-auto mb-2 text-teal-dark font-display text-xl">P</div>
              <p className="text-xs font-medium text-ink/60">Patient</p>
            </div>
            <div className="flex-1 mx-4 mt-7 border-t-2 border-dashed border-marigold relative">
              <span className="absolute -top-2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-marigold animate-pulse" />
            </div>
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-teal-light flex items-center justify-center mx-auto mb-2 text-teal-dark font-display text-xl">D</div>
              <p className="text-xs font-medium text-ink/60">Doctor</p>
            </div>
          </div>
          <ul className="space-y-4">
            {STEPS.slice(0, 4).map((s, i) => (
              <li key={s.label} className="thread pl-8 relative pb-1">
                <span className="absolute left-0 top-0 w-6 h-6 rounded-full bg-teal text-white text-xs flex items-center justify-center font-mono">
                  {i + 1}
                </span>
                <p className="text-sm font-semibold text-ink">{s.label}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Full workflow */}
      <section className="bg-white border-y border-teal/10">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <h2 className="font-display text-3xl font-semibold text-teal-dark mb-2">How it works</h2>
          <p className="text-ink/60 mb-10 max-w-lg">From first registration to a follow-up visit, every step keeps patient and doctor connected.</p>
          <div className="grid md:grid-cols-3 gap-x-8 gap-y-10">
            {STEPS.map((s, i) => (
              <div key={s.label} className="thread pl-9 relative">
                <span className="absolute left-0 top-0 w-6 h-6 rounded-full bg-marigold text-white text-xs flex items-center justify-center font-mono">
                  {i + 1}
                </span>
                <p className="font-semibold text-ink mb-1">{s.label}</p>
                <p className="text-sm text-ink/60">{s.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modules */}
      <section className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-8">
        {MODULES.map((m) => (
          <div key={m.title} className="bg-white rounded-xl2 border border-teal/10 p-8">
            <h3 className="font-display text-2xl font-semibold text-teal-dark mb-5">{m.title}</h3>
            <ul className="space-y-2.5">
              {m.items.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-ink/75">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-marigold shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="bg-teal-dark rounded-xl2 px-10 py-14 text-center">
          <h2 className="font-display text-3xl font-semibold text-white mb-3">Ready to connect?</h2>
          <p className="text-white/70 mb-8 max-w-md mx-auto">Create your account and book your first consultation in minutes.</p>
          <Link to="/register" className="inline-block px-7 py-3 rounded-full bg-marigold text-white font-medium hover:bg-marigold-dark transition-colors">
            Create free account
          </Link>
        </div>
      </section>
    </div>
  );
}
