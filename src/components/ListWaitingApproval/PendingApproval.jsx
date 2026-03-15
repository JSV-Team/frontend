import { useState, useEffect } from 'react';
import { Check, X } from 'lucide-react';
import './PendingApproval.css';

// Lấy user ID từ localStorage giống như ListWaitingGroup
const getUserId = () => {
    const userString = localStorage.getItem('user');
    if (userString) {
        try {
            const userObj = JSON.parse(userString);
            return userObj?.user_id || userObj?.id || null;
        } catch (e) {
            console.error("Error parsing user from localStorage", e);
        }
    }
    return null;
};

function PendingApproval({ reload }) {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const userId = getUserId();

    const fetchPendingApprovals = async () => {
        if (!userId) return;
        try {
            setLoading(true);
            const response = await fetch(`/api/activities/pending-approvals?userId=${userId}`);
            if (!response.ok) throw new Error('Không thể tải các yêu cầu xin tham gia');
            const data = await response.json();
            setRequests(data);
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingApprovals();
    }, [userId, reload]);

    const handleAction = async (requestId, action) => {
        try {
            const endpoint = `/api/activities/pending-activities/${requestId}/${action}`;
            const response = await fetch(endpoint, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Lỗi xử lý yêu cầu');
            }

            // Xóa người dùng khỏi danh sách chờ sau khi duyệt/từ chối
            setRequests(prev => prev.filter(req => req.id !== requestId));
        } catch (err) {
            alert('Lỗi: ' + err.message);
        }
    };

    if (loading) return <div className="pending-approval-container"><p className="pending-empty">Đang tải...</p></div>;
    if (error) return <div className="pending-approval-container"><p className="pending-empty" style={{ color: 'red' }}>{error}</p></div>;

    // Nếu không có yêu cầu nào, không hiển thị cả khối component này cho gọn
    if (requests.length === 0) return null;

    return (
        <div className="pending-approval-container">
            <h3 className="pending-title">Người chờ bạn duyệt</h3>
            <div className="pending-list">
                {requests.map(req => (
                    <div key={req.id} className="pending-item">
                        <img
                            src={req.requester_avatar || 'https://i.pravatar.cc/150'}
                            alt={req.requester_name}
                            className="pending-avatar"
                            referrerPolicy="no-referrer"
                        />
                        <div className="pending-info">
                            <span className="pending-name">
                                <strong>{req.requester_name}</strong> muốn vào "{req.name}"
                            </span>
                            <div className="pending-actions">
                                <button
                                    className="action-btn accept-btn"
                                    onClick={() => handleAction(req.id, 'approve')}
                                    title="Duyệt"
                                >
                                    <Check size={16} />
                                </button>
                                <button
                                    className="action-btn reject-btn"
                                    onClick={() => handleAction(req.id, 'reject')}
                                    title="Từ chối"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default PendingApproval;
