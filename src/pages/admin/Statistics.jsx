import React, { useState, useEffect } from 'react';
import apiConfig from '../../config/apiConfig';
import { 
  BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Legend, Cell
} from 'recharts';
import { 
  TrendingUp, Users, FileText, Heart, Activity, 
  Calendar, ChevronRight, Hash, ArrowUpRight, ArrowDownRight,
  TrendingDown, PieChart, BarChart3
} from 'lucide-react';
import { buildAvatarUrl } from '../../services/profileService';

const Statistics = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportData, setReportData] = useState([]);
  const [reportLoading, setReportLoading] = useState(false);

  const fetchInterestReport = async () => {
    try {
      setReportLoading(true);
      setReportModalOpen(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiConfig.BASE_API}/admin/user-interests-report`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      if (result.success) {
        setReportData(result.data);
      }
    } catch (error) {
      console.error("Error fetching interest report:", error);
    } finally {
      setReportLoading(false);
    }
  };

  useEffect(() => {
    const fetchDetailedStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');
        const response = await fetch(`${apiConfig.BASE_API}/admin/detailed-stats`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const result = await response.json();
        if (result.success) {
          setData(result.data);
        } else {
          setError(result.message || "Không thể tải dữ liệu.");
        }
      } catch (error) {
        console.error("Error fetching detailed stats:", error);
        setError("Lỗi kết nối server.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetailedStats();
  }, []);

  if (loading) {
    return (
      <div className="admin-loading-container">
        <Activity className="spin" size={48} color="#6366f1" />
        <p>Đang chuẩn bị dữ liệu phân tích hệ thống...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-error-container">
        <TrendingDown size={48} color="#f43f5e" />
        <h3>Ối! Có lỗi xảy ra</h3>
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="premium-btn-retry">Thử lại</button>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="statistics-page animate-fade-in">
      <div className="dashboard-header-simple">
        <h2 className="main-page-title">Thống kê Phân tích</h2>

      </div>



      {/* Row 2: Charts Grid 1:1 */}
      <div className="statistics-charts-grid">
        <div className="premium-glass-card-chart">
          <div className="chart-header-flex">
            <div>
              <h3 className="chart-title">Tăng trưởng Người dùng & Bài viết</h3>
              <p className="chart-subtitle">Số liệu tích lũy qua các tháng</p>
            </div>
            <div className="chart-legend-simple">
              <span className="legend-item"><div className="dot" style={{ background: '#6366f1' }} /> User</span>
              <span className="legend-item"><div className="dot" style={{ background: '#10b981' }} /> Post</span>
            </div>
          </div>
          <div className="chart-box" style={{ height: '320px', marginTop: '20px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
                />
                <Bar name="User" dataKey="users" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar name="Post" dataKey="posts" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="premium-glass-card-chart">
          <div className="chart-header-flex">
            <div>
              <h3 className="chart-title">Tần suất Ghép đôi</h3>
              <p className="chart-subtitle">Lượt ghép đôi mới theo thời gian</p>
            </div>
            <div className="chart-action-circle">
              <Activity size={18} color="#3b82f6" />
            </div>
          </div>
          <div className="chart-box" style={{ height: '320px', marginTop: '20px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.matchTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorMatchGreen" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
                />
                <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} fill="url(#colorMatchGreen)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 3: Emerging Interests */}
      <div className="premium-glass-card-interests" style={{ marginTop: '32px' }}>
        <div className="rankings-header-flex">
          <div>
            <h3 className="chart-title">Xếp hạng Sở thích Mới nổi</h3>
            <p className="chart-subtitle">Khám phá điều cộng đồng đang quan tâm nhất</p>
          </div>
          <button className="view-report-premium" onClick={fetchInterestReport}>
            Xem báo cáo chi tiết <ChevronRight size={16} />
          </button>
        </div>

        <div className="interests-premium-grid">
          {data.popularInterests && data.popularInterests.length > 0 ? (
            data.popularInterests.slice(0, 4).map((interest, idx) => (
              <div key={idx} className="interest-premium-card">
                <div className="interest-rank-badge">{idx + 1}</div>
                <div className="interest-icon-box">
                  <Hash size={18} color="#6366f1" />
                </div>
                <div className="interest-details">
                  <span className="interest-label-name">{interest.name}</span>
                  <div className="interest-stat-row">
                    <TrendingUp size={12} color="#10b981" />
                    <span>{interest.value} lượt quan tâm</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div style={{ padding: '40px', gridColumn: '1 / -1', textAlign: 'center', color: '#94a3b8' }}>Chưa có dữ liệu.</div>
          )}
        </div>
      </div>

      {/* Interest Report Modal (Existing) */}
      {reportModalOpen && (
        <div className="report-modal-overlay" onClick={() => setReportModalOpen(false)}>
          <div className="report-modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header-premium">
              <div className="title-area">
                <Hash size={24} color="#6366f1" />
                <h3>Báo cáo chi tiết sở thích người dùng</h3>
              </div>
              <button className="close-modal-btn" onClick={() => setReportModalOpen(false)}>×</button>
            </div>
            <div className="modal-body-scroll">
              {reportLoading ? (
                <div className="modal-loading-modern">
                   <div className="mini-spinner"></div>
                   <span>Đang chuẩn bị danh sách...</span>
                </div>
              ) : (
                <div className="user-interest-table">
                  <div className="table-header">
                    <div className="col">Người dùng</div>
                    <div className="col">Danh sách sở thích</div>
                  </div>
                  {reportData.map((user, i) => (
                    <div key={user.user_id} className="table-row">
                      <div className="col-user">
                        <img 
                          src={buildAvatarUrl(user.avatar_url) || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'} 
                          alt="" 
                          className="mini-avatar" 
                          onError={(e) => { e.target.src = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'; }}
                        />
                        <div className="user-meta-mini">
                           <span className="p-name">{user.full_name}</span>
                           <span className="p-id">ID: #{user.user_id}</span>
                        </div>
                      </div>
                      <div className="col-interests">
                        {user.interests && user.interests.length > 0 ? user.interests.map((interest, j) => (
                          <span key={j} className="interest-tag-mini">{interest}</span>
                        )) : <span className="interest-tag-empty">Chưa có sở thích</span>}
                      </div>
                    </div>
                  ))}
                  {reportData.length === 0 && <p className="empty-report">Không có dữ liệu người dùng.</p>}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        .statistics-page {
          padding: 24px;
          background: #f8fafc;
          min-height: 100vh;
        }

        .animate-fade-in {
          animation: fadeIn 0.6s ease-out forwards;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .dashboard-header-simple {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .main-page-title {
          font-size: 26px;
          font-weight: 850;
          color: #1e293b;
          margin: 0;
        }

        .header-meta {
          display: flex;
          align-items: center;
          background: #fff;
          padding: 8px 16px;
          border-radius: 99px;
          border: 1px solid #e2e8f0;
          color: #64748b;
          font-size: 13px;
          font-weight: 600;
        }

        /* Row 1: Growth Cards */
        .growth-stats-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-bottom: 24px;
        }

        .growth-card-premium {
          background: #fff;
          border-radius: 20px;
          padding: 20px;
          border: 1px solid #f1f5f9;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02);
          position: relative;
          overflow: hidden;
        }

        .growth-label {
          font-size: 13px;
          font-weight: 700;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .growth-main {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 10px 0;
        }

        .growth-num {
          font-size: 32px;
          font-weight: 900;
          color: #0f172a;
          margin: 0;
        }

        .growth-indicator {
          padding: 3px 6px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          font-size: 11px;
          font-weight: 700;
        }

        .growth-indicator.up { background: #dcfce7; color: #15803d; }
        .growth-indicator.down { background: #fee2e2; color: #b91c1c; }

        .growth-helper {
          font-size: 13px;
          color: #64748b;
          font-weight: 600;
          margin: 0;
        }

        .growth-progress-container {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: #f1f5f9;
        }

        .growth-progress-bar {
          height: 100%;
          transition: width 1s ease-in-out;
        }

        /* Row 2: Charts Area */
        .statistics-charts-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }

        .premium-glass-card-chart {
          background: #fff;
          border-radius: 24px;
          border: 1px solid #f1f5f9;
          padding: 24px;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02);
        }

        .chart-header-flex {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .chart-title {
          font-size: 18px;
          font-weight: 850;
          color: #1e293b;
          margin: 0 0 2px 0;
        }

        .chart-subtitle {
          font-size: 13px;
          color: #94a3b8;
          margin: 0;
          font-weight: 500;
        }

        .chart-legend-simple {
          display: flex;
          gap: 12px;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          font-weight: 700;
          color: #64748b;
        }

        .legend-item .dot {
          width: 7px;
          height: 7px;
          border-radius: 2px;
        }

        .chart-action-circle {
          width: 36px;
          height: 36px;
          background: #f1f5f9;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Row 3: Interests Area */
        .premium-glass-card-interests {
          background: #fff;
          border-radius: 24px;
          border: 1px solid #f1f5f9;
          padding: 24px;
        }

        .rankings-header-flex {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .view-report-premium {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 8px 16px;
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 700;
          color: #64748b;
          cursor: pointer;
        }

        .interests-premium-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        .interest-premium-card {
          background: #fff;
          border-radius: 16px;
          padding: 14px 16px;
          border: 1px solid #f1f5f9;
          display: flex;
          align-items: center;
          gap: 12px;
          position: relative;
        }

        .interest-rank-badge {
          position: absolute;
          top: -10px;
          right: 15px;
          font-size: 32px;
          font-weight: 900;
          color: #f1f5f9;
          z-index: 0;
          line-height:1;
        }

        .interest-icon-box {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: #f8fafc;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1;
        }

        .interest-details { z-index: 1; }

        .interest-label-name {
          display: block;
          font-size: 15px;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 2px;
        }

        .interest-stat-row {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          color: #64748b;
          font-weight: 600;
        }

        /* Loader & Error */
        .admin-loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: calc(100vh - 100px);
          gap: 12px;
        }
        .admin-error-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: calc(100vh - 100px);
          gap: 12px;
          text-align: center;
        }
        .premium-btn-retry {
          padding: 8px 24px;
          background: #6366f1;
          color: #fff;
          border: none;
          border-radius: 99px;
          font-weight: 700;
          cursor: pointer;
        }

        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        .report-modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(4px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        .report-modal-content {
          background: #fff;
          width: 100%;
          max-width: 800px;
          border-radius: 28px;
          max-height: 85vh;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }
        .modal-header-premium {
          padding: 24px 32px;
          border-bottom: 1px solid #f1f5f9;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .modal-header-premium .title-area { display: flex; align-items: center; gap: 12px; }
        .modal-header-premium h3 { margin: 0; font-size: 20px; font-weight: 800; }
        .close-modal-btn { font-size: 28px; background: none; border: none; color: #94a3b8; cursor: pointer; }
        .modal-body-scroll { padding: 32px; overflow-y: auto; flex: 1; }
        
        .user-interest-table { width: 100%; }
        .table-header {
          display: grid;
          grid-template-columns: 240px 1fr;
          padding-bottom: 12px;
          border-bottom: 2px solid #f1f5f9;
          color: #94a3b8;
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
        }
        .table-row {
          display: grid;
          grid-template-columns: 240px 1fr;
          padding: 16px 0;
          border-bottom: 1px solid #f1f5f9;
          align-items: center;
        }
        .mini-avatar { width: 40px; height: 40px; border-radius: 12px; object-fit: cover; }
        .col-user { display: flex; align-items: center; gap: 12px; }
        .user-meta-mini { display: flex; flex-direction: column; }
        .user-meta-mini .p-name { font-weight: 700; color: #1e293b; font-size: 14px; }
        .user-meta-mini .p-id { font-size: 11px; color: #94a3b8; }
        .col-interests { display: flex; flex-wrap: wrap; gap: 6px; }
        .interest-tag-mini {
          background: #6366f110;
          color: #6366f1;
          padding: 4px 12px;
          border-radius: 99px;
          font-size: 11px;
          font-weight: 700;
        }

        @media (max-width: 1200px) {
          .statistics-charts-grid { grid-template-columns: 1fr; }
          .interests-premium-grid { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>
    </div>
  );
};

export default Statistics;
