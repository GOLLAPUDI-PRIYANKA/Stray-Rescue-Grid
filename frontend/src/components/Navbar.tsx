import { useState } from "react";
import { NavLink } from "react-router-dom";

const navItems = [
  { label: "Home", path: "/" },
  { label: "Report an animal", path: "/report" },
  { label: "Dispatcher", path: "/dispatcher" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="site-navbar">
      <div className="navbar-inner">

        <NavLink to="/" className="navbar-brand">
          <div className="brand-icon">
            🐾
          </div>

          <span>
            Stray Rescue Grid
          </span>
        </NavLink>

        <button
          type="button"
          className="navbar-menu-toggle"
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav
          id="primary-navigation"
          className={`navbar-links ${menuOpen ? "navbar-links-open" : ""}`}
        >
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `navbar-link ${
                  isActive ? "navbar-link-active" : ""
                }`
              }
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

      </div>
    </header>
  );
}