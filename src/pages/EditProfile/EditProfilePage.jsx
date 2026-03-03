import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import SidebarProfile from "../../components/SidebarProfile/SidebarProfile";
import TopTabs from "../../components/TopTabs/TopTabs";
import StatBar from "../../components/StatBar/StatBar";
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
  const [profile, setProfile] = useState(getInitialProfile);

  const stats = useMemo(
    () => ({ reputation: 100, fer: 100, fing: 100, group: 100 }),
    []
  );

  const [interests, setInterests] = useState(getInitialInterests);

  const addInterest = () => {
    const name = prompt("Nhập sở thích mới:");
    const v = (name || "").trim();
    if (!v) return;
    if (interests.some((x) => x.toLowerCase() === v.toLowerCase())) return;
    setInterests((p) => [...p, v]);
  };

  const [isSaving, setIsSaving] = useState(false);

  // Xử lý khi người dùng click vào avatar để chọn ảnh
  const handleAvatarClick = () => {
    const fileInput = document.getElementById("avatar-input");
    if (fileInput) {
      fileInput.click();
    }
  };

  // Xử lý khi người dùng chọn ảnh
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Đọc file và convert thành base64 để hiển thị
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile((p) => ({ ...p, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const onCancel = () => {
    // Khôi phục dữ liệu từ localStorage
    setProfile(getInitialProfile());
    setInterests(getInitialInterests());
  };

  const onSave = async () => {
    try {
      setIsSaving(true);
      console.log("SAVE:", profile, interests);
      
      // Gọi API cập nhật profile
      try {
        await profileService.updateProfile({
          ...profile,
          interests: interests
        });
      } catch (apiError) {
        // Nếu API lỗi, vẫn lưu vào localStorage để demo
        console.warn("API error, saving to localStorage only:", apiError);
      }
      
      // Lưu vào localStorage
      localStorage.setItem("userProfile", JSON.stringify(profile));
      localStorage.setItem("userInterests", JSON.stringify(interests));
      
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
        profile={{ ...profile, stats }}
        onLogout={() => alert("Logout (demo)")}
      />

      <main className="vm-main">
        <TopTabs active="edit" />
        <StatBar stats={stats} />

        <div className="ep-card">
          <div className="ep-title">Thông tin chung</div>

          <div className="ep-grid">
            {/* Hidden file input for selecting avatar */}
            <input
              type="file"
              id="avatar-input"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleAvatarChange}
            />
            
            {/* Clickable avatar */}
            <div 
              className="ep-bigAvatar" 
              onClick={handleAvatarClick}
              style={{ 
                cursor: "pointer",
                backgroundImage: profile.avatar ? `url(${profile.avatar})` : undefined,
                backgroundSize: "cover",
                backgroundPosition: "center"
              }}
              title="Click to change avatar"
            />

            <div className="ep-col">
              <input
                className="ep-input"
                value={profile.fullName}
                onChange={(e) => setProfile((p) => ({ ...p, fullName: e.target.value }))}
              />
              <input
                className="ep-input"
                value={profile.gender}
                onChange={(e) => setProfile((p) => ({ ...p, gender: e.target.value }))}
              />

              <div className="ep-dateWrap">
                <input
                  className="ep-input ep-date"
                  value={profile.dobText}
                  onChange={(e) => setProfile((p) => ({ ...p, dobText: e.target.value }))}
                />
                <div className="ep-cal">📅</div>
              </div>

              <input
                className="ep-input"
                value={profile.email}
                onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
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
                {x}
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