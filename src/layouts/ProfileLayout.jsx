import { useEffect, useState } from "react";
import { Outlet, useParams, useNavigate, useLocation } from "react-router-dom";
import { profileService } from "../services/profileService";
import SidebarProfile from "../components/SidebarProfile/SidebarProfile";
import TopTabs from "../components/TopTabs/TopTabs";
import StatBar from "../components/StatBar/StatBar";
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
  const { userId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [interests, setInterests] = useState([]);
  const [error, setError] = useState(null);

  // Lấy USER_ID từ params hoặc localStorage
  const USER_ID = userId || getStoredUserId();

  // Xác định tab đang active dựa trên URL
  const getActiveTab = () => {
    const path = location.pathname;
    if (path.includes("/profile/edit")) return "edit";
    if (path.includes("/profile/reputation")) return "reputation";
    if (path.includes("/profile/posts")) return "posts";
    return "edit";
  };

  useEffect(() => {
    if (!USER_ID) {
      setError("Không tìm thấy user ID");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Lấy profile data
        const profileData = await profileService.getProfile(USER_ID);
        setProfile(profileData);
        
        // Lấy interests
        const interestsData = await profileService.getInterests(USER_ID);
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
  }, [USER_ID]);

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
        <StatBar stats={stats} />

        <Outlet
          context={{
            USER_ID,
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

