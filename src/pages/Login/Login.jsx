import "./Login.css";
import { useState } from "react";

export default function App() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="login-page">
      <div className="stars">
  <div className="meteor-group group-1">
    <span className="shooting-star star-1"></span>
    <span className="shooting-star star-2"></span>
    <span className="shooting-star star-3"></span>
  </div>
  

  <div className="meteor-group group-2">
    <span className="shooting-star star-4"></span>
    <span className="shooting-star star-5"></span>
    <span className="shooting-star star-6"></span>
  </div>
</div>
      <div className="glow glow-left"></div>
      <div className="glow glow-right"></div>

      <div className="page-content">
        <div className="left-content">
          <h1 className="brand">VibeMatch</h1>
          <p className="subtitle">
            Kết nối đúng vibe của bạn. Đăng nhập để bắt đầu đồng điệu.
          </p>
        </div>

        <div className="login-card">
          <h2>Đăng nhập</h2>
          <p className="welcome-text">Chào mừng trở lại</p>

          <form className="login-form">
            <div className="form-group">
              <label>username</label>
              <input type="username" placeholder="" />
            </div>

            <div className="form-group">
              <label>Mật khẩu</label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="show-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Ẩn" : "Hiện"}
                </button>
              </div>
            </div>

            <button type="submit" className="login-btn">
              Đăng nhập
            </button>

            <div className="bottom-links">
              <a href="/">Quên mật khẩu?</a>
              <a href="/">Tạo tài khoản</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}