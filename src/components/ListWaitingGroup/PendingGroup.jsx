import React, { useState, useEffect } from 'react';
import './PendingGroup.css';
import activityService from '../../services/activityService';

const PendingGroups = ({ reload = 0 }) => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPendingGroups = async () => {
      setLoading(true);

      const userString = localStorage.getItem('user');
      let currentUserId = null;

      if (userString) {
        try {
          const currentUser = JSON.parse(userString);
          currentUserId = currentUser?.user_id || currentUser?.id || null;
        } catch (e) {
          console.error("Lỗi khi đọc dữ liệu user từ localStorage:", e);
        }
      }

      if (!currentUserId) {
        setGroups([]);
        setLoading(false);
        return;
      }

      try {
        const data = await activityService.getPendingActivities(currentUserId);
        setGroups(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Lỗi lấy pending:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingGroups();
  }, [reload]);

  const handleCancel = async (id) => {
    if (!window.confirm('Bạn có chắc muốn hủy yêu cầu tham gia này?')) return;

    try {
      await activityService.cancelJoinRequest(id);
      setGroups(prev => prev.filter(g => g.id !== id));
    } catch (err) {
      console.error('Lỗi khi hủy:', err);
    }
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