import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import công cụ chuyển trang
import { loginService } from "../../services/loginService"; // Import file service vừa tạo
import "./login.css";

export default function Login() {
  // 1. Tạo "bộ nhớ" (State) để kiểm soát các ô nhập liệu
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  
  // 2. Tạo State để quản lý trạng thái (Đang xoay xoay hay Đang báo lỗi)
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  // 3. Hàm xử lý khi bấm nút
  const handleSubmit = async (e) => {
    e.preventDefault(); // Rất quan trọng: Chặn Form reload lại cả trang web
    setErrorMsg(""); // Xóa câu chửi cũ (nếu có) trước khi thử đăng nhập lại

    // Kiểm tra sơ bộ xem có để trống không
    if (!identifier || !password) {
      setErrorMsg("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    setIsLoading(true); // Bật chế độ "Đang tải"

    try {
      // Nhờ anh chạy vặt gửi data sang Backend (cổng 3001)
      const result = await loginService.login(identifier, password);
      
      if (result.success) {
        // Đăng nhập thành công, đá người dùng về trang chủ (hoặc trang match/friends tùy bạn)
        localStorage.setItem("user", JSON.stringify(result.data));
        navigate("/"); 
      }
    } catch (error) {
      // Hứng lỗi 401, 403 từ Backend ném sang
      setErrorMsg(error.message || "Tài khoản hoặc mật khẩu không chính xác!");
    } finally {
      setIsLoading(false); // Xong xuôi thì tắt chế độ tải
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

            <a className="link" href="#">
              Forgot your password?
            </a>
          </div>

          <button 
            className="btn primary" 
            type="submit" 
            disabled={isLoading} // Nếu đang load thì vô hiệu hóa nút, chống bấm 2 lần
          >
            {isLoading ? "Đang xử lý..." : "Login"}
          </button>

          <p className="foot">
            Not a member? <a className="link" href="#" onClick={(e) => {
              e.preventDefault();
              navigate('/register');
            }}>Sign up now</a>
          </p>
        </form>
      </section>
    </main>
  );
}