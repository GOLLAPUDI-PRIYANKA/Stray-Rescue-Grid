import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

type LoginLocationState = {
  from?: string;
};

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as LoginLocationState | null)?.from ?? "/report";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Enter your email and password to continue.");
      return;
    }

    setSubmitting(true);
    try {
      await login(email.trim(), password);
      navigate(from, { replace: true });
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to sign in right now.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-card report-card">
        <span className="report-eyebrow">CITIZEN REPORTING</span>
        <h1>Sign in to submit a report</h1>
        <p>Use your rescue grid account to send a report to the dispatch team.</p>

        <form className="auth-form" onSubmit={onSubmit}>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
            />
          </label>

          {error && <p className="form-error" role="alert">{error}</p>}

          <button className="primary-action auth-submit" type="submit" disabled={submitting}>
            {submitting ? "Signing in..." : "Login"}
            <span>→</span>
          </button>
        </form>

        <Link to="/" className="report-back-link">← Back to home</Link>
      </div>
    </section>
  );
}
