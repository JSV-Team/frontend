import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import {
  Users, FileText, Activity, AlertTriangle,
  TrendingUp, TrendingDown, Clock, MousePointer2,
  RefreshCw, Calendar, ChevronRight, LayoutDashboard,
  Bell, Search, User, LogOut, ArrowUpRight, ArrowDownRight
} from 'lucide-react';

const Dashboard = () => {
  const [timeFilter, setTimeFilter] = useState('Week');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    stats: [
      { title: 'Tổng người dùng', value: '1,280', trend: '+ 2%', trendType: 'up' },
      { title: 'Tổng bài viết', value: '3,500', trend: '+ 5%', trendType: 'up' },
      { title: 'Hoạt động nhóm', value: '85', trend: '+ 12%', trendType: 'up' },
      { title: 'Báo cáo chờ xử lý', value: '12', trend: 'Cần xử lý', trendType: 'up' }
    ],
    activityData: {
      Week: [
        { name: 'T2', value: 30 },
        { name: 'T3', value: 55 },
        { name: 'T4', value: 85 },
        { name: 'T5', value: 60 },
        { name: 'T6', value: 95 },
        { name: 'T7', value: 70 },
        { name: 'CN', value: 110 }
      ],

      Month: [
        { name: 'Jan', value: 420 },
        { name: 'Feb', value: 380 },
        { name: 'Mar', value: 510 },
        { name: 'Apr', value: 460 },
        { name: 'May', value: 620 },
        { name: 'Jun', value: 580 },
        { name: 'Jul', value: 640 },
        { name: 'Aug', value: 590 },
        { name: 'Sep', value: 610 },
        { name: 'Oct', value: 720 },
        { name: 'Nov', value: 680 },
        { name: 'Dec', value: 750 }
      ],

      Year: [
        { name: '2022', value: 6400 },
        { name: '2023', value: 7100 },
        { name: '2024', value: 8300 },
        { name: '2025', value: 9100 },
        { name: '2026', value: 9800 }
      ]
    },
    reportData: [
      { name: 'Spam', value: 35, color: '#ef4444' },
      { name: 'Nội dung độc hại', value: 25, color: '#f59e0b' },
      { name: 'Fake news', value: 20, color: '#3b82f6' },
      { name: 'Vi phạm quy chuẩn', value: 20, color: '#8b5cf6' }
    ],
    matchData: {
      stats: { pending: 0, active: 0, rejected: 0, ended: 0 },
      classification: [],
      recent: []
    },
    recentActivities: [
      { user: 'Hệ thống', action: 'đang tải dữ liệu...', time: 'Vừa xong', dotColor: '#3853b8' }
    ]
  });

  const fetchStats = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      if (result.success && result.data) {
        // Just use the stats from backend, adding context to trend labels
        const updatedStats = (result.data.stats || []).map(s => ({
          ...s,
          trend: s.trend ? (s.trend.includes('mới') ? s.trend : (s.trend + ' tuần này')) : ''
        }));

        setData(prevData => ({
          ...prevData,
          ...result.data,
          activityData: {
            ...prevData.activityData,
            ...(result.data.activityData || {})
          },
          stats: updatedStats,
          matchData: result.data.matchData || prevData.matchData
        }));
      }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    } finally {
      setTimeout(() => setLoading(false), 300);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', flexDirection: 'column', gap: '16px' }}>
        <RefreshCw className="spin" size={40} color="var(--admin-primary)" />
        <p style={{ color: 'var(--admin-text-muted)', fontWeight: 600 }}>Cập nhật dữ liệu hệ thống...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-wrapper animate-fade-in">
      {/* Page Title & Welcome */}
      <div className="dashboard-header-simple">
        <h2 className="main-page-title">Dashboard</h2>
        <p className="welcome-msg">Chào mừng trở lại, Admin 👋</p>
      </div>

      {/* Row 1: 4 Cards (Dàn ngang 4 ô) */}
      <div className="stats-row">
        {data.stats.map((stat, idx) => {
          const icons = [<Users size={24} />, <FileText size={24} />, <Activity size={24} />, <AlertTriangle size={24} />];
          const colors = ['#6366f1', '#3b82f6', '#10b981', '#f59e0b'];
          return (
            <div key={idx} className="stat-card-new">
              <div className="stat-card-header">
                <span className="stat-label-new">{stat.title}</span>
                <div className="stat-icon-new" style={{ backgroundColor: `${colors[idx]}15`, color: colors[idx] }}>
                  {icons[idx]}
                </div>
              </div>
              <div className="stat-value-new">{stat.value}</div>
              <div className={`stat-trend-new ${stat.trendType}`}>
                {stat.trendType === 'up' ? '↑' : '↓'} {stat.trend}
              </div>
            </div>
          );
        })}
      </div>

      {/* Row 2: Main Activity Grid */}
      <div className="dashboard-main-grid">
        {/* Activity Chart */}
        <div className="chart-section glass-card">
          <div className="section-header">
            <h3 className="section-title">Thống kê hoạt động</h3>
            <div className="chart-filters-new">
              {['Week', 'Month', 'Year'].map(f => (
                <button
                  key={f}
                  className={`filter-btn-new ${timeFilter === f ? 'active' : ''}`}
                  onClick={() => setTimeFilter(f)}
                >
                  {f === 'Week' ? 'Tuần' : f === 'Month' ? 'Tháng' : 'Năm'}
                </button>
              ))}
            </div>
          </div>
          <div className="chart-canvas" style={{ height: '320px', marginTop: '20px' }}>
            {data.activityData[timeFilter] && data.activityData[timeFilter].length > 0 ? (
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <LineChart data={data.activityData[timeFilter]} margin={{ left: -10, right: 30, top: 10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={true} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="name"
                    axisLine={{ stroke: '#cbd5e1' }}
                    tickLine={{ stroke: '#cbd5e1' }}
                    tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
                    dy={10}
                    interval={timeFilter === 'Month' ? 5 : 0}
                  />
                  <YAxis
                    axisLine={{ stroke: '#cbd5e1' }}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 13 }}
                  />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}
                    itemStyle={{ color: '#2563eb', fontWeight: 600 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#2563eb"
                    strokeWidth={3}
                    dot={{ r: 5, fill: '#2563eb', strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 7, strokeWidth: 2, stroke: '#fff' }}
                    animationDuration={1000}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94a3b8', fontStyle: 'italic' }}>
                Không có dữ liệu cho giai đoạn này
              </div>
            )}
          </div>
        </div>

        {/* Violation Pie Chart */}
        <div className="pie-section glass-card">
          <div className="section-header">
            <h3 className="section-title">Báo cáo vi phạm</h3>
          </div>
          <div className="pie-container" style={{ height: '220px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.reportData}
                  cx="50%" cy="50%"
                  innerRadius={60} outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.reportData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="pie-legend-new">
            {data.reportData.map((entry, idx) => (
              <div key={idx} className="legend-row">
                <div className="legend-info">
                  <div className="legend-dot-new" style={{ backgroundColor: entry.color }}></div>
                  <span>{entry.name}</span>
                </div>
                <span className="legend-val">{entry.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 3: Matching Management & Recent Activity */}
      <div className="bottom-content-grid">
        <div className="chart-section glass-card">
          <div className="section-header" style={{ marginBottom: '20px' }}>
            <h3 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users size={20} /> Quản lý Ghép đôi
            </h3>
          </div>

          <div className="match-stats-grid">
            <div className="match-mini-card">
              <div className="icon-box warning"><Clock size={16} /></div>
              <div className="info">
                <span>Đang chờ</span>
                <h4>{data.matchData?.stats?.pending || 0}</h4>
              </div>
            </div>
            <div className="match-mini-card">
              <div className="icon-box success"><User size={16} /></div>
              <div className="info">
                <span>Hoạt động</span>
                <h4>{data.matchData?.stats?.active || 0}</h4>
              </div>
            </div>
            <div className="match-mini-card">
              <div className="icon-box danger"><User size={16} /></div>
              <div className="info">
                <span>Từ chối</span>
                <h4>{data.matchData?.stats?.rejected || 0}</h4>
              </div>
            </div>
            <div className="match-mini-card">
              <div className="icon-box muted"><Users size={16} /></div>
              <div className="info">
                <span>Kết thúc</span>
                <h4>{data.matchData?.stats?.ended || 0}</h4>
              </div>
            </div>
          </div>

          <div className="match-body-grid">
            <div className="match-classification">
              <h4 className="sub-title">Phân loại ghép đôi</h4>
              <div style={{ height: '180px', position: 'relative' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.matchData?.classification || []}
                      cx="50%" cy="50%"
                      innerRadius={50} outerRadius={70}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      <Cell fill="#3b82f6" />
                      <Cell fill="#a855f7" />
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="pie-overlay-labels">
                  {(data.matchData?.classification || []).map((item, idx) => (
                    <div key={idx} className="overlay-row">
                      <div className="label">
                        <div className="dot" style={{ backgroundColor: idx === 0 ? '#3b82f6' : '#a855f7' }}></div>
                        <span>{item.name}</span>
                      </div>
                      <span className="val">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="recent-matches">
              <h4 className="sub-title">Ghép đôi gần đây</h4>
              <div className="match-list-small">
                {(data.matchData?.recent || []).map(match => (
                  <div key={match.id} className="match-item-small">
                    <div className="match-avatars">
                      <img src={match.avatars?.[0] || 'https://i.pravatar.cc/150?u=1'} alt="U1" />
                      <img src={match.avatars?.[1] || 'https://i.pravatar.cc/150?u=2'} alt="U2" />
                    </div>
                    <div className="match-info-content">
                      <div className="pair-name">{match.pair}</div>
                      <div className="pair-time">{match.time}</div>
                    </div>
                    <span className={`match-status-badge ${match.status ? match.status.toLowerCase().replace(/\s/g, '-') : ''}`}>
                      {match.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="pie-section glass-card">
          <div className="section-header">
            <h3 className="section-title">Hoạt động gần đây</h3>
          </div>
          <div className="activity-list-new">
            {data.recentActivities.length > 0 ? data.recentActivities.map((act, idx) => (
              <div key={idx} className="activity-item-new">
                <div className="activity-dot" style={{ backgroundColor: act.dotColor }}></div>
                <div className="activity-content-new">
                  <p><strong>{act.user}</strong> {act.action}</p>
                  <span>{act.time}</span>
                </div>
              </div>
            )) : (
              [
                { user: 'Nguyễn Văn A', action: 'tạo hoạt động mới', time: '5 phút trước', color: '#10b981' },
                { user: 'Trần Thị B', action: 'bị báo cáo vi phạm', time: '12 phút trước', color: '#ef4444' },
                { user: 'Lê Văn C', action: 'đăng ký tài khoản', time: '30 phút trước', color: '#3b82f6' },
                { user: 'Phạm Thị D', action: 'tham gia nhóm Bóng đá', time: '1 giờ trước', color: '#6366f1' }
              ].map((act, idx) => (
                <div key={idx} className="activity-item-new">
                  <div className="activity-dot" style={{ backgroundColor: act.color }}></div>
                  <div className="activity-content-new">
                    <p><strong>{act.user}</strong> {act.action}</p>
                    <span>{act.time}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <style>{`
        .admin-dashboard-wrapper {
          padding: 24px;
          background: #f8fafc;
          min-height: 100vh;
        }

        .animate-fade-in {
          animation: fadeIn 0.6s ease-out forwards;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Header Simple */
        .dashboard-header-simple {
          margin-bottom: 24px;
        }

        .main-page-title {
          font-size: 26px;
          font-weight: 800;
          color: #1e293b;
          margin: 0 0 4px 0;
        }

        .welcome-msg {
          font-size: 15px;
          color: #64748b;
          margin: 0;
          font-weight: 500;
        }

        /* Row 1 Cards */
        .stats-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 24px;
        }

        .stat-card-new {
          background: #fff;
          padding: 24px;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02);
        }

        .stat-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 12px;
        }

        .stat-label-new {
          font-size: 15px;
          font-weight: 600;
          color: #64748b;
        }

        .stat-icon-new {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stat-value-new {
          font-size: 32px;
          font-weight: 850;
          color: #0f172a;
          margin-bottom: 8px;
        }

        .stat-trend-new {
          font-size: 14px;
          font-weight: 600;
        }

        .stat-trend-new.up { color: #10b981; }
        .stat-trend-new.down { color: #ef4444; }

        /* Main Grids */
        .dashboard-main-grid, .bottom-content-grid {
          display: grid;
          grid-template-columns: 1.8fr 1fr;
          gap: 24px;
          margin-bottom: 30px;
        }

        .glass-card {
          background: #fff;
          padding: 24px;
          border-radius: 20px;
          border: 1px solid #e2e8f0;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .section-title {
          font-size: 18px;
          font-weight: 800;
          color: #1e293b;
          margin: 0;
        }

        .chart-filters-new {
          display: flex;
          background: #f1f5f9;
          padding: 4px;
          border-radius: 10px;
          gap: 4px;
        }

        .filter-btn-new {
          padding: 6px 16px;
          border: none;
          background: transparent;
          font-size: 13px;
          font-weight: 700;
          color: #64748b;
          cursor: pointer;
          border-radius: 8px;
        }

        .filter-btn-new.active {
          background: #3b82f6;
          color: #fff;
        }

        /* Activity List */
        .activity-list-new {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-top: 20px;
        }

        .activity-item-new {
          display: flex;
          gap: 16px;
          align-items: flex-start;
        }

        .activity-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          margin-top: 6px;
          flex-shrink: 0;
        }

        .activity-content-new p {
          font-size: 14px;
          margin: 0;
          color: #1e293b;
        }

        .activity-content-new span {
          font-size: 12px;
          color: #94a3b8;
          font-weight: 600;
        }

        /* Pie Legend */
        .pie-legend-new {
          margin-top: 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .legend-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 14px;
          font-weight: 600;
        }

        .legend-info {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #64748b;
        }

        .legend-dot-new {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .legend-val {
          color: #0f172a;
          font-weight: 800;
        }

        /* Loader */
        .dashboard-loader {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
        }

        .premium-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f1f5f9;
          border-top-color: #3b82f6;
          border-radius: 50%;
          animation: spin 1s infinite linear;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        @media (max-width: 1200px) {
          .stats-row { grid-template-columns: repeat(2, 1fr); }
          .dashboard-main-grid, .bottom-content-grid { grid-template-columns: 1fr; }
        }

        /* Matching Management Styles */
        .match-stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          margin-bottom: 24px;
        }

        .match-mini-card {
          background: #f8fafc;
          padding: 12px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .match-mini-card .icon-box {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .match-mini-card .icon-box.warning { background: #fff7ed; color: #f59e0b; }
        .match-mini-card .icon-box.success { background: #f0fdf4; color: #10b981; }
        .match-mini-card .icon-box.danger { background: #fee2e2; color: #ef4444; }
        .match-mini-card .icon-box.muted { background: #f1f5f9; color: #64748b; }

        .match-mini-card .info span {
          font-size: 11px;
          color: #64748b;
          font-weight: 600;
          display: block;
        }

        .match-mini-card .info h4 {
          font-size: 16px;
          font-weight: 800;
          margin: 0;
          color: #0f172a;
        }

        .match-body-grid {
          display: grid;
          grid-template-columns: 1fr 1.5fr;
          gap: 24px;
        }

        .sub-title {
          font-size: 14px;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 16px;
        }

        .pie-overlay-labels {
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          flex-direction: column;
          gap: 12px;
          width: 140px;
        }

        .overlay-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 13px;
          font-weight: 600;
        }

        .overlay-row .label {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #64748b;
        }

        .overlay-row .dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }

        .overlay-row .val {
          color: #0f172a;
          font-weight: 800;
        }

        .match-list-small {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .match-item-small {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 0;
        }

        .match-avatars {
          display: flex;
          align-items: center;
        }

        .match-avatars img {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 2px solid #fff;
        }

        .match-avatars img:last-child {
          margin-left: -12px;
        }

        .match-info-content {
          flex: 1;
        }

        .pair-name {
          font-size: 13px;
          font-weight: 700;
          color: #0f172a;
        }

        .pair-time {
          font-size: 11px;
          color: #94a3b8;
        }

        .match-status-badge {
          padding: 4px 10px;
          border-radius: 8px;
          font-size: 10px;
          font-weight: 700;
        }

        .match-status-badge.đang-hoạt-động { background: #dcfce7; color: #10b981; }
        .match-status-badge.đang-chờ { background: #fff7ed; color: #f59e0b; }
        .match-status-badge.từ-chối { background: #fee2e2; color: #ef4444; }
        .match-status-badge.kết-thúc { background: #f1f5f9; color: #64748b; }
      `}</style>
    </div>
  );
};

export default Dashboard;


