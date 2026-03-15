import { useMemo, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import SidebarProfile from "../../components/SidebarProfile/SidebarProfile";
import TopTabs from "../../components/TopTabs/TopTabs";
import StatBar from "../../components/StatBar/StatBar";
import { saveProfileToLocalStorage, getProfileFromLocalStorage } from "../../services/profileService";
import { profileService } from "../../services/profileService";
import "../profileLayout.css";
import "./editProfilePage.css";

// Hàm lấy dữ liệu profile từ localStorage hoặc giá trị mặc định
const getInitialProfile = () => {
  const saved = localStorage.getItem("userProfile");
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error("Error parsing saved profile:", e);
    }
  }
  return {
    fullName: "Bạn",
    gender: "Khác",
    dobISO: "2000-01-02",
    dobText: "01/02/2000",
    email: "hxoa@gmail.com",
    avatar: null,
  };
};

// Hàm lấy danh sách interests từ localStorage hoặc giá trị mặc định
const getInitialInterests = () => {
  const saved = localStorage.getItem("userInterests");
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error("Error parsing saved interests:", e);
    }
  }
  return ["Bóng đá", "Chạy bộ", "Cầu lông"];
};

export default function EditProfilePage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [profile, setProfile] = useState(getInitialProfile);
  const [interests, setInterests] = useState(getInitialInterests);
  const [avatarPreview, setAvatarPreview] = useState(profile.avatar || "");
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const stats = useMemo(
    () => ({ reputation: 100, fer: 100, fing: 100, group: 100 }),
    []
  );

  // Xử lý khi chọn ảnh
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Đọc file và convert thành base64 để hiển thị
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfile((p) => ({ ...p, avatar: reader.result }));
      setAvatarPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const addInterest = () => {
    const name = prompt("Nhập sở thích mới:");
    const v = (name || "").trim();
    if (!v) return;
    if (interests.some((x) => x.toLowerCase() === v.toLowerCase())) return;
    setInterests((p) => [...p, v]);
  };

  const onCancel = () => {
    // Khôi phục dữ liệu từ localStorage
    const savedProfile = getInitialProfile();
    setProfile(savedProfile);
    setAvatarPreview(savedProfile.avatar || "");
    setInterests(getInitialInterests());
  };

  const onSave = async () => {
    try {
      setIsSaving(true);
      console.log("SAVE:", profile, interests);
      
      // Lưu vào localStorage
      localStorage.setItem("userProfile", JSON.stringify(profile));
      localStorage.setItem("userInterests", JSON.stringify(interests));
      
      // Gửi sự kiện để Header cập nhật avatar
      window.dispatchEvent(new Event('profile-updated'));
      
      console.log("Saved to localStorage:", { profile, interests });
      alert("Lưu thành công! ✅");
      // Chuyển hướng về trang hồ sơ cá nhân
      navigate("/profile");
    } catch (error) {
      console.error("Save error:", error);
      alert("Lỗi khi lưu: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="vm-page">
      <SidebarProfile
        profile={{ ...profile, interests, stats, avatar: avatarPreview }}
        onLogout={() => alert("Logout (demo)")}
      />

      <main className="vm-main">
        <TopTabs active="edit" />
        <StatBar stats={stats} />

        <div className="ep-card">
          <div className="ep-title">Thông tin chung</div>

          <div className="ep-grid">
            {/* Avatar with upload functionality */}
            <div 
              className="ep-bigAvatar" 
              onClick={handleAvatarClick}
              style={{ cursor: 'pointer', position: 'relative' }}
            >
              <img
                src={avatarPreview || "https://i.pravatar.cc/150?img=11"}
                alt="Avatar"
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
              />
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'rgba(0,0,0,0.6)',
                color: 'white',
                textAlign: 'center',
                padding: '4px',
                fontSize: '12px',
                borderRadius: '0 0 50% 50%'
              }}>
                {isUploading ? 'Đang tải...' : 'Đổi ảnh'}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleAvatarChange}
                disabled={isUploading}
              />
            </div>

            <div className="ep-col">
              <input
                className="ep-input"
                value={profile.fullName}
                onChange={(e) => setProfile((p) => ({ ...p, fullName: e.target.value }))}
                placeholder="Họ và tên"
              />
              
              {/* Giới tính - Select option */}
              <select
                className="ep-input"
                value={profile.gender}
                onChange={(e) => setProfile((p) => ({ ...p, gender: e.target.value }))}
              >
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>

              <div className="ep-dateWrap">
                <input
                  className="ep-input ep-date"
                  type="date"
                  value={profile.dobISO}
                  onChange={(e) => {
                    const dobISO = e.target.value;
                    // Chuyển đổi sang định dd/mm/yyyy
                    if(dobISO) {
                        const [year, month, day] = dobISO.split('-');
                        const dobText = `${day}/${month}/${year}`;
                        setProfile((p) => ({ ...p, dobISO, dobText }));
                    } else {
                        setProfile((p) => ({ ...p, dobISO: "", dobText: "" }));
                    }
                  }}
                />
                <div className="ep-cal">📅</div>
              </div>

              <input
                className="ep-input"
                type="email"
                value={profile.email}
                onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
                placeholder="Email"
              />
            </div>
          </div>
        </div>

        <div className="ep-card">
          <div className="ep-title">Sở thích</div>

          <div className="ep-chips">
            {interests.map((x, idx) => (
              <button
                key={x}
                className={`ep-chip ${idx === 0 ? "c-blue" : idx === 1 ? "c-orange" : "c-gray"}`}
                type="button"
                title="Bấm để xóa"
                onClick={() => setInterests((p) => p.filter((i) => i !== x))}
              >
                {x} ×
              </button>
            ))}

            <button className="ep-chip c-sky" type="button" onClick={addInterest}>
              +Thêm
            </button>
          </div>
        </div>

        <div className="ep-actions">
          <button className="ep-btn ep-cancel" onClick={onCancel}>Hủy</button>
          <button className="ep-btn ep-save" onClick={onSave} disabled={isSaving}>
            {isSaving ? "Đang lưu..." : "Lưu"}
          </button>
        </div>
      </main>
    </div>
  );
}
