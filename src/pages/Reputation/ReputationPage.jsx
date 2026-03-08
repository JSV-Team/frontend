import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import "./reputationPage.css";

export default function ReputationPage() {
  const { stats } = useOutletContext();

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [rows] = useState([
    { by: "-", action: "Joined", date: "2026-02-26", reason: "-", point: 0, remain: 100 },
    { by: "-", action: "Updated profile", date: "2026-02-27", reason: "-", point: 0, remain: 100 },
  ]);

  return (
    <div className="rp-wrap">
      <div className="rp-headCard">
        <div className="rp-headLeft">
          <div className="rp-star">⭐</div>
          <div>
            <div className="rp-title">Lịch sử trừ điểm uy tín</div>
            <div className="rp-sub">Danh sách trừ điểm</div>
          </div>
        </div>

        <div className="rp-scorePill">Điểm hiện tại : {stats?.reputation || 0}</div>
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

          <button className="rp-btnFilter" onClick={() => alert("Lọc (demo) ✅")}>
            🔍 Lọc
          </button>
        </div>
      </div>

      <div className="rp-tableCard">
        <div className="rp-tableHead">
          <div>Hành động</div>
          <div>Ngày</div>
          <div>Lý do</div>
          <div>Điểm</div>
          <div>Điểm còn lại</div>
        </div>

        <div className="rp-tableBody">
          {rows.map((r, idx) => (
            <div className="rp-row" key={idx}>
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
    </div>
  );
}