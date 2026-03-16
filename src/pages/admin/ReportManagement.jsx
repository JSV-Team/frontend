import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, CheckCircle, XCircle, Clock, 
  ArrowRight, Shield, User, MessageSquare, AlertCircle
} from 'lucide-react';

const ReportManagement = () => {
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState([
    { label: 'Chờ xử lý', value: 0, type: 'pending' },
    { label: 'Đã xử lý', value: 0, type: 'resolved' },
    { label: 'Đã bỏ qua', value: 0, type: 'dismissed' }
  ]);

  const mockReports = [
    {
      id: 1,
      reporter: 'Trần Thị B',
      target: 'người dùng Hoàng Văn E',
      reason: 'Spam quảng cáo',
      status: 'pending',
      severity: 'Cao',
      time: '2 giờ trước'
    },
    {
      id: 2,
      reporter: 'Nguyễn Văn A',
      target: 'báo cáo Lê Văn C',
      reason: 'Nội dung không phù hợp',
      status: 'pending',
      severity: 'Trung bình',
      time: '5 giờ trước'
    }
  ];

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/admin/reports', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      
      if (result.success) {
        setReports(result.data.reports);
        setStats(result.data.stats);
      } else {
        setReports(mockReports);
      }
    } catch (error) {
      console.error("Error fetching reports:", error);
      setReports(mockReports);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/api/admin/reports/${id}/status`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      const result = await response.json();
      if (result.success) {
        // Update local state
        setReports(prev => prev.map(repo => 
          repo.id === id ? { ...repo, status: newStatus } : repo
        ));
        // Refresh stats
        fetchReports();
      }
    } catch (error) {
      console.error("Error updating report status:", error);
      // Fallback for mock
      setReports(prev => prev.map(repo => 
        repo.id === id ? { ...repo, status: newStatus } : repo
      ));
    }
  };

  return (
    <div className="report-management">
      <div className="dashboard-header">
        <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '4px' }}>Báo cáo vi phạm</h2>
        <p style={{ color: 'var(--admin-text-muted)', margin: 0 }}>Xử lý các báo cáo vi phạm từ người dùng 🛡️</p>
      </div>

      <div className="report-summary-grid">
        {stats.map((stat, idx) => (
          <div key={idx} className={`report-stat-card ${stat.type}`}>
            <div className="icon-box">
              {stat.type === 'pending' ? <Clock size={24} /> : 
               (stat.type === 'resolved' ? <CheckCircle size={24} /> : <XCircle size={24} />)}
            </div>
            <div className="info">
              <h3>{stat.value}</h3>
              <p>{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="report-list">
        {reports.map((repo) => (
          <div key={repo.id} className="report-item-card">
            <div className="warning-icon">
              <AlertTriangle size={24} />
            </div>
            
            <div className="content">
              <h4>
                {repo.reporter} <ArrowRight size={14} style={{ margin: '0 8px' }} /> {repo.target}
              </h4>
              <p className="reason">Lý do: {repo.reason}</p>
              
              <div className="meta">
                <span className={`severity-badge ${repo.severity.toLowerCase()}`}>
                  Mức độ: {repo.severity}
                </span>
                <span className="time">{repo.time}</span>
              </div>
            </div>

            {repo.status === 'pending' ? (
              <div className="report-actions">
                <button 
                  className="action-btn-small btn-approve"
                  onClick={() => handleUpdateStatus(repo.id, 'resolved')}
                >
                  Xử lý
                </button>
                <button 
                  className="action-btn-small btn-view"
                  onClick={() => handleUpdateStatus(repo.id, 'dismissed')}
                >
                  Bỏ qua
                </button>
              </div>
            ) : (
              <div className="action-status-icon">
                {repo.status === 'resolved' ? (
                  <CheckCircle size={24} className="status-check" />
                ) : (
                  <XCircle size={24} className="status-x" />
                )}
              </div>
            )}
          </div>
        ))}

        {reports.length === 0 && (
          <div style={{ padding: '60px', textAlign: 'center', background: '#fff', borderRadius: '20px', border: '1px solid var(--admin-border)' }}>
            <p style={{ color: 'var(--admin-text-muted)' }}>Hiện không có báo cáo nào cần xử lý.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportManagement;
