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
        <Link to="/friends" className={pathname === "/friends" ? "active" : ""}>
          Trò chuyện
        </Link>
      </nav>

      <div className="navbar-right">
        <span className="icon">🔔</span>
        <span className="avatar">👤</span>
      </div>
    </header>
  );
}