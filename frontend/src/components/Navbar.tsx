import { NavLink } from "react-router-dom";

const navItems = [
  { label: "Home", path: "/" },
  { label: "Dispatcher", path: "/dispatcher" },
];

export default function Navbar() {
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

        <nav className="navbar-links">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `navbar-link ${
                  isActive ? "navbar-link-active" : ""
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

      </div>
    </header>
  );
}