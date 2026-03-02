import { useState } from "react";
import "./Register.css";

export default function Register() {
  const [gender, setGender] = useState("Nam");

  return (<>
    
    <div className="register-container">
      <div className="register-card">

        <h2 className="title">Tạo tài khoản</h2>
        <p className="subtitle">
          Tham gia cộng đồng JSV ngay hôm nay
        </p>

        {/* Avatar */}
        <div className="avatar-wrapper">
          <div className="avatar-circle">
            <span>👤</span>
          </div>
          <div className="edit-icon">✏️</div>
        </div>

        <p className="avatar-text">Ảnh đại diện</p>
        <p className="avatar-sub">
          Tải ảnh lên để mọi người nhận ra bạn
        </p>

        {/* Email */}
        <div className="form-group">
          <label>Email hoặc số điện thoại</label>
          <input type="text" placeholder="Nhập email hoặc số điện thoại" />
        </div>

        {/* Họ Tên */}
        <div className="row">
          <div className="form-group">
            <label>Họ</label>
            <input type="text" placeholder="Họ" />
          </div>

          <div className="form-group">
            <label>Tên</label>
            <input type="text" placeholder="Tên" />
          </div>
        </div>

        {/* Ngày sinh */}
        <div className="form-group">
          <label>Ngày sinh</label>
          <div className="row">
            <select><option>Ngày</option></select>
            <select><option>Tháng</option></select>
            <select><option>Năm</option></select>
          </div>
        </div>

        {/* Giới tính */}
        <div className="form-group">
          <label>Giới tính</label>
          <div className="gender">
            {["Nam", "Nữ", "Khác"].map((item) => (
              <button
                key={item}
                className={gender === item ? "active" : ""}
                onClick={() => setGender(item)}
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
            <input type="text" placeholder="Nhập địa chỉ của bạn" />
            <span>📍</span>
          </div>
        </div>

        {/* Mật khẩu */}
        <div className="form-group">
          <label>Mật khẩu</label>
          <div className="input-icon">
            <input type="password" placeholder="Nhập mật khẩu" />
            <span>👁</span>
          </div>
        </div>

        <div className="form-group">
          <label>Nhập lại mật khẩu</label>
          <div className="input-icon">
            <input type="password" placeholder="Xác nhận mật khẩu" />
            <span>👁</span>
          </div>
        </div>

        {/* Button */}
        <button className="submit-btn">Đăng ký</button>

        <p className="terms">
          Bằng cách đăng ký, bạn đồng ý với
          <span> Điều khoản</span> &
          <span> Chính sách</span> của chúng tôi.
        </p>

        <p className="login-link">
          Đã có tài khoản? <span>Đăng nhập ngay</span>
        </p>

      </div>
    </div></>
  );
}