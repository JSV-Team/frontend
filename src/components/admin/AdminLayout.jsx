import React, { useState, useEffect, useRef } from "react";
import apiConfig from "../../config/apiConfig";
import { Outlet, useNavigate } from "react-router-dom";
import { Bell, Search, User, FileText, X } from "lucide-react";
import AdminSidebar from "./AdminSidebar";
import { getCurrentUser } from "../../utils/auth";
import "./Admin.css";

function AdminLayout() {
  const currentUser = getCurrentUser();
  const navigate = useNavigate();

  // ── Search ─────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim().length > 0) {
        fetchSuggestions();
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchSuggestions = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${apiConfig.BASE_API}/admin/search?q=${encodeURIComponent(searchQuery)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const result = await response.json();
      if (result.success) {
        setSuggestions(result.data);
        setShowSuggestions(true);
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setShowSuggestions(false);
    setSearchQuery("");
    if (suggestion.type === "user") {
      navigate(`/vibe-admin-panel/users?search=${suggestion.title}`);
    } else {
      navigate(`/vibe-admin-panel/posts?search=${suggestion.title}`);
    }
  };

  // ── Bell / Notifications ───────────────────────────────
  const [showBell, setShowBell] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const [activities, setActivities] = useState([]);
  const [bellLoading, setBellLoading] = useState(false);
  const bellRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (bellRef.current && !bellRef.current.contains(e.target)) {
        setShowBell(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchActivities = async () => {
    if (activities.length > 0) return; // dùng cache
    setBellLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${apiConfig.BASE_API}/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();
      if (result.success && result.data?.recentActivities) {
        setActivities(result.data.recentActivities);
      }
    } catch (err) {
      console.error("Error fetching activities:", err);
    } finally {
      setBellLoading(false);
    }
  };

  const handleBellClick = () => {
    const next = !showBell;
    setShowBell(next);
    if (next) {
      setHasUnread(false); // xem rồi → xóa chấm đỏ
      fetchActivities();
    }
  };

  const dotColors = ["#3b82f6", "#10b981", "#ef4444", "#6366f1", "#f59e0b", "#a855f7"];

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <div className="admin-main">
        <header className="admin-topbar">
          {/* Search */}
          <div className="admin-topbar__left">
            <div className="admin-search" ref={searchRef}>
              <Search size={18} />
              <input
                type="text"
                placeholder="Tìm kiếm người dùng, bài viết..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.trim() && setShowSuggestions(true)}
              />
              {searchQuery && (
                <button
                  className="search-clear-btn"
                  onClick={() => setSearchQuery("")}
                >
                  <X size={14} />
                </button>
              )}

              {showSuggestions && (
                <div className="search-suggestions animate-fade-in">
                  {isLoading ? (
                    <div className="suggestion-loading">Đang tìm kiếm...</div>
                  ) : suggestions.length > 0 ? (
                    suggestions.map((item) => (
                      <div
                        key={`${item.type}-${item.id}`}
                        className="suggestion-item"
                        onClick={() => handleSuggestionClick(item)}
                      >
                        <div className={`suggestion-icon ${item.type}`}>
                          {item.type === "user" ? (
                            <User size={14} />
                          ) : (
                            <FileText size={14} />
                          )}
                        </div>
                        <div className="suggestion-info">
                          <span className="suggestion-title">{item.title}</span>
                          <span className="suggestion-subtitle">
                            {item.subtitle}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="suggestion-empty">
                      Không tìm thấy kết quả
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right side */}
          <div className="admin-topbar__right">
            {/* Bell + Dropdown */}
            <div className="bell-wrapper" ref={bellRef}>
              <button className="admin-bell" onClick={handleBellClick}>
                <Bell size={20} />
                {hasUnread && <span className="admin-bell__dot" />}
              </button>

              {showBell && (
                <div className="bell-dropdown animate-fade-in">
                  <div className="bell-dropdown__header">
                    <span className="bell-dropdown__title">
                      Hoạt động gần đây
                    </span>
                    <span className="bell-dropdown__count">
                      {activities.length} mục
                    </span>
                  </div>

                  <div className="bell-dropdown__body">
                    {bellLoading ? (
                      <div className="bell-loading">
                        <div className="bell-spinner" />
                        <span>Đang tải...</span>
                      </div>
                    ) : activities.length > 0 ? (
                      activities.map((act, idx) => (
                        <div key={idx} className="bell-item">
                          <div
                            className="bell-item__dot"
                            style={{
                              backgroundColor:
                                act.dotColor ||
                                dotColors[idx % dotColors.length],
                            }}
                          />
                          <div className="bell-item__content">
                            <p>
                              <strong>{act.user}</strong> {act.action}
                            </p>
                            <span>{act.time}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="bell-empty">Chưa có hoạt động nào</div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile */}
            <div className="admin-profile">
              <div className="admin-profile__avatar">
                {currentUser?.username?.charAt(0)?.toUpperCase() || "A"}
              </div>
              <div className="admin-profile__meta">
                <h4>{currentUser?.username || "Admin"}</h4>
                <p>{currentUser?.email || "admin@jsv.com"}</p>
              </div>
            </div>
          </div>
        </header>

        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
