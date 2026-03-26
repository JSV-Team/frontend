import React, { useState, useEffect } from 'react';
import apiConfig from '../../config/apiConfig';
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
      { title: 'Hoạt động nhóm', value: '85', trend: '+ 12%', trendType: 'up' }
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
    reportData: [],
      matchData: {
        stats: { pending: 0, active: 0, rejected: 0, ended: 0 },
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
      const response = await fetch(`${apiConfig.BASE_API}/admin/stats`, {
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
        <h2 className="main-page-title" style={{ color: '#1e293b', fontWeight: '850' }}>Dashboard</h2>
        <p className="welcome-msg">Chào mừng trở lại, Admin 👋</p>
      </div>

      {/* Row 1: 4 Cards (Dàn ngang 4 ô) */}
      <div className="stats-row">
        {data.stats.slice(0, 3).map((stat, idx) => {
          const icons = [<Users size={24} />, <FileText size={24} />, <Activity size={24} />];
          const colors = ['#6366f1', '#3b82f6', '#10b981'];
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
          grid-template-columns: repeat(3, 1fr);
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
          grid-template-columns: 1fr;
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


