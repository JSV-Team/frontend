import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';
import { X, Search, MapPin } from 'lucide-react';
import './LocationPicker.css';

// Fix leaflet icon issue in react
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Component to handle map center updates
const MapUpdater = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
};

const LocationPicker = ({ onClose, onConfirm, initialLocation }) => {
  // Default to Hanoi center
  const [position, setPosition] = useState([21.028511, 105.804817]);
  const [address, setAddress] = useState(initialLocation || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  
  // Custom marker icon
  const customIcon = new L.Icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  // Reverse geocoding (Coord to Address)
  const getAddressFromCoords = async (lat, lng) => {
    setIsLoadingAddress(true);
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
      );
      if (response.data && response.data.display_name) {
        // Lấy tên địa chỉ chi tiết nhưng bỏ đi mã bưu điện hoặc đoạn đuôi dài dòng nếu cần
        const parts = response.data.display_name.split(',');
        const shortAddress = parts.slice(0, 4).join(',').trim();
        setAddress(shortAddress);
      } else {
        setAddress(`${lat.toFixed(5)}, ${lng.toFixed(5)}`);
      }
    } catch (error) {
      console.error("Error reverse geocoding:", error);
      setAddress(`${lat.toFixed(5)}, ${lng.toFixed(5)}`);
    } finally {
      setIsLoadingAddress(false);
    }
  };

  // Forward geocoding (Text to Coord)
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`
      );
      
      if (response.data && response.data.length > 0) {
        const topResult = response.data[0];
        const newLat = parseFloat(topResult.lat);
        const newLon = parseFloat(topResult.lon);
        setPosition([newLat, newLon]);
        
        // Cập nhật tên theo kết quả search
        const parts = topResult.display_name.split(',');
        const shortAddress = parts.slice(0, 4).join(',').trim();
        setAddress(shortAddress);
      } else {
        alert('Không tìm thấy địa điểm này!');
      }
    } catch (error) {
      console.error("Search error:", error);
      alert('Lỗi tìm kiếm, vui lòng thử lại sau.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  // Component to handle click on map
  const MapEvents = () => {
    useMapEvents({
      click(e) {
        setPosition([e.latlng.lat, e.latlng.lng]);
        getAddressFromCoords(e.latlng.lat, e.latlng.lng);
      },
    });
    return null;
  };

  // Draggable marker event handler
  const eventHandlers = {
    dragend(e) {
      const marker = e.target;
      const pos = marker.getLatLng();
      setPosition([pos.lat, pos.lng]);
      getAddressFromCoords(pos.lat, pos.lng);
    },
  };

  const handleConfirm = () => {
    onConfirm(address || `${position[0]}, ${position[1]}`);
    onClose();
  };

  return (
    <div className="location-picker-overlay">
      <div className="location-picker-modal" onClick={(e) => e.stopPropagation()}>
        <div className="location-picker-header">
          <h3>Chọn địa điểm</h3>
          <button className="close-btn" onClick={onClose} title="Đóng">
            <X size={20} />
          </button>
        </div>

        <div className="location-picker-search">
          <div className="search-input-wrapper">
            <Search size={18} color="#94a3b8" />
            <input 
              type="text" 
              placeholder="Tìm kiếm địa điểm (VD: Hồ Gươm)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button 
              className="search-btn" 
              onClick={handleSearch}
              disabled={isSearching || !searchQuery.trim()}
            >
              {isSearching ? 'Đang tìm...' : 'Tìm kiếm'}
            </button>
          </div>
        </div>

        <div className="location-picker-map-container">
          <MapContainer 
            center={position} 
            zoom={14} 
            scrollWheelZoom={true}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapUpdater center={position} />
            <MapEvents />
            <Marker 
              position={position} 
              draggable={true}
              eventHandlers={eventHandlers}
              icon={customIcon}
            />
          </MapContainer>
        </div>

        <div className="location-picker-footer">
          <div className="selected-address-info">
            <MapPin size={24} className="icon" />
            <div className="address-details">
              <p>Địa điểm đang chọn:</p>
              <h4>{isLoadingAddress ? 'Đang tải địa chỉ...' : (address || 'Chưa có địa chỉ cụ thể')}</h4>
            </div>
          </div>
          <div className="location-picker-actions">
            <button className="btn-cancel" onClick={onClose}>Hủy</button>
            <button 
              className="btn-confirm" 
              onClick={handleConfirm}
              disabled={isLoadingAddress}
            >
              Xác nhận vị trí
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationPicker;
