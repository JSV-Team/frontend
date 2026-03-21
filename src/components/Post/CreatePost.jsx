import { useState, useRef } from 'react';
import { MapPin, Image as ImageIcon, X } from 'lucide-react';
import useCreatePost from '../../hooks/useCreatePost';
import uploadService from '../../services/uploadService';
import LocationPicker from '../common/LocationPicker';
import './Post.css';

function CreatePost({ onPostCreated }) {
  const userString = localStorage.getItem('user');
  const currentUser = userString ? JSON.parse(userString) : null;
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [location, setLocation] = useState('');
  const [maxParticipants, setMaxParticipants] = useState('');
  const [duration, setDuration] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState(''); // Preview local blob URL
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const fileInputRef = useRef(null);

  // Lấy thông tin user hiện tại từ localStorage
  const storedUser = localStorage.getItem('user');
  // const currentUser = storedUser ? JSON.parse(storedUser) : null;
  const avatarUrl = currentUser?.avatar_url || 'https://i.pravatar.cc/150?img=1';
  const fullName = currentUser?.full_name || currentUser?.username || 'Người dùng';

  const { createPost, loading, error } = useCreatePost(() => {
    setTitle('');
    setContent('');
    setLocation('');
    setMaxParticipants('');
    setDuration('');
    setImageUrl('');
    setImagePreview('');
    onPostCreated();
  });

  // Gọi khi người dùng chọn file từ máy
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Hiện preview ngay lập tức từ file local
    const localPreview = URL.createObjectURL(file);
    setImagePreview(localPreview);
    setUploadError('');
    setImageUrl(''); // Reset URL cũ trong lúc đang upload

    // Upload lên server
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const res = await fetch('http://localhost:3001/api/upload/image', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Upload thất bại');

      // Lưu URL server trả về (path tương đối)
      setImageUrl(data.imageUrl);
    } catch (err) {
      setUploadError('Lỗi upload: ' + err.message);
      setImagePreview('');
    } finally {
      setUploading(false);
      // Reset file input để có thể chọn lại cùng file
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = () => {
    setImageUrl('');
    setImagePreview('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      alert('Vui lòng nhập tiêu đề hoạt động');
      return;
    }
    if (uploading) {
      alert('Ảnh đang được tải lên, vui lòng chờ...');
      return;
    }

    const postData = {
      userId: currentUser?.user_id,
      title: title.trim(),
      description: content.trim(),
      location,
      max_participants: parseInt(maxParticipants) || 0,
      duration_minutes: parseInt(duration) || 0,
      media: imageUrl ? [{ url: imageUrl }] : []
    };
    createPost(postData);
  };

  return (
    <div className="create-activity">
      <div className="create-activity-header">
        <div className="user-avatar">
          <img
            src={currentUser?.avatar_url
              ? (currentUser.avatar_url.startsWith('http') ? currentUser.avatar_url : currentUser.avatar_url)
              : (currentUser ? `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.full_name || currentUser.username || 'User')}&background=random` : "https://i.pravatar.cc/150?img=11")}
            alt={currentUser?.full_name || currentUser?.username || 'User'}
            referrerPolicy="no-referrer"
          />
        </div>
        <h3 className="create-activity-title">Tạo hoạt động mới</h3>
      </div>

      <div className="create-activity-form">
        <div className="form-row">
          <div className="form-group">
            <label>Tiêu đề *</label>
            <input
              type="text"
              placeholder="Nhập tiêu đề hoạt động"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-input"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Mô tả chi tiết</label>
            <textarea
              placeholder="Mô tả chi tiết về hoạt động của bạn..."
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="form-textarea"
            />
          </div>
        </div>

        <div className="form-row-3">
          <div className="form-group full-width">
            <label>Địa điểm</label>
            <div 
              className="input-with-icon" 
              onClick={() => setShowLocationPicker(true)}
              style={{ cursor: 'pointer' }}
            >
              <MapPin size={16} className="input-icon" />
              <input
                type="text"
                placeholder="Chọn địa điểm trên bản đồ"
                value={location}
                readOnly
                className="form-input"
                style={{ cursor: 'pointer', backgroundColor: 'transparent' }}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Số người tối đa</label>
            <input
              type="number"
              placeholder="VD: 10"
              value={maxParticipants}
              onChange={(e) => setMaxParticipants(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Thời lượng (phút)</label>
            <input
              type="number"
              placeholder="VD: 120"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="form-input"
            />
          </div>
        </div>

        {/* Preview ảnh đã chọn */}
        {imagePreview && (
          <div className="image-preview-container">
            <img src={imagePreview} alt="Preview" className="image-preview" />
            <button
              className="remove-image-btn"
              onClick={handleRemoveImage}
              title="Xóa ảnh"
            >
              <X size={16} />
            </button>
            {uploading && (
              <div className="image-upload-overlay">
                <span>Đang tải lên...</span>
              </div>
            )}
          </div>
        )}

        {uploadError && <p className="error-message">{uploadError}</p>}
      </div>

      {/* Input file ẩn - được trigger bởi btn-add-image */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleImageChange}
      />

      <div className="create-activity-footer">
        <button
          className={`btn-add-image ${imagePreview ? 'has-image' : ''}`}
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          <ImageIcon size={18} />
          <span>{uploading ? 'Đang tải...' : imagePreview ? 'Đổi ảnh' : 'Ảnh hoạt động'}</span>
        </button>
        <button
          className="btn-submit"
          onClick={handleSubmit}
          disabled={loading || uploading || !title}
        >
          {loading ? 'Đang đăng...' : 'Đăng hoạt động'}
        </button>
      </div>

      {uploadError && <p className="error-message">{uploadError}</p>}
      {error && <p className="error-message">{error}</p>}

      {showLocationPicker && (
        <LocationPicker 
          initialLocation={location}
          onClose={() => setShowLocationPicker(false)}
          onConfirm={(addr) => {
            setLocation(addr);
            setShowLocationPicker(false);
          }}
        />
      )}
    </div>
  );
}

export default CreatePost;
