import { useMemo, useState } from "react";
import SidebarProfile from "../../components/SidebarProfile/SidebarProfile";
import TopTabs from "../../components/TopTabs/TopTabs";
import StatBar from "../../components/StatBar/StatBar";
import { getProfileFromLocalStorage } from "../../services/profileService";
import "../profileLayout.css";
import "./reputationPage.css";

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

export default function ReputationPage() {
  // Load profile từ localStorage
  const savedProfile = getProfileFromLocalStorage();
  const profile = savedProfile ? { ...DEFAULT_PROFILE, ...savedProfile } : DEFAULT_PROFILE;
  const interests = savedProfile?.interests || DEFAULT_INTERESTS;

  const stats = useMemo(
    () => ({ reputation: 100, fer: 100, fing: 100, group: 100 }),
    []
  );

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [deductedBy, setDeductedBy] = useState("");

  const [rows] = useState([
    { by: "-", action: "Joined", date: "2026-02-26", reason: "-", point: 0, remain: 100 },
    { by: "-", action: "Updated profile", date: "2026-02-27", reason: "-", point: 0, remain: 100 },
  ]);

  return (
    <div className="vm-page">
      <SidebarProfile
        profile={{ ...profile, stats, interests }}
        onLogout={() => alert("Logout (demo)")}
      />

      <main className="vm-main">
        <TopTabs active="reputation" />
        <StatBar stats={stats} />

        <div className="rp-headCard">
          <div className="rp-headLeft">
            <div className="rp-star">⭐</div>
            <div>
              <div className="rp-title">Lịch sử trừ điểm uy tín</div>
              <div className="rp-sub">Danh sách trừ điểm</div>
            </div>
          </div>

          <div className="rp-scorePill">Điểm hiện tại : {stats.reputation}</div>
        </div>

        <div className="rp-filterCard">
          <div className="rp-filters">
            <select className="rp-select" value={fromDate} onChange={(e) => setFromDate(e.target.value)}>
              <option value="">Từ ngày</option>
              <option value="2026-02-01">01/02/2026</option>
              <option value="2026-02-15">15/02/2026</option>
            </select>

            <select className="rp-select" value={toDate} onChange={(e) => setToDate(e.target.value)}>
              <option value="">Đến ngày</option>
              <option value="2026-02-20">20/02/2026</option>
              <option value="2026-02-28">28/02/2026</option>
            </select>

            <select className="rp-select" value={deductedBy} onChange={(e) => setDeductedBy(e.target.value)}>
              <option value="">Người trừ điểm</option>
              <option value="admin">Admin</option>
              <option value="mod">Moderator</option>
            </select>

            <button className="rp-btnFilter" onClick={() => alert("Lọc (demo) ✅")}>
              🔍 Lọc
            </button>
          </div>
        </div>

        <div className="rp-tableCard">
          <div className="rp-tableHead">
            <div>Người trừ</div>
            <div>Hành động</div>
            <div>Ngày</div>
            <div>Lý do</div>
            <div>Điểm</div>
            <div>Điểm còn lại</div>
          </div>

          <div className="rp-tableBody">
            {rows.map((r, idx) => (
              <div className="rp-row" key={idx}>
                <div>{r.by}</div>
                <div>{r.action}</div>
                <div>{r.date}</div>
                <div>{r.reason}</div>
                <div>{r.point}</div>
                <div>{r.remain}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="rp-paging">
          <button className="rp-pageBtn">Trước</button>
          <button className="rp-pageBtn active">1</button>
          <button className="rp-pageBtn">2</button>
          <button className="rp-pageBtn">3</button>
          <button className="rp-pageBtn">4</button>
          <button className="rp-pageBtn">5</button>
          <button className="rp-pageBtn">6</button>
          <button className="rp-pageBtn">Tiếp &gt;</button>
        </div>
      </main>
    </div>
  );
}