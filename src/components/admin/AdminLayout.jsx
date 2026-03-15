import { Outlet } from "react-router-dom";
import { Bell, Search } from "lucide-react";
import AdminSidebar from "./AdminSidebar";
import { getCurrentUser } from "../../utils/auth";
import "./Admin.css";

function AdminLayout() {
  const currentUser = getCurrentUser();

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <div className="admin-main">
        <header className="admin-topbar">
          <div className="admin-topbar__left">
            <div className="admin-search">
              <Search />
              <input type="text" placeholder="Tìm kiếm..." />
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
