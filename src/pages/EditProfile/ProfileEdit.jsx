import { useEffect, useMemo, useState, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import InterestChips from "../../components/InterestChips/InterestChips";
import Toast from "../../components/Toast/Toast";
import { profileService } from "../../services/profileService";
import "./ProfileEdit.css";

export default function ProfileEdit() {
  const context = useOutletContext() || {};
  const { USER_ID, profile, setProfile, interests, setInterests } = context;
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    bio: "",
    full_name: "",
    gender: "",
    dob: "",
    location: "",
    email: "",
  });

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });

  // Map dữ liệu từ layout -> form
  useEffect(() => {
    setForm({
      bio: profile?.bio || "",
      full_name: profile?.full_name || profile?.fullName || "",
      gender: profile?.gender || "",
      dob: profile?.dob ? new Date(profile.dob).toLocaleDateString('en-CA') : "",
      location: profile?.location || "",
      email: profile?.email || "",
    });
  }, [profile]);

  const original = useMemo(() => ({
    bio: profile?.bio || "",
    full_name: profile?.full_name || profile?.fullName || "",
    gender: profile?.gender || "",
    dob: profile?.dob ? new Date(profile.dob).toLocaleDateString('en-CA') : "",
    location: profile?.location || "",
    email: profile?.email || "",
    interests: Array.isArray(interests) ? interests : [],
  }), [profile, interests]);

  const onChange = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    setUploading(true);
    setMsg({ type: "", text: "" });

    try {
      // 1. Upload to backend
      const res = await profileService.uploadAvatar(file);
      // Sử dụng fullUrl nếu có, fallback về url
      const newAvatarUrl = res.fullUrl || res.url;

      // 2. Update profile with new avatar URL
      await profileService.updateProfile(USER_ID, { avatar_url: newAvatarUrl });
      
      // 3. Refresh local state
      const fresh = await profileService.getProfile(USER_ID);
      setProfile(fresh);
      
      // --- THE REMEDY ---
      // Update localStorage with the new avatar_url so Header can read it
      const userString = localStorage.getItem("user");
      if (userString) {
        const userData = JSON.parse(userString);
        userData.avatar_url = newAvatarUrl;
        localStorage.setItem("user", JSON.stringify(userData));
        // Dispatch event for Header to listen
        window.dispatchEvent(new Event('userUpdated'));
      }
      
      setMsg({ type: "success", text: "Cập nhật ảnh đại diện thành công! ✨" });
      setTimeout(() => setMsg({ type: "", text: "" }), 3000); // Auto-hide after 3s
    } catch (err) {
      console.error("Upload error:", err);
      setMsg({ type: "danger", text: "Không thể tải ảnh lên. Thử lại sau." });
    } finally {
      setUploading(false);
    }
  };

  const onCancel = () => {
    setMsg({ type: "", text: "" });
    setForm({
      bio: original.bio,
      full_name: original.full_name,
      gender: original.gender,
      dob: original.dob,
      location: original.location,
      email: original.email,
    });
    setInterests(original.interests);
  };

  const onSave = async () => {
    setSaving(true);
    setMsg({ type: "", text: "" });

    try {
      // 1) update user
      await profileService.updateProfile(USER_ID, {
        bio: form.bio.trim(),
        full_name: form.full_name.trim(),
        gender: form.gender,
        dob: form.dob || null,
        location: form.location.trim(),
        email: form.email.trim(),
      });

      // 2) update interests
      await profileService.updateInterests(USER_ID, interests);

      // 3) refresh profile
      const fresh = await profileService.getProfile(USER_ID);
      setProfile(fresh);

      // --- THE REMEDY ---
      // Update localStorage with the new full_name so Header can read it
      const userString = localStorage.getItem("user");
      if (userString) {
        const userData = JSON.parse(userString);
        userData.full_name = form.full_name.trim(); // Update name in storage
        localStorage.setItem("user", JSON.stringify(userData));
        // Dispatch event for Header to listen
        window.dispatchEvent(new Event('userUpdated'));
      }

      setMsg({ type: "success", text: "Lưu thành công ✅" });
      setTimeout(() => setMsg({ type: "", text: "" }), 3000); // Auto-hide after 3s
    } catch (e) {
      setMsg({ type: "danger", text: "Lưu thất bại. Vui lòng thử lại." });
    } finally {
      setSaving(false);
    }
  };

  const currentAvatar = profile?.avatar_url || profile?.avatar;

  return (
    <div className="pe-wrap">
      {msg.text && (
        <Toast
          type={msg.type === 'danger' ? 'error' : msg.type}
          message={msg.text}
          onClose={() => setMsg({ type: "", text: "" })}
          duration={3000}
        />
      )}
      
      <div className="card pe-card">
        <div className="card-body">
          <h4 className="pe-title">Thông tin chung</h4>

          <div className="pe-flex-container">
            {/* Cột trái: Avatar */}
            <div className="pe-avatar-section">
              <div className="pe-avatar-box" onClick={handleAvatarClick}>
                {currentAvatar ? (
                  <img src={currentAvatar.startsWith('http') ? currentAvatar : `http://127.0.0.1:3001${currentAvatar}`} alt="Avatar" />
                ) : (
                  <div className="pe-avatar-placeholder">
                    {form.full_name?.charAt(0).toUpperCase() || "?"}
                  </div>
                )}
                <div className="pe-avatar-overlay">
                  <span>{uploading ? "..." : "Thay đổi ảnh"}</span>
                </div>
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                style={{ display: "none" }} 
                accept="image/*"
                onChange={handleAvatarChange}
              />
            </div>

            {/* Cột phải: Inputs */}
            <div className="pe-inputs-section">
              <div className="pe-form-row mb-4">
                <label className="pe-label-h">Tiểu sử</label>
                <div className="pe-input-field">
                  <textarea
                    className="form-control pe-input pe-textarea"
                    value={form.bio}
                    onChange={(e) => onChange("bio", e.target.value)}
                    placeholder="Giới thiệu một chút về bản thân..."
                    rows={2}
                  />
                </div>
              </div>

              <div className="pe-form-row mb-3">
                <label className="pe-label-h">Họ và tên</label>
                <div className="pe-input-field">
                  <input
                    className="form-control pe-input"
                    value={form.full_name}
                    onChange={(e) => onChange("full_name", e.target.value)}
                    placeholder="Nhập tên..."
                  />
                </div>
              </div>

              <div className="pe-form-row mb-3">
                <label className="pe-label-h">Giới tính</label>
                <div className="pe-input-field">
                  <select 
                    className="form-select pe-input"
                    value={form.gender}
                    onChange={(e) => onChange("gender", e.target.value)}
                  >
                    <option value="">Chọn giới tính</option>
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>
              </div>

              <div className="pe-form-row mb-3">
                <label className="pe-label-h">Ngày sinh</label>
                <div className="pe-input-field">
                  <input
                    type="date"
                    className="form-control pe-input"
                    value={form.dob}
                    onChange={(e) => onChange("dob", e.target.value)}
                  />
                </div>
              </div>

              <div className="pe-form-row mb-3">
                <label className="pe-label-h">Địa điểm</label>
                <div className="pe-input-field">
                  <input
                    className="form-control pe-input"
                    value={form.location}
                    onChange={(e) => onChange("location", e.target.value)}
                    placeholder="Tp. Hồ Chí Minh, Việt Nam"
                  />
                </div>
              </div>

              <div className="pe-form-row mb-0">
                <label className="pe-label-h">Email</label>
                <div className="pe-input-field">
                  <input
                    className="form-control pe-input"
                    value={form.email}
                    onChange={(e) => onChange("email", e.target.value)}
                    placeholder="example@gmail.com"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card pe-card mt-4">
        <div className="card-body">
          <div className="pe-interests-content">
            <InterestChips 
              value={interests} 
              onChange={setInterests}
              onSave={async (newInterests) => {
                try {
                  await profileService.updateInterests(USER_ID, newInterests);
                  // Update localStorage user object
                  const userString = localStorage.getItem("user");
                  if (userString) {
                    const userData = JSON.parse(userString);
                    userData.interests = newInterests;
                    localStorage.setItem("user", JSON.stringify(userData));
                  }
                  console.log('✅ Interests saved automatically');
                } catch (error) {
                  console.error('❌ Failed to save interests:', error);
                  throw error;
                }
              }}
            />
          </div>
        </div>
      </div>

      <div className="pe-actions">
        <button type="button" className="btn btn-danger pe-btn pe-cancel" onClick={onCancel} disabled={saving}>
          Hủy
        </button>
        <button type="button" className="btn btn-success pe-btn pe-save" onClick={onSave} disabled={saving || uploading}>
          {saving ? "Đang lưu..." : "Lưu"}
        </button>
      </div>
    </div>
  );
}