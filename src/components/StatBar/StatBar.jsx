import "./statBar.css";

export default function StatBar({ stats }) {
  if (!stats) return null;

  const items = [
    { label: "Uy tín", value: stats.reputation || 0, color: "#f59e0b" }, // Amber/Vàng
    { label: "F-er", value: stats.fer || 0, color: "#ec4899" }, // Pink
    { label: "F-ing", value: stats.fing || 0, color: "#10b981" }, // Emerald/Xanh
    { label: "Group", value: stats.group || 0, color: "#8b5cf6" }, // Purple/Tím
  ];

  return (
    <div className="st-wrap">
      {items.map((item, index) => (
        <div key={index} className="st-item">
          <span className="st-icon" style={{ color: item.color }}>★</span> 
          {item.label} 
          <b style={{ color: item.color }}>{item.value}</b>
        </div>
      ))}
    </div>
  );
}

