import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const { pathname } = useLocation();

  return (
    <header className="navbar">
      <div className="navbar-left">
        <div className="logo">VibeMatch</div>
      </div>

      <nav className="navbar-center">
        <Link to="/" className={pathname === "/" ? "active" : ""}>
          Home
        </Link>
        <a href="#">Ghép đôi</a>
        <a href="#">Bạn bè</a>
      </nav>

      <div className="navbar-right">
        <span className="icon">🔔</span>
        <span className="avatar">👤</span>
      </div>
    </header>
  );
}