import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, 
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { 
  Users, FileText, Activity, AlertTriangle, 
  TrendingUp, TrendingDown, Clock, MousePointer2,
  RefreshCw
} from 'lucide-react';

const Dashboard = () => {
  const [timeFilter, setTimeFilter] = useState('Week');
  const [loading, setLoading] = useState(true);
  
  // Default/Fallback Mock Data
  const [data, setData] = useState({
    stats: [
      { title: 'Tổng người dùng', value: '1,280', trend: '+ 2%', trendType: 'up' },
      { title: 'Tổng bài viết', value: '3,500', trend: '+ 5%', trendType: 'up' },
      { title: 'Hoạt động nhóm', value: '85', trend: '+ 12%', trendType: 'up' },
      { title: 'Báo cáo chờ xử lý', value: '12', trend: 'Cần xử lý', trendType: 'up' }
    ],
    activityData: {
      Week: [
        { name: 'T2', value: 30 }, { name: 'T3', value: 55 }, { name: 'T4', value: 85 },
        { name: 'T5', value: 60 }, { name: 'T6', value: 95 }, { name: 'T7', value: 70 }, { name: 'CN', value: 110 }
      ],
      Month: [], Year: []
    },
    reportData: [
      { name: 'Spam', value: 4, color: '#ef4444' },
      { name: 'Toxic', value: 3, color: '#f59e0b' },
      { name: 'Khác', value: 2, color: '#3b82f6' }
    ],
    recentActivities: [
      { user: 'Hệ thống', action: 'đang tải dữ liệu...', time: 'Vừa xong', dotColor: '#3853b8' }
    ]
  });

  const fetchStats = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const result = await response.json();
      if (result.success && result.data && result.data.stats.length > 0) {
        setData(result.data);
      }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const trafficData = [
    { hour: '6h', value: 15 }, { hour: '8h', value: 45 }, { hour: '10h', value: 75 },
    { hour: '12h', value: 95 }, { hour: '14h', value: 65 }, { hour: '16h', value: 80 },
    { hour: '18h', value: 110 }, { hour: '20h', value: 135 }, { hour: '22h', value: 85 },
    { hour: '0h', value: 30 },
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', flexDirection: 'column', gap: '16px' }}>
        <RefreshCw className="spin" size={40} color="var(--admin-primary)" />
        <p style={{ color: 'var(--admin-text-muted)', fontWeight: 600 }}>Cập nhật dữ liệu hệ thống...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-grid">
      <div className="dashboard-header">
        <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '4px' }}>Dashboard</h2>
        <p style={{ color: 'var(--admin-text-muted)', margin: 0 }}>Số liệu thống kê chi tiết hệ thống 👋</p>
      </div>

      {/* Row 1: Stats */}
      <div className="dashboard-row-stats">
        {data.stats.map((stat, idx) => {
          const icons = [<Users />, <FileText />, <Activity />, <AlertTriangle />];
          const colors = ['#3853b8', '#38b8b8', '#10b981', '#f59e0b'];
          const bgColors = ['rgba(56, 83, 184, 0.1)', 'rgba(56, 184, 184, 0.1)', 'rgba(16, 185, 129, 0.1)', 'rgba(245, 158, 11, 0.1)'];
          
          return (
            <div key={idx} className="stat-card">
              <div className="stat-info">
                <h3>{stat.title}</h3>
                <div className="stat-value">{stat.value}</div>
                <div className={`stat-trend ${stat.trendType}`}>
                  {stat.trendType === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                  {stat.trend}
                </div>
              </div>
              <div className="stat-icon" style={{ backgroundColor: bgColors[idx % 4], color: colors[idx % 4] }}>
                {icons[idx % 4]}
              </div>
            </div>
          );
        })}
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
              <LineChart data={data.activityData[timeFilter] && data.activityData[timeFilter].length > 0 ? data.activityData[timeFilter] : [
                { name: 'Mon', value: 0 }, { name: 'Sun', value: 0 }
              ]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}
                  itemStyle={{ color: '#3853b8', fontWeight: 600 }}
                  formatter={(value) => [value, "Số lượng"]}
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
                  data={data.reportData && data.reportData.length > 0 ? data.reportData : [{ name: 'Không có dữ liệu', value: 1, color: '#e2e8f0' }]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {(data.reportData && data.reportData.length > 0 ? data.reportData : [{ color: '#e2e8f0' }]).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [value, "Số lượng"]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="pie-legend" style={{ marginTop: '20px' }}>
            {data.reportData.map((entry, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: entry.color }}></div>
                  <span style={{ color: 'var(--admin-text-muted)' }}>{entry.name}</span>
                </div>
                <span style={{ fontWeight: '600' }}>{entry.value}</span>
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
            {data.recentActivities.length > 0 ? data.recentActivities.map((activity, idx) => (
              <div key={idx} className="activity-item">
                <div className="activity-dot" style={{ backgroundColor: activity.dotColor }}></div>
                <div className="activity-content">
                  <p><strong>{activity.user}</strong> {activity.action}</p>
                  <span>{activity.time}</span>
                </div>
              </div>
            )) : (
              <p style={{ color: 'var(--admin-text-muted)', fontSize: '14px', textAlign: 'center', padding: '20px' }}>Chưa có hoạt động nào</p>
            )}
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
