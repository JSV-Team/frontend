import { useState } from "react";
import "./interestChips.css";

export default function InterestChips({ value = [], onChange }) {
  const [input, setInput] = useState("");

  const addInterest = () => {
    const v = input.trim();
    if (!v) return;
    if (value.some((x) => x.toLowerCase() === v.toLowerCase())) {
      setInput("");
      return;
    }
    onChange([...value, v]);
    setInput("");
  };

  const removeInterest = (idx) => {
    onChange(value.filter((_, i) => i !== idx));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addInterest();
    }
  };

  return (
    <div className="interest-chips pe-form-row">
      <label className="pe-label-h" style={{ alignSelf: 'flex-start', marginTop: '10px' }}>Sở thích</label>
      <div className="pe-input-field">
        <div className="chips-list">
          {value.map((item, idx) => (
            <span key={idx} className="chip-item">
              {item}
              <button
                type="button"
                className="chip-remove"
                onClick={() => removeInterest(idx)}
              >
                ×
              </button>
            </span>
          ))}
        </div>

        <div className="chip-input-wrap">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Nhập sở thích mới..."
            className="form-control chip-input"
          />
          <button
            type="button"
            onClick={addInterest}
            className="chip-add-btn"
          >
            + Thêm
          </button>
        </div>
      </div>
    </div>
  );
}

