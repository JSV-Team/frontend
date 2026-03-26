import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FileText,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";
import { logout } from "../../utils/auth";
import "./Admin.css";

const navItems = [
  { to: "/admin", icon: LayoutDashboard, label: "Dashboard", end: true },
  { to: "/admin/users", icon: Users, label: "Quản lý User" },
  { to: "/admin/posts", icon: FileText, label: "Quản lý Bài viết" },
  { to: "/admin/statistics", icon: BarChart3, label: "Thống kê" },
  { to: "/admin/settings", icon: Settings, label: "Cài đặt" },
];

function AdminSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar__brand">
        <h1>VibeMatch</h1>
        <span>Admin</span>
      </div>

      <nav className="admin-sidebar__nav">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `admin-sidebar__item ${isActive ? "active" : ""}`
              }
            >
              <Icon />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="admin-sidebar__footer">
        <button className="admin-sidebar__logout" onClick={handleLogout}>
          <LogOut />
          <span>Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
}

export default AdminSidebar;
