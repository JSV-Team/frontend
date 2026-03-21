import React, { useState, useEffect, useRef } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Bell, Search, User, FileText, X } from "lucide-react";
import AdminSidebar from "./AdminSidebar";
import { getCurrentUser } from "../../utils/auth";
import "./Admin.css";

function AdminLayout() {
  const currentUser = getCurrentUser();
  const navigate = useNavigate();
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
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/search?q=${encodeURIComponent(searchQuery)}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
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
    if (suggestion.type === 'user') {
      navigate(`/admin/users?search=${suggestion.title}`);
    } else {
      navigate(`/admin/posts?search=${suggestion.title}`);
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <div className="admin-main">
        <header className="admin-topbar">
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
                <button className="search-clear-btn" onClick={() => setSearchQuery("")}>
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
                          {item.type === 'user' ? <User size={14} /> : <FileText size={14} />}
                        </div>
                        <div className="suggestion-info">
                          <span className="suggestion-title">{item.title}</span>
                          <span className="suggestion-subtitle">{item.subtitle}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="suggestion-empty">Không tìm thấy kết quả</div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="admin-topbar__right">
            <button className="admin-bell">
              <Bell />
              <span className="admin-bell__dot"></span>
            </button>

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
