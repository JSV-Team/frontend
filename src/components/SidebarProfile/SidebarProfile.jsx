import "./sidebarProfile.css";

export default function SidebarProfile({ profile, onLogout }) {
  return (
    <aside className="sb-wrap">
      <div className="sb-avatarWrap">
        <div 
          className="sb-avatar" 
          style={{ 
            backgroundImage: profile.avatar ? `url(${profile.avatar})` : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        />
      </div>

      <div className="sb-title">Hồ sơ cá nhân</div>

      <div className="sb-card">
        <div className="sb-row">
          <span>Họ và tên:</span> <b>{profile.fullName}</b>
        </div>
      </div>

      <div className="sb-card">
        <div className="sb-row">
          <span>Giới tính:</span> <b>{profile.gender}</b>
        </div>
      </div>

      <div className="sb-card">
        <div className="sb-row">
          <span>Ngày sinh:</span> <b>{profile.dobISO}</b>
        </div>
      </div>

      <div className="sb-card">
        <div className="sb-row">
          <span>Email:</span> <b>{profile.email}</b>
        </div>
      </div>

      <button className="sb-logout" onClick={onLogout}>
        LOG OUT
      </button>
    </aside>
  );
}