import React, { useState, useEffect } from 'react';
import './PendingGroup.css';

// FIX: nhận reload prop để re-fetch khi có join mới
const PendingGroups = ({ reload = 0 }) => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userString = localStorage.getItem('user');
    const currentUser = userString ? JSON.parse(userString) : null;
    const currentUserId = currentUser?.user_id;

    if (!currentUserId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userObj = JSON.parse(storedUser);
      } catch (e) {
        console.error("Error parsing user from localStorage", e);
      }
    }

    if (!currentUserId) {
      console.warn("No user ID found in localStorage, cannot fetch pending activities.");
      setGroups([]); // Clear groups if no user
      setLoading(false); // Ensure loading is set to false
      return; // Exit early if no user ID
    }

    fetch(`/api/pending-activities?userId=${currentUserId}`)
      .then(res => res.json())
      .then(data => {
        setGroups(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Lỗi lấy pending:', err);
        setLoading(false);
      });
  }, [reload]); // FIX: re-fetch khi reload thay đổi

  const handleCancel = (id) => {
    if (!window.confirm('Bạn có chắc muốn hủy yêu cầu tham gia này?')) return;

    // FIX: DELETE /api/activities/pending-activities/:request_id (hủy request, không phải activity)
    fetch(`/api/activities/pending-activities/${id}`, { method: 'DELETE' })
      .then(res => res.json())
      .then(() => {
        setGroups(prev => prev.filter(g => g.id !== id));
      })
      .catch(err => console.error('Lỗi khi hủy:', err));
  };

  if (loading) {
    return (
      <div className="pending_container">
        <h4 className="pending_title">Danh sách các nhóm đang chờ duyệt</h4>
        <p style={{ fontSize: '13px', color: '#777', textAlign: 'center' }}>Đang tải...</p>
      </div>
    );
  }

  return (
    <div className="pending_container">
      <h4 className="pending_title">Danh sách các nhóm đang chờ duyệt</h4>

      {groups.length === 0 ? (
        <p style={{ fontSize: '13px', color: '#777', textAlign: 'center', margin: '20px 0' }}>
          Không có hoạt động nào đang chờ duyệt.
        </p>
      ) : (
        <div className="pending_list_wrap">
          {groups.map(group => (
            <div key={group.id} className="pending_item">
              <img
                src={group.creator_avatar || 'https://i.pravatar.cc/150?img=1'}
                alt={group.creator_name || 'User'}
                className="pending_avatar"
                referrerPolicy="no-referrer"
              />
              <div className="pending_name_wrapper">
                <span className="pending_name_text">{group.name}</span>
              </div>
              <div className="pending_actions" style={{ display: 'flex', gap: '5px' }}>
                <button className="pending_btn_cancel" onClick={() => handleCancel(group.id)}>
                  Hủy chờ
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PendingGroups;
