import { useState, useRef } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { postService } from "../../services/postService";
import { Image as ImageIcon, X } from 'lucide-react';
import "./createPostPage.css";

export default function CreatePostPage() {
  const navigate = useNavigate();
  const { USER_ID } = useOutletContext();

  const [desc, setDesc] = useState("");
  const [files, setFiles] = useState([]); // File[]
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFiles([file]);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setFiles([]);
    setImagePreview("");
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const onSubmit = async () => {
    if (!desc.trim() && files.length === 0) {
      alert("Vui lòng nhập nội dung hoặc chọn ảnh.");
      return;
    }
    setLoading(true);

    try {
      let mediaUrls = [];
      if (files.length > 0) {
        mediaUrls = await postService.uploadPostMedia(files);
      }

      // Chuẩn bị payload cho backend gọi bảng daily_status
      const postData = {
        description: desc.trim(),
        media: mediaUrls.map(url => ({ url }))
      };

      await postService.createStatus(USER_ID, postData);

      // Sau khi lưu thành công vào DB, chuyển hướng về trang danh sách
      navigate(`/profile/${USER_ID}/posts`);
    } catch (error) {
      console.error("Lỗi khi đăng bài:", error);
      alert(`Đăng bài thất bại: ${error.error || error.message || "Lỗi server"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cp-wrap">
      <div className="cp-card">
        <div className="cp-title">Cập nhật Trạng thái (Story 24h)</div>

        <textarea
          className="cp-textarea"
          placeholder="Bạn đang nghĩ gì?"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          rows={6}
          style={{ width: '100%', padding: '16px', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '16px', fontSize: '15px' }}
        />

        {imagePreview && (
          <div style={{ position: 'relative', marginBottom: '16px', display: 'inline-block' }}>
            <img src={imagePreview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '8px' }} />
            <button
              onClick={handleRemoveImage}
              style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', borderRadius: '50%', padding: '4px', cursor: 'pointer' }}
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Input file ẩn */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleImageChange}
        />

        <div className="cp-actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={() => fileInputRef.current?.click()}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', border: '1px solid #4a90e2', color: '#4a90e2', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold' }}
            disabled={loading}
          >
            <ImageIcon size={18} />
            <span>{imagePreview ? 'Đổi ảnh' : 'Thêm ảnh'}</span>
          </button>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              className="cp-cancel" 
              onClick={() => navigate(-1)} 
              disabled={loading}
              style={{ padding: '8px 24px', borderRadius: '20px', border: 'none', background: '#f1f1f1', color: '#333', cursor: 'pointer', fontWeight: 'bold' }}
            >
              Hủy
            </button>
            <button 
              className="cp-post" 
              onClick={onSubmit} 
              disabled={loading || (!desc.trim() && files.length === 0)}
              style={{ padding: '8px 24px', borderRadius: '20px', border: 'none', background: '#4a90e2', color: 'white', cursor: 'pointer', fontWeight: 'bold', opacity: (loading || (!desc.trim() && files.length === 0)) ? 0.5 : 1 }}
            >
              {loading ? "Đang đăng..." : "Đăng trạng thái"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}