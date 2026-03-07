import { useState, useRef } from 'react';
import { MapPin, Image as ImageIcon } from 'lucide-react';
import useCreatePost from '../../hooks/useCreatePost';
import uploadService from '../../services/uploadService';
import './Post.css';

function CreatePost({ onPostCreated }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [location, setLocation] = useState('');
  const [maxParticipants, setMaxParticipants] = useState('');
  const [duration, setDuration] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);
  
  const { createPost, loading, error } = useCreatePost(() => {
    setTitle('');
    setContent('');
    setLocation('');
    setMaxParticipants('');
    setDuration('');
    setImageUrl('');
    setUploadError('');
    onPostCreated();
  });

  const handleImageSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError('');

    try {
      const response = await uploadService.uploadImage(file);
      setImageUrl(response.imageUrl);
      console.log('Image uploaded:', response.imageUrl);
    } catch (err) {
      setUploadError(err.message || 'Upload ảnh thất bại');
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      alert('Vui lòng nhập tiêu đề hoạt động');
      return;
    }
    
    const postData = {
      title: title.trim(),
      content: content.trim(),
      location,
      maxParticipants: parseInt(maxParticipants) || 0,
      duration: parseInt(duration) || 0,
      imageUrl
    };
    createPost(postData);
  };

  return (
    <div className="create-activity">
      <div className="create-activity-header">
        <div className="user-avatar">
          <img 
            src="https://i.pravatar.cc/150?img=2" 
            alt="Nguyễn Minh Khoa" 
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
            <div className="input-with-icon">
              <MapPin size={16} className="input-icon" />
              <input 
                type="text" 
                placeholder="Nhập địa điểm" 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="form-input"
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

        {imageUrl && (
          <div className="form-row">
            <div className="form-group full-width">
              <label>Ảnh đã chọn</label>
              <img 
                src={`http://localhost:3001${imageUrl}`} 
                alt="Preview" 
                style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '8px' }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="create-activity-footer">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          onChange={handleImageSelect}
          style={{ display: 'none' }}
        />
        <button 
          className="btn-add-image" 
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          <ImageIcon size={18} />
          <span>{uploading ? 'Đang upload...' : 'Ảnh hoạt động'}</span>
        </button>
        <button 
          className="btn-submit" 
          onClick={handleSubmit}
          disabled={loading || !title}
        >
          {loading ? 'Đang đăng...' : 'Đăng hoạt động'}
        </button>
      </div>

      {uploadError && <p className="error-message">{uploadError}</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default CreatePost;
