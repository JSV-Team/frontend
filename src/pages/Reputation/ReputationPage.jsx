import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { 
  TrendingUp, 
  ShieldCheck, 
  AlertCircle, 
  Info, 
  Star, 
  UserPlus, 
  Clock,
  History
} from "lucide-react";
import "./reputationPage.css";
import { reputationService } from "../../services/apiReputationService";

export default function ReputationPage() {
  const { USER_ID, stats } = useOutletContext();
  const score = stats?.reputation || 0;
  const maxScore = 500;
  
  const [logs, setLogs] = useState([]);
  const [summary, setSummary] = useState({ monthly_delta: 0, positive_count: 0, report_count: 0 });
  const [filter, setFilter] = useState("Tất cả");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!USER_ID) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const [logsData, summaryData] = await Promise.all([
          reputationService.getLogs(USER_ID, { type: filter }),
          reputationService.getSummary(USER_ID)
        ]);
        setLogs(logsData);
        setSummary(summaryData);
      } catch (error) {
        console.error("Error fetching reputation data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [USER_ID, filter]);

  // Calculate level based on score
  const getLevelInfo = (s) => {
    if (s < 100) return { label: "Mới", color: "#ef4444", icon: <UserPlus size={20} />, range: "0-99" };
    if (s < 200) return { label: "Bình thường", color: "#f59e0b", icon: <Clock size={20} />, range: "100-199" };
    if (s < 400) return { label: "Tin cậy", color: "#10b981", icon: <ShieldCheck size={20} />, range: "200-399" };
    return { label: "Xuất sắc", color: "#8b5cf6", icon: <Star size={20} />, range: "400-500" };
  };

  const currentLevel = getLevelInfo(score);
  const percentage = Math.min((score / maxScore) * 100, 100);

  const getNextLevelInfo = (s) => {
    if (s < 100) return { score: 100, label: "Bình thường" };
    if (s < 200) return { score: 200, label: "Tin cậy" };
    if (s < 400) return { score: 400, label: "Xuất sắc" };
    return null;
  };

  const nextLevel = getNextLevelInfo(score);

  const formatType = (type) => {
    const map = {
      'activity': 'Hoạt động',
      'report': 'Báo cáo',
      'system': 'Hệ thống',
      'match': 'Ghép đôi'
    };
    return map[type] || type;
  };

  return (
    <div className="rp-container">
      {/* Main Score Card */}
      <div className="rp-score-card">
        <div className="rp-score-left">
          <div className="rp-circular-progress" style={{ '--percentage': `${percentage}%`, '--color': currentLevel.color }}>
            <div className="rp-score-inner">
              <span className="rp-score-value">{score}</span>
              <span className="rp-score-max">/{maxScore}</span>
            </div>
          </div>
          <div className="rp-level-badge" style={{ backgroundColor: `${currentLevel.color}15`, color: currentLevel.color }}>
            {currentLevel.icon}
            <span>{currentLevel.label}</span>
          </div>
        </div>

        <div className="rp-score-center">
          <h2 className="rp-main-title">Điểm uy tín của bạn</h2>
          <p className="rp-main-desc">
            Điểm được tính từ hoạt động, đánh giá của cộng đồng và lịch sử báo cáo. 
            Duy trì điểm cao để mở khoá nhiều tính năng hơn.
          </p>
          <div className="rp-range-info">
            <span className="rp-range-label">{currentLevel.label} ({currentLevel.range})</span>
            {nextLevel && (
              <span className="rp-range-next">Còn {nextLevel.score - score} điểm để lên {nextLevel.label}</span>
            )}
          </div>
          <div className="rp-progress-track">
            <div className="rp-progress-bar" style={{ width: `${percentage}%`, backgroundColor: currentLevel.color }}></div>
          </div>
        </div>

        <div className="rp-score-right">
          <div className="rp-mini-stat">
            <div className="rp-mini-icon trending"><TrendingUp size={16} /></div>
            <div className="rp-mini-text">
              <span className={`rp-mini-val ${summary.monthly_delta >= 0 ? 'highlight' : 'danger'}`}>
                {summary.monthly_delta >= 0 ? `+${summary.monthly_delta}` : summary.monthly_delta}
              </span>
              <span className="rp-mini-label">tháng này</span>
            </div>
          </div>
          <div className="rp-mini-stat">
            <div className="rp-mini-icon history"><History size={16} /></div>
            <div className="rp-mini-text">
              <span className="rp-mini-val">{summary.positive_count}</span>
              <span className="rp-mini-label">lần cộng</span>
            </div>
          </div>
          <div className="rp-mini-stat">
            <div className="rp-mini-icon reports"><AlertCircle size={16} /></div>
            <div className="rp-mini-text">
              <span className={`rp-mini-val ${summary.report_count > 0 ? 'danger' : ''}`}>{summary.report_count}</span>
              <span className="rp-mini-label">báo cáo</span>
            </div>
          </div>
        </div>
      </div>

      {/* Levels Explorer */}
      <div className="rp-levels-grid">
        <div className={`rp-level-card ${score < 100 ? 'active' : ''}`}>
          <div className="rp-card-icon level-new"><UserPlus size={24} /></div>
          <h3 className="rp-card-label">Mới</h3>
          <span className="rp-card-range">0 - 99 pts</span>
          <p className="rp-card-desc">Tài khoản vừa đăng ký, chưa có lịch sử hoạt động</p>
          {score < 100 && <div className="rp-current-marker">— Bạn đang ở đây</div>}
        </div>

        <div className={`rp-level-card ${score >= 100 && score < 200 ? 'active' : ''}`}>
          <div className="rp-card-icon level-normal"><Clock size={24} /></div>
          <h3 className="rp-card-label">Bình thường</h3>
          <span className="rp-card-range">100 - 199 pts</span>
          <p className="rp-card-desc">Điểm khởi đầu mặc định, cần tích cực hơn để nâng hạng</p>
          {score >= 100 && score < 200 && <div className="rp-current-marker">— Bạn đang ở đây</div>}
        </div>

        <div className={`rp-level-card ${score >= 200 && score < 400 ? 'active' : ''}`}>
          <div className="rp-card-icon level-trusted"><ShieldCheck size={24} /></div>
          <h3 className="rp-card-label">Tin cậy</h3>
          <span className="rp-card-range">200 - 399 pts</span>
          <p className="rp-card-desc">Đã chứng minh độ tin cậy qua các hoạt động tích cực</p>
          {score >= 200 && score < 400 && <div className="rp-current-marker">— Bạn đang ở đây</div>}
        </div>

        <div className={`rp-level-card ${score >= 400 ? 'active' : ''}`}>
          <div className="rp-card-icon level-excellent"><Star size={24} /></div>
          <h3 className="rp-card-label">Xuất sắc</h3>
          <span className="rp-card-range">400 - 500 pts</span>
          <p className="rp-card-desc">Thành viên nổi bật, được ưu tiên ghép đôi và hiển thị</p>
          {score >= 400 && <div className="rp-current-marker">— Bạn đang ở đây</div>}
        </div>
      </div>

      {/* Info Box */}
      <div className="rp-info-box">
        <div className="rp-info-icon"><Info size={24} /></div>
        <div className="rp-info-content">
          <h4 className="rp-info-title">Cách tăng điểm uy tín nhanh</h4>
          <p className="rp-info-p">
            Tổ chức hoặc tham gia hoạt động nhóm <strong>(+20–50 pts)</strong>, 
            nhận đánh giá tốt từ thành viên <strong>(+20 pts)</strong>, 
            duy trì nhóm đều đặn <strong>(+50 pts)</strong>. 
            Tránh bị báo cáo — mỗi báo cáo nhẹ trừ 5 điểm, nghiêm trọng trừ 15 điểm.
          </p>
        </div>
      </div>

      {/* Deduction Rules Card */}
      <div className="rp-rules-card">
        <div className="rp-rules-header">
          <h3 className="rp-rules-title">Quy tắc trừ điểm</h3>
          <span className="rp-rules-subtitle">theo quy định chung</span>
        </div>
        
        <div className="rp-rules-list">
          <div className="rp-rule-item">
            <div className="rp-rule-info">
              <span className="rp-rule-name warning">Báo cáo nhẹ</span>
              <span className="rp-rule-desc">Ngôn từ, spam nhẹ, tag sai</span>
            </div>
            <div className="rp-rule-value warning">-5</div>
          </div>

          <div className="rp-rule-item">
            <div className="rp-rule-info">
              <span className="rp-rule-name danger">Báo cáo nghiêm trọng</span>
              <span className="rp-rule-desc">Quấy rối, lừa đảo, kích động</span>
            </div>
            <div className="rp-rule-value danger">-15</div>
          </div>

          <div className="rp-rule-item">
            <div className="rp-rule-info">
              <span className="rp-rule-name purple">Vi phạm cực kỳ nghiêm trọng</span>
              <span className="rp-rule-desc">Bạo lực, phân biệt, nội dung độc hại</span>
            </div>
            <div className="rp-rule-value purple">-30</div>
          </div>

          <div className="rp-rule-item highlight-red">
            <div className="rp-rule-info">
              <span className="rp-rule-name dark-red">Ngưỡng khoá tài khoản</span>
              <span className="rp-rule-desc">Bạn có thể bị khoá các tính năng quan trọng khi điểm thấp</span>
            </div>
            <div className="rp-rule-value dark-red">≤ 50</div>
          </div>
        </div>
      </div>

      {/* History Table Card */}
      <div className="rp-history-card">
        <div className="rp-history-header">
          <div className="rp-history-title-area">
            <h3 className="rp-history-title">Lịch sử điểm uy tín</h3>
            <span className="rp-history-subtitle">
              {loading ? "Đang tải..." : `Có ${logs.length} bản ghi`}
            </span>
          </div>
          <div className="rp-history-filters">
            <select 
              className="rp-filter-select" 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
            >
              <option>Tất cả</option>
              <option value="activity">Hoạt động</option>
              <option value="report">Báo cáo</option>
              <option value="system">Hệ thống</option>
              <option value="match">Ghép đôi</option>
            </select>
          </div>
        </div>

        <div className="rp-table-wrapper">
          <table className="rp-table">
            <thead>
              <tr>
                <th>HÀNH ĐỘNG</th>
                <th>LOẠI</th>
                <th>NGÀY</th>
                <th>ĐIỂM</th>
              </tr>
            </thead>
            <tbody>
              {logs.length > 0 ? (
                logs.map(log => (
                  <tr key={log.log_id}>
                    <td>{log.reason}</td>
                    <td>
                      <span className={`rp-type-tag ${log.ref_type}`}>
                        {formatType(log.ref_type)}
                      </span>
                    </td>
                    <td>{new Date(log.created_at).toLocaleDateString('vi-VN')}</td>
                    <td className={`rp-points ${log.delta >= 0 ? 'positive' : 'negative'}`}>
                      {log.delta >= 0 ? `+${log.delta}` : log.delta}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center", padding: "2rem" }}>
                    {loading ? "Đang tải dữ liệu..." : "Chưa có lịch sử điểm uy tín."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}