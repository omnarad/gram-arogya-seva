import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <header className="border-b border-teal/10 bg-paper/90 backdrop-blur sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="w-3 h-3 rounded-full bg-marigold group-hover:scale-110 transition-transform" />
          <span className="font-display text-xl font-semibold tracking-tight text-teal-dark">
            GRAM Arogya Seva
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-ink/70">
          <Link to="/doctors" className="hover:text-teal-dark transition-colors">Find a doctor</Link>
          {user && (
            <Link
              to={user.role === 'doctor' ? '/doctor/dashboard' : '/patient/dashboard'}
              className="hover:text-teal-dark transition-colors"
            >
              Dashboard
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="hidden sm:inline text-sm text-ink/60">
                {user.name.split(' ')[0]} · <span className="capitalize">{user.role}</span>
              </span>
              <button
                onClick={handleLogout}
                className="text-sm font-medium px-4 py-2 rounded-full border border-ink/15 hover:border-clay hover:text-clay transition-colors"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-medium px-4 py-2 rounded-full hover:text-teal-dark transition-colors"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="text-sm font-medium px-4 py-2 rounded-full bg-teal text-white hover:bg-teal-dark transition-colors"
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
