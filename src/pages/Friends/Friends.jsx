import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { io } from 'socket.io-client';
import { Send, MoreVertical, LogOut, Phone, Video, Info, Edit, Search, Image as ImageIcon, PlusCircle } from 'lucide-react';
import './Friends.css';



function Friends() {
  const location = useLocation();
  const userString = localStorage.getItem('user');
  const currentUser = userString ? JSON.parse(userString) : null;
  const CURRENT_USER_ID = currentUser?.user_id;
  const [conversations, setConversations] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); // State cho ô tìm kiếm
  const [activeConvId, setActiveConvId] = useState(location.state?.openChatId || null);
  const [messages, setMessages] = useState([]);
  const [inputMsg, setInputMsg] = useState('');
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showInfo, setShowInfo] = useState(false);       // Toggle panel thông tin nhóm
  const [groupMembers, setGroupMembers] = useState([]);  // Danh sách thành viên
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef(null);
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

  // Sync with location state when navigating from another page
  useEffect(() => {
    if (location.state?.openChatId) {
      setActiveConvId(location.state.openChatId);
      // Xóa state để tránh vòng lặp nếu có rerender
      window.history.replaceState({}, document.title);
    }
  }, [location.state?.openChatId]);

  // Khởi tạo Socket
  useEffect(() => {
    const newSocket = io('http://localhost:3001', {
      auth: { userId: CURRENT_USER_ID }, // Gửi kèm userId để server biết ai
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
    fetch(`/api/chat/conversations?userId=${CURRENT_USER_ID}`)
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
    fetch(`/api/chat/conversations/${activeConvId}/messages?userId=${CURRENT_USER_ID}&limit=50`)
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
      msgType: 'text',
    }, (response) => {
      // Callback từ server
      if (response.status === 'error') {
        alert(response.error);
      }
    });

    setInputMsg('');
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !activeConvId || !socket) return;

    // Hiển thị preview local
    const localPreview = URL.createObjectURL(file);
    setImagePreview(localPreview);
    setUploadingImage(true);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const res = await fetch('http://localhost:3001/api/upload/image', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Upload thất bại');

      // Gửi Message ảnh qua Socket
      socket.emit('send_message', {
        conversationId: activeConvId,
        content: '', // Có thể để trống nếu chỉ gửi ảnh
        msgType: 'image',
        imageUrl: data.imageUrl
      }, (response) => {
        if (response.status === 'error') {
          alert('Lỗi gửi ảnh: ' + response.error);
        }
      });

    } catch (err) {
      alert('Lỗi upload: ' + err.message);
    } finally {
      setUploadingImage(false);
      setImagePreview(''); // Xóa preview sau khi gửi xong
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleLeaveGroup = () => {
    if (!window.confirm('Bạn có chắc muốn rời nhóm này chứ?')) return;

    fetch(`/api/chat/conversations/${activeConvId}/leave`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: CURRENT_USER_ID })
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
                  const isMine = msg.sender_id === CURRENT_USER_ID;
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
                        {msg.msg_type === 'image' || msg.image_url ? (
                          <div className="message-image-container">
                            <img
                              src={msg.image_url?.startsWith('http') ? msg.image_url : `http://localhost:3001${msg.image_url}`}
                              alt="Sent image"
                              className="message-image"
                            />
                            {/* Nếu muốn cho phép vừa gửi ảnh vừa gửi chữ 1 lúc */}
                            {msg.content && <div style={{ marginTop: '5px' }}>{msg.content}</div>}
                          </div>
                        ) : (
                          msg.content
                        )}
                      </div>
                      {/* Fake Trạng thái tin nhắn */}
                      {isMine && index === messages.length - 1 && (
                        <span className="message-status">Đã gửi</span>
                      )}
                    </div>
                  );
                })}
                <div ref={(el) => { messagesEndRef.current = el; }} />
              </div>
            </div>

            <div className="chat-input-area">
              {imagePreview && (
                <div className="image-preview-container" style={{ position: 'absolute', bottom: '100%', left: '0', padding: '10px', background: '#fff', borderTop: '1px solid #ddd', width: '100%', zIndex: 10 }}>
                  <img src={imagePreview} alt="Preview" style={{ height: '60px', borderRadius: '4px' }} />
                  <button className="icon-btn" onClick={() => {
                    URL.revokeObjectURL(imagePreview);
                    setImagePreview('');
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }} style={{ position: 'absolute', top: '5px', right: '5px', background: 'rgba(0,0,0,0.6)', color: 'white', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', border: 'none', cursor: 'pointer' }}>×</button>
                </div>
              )}

              <div className="chat-input-tools">
                <PlusCircle size={22} cursor="pointer" />
                <ImageIcon size={22} cursor="pointer" onClick={() => fileInputRef.current?.click()} />
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  onChange={handleImageUpload}
                />
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
                  <button className="leave-group-btn" onClick={handleLeaveGroup}>
                    <LogOut size={16} />
                    <span>Rời nhóm</span>
                  </button>
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
