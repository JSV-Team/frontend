import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { Send, MoreVertical, LogOut, Phone, Video, Info, Edit, Search, Image as ImageIcon, PlusCircle } from 'lucide-react';
import './Friends.css';

const getUserId = () => {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    try {
      const userObj = JSON.parse(storedUser);
      return userObj?.user_id || userObj?.id || null;
    } catch (e) {
      console.error("Error parsing user from localStorage", e);
    }
  }
  return null;
};
function Friends() {
  const [conversations, setConversations] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); // State cho ô tìm kiếm
  const [activeConvId, setActiveConvId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMsg, setInputMsg] = useState('');
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showInfo, setShowInfo] = useState(false);       // Toggle panel thông tin nhóm
  const [groupMembers, setGroupMembers] = useState([]);  // Danh sách thành viên
  const [loadingMembers, setLoadingMembers] = useState(false);
  const messagesEndRef = useRef(null);
  const activeConvIdRef = useRef(null);

  // Danh sách đã lọc theo từ khóa tìm kiếm (tính toán ngay mỗi lần render, ko cần state)
  const filteredConversations = searchQuery.trim()
    ? conversations.filter(c =>
      (c.activity_title || `Group ${c.conversation_id}`)
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    )
    : conversations;

  // Sync state into ref for Socket scope to access the latest active ID
  useEffect(() => {
    activeConvIdRef.current = activeConvId;
  }, [activeConvId]);

  // Khởi tạo Socket
  useEffect(() => {
    const currentUserId = getUserId();
    const newSocket = io('http://localhost:3001', {
      auth: { userId: currentUserId }, // Gửi kèm userId để server biết ai
    });

    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Socket connected:', newSocket.id);
    });

    // Lắng nghe tin nhắn mới tới
    newSocket.on('receive_message', (msg) => {
      // NẾU user đang mở đúng group này thì add tin nhắn mới vào màn hình ngay
      if (msg.conversation_id === activeConvIdRef.current) {
        setMessages((prev) => [...prev, msg]);
      }

      // Đẩy Group có tin nhắn mới lên vị trí ĐẦU TIÊN của Sidebar
      setConversations(prev => {
        const index = prev.findIndex(c => c.conversation_id === msg.conversation_id);
        if (index > -1) {
          const updatedConv = { ...prev[index], last_message: msg.content };
          const newConvs = [...prev];
          newConvs.splice(index, 1);
          newConvs.unshift(updatedConv); // Add to top
          return newConvs;
        }
        return prev;
      });
    });

    return () => newSocket.disconnect();
  }, []);

  // Cuộn xuống cuối mỗi khi có tin nhắn mới
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load danh sách nhóm chat
  useEffect(() => {
    const currentUserId = getUserId();
    fetch(`/api/chat/conversations?userId=${currentUserId}`)
      .then(res => res.json())
      .then(data => {
        setConversations(data);
        if (socket && data.length > 0) {
          // Báo server join các room socket để bắt đầu nghe ngóng tin
          const ids = data.map(c => c.conversation_id);
          socket.emit('join_rooms', ids);
        }
      })
      .catch(err => console.error('Fetch convs error:', err));
  }, [socket]);

  // Load lịch sử tin nhắn khi click vào 1 nhóm
  useEffect(() => {
    if (!activeConvId) return;
    setLoading(true);
    const currentUserId = getUserId();
    fetch(`/api/chat/conversations/${activeConvId}/messages?userId=${currentUserId}&limit=50`)
      .then(res => res.json())
      .then(data => {
        setMessages(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Fetch messages err:', err);
        setLoading(false);
      });
  }, [activeConvId]);

  const handleSend = () => {
    if (!inputMsg.trim() || !activeConvId || !socket) return;

    // Phát sự kiện lên server
    socket.emit('send_message', {
      conversationId: activeConvId,
      content: inputMsg,
    }, (response) => {
      // Callback từ server
      if (response.status === 'error') {
        alert(response.error);
      }
    });

    setInputMsg('');
  };

  const handleLeaveGroup = () => {
    if (!window.confirm('Bạn có chắc muốn rời nhóm này chứ?')) return;

    fetch(`/api/chat/conversations/${activeConvId}/leave`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: getUserId() })
    })
      .then(res => res.json())
      .then(() => {
        setConversations(prev => prev.filter(c => c.conversation_id !== activeConvId));
        setActiveConvId(null);
      });
  }

  // Hiện/ẩn panel thông tin nhóm và tải danh sách thành viên
  const handleShowInfo = () => {
    if (showInfo) {
      setShowInfo(false);
      return;
    }
    setShowInfo(true);
    setLoadingMembers(true);
    fetch(`/api/chat/conversations/${activeConvId}/members`)
      .then(res => res.json())
      .then(data => {
        setGroupMembers(data);
        setLoadingMembers(false);
      })
      .catch(() => setLoadingMembers(false));
  };

  const activeConv = conversations.find(c => c.conversation_id === activeConvId);

  return (
    <div className="friends-page">
      {/* CỘT TRÁI: Danh sách */}
      <div className="chat-sidebar">
        <div className="chat-sidebar-header">
          <div className="chat-sidebar-header-top">
            <h2>Tin nhắn</h2>
            <button className="new-chat-btn"><Edit size={16} /></button>
          </div>
          <div className="chat-search-wrapper">
            <Search size={16} color="#9ca3af" />
            <input
              type="text"
              className="chat-search-input"
              placeholder="Tìm kiếm cuộc trò chuyện"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="conversation-list">
          {filteredConversations.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#999', marginTop: '20px' }}>
              {searchQuery ? `Không tìm thấy "${searchQuery}"` : 'Chưa có cuộc trò chuyện nào'}
            </p>
          ) : (
            filteredConversations.map(conv => (
              <div
                key={conv.conversation_id}
                className={`conversation-item ${activeConvId === conv.conversation_id ? 'active' : ''}`}
                onClick={() => setActiveConvId(conv.conversation_id)}
              >
                <div className="avatar-container">
                  <img
                    src="https://via.placeholder.com/52/3b82f6/ffffff?text=GRP"
                    alt="Avatar"
                    className="conv-avatar"
                  />
                  <div className="online-dot"></div>
                </div>
                <div className="conv-info">
                  <div className="conv-title-row">
                    <span className="conv-title">{conv.activity_title || `Group ${conv.conversation_id}`}</span>
                    <span className="conv-time">12:45</span>
                  </div>
                  <div className="conv-last-msg">{conv.last_message || 'Chưa có tin nhắn...'}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* CỘT PHẢI: Khung chat */}
      <div className="chat-main">
        {!activeConvId ? (
          <div className="no-chat-selected">
            <svg width="100" height="100" viewBox="0 0 24 24" fill="#e2e8f0" xmlns="http://www.w3.org/2000/svg" className="no-chat-img">
              <rect x="3" y="4" width="18" height="14" rx="2" stroke="#cbd5e1" strokeWidth="2" />
              <path d="M7 12H17" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
              <path d="M7 8H13" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <h2>Chọn một cuộc trò chuyện để bắt đầu</h2>
            <p>Kết nối và chia sẻ cùng cộng đồng ngay bây giờ. Mọi cuộc hội thoại đều bắt đầu từ một tin nhắn đơn giản.</p>
            <button className="btn-new-chat">Tạo cuộc hội thoại mới</button>
          </div>
        ) : (
          <>
            <div className="chat-messages-container">
              {/* Box Tựa đề lơ lửng trên cùng (Floating Header) */}
              <div className="floating-chat-header">
                <div className="chat-header-info">
                  <h3>{activeConv?.activity_title || 'Chat Nhóm'}</h3>
                </div>
                <div className="chat-actions">
                  <button className="icon-btn"><Phone size={18} /></button>
                  <button className="icon-btn"><Video size={18} /></button>
                  <button
                    className={`icon-btn ${showInfo ? 'active' : ''}`}
                    title="Thông tin nhóm"
                    onClick={handleShowInfo}
                  >
                    <Info size={18} />
                  </button>
                </div>
              </div>

              <div className="chat-messages-scroll" ref={messagesEndRef?.current?.parentElement}>
                {loading && <p style={{ textAlign: 'center', color: '#888' }}>Đang tải tin nhắn...</p>}

                {messages.map((msg, index) => {
                  const currentUserId = getUserId();
                  const isMine = msg.sender_id === currentUserId;
                  const isSystem = msg.msg_type === 'system';

                  if (isSystem) {
                    return (
                      <div key={index} className="system-message">
                        Thông báo: {msg.content}
                      </div>
                    )
                  }

                  return (
                    <div key={index} className={`message-wrapper ${isMine ? 'mine' : 'theirs'}`}>
                      {!isMine && <span className="sender-name">{msg.sender_name || 'Người dùng'}</span>}
                      <div className="message-bubble">
                        {msg.content}
                      </div>
                      {/* Fake Trạng thái tin nhắn */}
                      {isMine && index === messages.length - 1 && (
                        <span className="message-status">Đã gửi</span>
                      )}
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            </div>

            <div className="chat-input-area">
              <div className="chat-input-tools">
                <PlusCircle size={22} cursor="pointer" />
                <ImageIcon size={22} cursor="pointer" />
              </div>
              <div className="chat-input-wrapper">
                <input
                  type="text"
                  className="chat-input"
                  placeholder="Chọn một người để nhắn tin..."
                  value={inputMsg}
                  onChange={(e) => setInputMsg(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                />
              </div>
              <button
                className={`chat-send-btn ${inputMsg.trim() ? 'active' : ''}`}
                onClick={handleSend}
                disabled={!inputMsg.trim()}
              >
                <Send size={18} />
              </button>
            </div>

            {/* === PANEL THÔNG TIN NHÓM (slide in từ phải) === */}
            {showInfo && (
              <div className="group-info-panel">
                <div className="group-info-header">
                  <h4>Thông tin nhóm</h4>
                  <button className="icon-btn" onClick={() => setShowInfo(false)}>×</button>
                </div>

                <div className="group-info-cover">
                  <div className="group-info-avatar">
                    {(activeConv?.activity_title || 'G').charAt(0).toUpperCase()}
                  </div>
                  <h3>{activeConv?.activity_title || 'Chat Nhóm'}</h3>
                </div>

                <div className="group-info-section">
                  <p className="group-info-label">
                    • {loadingMembers ? 'Đang tải...' : `${groupMembers.length} thành viên`}
                  </p>
                  <div className="member-list">
                    {loadingMembers ? (
                      <p className="loading-text">Đang tải danh sách...</p>
                    ) : (
                      groupMembers.map(m => (
                        <div key={m.user_id} className="member-item">
                          <div className="member-avatar">
                            {m.avatar_url
                              ? <img src={m.avatar_url} alt={m.full_name} />
                              : <span>{(m.full_name || '?').charAt(0).toUpperCase()}</span>
                            }
                          </div>
                          <div className="member-info">
                            <span className="member-name">{m.full_name}</span>
                            <span className={`member-role ${m.role}`}>{m.role === 'host' ? '👑 Chủ nhóm' : 'Thành viên'}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Friends;
