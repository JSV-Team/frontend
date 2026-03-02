import { useMemo, useState } from "react";
import SidebarProfile from "../components/SidebarProfile/SidebarProfile";
import TopTabs from "../components/TopTabs/TopTabs";
import StatBar from "../components/StatBar/StatBar";
import "./profileLayout.css";
import "./editProfilePage.css";

export default function EditProfilePage() {
  const [profile, setProfile] = useState({
    fullName: "Bạn",
    gender: "Khác",
    dobISO: "2000-01-02",
    dobText: "01/02/2000",
    email: "hxoa@gmail.com",
  });

  const stats = useMemo(
    () => ({ reputation: 100, fer: 100, fing: 100, group: 100 }),
    []
  );

  const [interests, setInterests] = useState(["Bóng đá", "Chạy bộ", "Cầu lông"]);

  const addInterest = () => {
    const name = prompt("Nhập sở thích mới:");
    const v = (name || "").trim();
    if (!v) return;
    if (interests.some((x) => x.toLowerCase() === v.toLowerCase())) return;
    setInterests((p) => [...p, v]);
  };

  const onCancel = () => {
    setProfile({
      fullName: "Bạn",
      gender: "Khác",
      dobISO: "2000-01-02",
      dobText: "01/02/2000",
      email: "hxoa@gmail.com",
    });
    setInterests(["Bóng đá", "Chạy bộ", "Cầu lông"]);
  };

  const onSave = () => {
    console.log("SAVE:", profile, interests);
    alert("Đã lưu (demo) ✅");
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
            <div className="ep-bigAvatar" />

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
          <button className="ep-btn ep-save" onClick={onSave}>Lưu</button>
        </div>
      </main>
    </div>
  );
}