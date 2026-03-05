import "./InteractModal.css";

export default function InteractModal({ open, title, items, onClose }) {
  if (!open) return null;

  return (
    <div className="im-backdrop" onClick={onClose}>
      <div className="im-modal" onClick={(e) => e.stopPropagation()}>
        <div className="im-header">
          <div className="im-title">{title}</div>
          <button className="im-close" onClick={onClose}>✕</button>
        </div>

        <div className="im-body">
          {items?.length ? (
            items.map((u) => (
              <div key={u.key} className="im-row">
                <img className="im-avatar" src={u.avatar} alt="avatar" />
                <div className="im-info">
                  <div className="im-name">{u.name}</div>
                  <div className="im-sub">{u.sub}</div>
                </div>
              </div>
            ))
          ) : (
            <div className="im-empty">Chưa có ai tương tác</div>
          )}
        </div>
      </div>
    </div>
  );
}

