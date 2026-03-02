import "./statBar.css";

export default function StatBar({ stats }) {
  return (
    <div className="st-wrap">
      <div className="st-item">★ Uy tín <b>{stats.reputation}</b></div>
      <div className="st-item">★ F-er <b>{stats.fer}</b></div>
      <div className="st-item">★ F-ing <b>{stats.fing}</b></div>
      <div className="st-item">★ Group <b>{stats.group}</b></div>
    </div>
  );
}