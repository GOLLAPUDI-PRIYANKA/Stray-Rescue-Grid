import React from 'react';
import { useParams, Link } from 'react-router-dom';

export default function ConfirmationPage() {
  const { ticketId } = useParams<{ ticketId: string }>();
  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold">Report submitted</h2>
      <p className="mt-4">Thank you — your report has been recorded.</p>
      <p className="mt-2">Reference: <strong>{ticketId}</strong></p>
      <div className="mt-4">
        <Link to="/" className="text-blue-600">Submit another report</Link>
      </div>
    </div>
  );
}