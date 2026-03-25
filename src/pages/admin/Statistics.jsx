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
  const [activeTab, setActiveTab] = useState('Growth');
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
      <div className="admin-loading">
        <div className="spinner"></div>
        <p>Đang chuẩn bị dữ liệu phân tích hệ thống...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-loading">
        <TrendingDown size={48} color="#f43f5e" />
        <h3>Ối! Có lỗi xảy ra</h3>
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="premium-btn-outline">Thử lại</button>
      </div>
    );
  }

  if (!data) return null;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="label">{label}</p>
          {payload.map((pld, index) => (
            <div key={index} className="tooltip-item">
              <div className="dot" style={{ backgroundColor: pld.fill || pld.stroke }}></div>
              <span>{pld.name}: <strong>{pld.value}</strong></span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="statistics-page animate-fade-in">
      <div className="dashboard-header-modern">
        <div className="header-content">
          <h2 className="premium-title">Thống kê Phân tích</h2>
          <p className="premium-subtitle">Dữ liệu thời gian thực và xu hướng tăng trưởng hệ thống</p>
        </div>
        <div className="header-actions">
          <div className="date-badge">
            <Calendar size={14} />
            <span>Tháng {new Date().getMonth() + 1}, {new Date().getFullYear()}</span>
          </div>
        </div>
      </div>

      {/* Row 1: Growth Cards */}
      <div className="premium-stats-row">
        {data.growthStats.map((stat, idx) => {
          const icons = [<Users size={24} />, <FileText size={24} />, <Heart size={24} />];
          const colors = ['#6366f1', '#10b981', '#f43f5e'];
          const isUp = stat.value.startsWith('+');
          
          return (
            <div key={idx} className="premium-stat-card">
              <div className="card-top">
                <div className="stat-icon-wrapper" style={{ backgroundColor: `${colors[idx]}15`, color: colors[idx] }}>
                  {icons[idx]}
                </div>
                <div className={`trend-tag ${isUp ? 'trend-up' : 'trend-down'}`}>
                  {isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  {stat.value}
                </div>
              </div>
              <div className="card-body">
                <span className="stat-label-modern">{stat.title}</span>
                <div className="stat-main-row">
                  <h3 className="stat-value-modern">{stat.value.replace('+', '').replace('-', '')}</h3>
                  <span className="stat-unit">%</span>
                </div>
                <p className="stat-helper">{stat.subtext}</p>
              </div>
              <div className="stat-progress-bg" style={{ backgroundColor: `${colors[idx]}10` }}>
                <div className="stat-progress-bar" style={{ width: '65%', backgroundColor: colors[idx] }}></div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="statistics-main-grid">
        {/* Row 2: Charts Area */}
        <div className="premium-glass-card chart-main">
          <div className="card-header-flex">
            <div className="left">
              <h3 className="card-title-modern">Tăng trưởng Người dùng & Bài viết</h3>
              <p className="card-subtitle-modern">Số liệu tích lũy và tương tác qua các tháng</p>
            </div>
            <div className="right">
              <div className="chart-legend-modern">
                <div className="legend-item">
                  <span className="dot" style={{ backgroundColor: '#6366f1' }}></span>
                  <span>User</span>
                </div>
                <div className="legend-item">
                  <span className="dot" style={{ backgroundColor: '#10b981' }}></span>
                  <span>Post</span>
                </div>
              </div>
            </div>
          </div>
          <div className="chart-box" style={{ height: '320px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f1f5f9' }} />
                <Bar name="Người dùng" dataKey="users" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={24} />
                <Bar name="Bài viết" dataKey="posts" fill="#10b981" radius={[6, 6, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="premium-glass-card matches-chart">
          <div className="card-header-flex">
            <div>
              <h3 className="card-title-modern">Ghép đôi thành công</h3>
              <p className="card-subtitle-modern">Tỷ lệ tương tác thực tế</p>
            </div>
          </div>
          <div className="chart-box" style={{ height: '320px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.matchTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="premiumMatch" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#f43f5e" 
                  fillOpacity={1} 
                  fill="url(#premiumMatch)" 
                  strokeWidth={3}
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Row 3: Interests */}
        <div className="premium-glass-card full-span">
          <div className="card-header-flex no-border">
            <div>
              <h3 className="card-title-modern">Xếp hạng Sở thích Mới nổi</h3>
              <p className="card-subtitle-modern">Khám phá điều cộng đồng đang quan tâm nhất</p>
            </div>
            <button className="premium-btn-outline" onClick={fetchInterestReport}>
              Xem báo cáo chi tiết <ChevronRight size={16} />
            </button>
          </div>
          <div className="interests-premium-grid">
            {data.popularInterests.map((interest, idx) => (
              <div key={idx} className="interest-modern-card" style={{ '--delay': `${idx * 0.1}s` }}>
                <div className="interest-rank">{idx + 1}</div>
                <div className="interest-icon-circle">
                  <Hash size={18} />
                </div>
                <div className="interest-info">
                  <h4 className="interest-name">{interest.name}</h4>
                  <div className="interest-stats">
                    <TrendingUp size={12} color="#10b981" />
                    <span>{interest.value} tương tác</span>
                  </div>
                </div>
                <div className="interest-meter">
                  <div className="fill" style={{ width: `${100 - (idx * 15)}%`, backgroundColor: idx < 3 ? '#6366f1' : '#94a3b8' }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Interest Report Modal */}
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
                          src={buildAvatarUrl(user.avatar_url) || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.full_name)}&background=random`} 
                          alt="" 
                          className="mini-avatar" 
                        />
                        <div className="user-meta-mini">
                           <span className="p-name">{user.full_name}</span>
                           <span className="p-id">ID: #{user.user_id}</span>
                        </div>
                      </div>
                      <div className="col-interests">
                        {user.interests && user.interests.map((interest, j) => (
                          <span key={j} className="interest-tag-mini">{interest}</span>
                        ))}
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
          padding-bottom: 40px;
        }
        .animate-fade-in {
          animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .dashboard-header-modern {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
        }
        .premium-title {
          font-size: 28px;
          font-weight: 850;
          color: #1e293b;
          margin: 0 0 4px 0;
          letter-spacing: -0.5px;
        }
        .premium-subtitle {
          color: #64748b;
          margin: 0;
          font-size: 15px;
        }
        .date-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #fff;
          padding: 8px 16px;
          border-radius: 99px;
          border: 1px solid #e2e8f0;
          font-size: 13px;
          font-weight: 600;
          color: #475569;
          box-shadow: 0 2px 4px rgba(0,0,0,0.02);
        }

        /* Stats Row */
        .premium-stats-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;
          margin-bottom: 32px;
        }
        .premium-stat-card {
          background: #fff;
          padding: 24px;
          border-radius: 24px;
          border: 1px solid #f1f5f9;
          box-shadow: 0 10px 15px -3px rgba(0,0,0,0.02);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          overflow: hidden;
          position: relative;
        }
        .premium-stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 25px -5px rgba(0,0,0,0.05);
          border-color: #6366f120;
        }
        .card-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .stat-icon-wrapper {
          width: 52px;
          height: 52px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .trend-tag {
          padding: 6px 12px;
          border-radius: 99px;
          font-size: 12px;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .trend-up { background: #dcfce7; color: #15803d; }
        .trend-down { background: #fee2e2; color: #b91c1c; }
        
        .stat-label-modern {
          color: #64748b;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 8px;
          display: block;
        }
        .stat-main-row {
          display: flex;
          align-items: baseline;
          gap: 4px;
          margin-bottom: 8px;
        }
        .stat-value-modern {
          font-size: 32px;
          font-weight: 850;
          color: #1e293b;
          margin: 0;
        }
        .stat-unit {
          font-size: 18px;
          font-weight: 700;
          color: #94a3b8;
        }
        .stat-helper {
          font-size: 12px;
          color: #94a3b8;
          margin: 0;
        }
        .stat-progress-bg {
          height: 6px;
          border-radius: 3px;
          margin-top: 16px;
          width: 100%;
          overflow: hidden;
        }
        .stat-progress-bar {
          height: 100%;
          border-radius: 3px;
        }

        /* Glass Cards */
        .statistics-main-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 24px;
        }
        .premium-glass-card {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(12px);
          padding: 28px;
          border-radius: 28px;
          border: 1px solid rgba(255, 255, 255, 0.5);
          box-shadow: 0 10px 30px -5px rgba(0,0,0,0.03);
          box-sizing: border-box;
        }
        .full-span {
          grid-column: span 2;
        }
        .card-header-flex {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 24px;
          padding-bottom: 20px;
          border-bottom: 1px solid #f1f5f9;
        }
        .no-border { border: none; }
        .card-title-modern {
          font-size: 18px;
          font-weight: 800;
          color: #1e293b;
          margin: 0 0 4px 0;
        }
        .card-subtitle-modern {
          color: #64748b;
          font-size: 13px;
          margin: 0;
        }
        .chart-legend-modern {
          display: flex;
          gap: 16px;
        }
        .legend-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          font-weight: 600;
          color: #64748b;
        }
        .legend-item .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        /* Interests Grid */
        .interests-premium-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 16px;
        }
        .interest-modern-card {
          background: #fff;
          padding: 16px;
          border-radius: 20px;
          border: 1px solid #f1f5f9;
          display: flex;
          align-items: center;
          gap: 16px;
          position: relative;
          transition: all 0.3s;
          opacity: 0;
          animation: slideInUp 0.6s forwards;
          animation-delay: var(--delay);
          overflow: hidden;
        }
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .interest-modern-card:hover {
          border-color: #6366f150;
          background: #f8fafc;
        }
        .interest-rank {
          font-size: 32px;
          font-weight: 900;
          color: #f1f5f9;
          position: absolute;
          right: 12px;
          top: 0px;
          line-height: 1;
        }
        .interest-icon-circle {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: #f8fafc;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6366f1;
        }
        .interest-info { flex: 1; }
        .interest-name {
          margin: 0 0 4px 0;
          font-size: 15px;
          font-weight: 700;
          color: #1e293b;
        }
        .interest-stats {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: #64748b;
          font-weight: 500;
        }
        .interest-meter {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: #f1f5f9;
        }
        .interest-meter .fill { height: 100%; }

        /* Custom Tooltip */
        .custom-tooltip {
          background: #fff;
          padding: 12px 16px;
          border-radius: 14px;
          box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1);
          border: 1px solid #e2e8f0;
        }
        .custom-tooltip .label {
          color: #1e293b;
          font-weight: 800;
          font-size: 13px;
          margin: 0 0 8px 0;
          border-bottom: 1px solid #f1f5f9;
          padding-bottom: 4px;
        }
        .tooltip-item {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 4px;
          font-size: 12px;
          color: #64748b;
        }
        .tooltip-item .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }
        .tooltip-item strong { color: #1e293b; }

        .premium-btn-outline {
          padding: 8px 16px;
          border-radius: 99px;
          border: 1px solid #e2e8f0;
          background: #fff;
          color: #475569;
          font-size: 13px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .premium-btn-outline:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
        }

        .spinner {
          width: 50px;
          height: 50px;
          border: 5px solid #6366f110;
          border-left-color: #6366f1;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        /* Modal Styles */
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
          animation: modalScaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes modalScaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .modal-header-premium {
          padding: 24px 32px;
          border-bottom: 1px solid #f1f5f9;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .modal-header-premium .title-area {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .modal-header-premium h3 {
          margin: 0;
          font-size: 20px;
          font-weight: 800;
          color: #1e293b;
        }
        .close-modal-btn {
          font-size: 28px;
          background: none;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          line-height: 1;
        }
        .modal-body-scroll {
          padding: 32px;
          overflow-y: auto;
          flex: 1;
        }
        .user-interest-table {
          width: 100%;
        }
        .table-header {
          display: grid;
          grid-template-columns: 240px 1fr;
          padding: 0 16px 12px 16px;
          border-bottom: 2px solid #f1f5f9;
          color: #64748b;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }
        .table-row {
          display: grid;
          grid-template-columns: 240px 1fr;
          padding: 16px;
          border-bottom: 1px solid #f1f5f9;
          align-items: center;
          transition: background 0.2s;
        }
        .table-row:hover { background: #f8fafc; }
        .col-user {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .user-meta-mini {
          display: flex;
          flex-direction: column;
        }
        .user-meta-mini .p-name {
          font-weight: 700;
          color: #1e293b;
          font-size: 14px;
        }
        .user-meta-mini .p-id {
          font-size: 11px;
          color: #94a3b8;
        }
        .mini-avatar {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          object-fit: cover;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
        }
        .col-interests {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        .interest-tag-mini {
          background: #6366f110;
          color: #6366f1;
          padding: 4px 12px;
          border-radius: 99px;
          font-size: 11px;
          font-weight: 700;
          border: 1px solid #6366f120;
        }
        .modal-loading-modern {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 0;
          gap: 16px;
          color: #64748b;
          font-weight: 600;
        }
        .mini-spinner {
          width: 32px;
          height: 32px;
          border: 3px solid #6366f120;
          border-left-color: #6366f1;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        .empty-report {
          text-align: center;
          padding: 40px 0;
          color: #94a3b8;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Statistics;
