import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import ReportPage from './pages/ReportPage';
import ConfirmationPage from './pages/ConfirmationPage';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-lg font-semibold">Stray Rescue — Report an Animal</h1>
          <nav>
            <Link to="/" className="text-sm text-blue-600">Report</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4">
        <Routes>
          <Route path="/" element={<ReportPage />} />
          <Route path="/confirmation/:ticketId" element={<ConfirmationPage />} />
        </Routes>
      </main>
    </div>
  );
}