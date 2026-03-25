import { useState, useRef, useEffect } from "react";
import { Heart, Plus, X, Search } from "lucide-react";
import { profileService } from "../../services/profileService";
import "./interestChips.css";

export default function InterestChips({ value = [], onChange, onSave }) {
  const [input, setInput] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [allInterests, setAllInterests] = useState([]);
  const containerRef = useRef(null);

  // Lấy tất cả sở thích từ database khi mount
  useEffect(() => {
    const fetchAllInterests = async () => {
      try {
        const data = await profileService.getAllAvailableInterests();
        // data có thể là array of objects { interest_id, name } hoặc array strings
        const names = data.map(item => typeof item === 'string' ? item : item.name);
        setAllInterests(names);
      } catch (error) {
        console.error("Lỗi khi fetch all interests:", error);
      }
    };
    fetchAllInterests();
  }, []);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Lọc danh sách gợi ý dựa trên input và những cái chưa chọn
  // Nếu input rỗng nhưng đang focus, hiện một số cái phổ biến nhất
  const suggestions = allInterests.filter(item => 
    (input ? item.toLowerCase().includes(input.toLowerCase()) : true) && 
    !value.some(v => v.toLowerCase() === item.toLowerCase())
  ).slice(0, input ? 20 : 15); // Giới hạn số lượng hiển thị cho gọn

  const toggleInterest = async (interest) => {
    let newInterests;
    if (value.some(v => v.toLowerCase() === interest.toLowerCase())) {
      newInterests = value.filter(v => v.toLowerCase() !== interest.toLowerCase());
    } else {
      newInterests = [...value, interest];
    }

    onChange(newInterests);
    if (onSave) {
      try {
        await onSave(newInterests);
      } catch (error) {
        console.error('Failed to save interests:', error);
      }
    }
  };

  const removeInterest = async (idx) => {
    const newInterests = value.filter((_, i) => i !== idx);
    onChange(newInterests);
    if (onSave) {
      try {
        await onSave(newInterests);
      } catch (error) {
        console.error('Failed to save interests:', error);
      }
    }
  };

  const handleSearchCommit = () => {
    if (suggestions.length > 0) {
      toggleInterest(suggestions[0]);
      setInput("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearchCommit();
    }
  };

  return (
    <div className="interest-chips-container" ref={containerRef}>
      <div className="interest-chips-header">
        <div className="interest-chips-title">
          <Heart size={20} className="interest-icon" />
          <span>Sở thích của bạn</span>
        </div>
        <div className="interest-count">
          {value.length} {value.length === 1 ? 'sở thích' : 'sở thích'}
        </div>
      </div>

      <div className="chips-container">
        {value.length === 0 ? (
          <div className="chips-empty-state">
            <Heart size={32} className="empty-icon" />
            <p className="empty-text">Chưa có sở thích nào</p>
            <p className="empty-subtext">Nhấn vào ô dưới để chọn những gì bạn thích!</p>
          </div>
        ) : (
          <div className="chips-list">
            {value.map((item, idx) => (
              <span key={idx} className="chip-item">
                <span className="chip-text">{item}</span>
                <button
                  type="button"
                  className="chip-remove"
                  onClick={() => removeInterest(idx)}
                  aria-label="Xóa sở thích"
                >
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>
        )}

        <div className="chip-input-container">
          <div className="chip-search-wrapper">
            <button 
              type="button"
              className="search-icon-inside"
              onClick={() => setIsFocused(!isFocused)}
              title="Hiện danh sách sở thích"
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <Search size={18} />
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onFocus={() => setIsFocused(true)}
              placeholder="Tìm kiếm sở thích có sẵn..."
              className="chip-search-input"
            />
          </div>

          {(isFocused || input) && suggestions.length > 0 && (
            <div className="suggestions-panel">
              <div className="suggestions-label">
                {input ? `Tìm thấy ${suggestions.length} sở thích:` : 'Chọn từ danh sách:'}
              </div>
              <div className="suggestions-list">
                {suggestions.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="suggestion-item"
                    onClick={() => {
                      toggleInterest(item);
                      setInput("");
                    }}
                  >
                    <Plus size={14} />
                    <span>{item}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {(isFocused || input) && suggestions.length === 0 && input && (
            <div className="suggestions-panel">
              <div className="suggestions-label" style={{ color: '#ef4444' }}>
                Không tìm thấy "{input}" trong danh sách sở thích
              </div>
              <p style={{ fontSize: '0.875rem', color: '#64748b', padding: '8px 12px', margin: 0 }}>
                Vui lòng chọn từ danh sách có sẵn hoặc liên hệ admin để thêm sở thích mới.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

