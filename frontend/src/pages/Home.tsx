import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="home-page">

      {/* HERO */}
      <section className="home-hero">
        <div className="home-hero-content">
          <div className="home-badge">
            <span className="status-dot" />
            Rescue operations platform
          </div>

          <h1>
            Coordinate rescues.
            <br />
            <span>Save more lives.</span>
          </h1>

          <p>
            Stray Rescue Grid helps rescue teams manage emergency
            reports, coordinate response efforts, and track rescue
            locations from one central dashboard.
          </p>

          <div className="home-actions">
            <Link to="/report" className="secondary-action">
              Report an animal
            </Link>

            <Link to="/dispatcher" className="primary-action">
              Open Dispatcher
              <span>→</span>
            </Link>

            <a href="#features" className="secondary-action">
              Explore Platform
            </a>
          </div>
        </div>

        <div className="home-hero-visual">
          <div className="hero-card">
            <div className="hero-card-top">
              <div>
                <span className="small-label">LIVE OPERATIONS</span>
                <h3>Rescue Overview</h3>
              </div>

              <div className="live-indicator">
                <span />
                Live
              </div>
            </div>

            <div className="hero-stats">
              <div className="hero-stat">
                <span>Active Tickets</span>
                <strong>04</strong>
              </div>

              <div className="hero-stat">
                <span>High Priority</span>
                <strong className="danger-number">02</strong>
              </div>

              <div className="hero-stat">
                <span>Resolved</span>
                <strong>18</strong>
              </div>
            </div>

            <div className="mini-map">
              <div className="map-grid" />

              <div className="map-pin pin-one">●</div>
              <div className="map-pin pin-two">●</div>
              <div className="map-pin pin-three">●</div>

              <div className="map-label">
                Rescue locations
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="home-features">
        <div className="section-heading">
          <span>WHY STRAY RESCUE GRID</span>

          <h2>
            Everything your rescue team needs
          </h2>

          <p>
            A single place to monitor reports, prioritize emergencies,
            and coordinate field response.
          </p>
        </div>

        <div className="feature-grid">

          <div className="feature-card">
            <div className="feature-icon">🎫</div>

            <h3>Rescue Tickets</h3>

            <p>
              Manage incoming rescue reports and keep every case
              organized from submission to resolution.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🗺️</div>

            <h3>Live Locations</h3>

            <p>
              View rescue requests on an interactive map and quickly
              understand where help is needed.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🚨</div>

            <h3>Priority Response</h3>

            <p>
              Filter and identify critical rescue situations so your
              team can respond to the most urgent cases first.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🐾</div>

            <h3>Animal Tracking</h3>

            <p>
              Keep rescue information organized by animal type,
              status, location, and priority.
            </p>
          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="home-cta">
        <div>
          <span>READY TO RESPOND?</span>

          <h2>
            Start managing rescue operations.
          </h2>

          <p>
            Open the dispatcher dashboard to view active rescue
            tickets and locations.
          </p>
        </div>

        <Link to="/dispatcher" className="cta-button">
          Go to Dispatcher
          <span>→</span>
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="home-footer">
        <div>
          <strong>Stray Rescue Grid</strong>
          <span>
            Rescue management system
          </span>
        </div>

        <span>
          © 2026 Stray Rescue Grid
        </span>
      </footer>

    </div>
  );
}