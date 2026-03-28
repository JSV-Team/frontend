import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";
import apiConfig from "../../config/apiConfig";
import LocationPicker from "../../components/common/LocationPicker";
import { MapPin } from "lucide-react";

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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPickerOpen, setIsPickerOpen] = useState(false);

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
      const response = await fetch(`${apiConfig.BASE_API}/login/register`, {
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
    <div className="register-page">
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
          <h1>VibeMatch</h1>
          <p style={{ fontSize: '1.25rem', color: 'rgba(255, 255, 255, 0.85)', marginTop: '20px', lineHeight: 1.6, maxWidth: '400px' }}>
            Khám phá, chia sẻ và kết nối với những người có cùng sở thích với bạn. Đăng ký để bắt đầu hành trình của mình!
          </p>
        </div>

        <div className="register-card">
          <h2>Tạo tài khoản</h2>
          <p className="welcome-text">Tham gia cộng đồng VibeMatch ngay hôm nay</p>

          <form className="register-form" onSubmit={handleSubmit}>
            {message.text && (
              <div className={`message ${message.type}`}>
                {message.text}
              </div>
            )}

            <div className="form-group">
              <label>Email hoặc số điện thoại</label>
              <input
                type="text"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Nhập email hoặc số điện thoại"
                required
              />
            </div>

            <div className="row">
              <div className="form-group flex-1">
                <label>Họ</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="Họ"
                  required
                />
              </div>

              <div className="form-group flex-1">
                <label>Tên</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Tên"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Ngày sinh</label>
              <div className="row date-row">
                <select name="day" value={formData.day} onChange={handleInputChange} className="flex-1">
                  <option value="">Ngày</option>
                  {days.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>

                <select name="month" value={formData.month} onChange={handleInputChange} className="flex-1">
                  <option value="">Tháng</option>
                  {months.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>

                <select name="year" value={formData.year} onChange={handleInputChange} className="flex-1">
                  <option value="">Năm</option>
                  {years.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Giới tính</label>
              <div className="gender-toggle">
                {["Nam", "Nữ"].map((item) => (
                  <button
                    key={item}
                    className={`gender-btn ${formData.gender === item ? "active" : ""}`}
                    onClick={() => handleGenderChange(item)}
                    type="button"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Địa chỉ hoạt động (thường xuyên)</label>
              <div className="location-input-group">
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Nhập địa chỉ hoặc chọn từ bản đồ..."
                  className="register-location-input"
                />
                <button 
                  type="button" 
                  className="map-icon-btn"
                  onClick={() => setIsPickerOpen(true)}
                  title="Chọn địa điểm từ bản đồ"
                >
                  <MapPin size={20} />
                </button>
              </div>
            </div>

            {isPickerOpen && (
              <LocationPicker
                onClose={() => setIsPickerOpen(false)}
                onConfirm={(addr) => setFormData(prev => ({ ...prev, location: addr }))}
                initialLocation={formData.location}
              />
            )}

            <div className="form-group">
              <label>Mật khẩu</label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Nhập mật khẩu"
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Ẩn" : "Hiện"}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label>Nhập lại mật khẩu</label>
              <div className="password-wrapper">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Xác nhận mật khẩu"
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? "Ẩn" : "Hiện"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="register-btn"
              disabled={loading}
              style={{ width: '100%', marginTop: '10px' }}
            >
              {loading ? "Đang xử lý..." : "Đăng ký ngay"}
            </button>

            <p className="terms-text">
              Bằng cách đăng ký, bạn đồng ý với{" "}
              <a href="#">Điều khoản</a> & <a href="#">Chính sách</a> của chúng tôi.
            </p>

            <div className="login-prompt">
              Đã có tài khoản?{" "}
              <a
                href="#"
                className="login-link"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/login');
                }}
              >
                Đăng nhập ngay
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}