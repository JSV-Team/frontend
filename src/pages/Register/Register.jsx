import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    day: "",
    month: "",
    year: "",
    gender: "Nam",
    location: "",
    password: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1950 + 1 }, (_, i) => currentYear - i);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGenderChange = (newGender) => {
    setFormData(prev => ({
      ...prev,
      gender: newGender
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    // Validate
    if (!formData.email || !formData.firstName || !formData.lastName || 
        !formData.password || !formData.confirmPassword) {
      setMessage({ type: "error", text: "Vui lòng điền tất cả thông tin bắt buộc" });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage({ type: "error", text: "Mật khẩu không trùng khớp" });
      return;
    }

    if (formData.password.length < 6) {
      setMessage({ type: "error", text: "Mật khẩu phải có ít nhất 6 ký tự" });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:3001/api/login/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: formData.email,
          username: `${formData.email.split("@")[0]}_${Math.floor(Math.random() * 10000)}`,
          password: formData.password,
          full_name: `${formData.firstName} ${formData.lastName}`,
          location: formData.location
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: "success", text: "Đăng ký thành công! 🎉 Đang chuyển sang trang đăng nhập..." });
        setFormData({
          email: "",
          firstName: "",
          lastName: "",
          day: "",
          month: "",
          year: "",
          gender: "Nam",
          location: "",
          password: "",
          confirmPassword: ""
        });
        // Chuyển sang trang Login sau 2 giây
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setMessage({ type: "error", text: data.error || data.message || "Đăng ký thất bại" });
      }
    } catch (error) {
      console.error("Register error:", error);
      setMessage({ type: "error", text: "Lỗi kết nối: " + error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="register-container">
        <div className="register-card">
          <h2 className="title">Tạo tài khoản</h2>
          <p className="subtitle">Tham gia cộng đồng JSV ngay hôm nay</p>

          {/* Message */}
          {message.text && (
            <div className={`message ${message.type}`}>
              {message.text}
            </div>
          )}

          {/* Email */}
          <div className="form-group">
            <label>Email hoặc số điện thoại</label>
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Nhập email hoặc số điện thoại"
            />
          </div>

          {/* Họ Tên */}
          <div className="row">
            <div className="form-group">
              <label>Họ</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="Họ"
              />
            </div>

            <div className="form-group">
              <label>Tên</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Tên"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Ngày sinh</label>
            <div className="row">
              <select name="day" value={formData.day} onChange={handleInputChange}>
                <option value="">Ngày</option>
                {days.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>

              <select name="month" value={formData.month} onChange={handleInputChange}>
                <option value="">Tháng</option>
                {months.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>

              <select name="year" value={formData.year} onChange={handleInputChange}>
                <option value="">Năm</option>
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Giới tính */}
          <div className="form-group">
            <label>Giới tính</label>
            <div className="gender">
              {["Nam", "Nữ"].map((item) => (
                <button
                  key={item}
                  className={formData.gender === item ? "active" : ""}
                  onClick={() => handleGenderChange(item)}
                  type="button"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Địa chỉ */}
          <div className="form-group">
            <label>Địa chỉ hoạt động (thường xuyên)</label>
            <div className="input-icon">
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Nhập địa chỉ của bạn"
              />
            </div>
          </div>

          {/* Mật khẩu */}
          <div className="form-group">
            <label>Mật khẩu</label>
            <div className="input-icon">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Nhập mật khẩu"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Nhập lại mật khẩu</label>
            <div className="input-icon">
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Xác nhận mật khẩu"
              />
            </div>
          </div>

          {/* Button */}
          <button
            className="submit-btn"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Đang xử lý..." : "Đăng ký"}
          </button>

          <p className="terms">
            Bằng cách đăng ký, bạn đồng ý với
            <span> Điều khoản</span> &
            <span> Chính sách</span> của chúng tôi.
          </p>

          <p className="login-link">
            Đã có tài khoản? <a href="#" onClick={(e) => {
              e.preventDefault();
              navigate('/login');
            }}>Đăng nhập ngay</a>
          </p>
        </div>
      </div>
    </>
  );
}