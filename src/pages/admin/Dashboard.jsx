import React, { useState } from 'react';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, 
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { 
  Users, FileText, Activity, AlertTriangle, 
  TrendingUp, TrendingDown, Clock, MousePointer2 
} from 'lucide-react';

const Dashboard = () => {
  const [timeFilter, setTimeFilter] = useState('Week');

  // Mock Data
  const stats = [
    { title: 'Tổng người dùng', value: '1248', trend: '+ 12%', trendType: 'up', icon: <Users />, bgColor: 'rgba(56, 83, 184, 0.1)', color: '#3853b8' },
    { title: 'Tổng bài viết', value: '3567', trend: '+ 8%', trendType: 'up', icon: <FileText />, bgColor: 'rgba(56, 184, 184, 0.1)', color: '#38b8b8' },
    { title: 'Hoạt động nhóm', value: '89', trend: '- 5%', trendType: 'down', icon: <Activity />, bgColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981' },
    { title: 'Yêu cầu chờ xử lý', value: '23', trend: '+ 3 mới hôm nay', trendType: 'up', icon: <AlertTriangle />, bgColor: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' },
  ];

  const activityData = {
    Week: [
      { name: 'T2', value: 30 },
      { name: 'T3', value: 55 },
      { name: 'T4', value: 85 },
      { name: 'T5', value: 60 },
      { name: 'T6', value: 95 },
      { name: 'T7', value: 70 },
      { name: 'CN', value: 110 },
    ],
    Month: [
      { name: 'Tuần 1', value: 240 },
      { name: 'Tuần 2', value: 320 },
      { name: 'Tuần 3', value: 280 },
      { name: 'Tuần 4', value: 450 },
    ],
    Year: [
      { name: 'T1', value: 1200 }, { name: 'T2', value: 1500 }, { name: 'T3', value: 1100 },
      { name: 'T4', value: 1800 }, { name: 'T5', value: 2100 }, { name: 'T6', value: 1900 },
      { name: 'T7', value: 2400 }, { name: 'T8', value: 2700 }, { name: 'T9', value: 2300 },
      { name: 'T10', value: 3100 }, { name: 'T11', value: 3500 }, { name: 'T12', value: 4200 },
    ]
  };

  const reportData = [
    { name: 'Spam', value: 35, color: '#ef4444' },
    { name: 'Nội dung độc hại', value: 25, color: '#f59e0b' },
    { name: 'Fake news', value: 20, color: '#3b82f6' },
    { name: 'Vi phạm quy chuẩn', value: 20, color: '#8b5cf6' },
  ];

  const trafficData = [
    { hour: '6h', value: 15 },
    { hour: '8h', value: 45 },
    { hour: '10h', value: 75 },
    { hour: '12h', value: 95 },
    { hour: '14h', value: 65 },
    { hour: '16h', value: 80 },
    { hour: '18h', value: 110 },
    { hour: '20h', value: 135 },
    { hour: '22h', value: 85 },
    { hour: '0h', value: 30 },
  ];

  const recentActivities = [
    { user: 'Nguyễn Văn A', action: 'tạo hoạt động mới', time: '5 phút trước', dotColor: '#10b981' },
    { user: 'Trần Thị B', action: 'bị báo cáo vi phạm', time: '12 phút trước', dotColor: '#ef4444' },
    { user: 'Lê Văn C', action: 'đăng ký tài khoản', time: '30 phút trước', dotColor: '#3b82f6' },
    { user: 'Phạm Thị D', action: 'tham gia nhóm Bóng đá', time: '1 giờ trước', dotColor: '#f59e0b' },
  ];

  return (
    <div className="dashboard-grid">
      <div className="dashboard-header">
        <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '4px' }}>Dashboard</h2>
        <p style={{ color: 'var(--admin-text-muted)', margin: 0 }}>Chào mừng trở lại, Admin 👋</p>
      </div>

      {/* Row 1: Stats */}
      <div className="dashboard-row-stats">
        {stats.map((stat, idx) => (
          <div key={idx} className="stat-card">
            <div className="stat-info">
              <h3>{stat.title}</h3>
              <div className="stat-value">{stat.value}</div>
              <div className={`stat-trend ${stat.trendType}`}>
                {stat.trendType === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                {stat.trend}
              </div>
            </div>
            <div className="stat-icon" style={{ backgroundColor: stat.bgColor, color: stat.color }}>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Row 2: Charts */}
      <div className="dashboard-row-charts">
        <div className="admin-card">
          <div className="admin-card__header">
            <h3 className="admin-card__title">Thống kê hoạt động</h3>
            <div className="chart-filters" style={{ display: 'flex', gap: '8px' }}>
              <button 
                onClick={() => setTimeFilter('Week')} 
                style={timeFilter === 'Week' ? filterBtnActive : filterBtn}
              >Tuần</button>
              <button 
                onClick={() => setTimeFilter('Month')} 
                style={timeFilter === 'Month' ? filterBtnActive : filterBtn}
              >Tháng</button>
              <button 
                onClick={() => setTimeFilter('Year')} 
                style={timeFilter === 'Year' ? filterBtnActive : filterBtn}
              >Năm</button>
            </div>
          </div>
          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={activityData[timeFilter]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}
                  itemStyle={{ color: '#3853b8', fontWeight: 600 }}
                  formatter={(value) => [value, "Người dùng"]}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#3853b8" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#3853b8', strokeWidth: 2, stroke: '#fff' }} 
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="admin-card">
          <div className="admin-card__header">
            <h3 className="admin-card__title">Báo cáo vi phạm</h3>
          </div>
          <div style={{ height: '240px', width: '100%', display: 'flex', justifyContent: 'center' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={reportData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {reportData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, "Tỷ lệ"]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="pie-legend" style={{ marginTop: '20px' }}>
            {reportData.map((entry, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: entry.color }}></div>
                  <span style={{ color: 'var(--admin-text-muted)' }}>{entry.name}</span>
                </div>
                <span style={{ fontWeight: '600' }}>{entry.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 3: Bottom Row */}
      <div className="dashboard-row-bottom">
        <div className="admin-card">
          <div className="admin-card__header">
            <h3 className="admin-card__title">Lượng truy cập theo giờ</h3>
          </div>
          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trafficData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip 
                  cursor={{ fill: 'rgba(56, 83, 184, 0.05)' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}
                  formatter={(value) => [value, "Lượt truy cập"]}
                />
                <Bar dataKey="value" fill="#3853b8" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="admin-card">
          <div className="admin-card__header">
            <h3 className="admin-card__title">Hoạt động gần đây</h3>
          </div>
          <div className="activity-list">
            {recentActivities.map((activity, idx) => (
              <div key={idx} className="activity-item">
                <div className="activity-dot" style={{ backgroundColor: activity.dotColor }}></div>
                <div className="activity-content">
                  <p><strong>{activity.user}</strong> {activity.action}</p>
                  <span>{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
          <button style={{ width: '100%', marginTop: 'auto', padding: '12px', background: 'none', border: '1px solid var(--admin-border)', borderRadius: '12px', fontSize: '14px', fontWeight: '600', color: 'var(--admin-primary)', cursor: 'pointer' }}>
            Xem tất cả
          </button>
        </div>
      </div>
    </div>
  );
};

const filterBtn = {
  padding: '6px 16px',
  borderRadius: '8px',
  border: 'none',
  background: '#f1f5f9',
  fontSize: '13px',
  fontWeight: '600',
  color: '#64748b',
  cursor: 'pointer'
};

const filterBtnActive = {
  ...filterBtn,
  background: '#3853b8',
  color: '#fff'
};

export default Dashboard;
