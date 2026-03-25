import React, { useState, useEffect } from 'react';
import apiConfig from '../../config/apiConfig';
import {
  Shield,
  Bell,
  Save,
  Check,
  ShieldAlert,
  Plus,
  Trash2,
} from 'lucide-react';

const SystemSettings = () => {
  const [saveLoading, setSaveLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [keywords, setKeywords] = useState([]);
  const [newKeyword, setNewKeyword] = useState('');
  const [keywordLoading, setKeywordLoading] = useState(false);

  const [settings, setSettings] = useState({
    autoApprove: true,
    sensitiveFilter: true,
    autoBan: false,
    notifyReports: true,
    notifyNewUsers: false,
    notifySuspicious: true,
  });

  useEffect(() => {
    fetchSettings();
    fetchKeywords();
  }, []);

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiConfig.BASE_API}/admin/settings`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      if (result.success && result.data) {
        const dbData = result.data;
        setSettings(prev => ({
          ...prev,
          autoApprove: dbData.autoApprove !== undefined ? dbData.autoApprove === 'true' : prev.autoApprove,
          sensitiveFilter: dbData.sensitiveFilter !== undefined ? dbData.sensitiveFilter === 'true' : prev.sensitiveFilter,
          autoBan: dbData.autoBan !== undefined ? dbData.autoBan === 'true' : prev.autoBan,
          notifyReports: dbData.notifyReports !== undefined ? dbData.notifyReports === 'true' : prev.notifyReports,
          notifyNewUsers: dbData.notifyNewUsers !== undefined ? dbData.notifyNewUsers === 'true' : prev.notifyNewUsers,
          notifySuspicious: dbData.notifySuspicious !== undefined ? dbData.notifySuspicious === 'true' : prev.notifySuspicious,
        }));
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    }
  };

  const fetchKeywords = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiConfig.BASE_API}/admin/banned-keywords`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      if (result.success) {
        setKeywords(result.data);
      }
    } catch (error) {
      console.error("Error fetching keywords:", error);
    }
  };

  const handleToggle = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    setSaveLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiConfig.BASE_API}/admin/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(settings)
      });
      const result = await response.json();
      if (result.success) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (error) {
      console.error("Error saving settings:", error);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleAddKeyword = async (e) => {
    e.preventDefault();
    if (!newKeyword.trim()) return;

    setKeywordLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiConfig.BASE_API}/admin/banned-keywords`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ keyword: newKeyword.trim() })
      });
      const result = await response.json();
      if (result.success) {
        setNewKeyword('');
        fetchKeywords();
      }
    } catch (error) {
      console.error("Error adding keyword:", error);
    } finally {
      setKeywordLoading(false);
    }
  };

  const handleDeleteKeyword = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiConfig.BASE_API}/admin/banned-keywords/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      if (result.success) {
        fetchKeywords();
      }
    } catch (error) {
      console.error("Error deleting keyword:", error);
    }
  };

  const Toggle = ({ active, onClick, label, subtext }) => (
    <div className="settings-toggle-row">
      <div className="toggle-info">
        <span className="toggle-label">{label}</span>
        {subtext && <p className="toggle-subtext">{subtext}</p>}
      </div>
      <button
        className={`premium-toggle ${active ? 'active' : ''}`}
        onClick={onClick}
        type="button"
      >
        <div className="toggle-thumb" />
      </button>
    </div>
  );

  return (
    <div className="settings-page animate-fade-in">
      <div className="settings-header">
        <div className="header-content">
          <h2 className="premium-title">Cài đặt</h2>
          <p className="premium-subtitle">Quản lý cài đặt hệ thống</p>
        </div>
      </div>

      <div className="settings-layout">
        <div className="settings-main">
          {/* Section 1: Kiểm duyệt nội dung */}
          <div className="premium-glass-card settings-section">
            <div className="section-header">
              <div className="icon-circle bg-blue">
                <Shield size={20} />
              </div>
              <h3 className="section-title">Kiểm duyệt nội dung</h3>
            </div>
            <div className="section-body">
              <Toggle
                active={settings.autoApprove}
                onClick={() => handleToggle('autoApprove')}
                label="Tự động duyệt bài viết"
                subtext="Bài viết sẽ được đăng ngay mà không cần admin duyệt"
              />
              <Toggle
                active={settings.sensitiveFilter}
                onClick={() => handleToggle('sensitiveFilter')}
                label="Bộ lọc từ ngữ nhạy cảm"
                subtext="Tự động phát hiện và ẩn nội dung có từ ngữ vi phạm"
              />
              <Toggle
                active={settings.autoBan}
                onClick={() => handleToggle('autoBan')}
                label="Giới hạn báo cáo tự động cấm"
                subtext="Tự động cấm user khi nhận quá 10 báo cáo"
              />
            </div>
          </div>

          {/* Section 3: Thông báo */}
          <div className="premium-glass-card settings-section">
            <div className="section-header">
              <div className="icon-circle bg-purple">
                <Bell size={20} />
              </div>
              <h3 className="section-title">Thông báo</h3>
            </div>
            <div className="section-body">
              <Toggle
                active={settings.notifyReports}
                onClick={() => handleToggle('notifyReports')}
                label="Báo cáo vi phạm mới"
              />
              <Toggle
                active={settings.notifyNewUsers}
                onClick={() => handleToggle('notifyNewUsers')}
                label="User đăng ký mới"
              />
              <Toggle
                active={settings.notifySuspicious}
                onClick={() => handleToggle('notifySuspicious')}
                label="Hoạt động đáng ngờ"
              />
            </div>
          </div>

          <div className="button-row">
            <button
              className={`save-btn ${saveLoading ? 'loading' : ''} ${success ? 'success' : ''}`}
              onClick={handleSave}
              disabled={saveLoading}
            >
              {saveLoading ? (
                <div className="loader"></div>
              ) : success ? (
                <><Check size={18} /> Đã lưu</>
              ) : (
                <><Save size={18} /> Lưu thay đổi</>
              )}
            </button>
          </div>
        </div>

        <div className="settings-sidebar">
          {/* Banned Keywords Section */}
          <div className="premium-glass-card keyword-section">
            <div className="section-header" style={{ justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div className="icon-circle bg-red">
                  <ShieldAlert size={20} />
                </div>
                <h3 className="section-title">Từ khóa cấm</h3>
              </div>
            </div>

            <p className="section-description">Quản lý danh sách từ ngữ bị cấm (BannedKeywords)</p>

            <form className="keyword-input-box" onSubmit={handleAddKeyword}>
              <input
                type="text"
                placeholder="Thêm từ khóa mới..."
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                disabled={keywordLoading}
              />
              <button type="submit" disabled={keywordLoading || !newKeyword.trim()}>
                {keywordLoading ? <div className="loader small"></div> : <Plus size={18} />}
              </button>
            </form>

            <div className="keyword-list">
              <div className="keyword-list-header">
                <span>Từ khóa</span>
              </div>
              {keywords.map((kw) => (
                <div key={kw.id} className="keyword-item">
                  <span className="keyword-text">{kw.keyword}</span>
                  <button className="delete-kw-btn" onClick={() => handleDeleteKeyword(kw.id)}>
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              {keywords.length === 0 && (
                <div className="empty-keywords">Chưa có từ khóa nào</div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .settings-page {
          padding-bottom: 60px;
        }
        .animate-fade-in {
          animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .settings-header {
          margin-bottom: 32px;
        }
        .premium-title {
          font-size: 28px;
          font-weight: 850;
          color: #1e293b;
          margin: 0 0 4px 0;
          letter-spacing: -0.5px;
        }
        .premium-subtitle {
          color: #64748b;
          margin: 0;
          font-size: 15px;
        }

        .settings-layout {
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: 24px;
          align-items: start;
        }

        .settings-main {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .premium-glass-card {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(12px);
          padding: 24px;
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.5);
          box-shadow: 0 10px 30px -5px rgba(0,0,0,0.03);
        }

        .section-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 24px;
        }

        .icon-circle {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
        }
        .bg-blue { background: linear-gradient(135deg, #3b82f6, #2563eb); }
        .bg-purple { background: linear-gradient(135deg, #a855f7, #9333ea); }
        .bg-red { background: linear-gradient(135deg, #ef4444, #dc2626); }

        .section-title {
          font-size: 17px;
          font-weight: 700;
          color: #1e293b;
          margin: 0;
        }

        .section-description {
            font-size: 13px;
            color: #64748b;
            margin: -16px 0 20px 0;
        }

        .section-body {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .settings-toggle-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .toggle-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .toggle-label {
          font-size: 14px;
          font-weight: 600;
          color: #1e293b;
        }

        .toggle-subtext {
          font-size: 12px;
          color: #64748b;
          margin: 0;
        }

        .premium-toggle {
          width: 44px;
          height: 24px;
          border-radius: 99px;
          background: #e2e8f0;
          position: relative;
          border: none;
          cursor: pointer;
          transition: all 0.3s;
        }

        .premium-toggle.active {
          background: #1e293b;
        }

        .toggle-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #fff;
          position: absolute;
          top: 3px;
          left: 3px;
          transition: all 0.3s;
        }

        .premium-toggle.active .toggle-thumb {
          left: 23px;
        }

        .save-btn {
          padding: 12px 28px;
          border-radius: 10px;
          background: #1e293b;
          color: #fff;
          font-size: 14px;
          font-weight: 700;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s;
        }

        .save-btn:hover:not(:disabled) {
          background: #334155;
          transform: translateY(-1px);
        }

        .save-btn.success {
          background: #10b981;
        }

        /* Keyword styles */
        .keyword-input-box {
          display: flex;
          gap: 8px;
          margin-bottom: 20px;
        }

        .keyword-input-box input {
          flex: 1;
          padding: 10px 14px;
          border-radius: 10px;
          border: 1px solid #e2e8f0;
          background: #f8fafc;
          font-size: 14px;
        }

        .keyword-input-box button {
          width: 42px;
          height: 42px;
          border-radius: 10px;
          background: #1e293b;
          color: #fff;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .keyword-list {
          display: flex;
          flex-direction: column;
          border: 1px solid #f1f5f9;
          border-radius: 12px;
          overflow: hidden;
        }

        .keyword-list-header {
          padding: 12px 16px;
          background: #f8fafc;
          border-bottom: 1px solid #f1f5f9;
          font-size: 12px;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .keyword-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          border-bottom: 1px solid #f1f5f9;
          transition: background 0.2s;
        }

        .keyword-item:last-child {
          border-bottom: none;
        }

        .keyword-item:hover {
          background: #fcfdfe;
        }

        .keyword-text {
          font-size: 14px;
          font-weight: 600;
          color: #ef4444;
          background: rgba(239, 68, 68, 0.08);
          padding: 4px 10px;
          border-radius: 6px;
        }

        .delete-kw-btn {
          color: #94a3b8;
          background: none;
          border: none;
          cursor: pointer;
          transition: color 0.2s;
        }

        .delete-kw-btn:hover {
          color: #ef4444;
        }

        .empty-keywords {
          padding: 30px;
          text-align: center;
          color: #94a3b8;
          font-size: 13px;
        }

        .loader {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        .loader.small {
          width: 14px;
          height: 14px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default SystemSettings;
