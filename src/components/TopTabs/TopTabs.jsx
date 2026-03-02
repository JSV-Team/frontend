import { useNavigate } from "react-router-dom";
import "./topTabs.css";

export default function TopTabs({ active = "edit" }) {
  const nav = useNavigate();

  return (
    <div className="tt-wrap">
      <button
        className={`tt-tab ${active === "edit" ? "active" : ""}`}
        onClick={() => nav("/profile/edit")}
      >
        Chỉnh sửa
      </button>

      <button
        className={`tt-tab ${active === "reputation" ? "active" : ""}`}
        onClick={() => nav("/profile/reputation")}
      >
        Uy tín
      </button>

      <button
        className={`tt-tab ${active === "posts" ? "active" : ""}`}
        onClick={() => nav("/profile/posts")}
      >
        Đăng bài
      </button>
    </div>
  );
}