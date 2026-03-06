import "./sidebarProfile.css";

export default function SidebarProfile({ profile, onLogout }) {
  return (
    <aside className="sb-wrap">
      <div className="sb-avatarWrap">
        <div className="sb-avatar">
          {profile.avatar ? (
            <img 
              src={profile.avatar} 
              alt={profile.fullName} 
              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
            />
          ) : null}
        </div>
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

      {/* Hiển thị sở thích */}
      {profile.interests && profile.interests.length > 0 && (
        <div className="sb-card">
          <div className="sb-row">
            <span>Sở thích:</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '8px' }}>
            {profile.interests.map((interest, idx) => (
              <span 
                key={idx}
                style={{
                  background: idx === 0 ? '#3b82f6' : idx === 1 ? '#f97316' : '#6b7280',
                  color: 'white',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontSize: '12px'
                }}
              >
                {interest}
              </span>
            ))}
          </div>
        </div>
      )}

      <button className="sb-logout" onClick={onLogout}>
        LOG OUT
      </button>
    </aside>
  );
}
