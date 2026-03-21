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
      console.log("Đang gọi API login cho:", identifier);
      const result = await loginService.login(identifier, password);
      console.log("Kết quả:", result);

      if (result.success) {
        localStorage.setItem("user", JSON.stringify(result.user));
        localStorage.setItem("token", result.token);
        navigate("/home");
      } else {
        setErrorMsg("Đăng nhập thất bại. Vui lòng thử lại!");
      }
    } catch (error) {
      console.error("Lỗi login:", error);
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

      <form className="form" onSubmit={handleSubmit}>
        {errorMsg && <div className="error">{errorMsg}</div>}
        
        <label className="field">
          <span className="fieldIcon">👤</span>
          <input
            type="text"
            name="identifier"
            placeholder="Gmail hoặc Username"
            autoComplete="username"
            required
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
          />
        </label>

        <label className="field">
          <span className="fieldIcon">🔒</span>
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
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "Ẩn" : "Hiện"}
          </button>
        </label>

        <div className="row">
          <label className="check">
            <input type="checkbox" name="remember" />
            <span>Remember me</span>
          </label>
        </div>

        <button className="btn primary" type="submit" disabled={isLoading}>
          {isLoading ? "Đang xử lý..." : "Đăng nhập"}
        </button>

        <p className="foot">
          Not a member?{" "}
          <a 
            className="link" 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              navigate('/register');
            }}
          >
            Sign up now
          </a>
        </p>
      </form>
    </div>
  );
}
