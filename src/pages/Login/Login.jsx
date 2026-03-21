import "./Login.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginService } from "../../services/loginService.js";

export default function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!identifier || !password) {
      setErrorMsg("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    setIsLoading(true);
    try {
      const result = await loginService.login(identifier, password);
      if (result.success) {
        const user = result.user; // service returns 'user', not 'data'
        const token = result.token;

        // Lưu thông tin vào bộ nhớ trình duyệt
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", token);
        localStorage.setItem("role", user.role);

        if (user.role === "admin") {
          navigate("/admin", { replace: true });
        } else {
          navigate("/home", { replace: true });
        }
      }
    } catch (error) {
      setErrorMsg(error.message || "Tài khoản hoặc mật khẩu không chính xác!");
    } finally {
      setIsLoading(false);
    }
  };

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
          <h1 style={{ fontSize: '4.5rem', fontWeight: 800, color: 'rgb(72, 225, 223)', textShadow: '0 0 20px rgba(0, 255, 213, 0.4)' }}>VibeMatch</h1>
          <p style={{ fontSize: '1.25rem', color: 'rgba(255, 255, 255, 0.85)', marginTop: '20px', lineHeight: 1.6, maxWidth: '400px' }}>
            Khám phá, chia sẻ và kết nối với những người có cùng sở thích với bạn. Đăng nhập để tiếp tục hành trình của mình!
          </p>
        </div>

        <div className="login-card">
          <h2>Welcome Back</h2>
          <p className="welcome-text">Trở lại và tiếp tục khám phá sở thích</p>

          <form className="login-form" onSubmit={handleSubmit}>
            {errorMsg && <div style={{ color: "#ff4d4f", textAlign: "center", fontWeight: "bold", background: "rgba(255,77,79,0.1)", padding: "10px", borderRadius: "8px" }}>{errorMsg}</div>}

            <div className="form-group">
              <label>Email hoặc Tên đăng nhập</label>
              <input
                type="text"
                name="identifier"
                placeholder="Nhập email hoặc username..."
                autoComplete="username"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Mật khẩu</label>
              <div className="password-wrapper" style={{ position: 'relative', width: '100%' }}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="show-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600 }}
                >
                  {showPassword ? "Ẩn" : "Hiện"}
                </button>
              </div>
            </div>

            <div className="options" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', width: '100%' }}>
              <label className="checkbox" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.7)', cursor: 'pointer' }}>
                <input type="checkbox" name="remember" /> <span>Ghi nhớ tôi</span>
              </label>
              <a href="#" className="forgot-password" style={{ color: '#4ecdc4', textDecoration: 'none' }}>Quên mật khẩu?</a>
            </div>

            <button type="submit" className="login-btn" disabled={isLoading} style={{ width: '100%' }}>
              {isLoading ? "Đang xử lý..." : "Đăng nhập ngay"}
            </button>

            <div className="signup-prompt" style={{ textAlign: 'center', color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem' }}>
              Chưa có tài khoản?{" "}
              <a
                href="#"
                className="signup-link"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/register');
                }}
                style={{ color: '#4ecdc4', textDecoration: 'none', fontWeight: 600 }}
              >
                Đăng ký ngay
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
