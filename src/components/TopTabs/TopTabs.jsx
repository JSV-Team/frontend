import { useNavigate, useParams } from "react-router-dom";
import "./topTabs.css";

export default function TopTabs({ active = "edit" }) {
  const navigate = useNavigate();
  const { username } = useParams();
  
  // Use the username from the URL param
  const targetId = username || "me";

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

