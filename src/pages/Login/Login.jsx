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
    <main className="bg">
      <section className="card" aria-label="Login">
        <h1 className="title">LOGIN</h1>

        {/* Khối hiển thị lỗi: Chỉ hiện ra khi biến errorMsg có chữ */}
        {errorMsg && (
          <div style={{ color: "#ff4d4f", textAlign: "center", marginBottom: "15px", fontWeight: "bold" }}>
            {errorMsg}
          </div>
        )}

        <form className="form" onSubmit={handleSubmit}>
          <label className="field">
            <span className="fieldIcon">👤</span>
            <input
              type="text"
              name="identifier" // Đổi name thành tiếng Anh cho chuẩn mực
              placeholder="Gmail hoặc Username" // Cập nhật lại placeholder cho khớp với DB
              autoComplete="username"
              required
              // Trói chặt ô input vào State (Truyền hình trực tiếp)
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
            />
          </label>

          <label className="field">
            <span className="fieldIcon">🔒</span>
            <input
              type="password"
              name="password"
              placeholder="password"
              autoComplete="current-password"
              required
              // Trói chặt ô mật khẩu vào State
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          <div className="row">
            <label className="check">
              <input type="checkbox" name="remember" />
              <span>Remember me</span>
            </label>


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
