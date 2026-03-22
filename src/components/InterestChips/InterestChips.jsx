import { useState } from "react";
import { Heart, Plus, X } from "lucide-react";
import "./interestChips.css";

export default function InterestChips({ value = [], onChange, onSave }) {
  const [input, setInput] = useState("");

  const addInterest = async () => {
    const v = input.trim();
    if (!v) return;
    if (value.some((x) => x.toLowerCase() === v.toLowerCase())) {
      setInput("");
      return;
    }
    const newInterests = [...value, v];
    onChange(newInterests);
    setInput("");
    
    // Auto-save if onSave callback is provided
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
    
    // Auto-save if onSave callback is provided
    if (onSave) {
      try {
        await onSave(newInterests);
      } catch (error) {
        console.error('Failed to save interests:', error);
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addInterest();
    }
  };

  return (
    <div className="interest-chips-container">
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
            <p className="empty-subtext">Hãy thêm những điều bạn yêu thích!</p>
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
          <div className="chip-input-wrapper">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Nhập sở thích mới (VD: Chơi game, Nấu ăn, Piano...)"
              className="chip-input"
              maxLength={30}
            />
            <button
              type="button"
              onClick={addInterest}
              className="chip-add-btn"
              disabled={!input.trim()}
            >
              <Plus size={18} />
              <span>Thêm</span>
            </button>
          </div>
          {input.length > 0 && (
            <div className="chip-input-hint">
              {input.length}/30 ký tự
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

