import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="max-w-lg mx-auto px-6 py-24 text-center">
      <p className="font-display text-6xl text-teal-dark mb-4">404</p>
      <p className="text-ink/60 mb-8">This page hasn't been connected yet.</p>
      <Link to="/" className="px-6 py-3 rounded-full bg-teal text-white font-medium hover:bg-teal-dark transition-colors">
        Back to home
      </Link>
    </div>
  );
}
