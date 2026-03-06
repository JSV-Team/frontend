import { useMemo, useState, useEffect, useRef } from "react";
import SidebarProfile from "../../components/SidebarProfile/SidebarProfile";
import TopTabs from "../../components/TopTabs/TopTabs";
import StatBar from "../../components/StatBar/StatBar";
import { saveProfileToLocalStorage, getProfileFromLocalStorage } from "../../services/profileService";
import "../profileLayout.css";
import "./editProfilePage.css";

// Dữ liệu mặc định
const DEFAULT_PROFILE = {
  fullName: "Bạn",
  gender: "Khác",
  dobISO: "2000-01-02",
  dobText: "01/02/2000",
  email: "hxoa@gmail.com",
  avatar: "",
};

const DEFAULT_INTERESTS = ["Bóng đá", "Chạy bộ", "Cầu lông"];

export default function EditProfilePage() {
  const fileInputRef = useRef(null);
  
  // Load dữ liệu từ localStorage hoặc dùng mặc định
  const [profile, setProfile] = useState(() => {
    const saved = getProfileFromLocalStorage();
    return saved ? { ...DEFAULT_PROFILE, ...saved } : DEFAULT_PROFILE;
  });

  const [interests, setInterests] = useState(() => {
    const saved = getProfileFromLocalStorage();
    return saved?.interests || DEFAULT_INTERESTS;
  });

  const [avatarPreview, setAvatarPreview] = useState(profile.avatar || "");
  const [isUploading, setIsUploading] = useState(false);

  const stats = useMemo(
    () => ({ reputation: 100, fer: 100, fing: 100, group: 100 }),
    []
  );

  // Xử lý khi chọn ảnh
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Tạo preview cục bộ
    const localPreview = URL.createObjectURL(file);
    setAvatarPreview(localPreview);
    setProfile((p) => ({ ...p, avatar: localPreview }));
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
    const saved = getProfileFromLocalStorage();
    if (saved) {
      setProfile(saved);
      setAvatarPreview(saved.avatar || "");
      setInterests(saved.interests || DEFAULT_INTERESTS);
    } else {
      setProfile(DEFAULT_PROFILE);
      setAvatarPreview("");
      setInterests(DEFAULT_INTERESTS);
    }
  };

  const onSave = () => {
    // Lưu vào localStorage
    const profileData = {
      ...profile,
      interests: interests,
    };
    saveProfileToLocalStorage(profileData);
    
    // Gửi sự kiện để Header cập nhật avatar
    window.dispatchEvent(new Event('profile-updated'));
    
    alert("Đã lưu thông tin thành công! ✅");
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
                    const [year, month, day] = dobISO.split('-');
                    const dobText = `${day}/${month}/${year}`;
                    setProfile((p) => ({ ...p, dobISO, dobText }));
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
          <button className="ep-btn ep-save" onClick={onSave}>Lưu</button>
        </div>
      </main>
    </div>
  );
}
