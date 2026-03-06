import { useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import InterestChips from "../components/InterestChips/InterestChips";
import { profileService } from "../services/profile.service";
import "./profileEdit.css";

const genders = ["Male", "Female", "Khác"];

export default function ProfileEdit() {
  const { USER_ID, profile, setProfile, interests, setInterests } = useOutletContext();

  const [form, setForm] = useState({
    full_name: "",
    gender: "Khác",
    dob: "",
    email: "",
  });

  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });

  // Map dữ liệu từ layout -> form
  useEffect(() => {
    setForm({
      full_name: profile?.full_name || profile?.fullName || "",
      gender: profile?.gender || "Khác",
      dob: normalizeDate(profile?.dob || profile?.date_of_birth || profile?.birth_date || ""),
      email: profile?.email || "",
    });
  }, [profile]);

  const original = useMemo(() => ({
    full_name: profile?.full_name || profile?.fullName || "",
    gender: profile?.gender || "Khác",
    dob: normalizeDate(profile?.dob || profile?.date_of_birth || profile?.birth_date || ""),
    email: profile?.email || "",
    interests: Array.isArray(interests) ? interests : [],
  }), [profile, interests]);

  const onChange = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const onCancel = () => {
    setMsg({ type: "", text: "" });
    setForm({
      full_name: original.full_name,
      gender: original.gender,
      dob: original.dob,
      email: original.email,
    });
    setInterests(original.interests);
  };

  const onSave = async () => {
    setSaving(true);
    setMsg({ type: "", text: "" });

    try {
      // 1) update user
      const payload = {
        full_name: form.full_name.trim(),
        gender: form.gender,
        dob: form.dob || null, // yyyy-mm-dd
        email: form.email.trim(),
      };

      await profileService.updateProfile(USER_ID, payload);

      // 2) update interests
      await profileService.updateInterests(USER_ID, interests);

      // 3) refresh profile from server (optional nhưng sạch)
      const fresh = await profileService.getProfile(USER_ID);
      setProfile(fresh.data);

      setMsg({ type: "success", text: "Lưu thành công ✅" });
    } catch (e) {
      const text =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        "Lưu thất bại. Kiểm tra backend/DB hoặc dữ liệu gửi lên.";
      setMsg({ type: "danger", text });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="pe-wrap">
      <div className="card pe-card">
        <div className="card-body">
          <h4 className="pe-title">Thông tin chung</h4>

          {msg.text && (
            <div className={`alert alert-${msg.type} pe-alert`} role="alert">
              {msg.text}
            </div>
          )}

          <div className="row g-3 mt-1">
            <div className="col-12 col-md-6">
              <label className="form-label">Họ và tên</label>
              <input
                className="form-control pe-input"
                value={form.full_name}
                onChange={(e) => onChange("full_name", e.target.value)}
                placeholder="Nhập tên..."
              />
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label">Giới tính</label>
              <select
                className="form-select pe-input"
                value={form.gender}
                onChange={(e) => onChange("gender", e.target.value)}
              >
                {genders.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label">Ngày sinh</label>
              <input
                type="date"
                className="form-control pe-input"
                value={form.dob}
                onChange={(e) => onChange("dob", e.target.value)}
              />
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label">Email</label>
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

      <div className="card pe-card mt-4">
        <div className="card-body">
          <h4 className="pe-title">Sở thích</h4>
          <InterestChips value={interests} onChange={setInterests} />
        </div>
      </div>

      <div className="pe-actions">
        <button type="button" className="btn btn-danger pe-btn pe-cancel" onClick={onCancel} disabled={saving}>
          Hủy
        </button>
        <button type="button" className="btn btn-success pe-btn pe-save" onClick={onSave} disabled={saving}>
          {saving ? "Đang lưu..." : "Lưu"}
        </button>
      </div>
    </div>
  );
}

function normalizeDate(input) {
  if (!input) return "";
  // Nếu input là "01/02/2000" -> đổi sang "2000-02-01" (tạm xử lý đơn giản)
  if (typeof input === "string" && input.includes("/")) {
    const [dd, mm, yyyy] = input.split("/").map((x) => x.trim());
    if (yyyy && mm && dd) return `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
  }
  // Nếu input là ISO datetime
  if (typeof input === "string" && input.includes("T")) return input.split("T")[0];
  // Nếu đã là yyyy-mm-dd
  return input;
}