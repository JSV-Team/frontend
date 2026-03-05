import { useEffect, useRef, useState } from "react";
import "./PostCard.css";

export default function PostCard({
  post,
  onEdit,
  onDelete,
  onReact,
  onComment,
  onShare,
  onOpenReactors,
  onOpenCommenters,
  onOpenSharers,
}) {
  const [openMenu, setOpenMenu] = useState(false);
  const [openReacts, setOpenReacts] = useState(false);
  const menuRef = useRef(null);

  // Tính tổng reactions
  const totalReacts =
    (post.reactions?.like || 0) +
    (post.reactions?.love || 0) +
    (post.reactions?.haha || 0) +
    (post.reactions?.sad || 0) +
    (post.reactions?.angry || 0);

  // đóng menu khi click ra ngoài
  useEffect(() => {
    const onDocClick = (e) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target)) {
        setOpenMenu(false);
        setOpenReacts(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  return (
    <div className="pc-card">
      <div className="pc-topRow">
        <div>
          <div className="pc-title">{post.title}</div>
          <div className="pc-meta">
            Người dùng • {post.time}
            {post.updatedAt ? ` • (đã sửa ${post.updatedAt})` : ""}
          </div>
        </div>

        {/* Menu 3 gạch */}
        <div className="pc-menuWrap" ref={menuRef}>
          <button className="pc-menuBtn" onClick={() => setOpenMenu((v) => !v)}>
            ⋮
          </button>

          {openMenu && (
            <div className="pc-menu">
              <button
                className="pc-menuItem"
                onClick={() => {
                  setOpenMenu(false);
                  onEdit(post.id);
                }}
              >
                Chỉnh sửa
              </button>
              <button
                className="pc-menuItem danger"
                onClick={() => {
                  setOpenMenu(false);
                  onDelete(post.id);
                }}
              >
                Xóa
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="pc-desc">{post.desc}</div>

      {post.image && <img className="pc-img" src={post.image} alt="post" />}

      {post.tags?.length ? (
        <div className="pc-tags">
          {post.tags.map((t) => (
            <span key={t} className="pc-tag">
              #{t}
            </span>
          ))}
        </div>
      ) : null}

      {/* Hàng emoji / bình luận / share */}
      <div className="pc-actions">
        <div className="pc-reactWrap" ref={menuRef}>
          <button className="pc-action" onClick={() => setOpenReacts((v) => !v)}>
            👍 <span className="pc-count">{totalReacts}</span>
          </button>

          {openReacts && (
            <div className="pc-reactBox">
              <button className="pc-react" onClick={() => { onReact(post.id, "like"); setOpenReacts(false); }}>👍</button>
              <button className="pc-react" onClick={() => { onReact(post.id, "love"); setOpenReacts(false); }}>❤️</button>
              <button className="pc-react" onClick={() => { onReact(post.id, "haha"); setOpenReacts(false); }}>😆</button>
              <button className="pc-react" onClick={() => { onReact(post.id, "sad"); setOpenReacts(false); }}>😢</button>
              <button className="pc-react" onClick={() => { onReact(post.id, "angry"); setOpenReacts(false); }}>😡</button>
            </div>
          )}
        </div>

        <button className="pc-action" onClick={() => onComment(post.id)}>
          💬 <span className="pc-count">{post.comments?.length || 0}</span>
        </button>

        <button className="pc-action" onClick={() => onShare(post.id)}>
          🔁 <span className="pc-count">{post.shares || 0}</span>
        </button>
      </div>


      {/* Comments list */}
      {post.comments?.length ? (
        <div className="pc-comments">
          {post.comments.map((c) => (
            <div key={c.id} className="pc-commentItem">
              <img className="pc-cmtAvatar" src={c.avatar} alt="avatar" />
              <div className="pc-cmtBody">
                <div className="pc-cmtNameRow">
                  <div className="pc-cmtName">{c.name}</div>
                  <div className="pc-cmtTime">{c.time}</div>
                </div>
                <div className="pc-cmtText">{c.text}</div>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

