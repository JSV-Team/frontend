import React, { useState } from 'react';
import { 
  Globe, 
  Shield, 
  Bell, 
  Save, 
  Check, 
  Info,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';

const SystemSettings = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [settings, setSettings] = useState({
    siteName: 'VibeMatch',
    siteDescription: 'Nền tảng kết nối những người có chung sở thích',
    autoApprove: true,
    sensitiveFilter: true,
    autoBan: false,
    notifyReports: true,
    notifyNewUsers: false,
    notifySuspicious: true,
  });

  const handleToggle = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }, 1500);
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

      <div className="settings-container">
        {/* Section 1: Cài đặt chung */}
        <div className="premium-glass-card settings-section">
          <div className="section-header">
            <div className="icon-circle bg-indigo">
              <Globe size={20} />
            </div>
            <h3 className="section-title">Cài đặt chung</h3>
          </div>
          <div className="section-body">
            <div className="input-group">
              <label>Tên hệ thống</label>
              <input 
                type="text" 
                name="siteName"
                value={settings.siteName} 
                onChange={handleInputChange}
                placeholder="Nhập tên hệ thống..." 
              />
            </div>
            <div className="input-group">
              <label>Mô tả</label>
              <textarea 
                name="siteDescription"
                value={settings.siteDescription}
                onChange={handleInputChange}
                placeholder="Nhập mô tả hệ thống..."
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Section 2: Kiểm duyệt nội dung */}
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
            className={`save-btn ${loading ? 'loading' : ''} ${success ? 'success' : ''}`}
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? (
              <div className="loader"></div>
            ) : success ? (
              <><Check size={18} /> Đã lưu</>
            ) : (
              <><Save size={18} /> Lưu thay đổi</>
            )}
          </button>
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

        .settings-container {
          display: flex;
          flex-direction: column;
          gap: 24px;
          max-width: 1000px;
        }

        .premium-glass-card {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(12px);
          padding: 32px;
          border-radius: 24px;
          border: 1px solid rgba(255, 255, 255, 0.5);
          box-shadow: 0 10px 30px -5px rgba(0,0,0,0.03);
          transition: transform 0.3s;
        }

        .section-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 24px;
        }

        .icon-circle {
          width: 44px;
          height: 44px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
        }
        .bg-indigo { background: linear-gradient(135deg, #6366f1, #4f46e5); }
        .bg-blue { background: linear-gradient(135deg, #3b82f6, #2563eb); }
        .bg-purple { background: linear-gradient(135deg, #a855f7, #9333ea); }

        .section-title {
          font-size: 18px;
          font-weight: 700;
          color: #1e293b;
          margin: 0;
        }

        .section-body {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .input-group label {
          font-size: 14px;
          font-weight: 600;
          color: #475569;
        }

        .input-group input, 
        .input-group textarea {
          padding: 14px 16px;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          background: #f8fafc;
          font-size: 15px;
          transition: all 0.2s;
          color: #1e293b;
          width: 100%;
          box-sizing: border-box;
        }

        .input-group input:focus, 
        .input-group textarea:focus {
          outline: none;
          background: #fff;
          border-color: #6366f1;
          box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
        }

        .settings-toggle-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 4px 0;
        }

        .toggle-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .toggle-label {
          font-size: 15px;
          font-weight: 600;
          color: #1e293b;
        }

        .toggle-subtext {
          font-size: 13px;
          color: #64748b;
          margin: 0;
        }

        .premium-toggle {
          width: 48px;
          height: 26px;
          border-radius: 99px;
          background: #e2e8f0;
          position: relative;
          border: none;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .premium-toggle.active {
          background: #3b82f6;
        }

        .toggle-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #fff;
          position: absolute;
          top: 3px;
          left: 3px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .premium-toggle.active .toggle-thumb {
          left: 25px;
        }

        .button-row {
          display: flex;
          justify-content: flex-start;
          margin-top: 8px;
        }

        .save-btn {
          padding: 14px 32px;
          border-radius: 12px;
          background: #3853b8;
          color: #fff;
          font-size: 15px;
          font-weight: 700;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 10px;
          transition: all 0.3s;
          box-shadow: 0 4px 12px rgba(56, 83, 184, 0.2);
        }

        .save-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(56, 83, 184, 0.3);
          background: #2e44a3;
        }

        .save-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .save-btn.success {
          background: #10b981;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
        }

        .loader {
          width: 18px;
          height: 18px;
          border: 3px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default SystemSettings;
