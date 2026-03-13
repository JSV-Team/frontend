import { useNavigate, useParams } from "react-router-dom";
import "./topTabs.css";

export default function TopTabs({ active = "edit" }) {
  const navigate = useNavigate();
  const { userId } = useParams();
  
  // Use the actual userId from the URL param, or fallback to something if needed
  const targetId = userId || "me";

  const tabs = [
    { id: "edit", label: "Chỉnh sửa", path: "edit" },
    { id: "reputation", label: "Uy tín", path: "reputation" },
    { id: "posts", label: "Đăng bài", path: "posts" },
  ];

  return (
    <div className="tt-wrap">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`tt-tab ${active === tab.id ? "active" : ""}`}
          onClick={() => navigate(`/profile/${targetId}/${tab.path}`)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

