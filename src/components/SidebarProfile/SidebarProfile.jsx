import "./sidebarProfile.css";
import { buildAvatarUrl } from "../../services/profileService";

export default function SidebarProfile({ profile, onLogout }) {
  return (
    <aside className="sb-wrap">
      <div className="sb-avatarWrap">
        <div className="sb-avatar">
          {(profile.avatar_url || profile.avatar) ? (
            <img 
              src={buildAvatarUrl(profile.avatar_url || profile.avatar)}
              alt={profile.full_name || profile.fullName} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
             <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#a78bfa', fontSize: '40px', fontWeight: 'bold' }}>
               {(profile.full_name || profile.fullName || "?").charAt(0).toUpperCase()}
             </div>
          )}
        </div>
      </div>

      <div className="sb-title">Hồ sơ cá nhân</div>

      <div className="sb-info-container">
        {profile.bio && (
          <div className="sb-card sb-bio-card">
            <div className="sb-row">
              <span>Tiểu sử:</span> <i>{profile.bio}</i>
            </div>
          </div>
        )}

        <div className="sb-card">
          <div className="sb-row">
            <span>Họ và tên:</span> <b>{profile.full_name || profile.fullName}</b>
          </div>
        </div>

        {profile.gender && (
          <div className="sb-card">
            <div className="sb-row">
              <span>Giới tính:</span> <b>{profile.gender}</b>
            </div>
          </div>
        )}

        {profile.dob && (
          <div className="sb-card">
            <div className="sb-row">
              <span>Ngày sinh:</span> <b>{(() => {
                const d = new Date(profile.dob);
                if (isNaN(d.getTime())) return "";
                return d.toLocaleDateString('vi-VN');
              })()}</b>
            </div>
          </div>
        )}

        {profile.location && (
          <div className="sb-card">
            <div className="sb-row">
              <span>Địa điểm:</span> <b>{profile.location}</b>
            </div>
          </div>
        )}

        <div className="sb-card">
          <div className="sb-row">
            <span>Email:</span> <b>{profile.email}</b>
          </div>
        </div>
      </div>

      {/* Hiển thị sở thích */}
      {profile.interests && profile.interests.length > 0 && (
        <div className="sb-card">
          <div className="sb-row">
            <span>Sở thích:</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '10px' }}>
            {profile.interests.map((interest, idx) => (
              <span 
                key={idx}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  padding: '4px 10px',
                  borderRadius: '20px',
                  fontSize: '13px',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
              >
                {interest}
              </span>
            ))}
          </div>
        </div>
      )}

    </aside>
  );
}
