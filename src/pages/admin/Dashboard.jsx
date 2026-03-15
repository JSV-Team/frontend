import React from 'react';

function Dashboard() {
  return (
    <div>
      <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '20px' }}>Dashboard Overview</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
        <div style={cardStyle}>
          <h3>Total Users</h3>
          <p style={numberStyle}>1,234</p>
        </div>
        <div style={cardStyle}>
          <h3>Active Posts</h3>
          <p style={numberStyle}>567</p>
        </div>
        <div style={cardStyle}>
          <h3>Pending Reports</h3>
          <p style={numberStyle}>12</p>
        </div>
        <div style={cardStyle}>
          <h3>Daily Active Users</h3>
          <p style={numberStyle}>89</p>
        </div>
      </div>
    </div>
  );
}

const cardStyle = {
  background: '#fff',
  padding: '24px',
  borderRadius: '16px',
  border: '1px solid #e7ecf3',
  boxShadow: '0 4px 6px rgba(0,0,0,0.02)'
};

const numberStyle = {
  fontSize: '32px',
  fontWeight: '800',
  color: '#3853b8',
  margin: '8px 0 0 0'
};

export default Dashboard;
