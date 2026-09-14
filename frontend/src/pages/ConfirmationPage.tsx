import { Link, useParams } from "react-router-dom";

export default function ConfirmationPage() {
  const { ticketId } = useParams<{ ticketId: string }>();

  return (
    <section className="report-page">
      <div className="report-card confirmation-card">
        <span className="report-eyebrow">REPORT RECEIVED</span>
        <h1>Thank you for helping an animal in need.</h1>
        <p>
          Your report has been added to the rescue queue. A dispatcher can now
          review the location and coordinate a response.
        </p>
        <div className="reference-card">
          <span>Reference number</span>
          <strong>{ticketId ?? "Pending"}</strong>
        </div>
        <Link to="/report" className="primary-action">
          Submit another report
          <span>→</span>
        </Link>
      </div>
    </section>
  );
}
