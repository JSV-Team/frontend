import React from 'react';

function UserManagement() {
  return (
    <div>
      <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '20px' }}>User Management</h2>
      <div style={tableContainerStyle}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Username</th>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Role</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={tdStyle}>1</td>
              <td style={tdStyle}>admin</td>
              <td style={tdStyle}>admin@jsv.com</td>
              <td style={tdStyle}>admin</td>
              <td style={tdStyle}><span style={badgeStyle}>Active</span></td>
              <td style={tdStyle}><button style={btnStyle}>Edit</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

const tableContainerStyle = {
  background: '#fff',
  borderRadius: '16px',
  border: '1px solid #e7ecf3',
  overflow: 'hidden'
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
};

const thStyle = {
  textAlign: 'left',
  padding: '16px',
  background: '#f8fafc',
  borderBottom: '1px solid #e7ecf3',
  color: '#64748b',
  fontWeight: '600',
  fontSize: '14px'
};

const tdStyle = {
  padding: '16px',
  borderBottom: '1px solid #e7ecf3',
  fontSize: '14px'
};

const badgeStyle = {
  padding: '4px 8px',
  borderRadius: '6px',
  background: '#dcfce7',
  color: '#166534',
  fontSize: '12px',
  fontWeight: '600'
};

const btnStyle = {
  padding: '6px 12px',
  borderRadius: '8px',
  border: '1px solid #dbe3ef',
  background: '#fff',
  cursor: 'pointer',
  fontSize: '12px'
};

export default UserManagement;
