import "./style.css";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      navigate("/home");
    }
  }, [navigate]);

  const handleRegisterClick = () => {
    navigate("/register");
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <div className="landing-page">
      {/* Hero */}
      <section className="hero">
        <div className="hero-left">
          <div className="logo-box">
            <h1>JSV</h1>
          </div>
        </div>

        <div className="hero-right">
          <div className="top-buttons">
            <button onClick={handleRegisterClick} className="nav-btn">Đăng ký</button>
            <button onClick={handleLoginClick} className="nav-btn">Đăng nhập</button>
          </div>

          <div className="hero-text">
            <h2>
              Discover new friends,
              <br />
              connect every day,
              <br />
              and start building
              <br />
              meaningful friendships
              <br />
              today.
            </h2>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-col brand-col">
          <div className="brand-top">
            <div className="brand-icon">JS</div>
            <div>
              <h3>JSV</h3>
            </div>
          </div>

          <p className="brand-desc">
            JSV - Nơi bạn có thể gặp gỡ, sẻ chia và xây dựng những mối quan hệ bạn bè chân thành. .
          </p>
        </div>

        <div className="footer-col">
          <h4>LIÊN HỆ</h4>
          <ul>
            <li>📍 Đại học FPT, Khu Công nghệ cao Hòa Lạc, KM 29 Đại Lộ Thăng Long, Hà Nội</li>
            <li>✉️ jsv.fpt@gmail.com</li>
            <li>👤 Thực hiện: team JSV</li>
          </ul>
        </div>

        <div className="footer-col links-col">
          <h4>LIÊN KẾT</h4>
          <ul>
            <li><a href="/">Facebook Fanpage</a></li>
            <li><a href="/">TikTok Channel</a></li>
            <li><a href="/">Instagram</a></li>
          </ul>
        </div>
      </footer>
    </div>
  );
}