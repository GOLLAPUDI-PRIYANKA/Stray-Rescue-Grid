import { Routes, Route } from "react-router-dom";

import Layout from "../components/Layout";
import Home from "../pages/Home";
import DispatcherDashboard from "../pages/DispatcherDashboard";
import ReportPage from "../pages/ReportPage";
import ConfirmationPage from "../pages/ConfirmationPage";
import LoginPage from "../pages/LoginPage";
import ProtectedRoute from "../components/ProtectedRoute";

function NotFound() {
  return (
    <div className="not-found">
      <div className="not-found-card">
        <span>404</span>

        <h1>Page not found</h1>

        <p>
          The page you're looking for doesn't exist.
        </p>

        <a href="/">
          Return Home
        </a>
      </div>
    </div>
  );
}

export default function AppRoutes() {
  return (
    <Layout>
      <Routes>

        {/* HOME ONLY */}
        <Route
          path="/"
          element={<Home />}
        />

        {/* DISPATCHER ONLY */}
        <Route
          path="/dispatcher"
          element={<DispatcherDashboard />}
        />

        {/* CITIZEN REPORTING */}
        <Route
          path="/report"
          element={<ProtectedRoute />}
        >
          <Route index element={<ReportPage />} />
        </Route>

        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route
          path="/confirmation/:ticketId"
          element={<ConfirmationPage />}
        />

        {/* 404 */}
        <Route
          path="*"
          element={<NotFound />}
        />

      </Routes>
    </Layout>
  );
}