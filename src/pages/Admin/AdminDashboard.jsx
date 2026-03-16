import React from 'react';

export default function AdminDashboard() {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>VibeMatch Admin Dashboard</h1>
      <p>Chào mừng Admin! Đây là khu vực bảo mật.</p>
      <div style={{ marginTop: '20px', border: '1px solid #ccc', padding: '10px' }}>
        <h3>Thống kê hệ thống</h3>
        <p>Người dùng đang hoạt động: 150</p>
        <p>Báo cáo chờ xử lý: 5</p>
      </div>
    </div>
  );
}
