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
  const menuRef = useRef(null);

  useEffect(() => {
    if (post.image) console.log(`PostCard [${post.id}] image:`, post.image);
  }, [post.id, post.image]);

  // đóng menu khi click ra ngoài
  useEffect(() => {
    const onDocClick = (e) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target)) {
        setOpenMenu(false);
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

      {(post.location || post.duration || post.maxParticipants) && (
        <div className="pc-activity-info">
          {post.location && <span className="pc-info-item"><span className="pc-icon pin">📍</span> {post.location}</span>}
          {post.duration && <span className="pc-info-item"><span className="pc-icon time">⏱️</span> {post.duration} phút</span>}
          {post.maxParticipants && <span className="pc-info-item"><span className="pc-icon group">👥</span> Tối đa {post.maxParticipants} người</span>}
        </div>
      )}

      {(post.image_url || post.image || (post.images && post.images[0])) && (
        <div className="pc-images">
          <img className="pc-img" src={post.image_url || post.image || post.images[0]} alt="post" />
          {post.images && post.images.length > 1 && (
            <div className="pc-additional-images">
              {post.images.slice(1, 4).map((img, idx) => (
                <img key={idx} className="pc-img-small" src={img} alt={`post ${idx + 2}`} />
              ))}
              {post.images.length > 4 && (
                <div className="pc-more-images">+{post.images.length - 4}</div>
              )}
            </div>
          )}
        </div>
      )}

      {post.tags?.length ? (
        <div className="pc-tags">
          {post.tags.map((t) => (
            <span key={t} className="pc-tag">
              #{t}
            </span>
          ))}
        </div>
      ) : null}




    </div>
  );
}

