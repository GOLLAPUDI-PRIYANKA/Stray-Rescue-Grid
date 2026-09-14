// frontend/src/components/Layout.tsx  (or insert into your existing header component)
import React from 'react';
import { Link, NavLink } from 'react-router-dom';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-3">
              <img src="/logo192.png" alt="Stray Rescue" className="h-8 w-8" />
              <span className="font-semibold text-lg">Stray Rescue Grid</span>
            </Link>
          </div>

          <nav className="flex items-center gap-6">
            <NavLink to="/" className={({ isActive }) => (isActive ? 'text-blue-600 font-medium' : 'text-gray-600')}>
              Home
            </NavLink>

            <NavLink to="/report" className={({ isActive }) => (isActive ? 'text-blue-600 font-medium' : 'text-gray-600')}>
              Report
            </NavLink>

            <NavLink to="/dispatcher" className={({ isActive }) => (isActive ? 'text-blue-600 font-medium' : 'text-gray-600')}>
              Dispatcher
            </NavLink>

            {/* keep other nav items (Volunteer etc.) here */}
          </nav>
        </div>
      </header>

      <main>{children}</main>
    </div>
  );
}