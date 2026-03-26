import { useEffect, useState } from "react";
import { Outlet, useParams, useNavigate, useLocation } from "react-router-dom";
import { profileService } from "../services/profileService";
import SidebarProfile from "../components/SidebarProfile/SidebarProfile";
import TopTabs from "../components/TopTabs/TopTabs";
import { useTheme } from "../contexts/ThemeContext";
import Particles from "../components/Particles/Particles";
import Aurora from "../components/Aurora/Aurora";
import "../pages/profileLayout.css";

// Lấy userId từ localStorage (đã được lưu khi login)
const getStoredUserId = () => {
  const userStr = localStorage.getItem("user");
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      return user.user_id || user.id || user.USER_ID;
    } catch (e) {
      console.error("Error parsing user:", e);
    }
  }
  return null;
};

export default function ProfileLayout() {
  const { username } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [interests, setInterests] = useState([]);
  const [error, setError] = useState(null);
  const { theme } = useTheme();

  // Identifier can be username from URL or stored userId as fallback
  const identifier = username || getStoredUserId();

  // The definitive numeric ID will be resolved from the profile data
  const [targetUserId, setTargetUserId] = useState(null);

  // Xác định tab đang active dựa trên URL
  const getActiveTab = () => {
    const path = location.pathname;
    if (path.includes("/edit")) return "edit";
    if (path.includes("/reputation")) return "reputation";
    if (path.includes("/posts")) return "posts";
    return "edit";
  };

  useEffect(() => {
    if (!identifier) {
      setError("Không tìm thấy thông tin định danh");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);

        // Lấy profile data (backend now handles ID or Username)
        const profileData = await profileService.getProfile(identifier);
        setProfile(profileData);
        setTargetUserId(profileData.user_id);

        // Lấy interests using numeric ID
        const interestsData = await profileService.getInterests(profileData.user_id);
        // interestsData là array của objects { interest_id, name }
        setInterests(interestsData.map(i => i.name));

        setError(null);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Không thể tải thông tin profile");
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Listen for profile updates (avatar change, etc.)
    const handleProfileUpdate = () => {
      console.log('🔄 ProfileLayout: Detected profile update, reloading...');
      fetchData();
    };

    window.addEventListener('userUpdated', handleProfileUpdate);

    // Cleanup listener
    return () => {
      window.removeEventListener('userUpdated', handleProfileUpdate);
    };
  }, [identifier]);

  if (loading) {
    return (
      <div className="loading-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f6f7fb' }}>
        <p>Đang tải...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f6f7fb' }}>
        <p style={{ color: 'red' }}>{error}</p>
      </div>
    );
  }

  const stats = {
    reputation: profile?.reputation_score || 0,
    fer: profile?.fer_score || 0,
    fing: profile?.fing_score || 0,
    group: profile?.group_score || 0,
  };

  return (
    <div className="vm-page">
      {/* Background effects - only visible in dark mode */}
      {theme === 'dark' && (
        <>
          <div className="home-aurora-bg">
            <Aurora
              colorStops={['#d666ff', '#e15b83', '#5227FF']}
              blend={0.5}
              amplitude={1.0}
              speed={1.2}
            />
          </div>
          <div className="home-particles-bg">
            <Particles
              particleColors={['#c653b6', '#8b5cf6', '#6366f1']}
              particleCount={200}
              particleSpread={10}
              speed={0.1}
              particleBaseSize={400}
              moveParticlesOnHover={false}
              alphaParticles={true}
              disableRotation={false}
              sizeRandomness={1}
              cameraDistance={20}
              pixelRatio={1}
            />
          </div>
        </>
      )}

      <SidebarProfile
        profile={{
          ...profile,
          fullName: profile?.full_name || profile?.fullName || "User",
          interests: interests,
          stats: stats,
          avatar: profile?.avatar_url || profile?.avatar || null,
        }}
        onLogout={() => {
          localStorage.removeItem("user");
          navigate("/login");
        }}
      />

      <main className="vm-main">
        <TopTabs active={getActiveTab()} />

        <Outlet
          context={{
            USER_ID: targetUserId,
            profile,
            setProfile,
            interests,
            setInterests,
            stats,
          }}
        />
      </main>
    </div>
  );
}

