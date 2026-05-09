import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function LocationMarker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });
  return position === null ? null : <Marker position={position}></Marker>;
}

export default function RegisterProject() {
  const navigate = useNavigate();
  const [position, setPosition] = useState({ lat: 12.9716, lng: 77.5946 }); 
  const [formData, setFormData] = useState({
    name: '',
    amenity_type: 'Road',
    budget: '',
    deadline: '',
    monitoring_frequency: 7
  });

  const [previewImages, setPreviewImages] = useState([]);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);

  const handlePreview = async () => {
    setIsPreviewLoading(true);
    try {
      const res = await axios.get(`http://localhost:8000/preview-satellite?lat=${position.lat}&lng=${position.lng}`);
      setPreviewImages(res.data.images);
    } catch (error) {
      console.error(error);
      alert('Failed to fetch satellite preview');
    } finally {
      setIsPreviewLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/projects', {
        ...formData,
        budget: parseFloat(formData.budget),
        monitoring_frequency: parseInt(formData.monitoring_frequency),
        latitude: position.lat,
        longitude: position.lng,
        deadline: new Date(formData.deadline).toISOString()
      });
      navigate('/admin');
    } catch (error) {
      console.error(error);
      alert('Failed to register project');
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-md rounded-2xl shadow-lg shadow-purple-500/5 border border-purple-100 overflow-hidden">
      <div className="p-8 border-b border-purple-100 bg-white/50">
        <h2 className="text-2xl font-black text-slate-800">Register New Amenity</h2>
        <p className="text-sm font-medium text-purple-600 mt-1">Configure target for AI satellite tracking.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="p-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* ... existing fields ... */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Project Name</label>
            <input 
              required
              type="text" 
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all font-medium text-slate-800"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Amenity Type</label>
            <select 
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all font-medium text-slate-800"
              value={formData.amenity_type}
              onChange={e => setFormData({...formData, amenity_type: e.target.value})}
            >
              <option>Road</option>
              <option>Park</option>
              <option>Hospital</option>
              <option>Building</option>
              <option>Water Tank</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Sanctioned Budget (₹)</label>
            <input 
              required
              type="number" 
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all font-medium text-slate-800"
              value={formData.budget}
              onChange={e => setFormData({...formData, budget: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Completion Deadline</label>
            <input 
              required
              type="date" 
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all font-medium text-slate-800"
              value={formData.deadline}
              onChange={e => setFormData({...formData, deadline: e.target.value})}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Monitoring Frequency (Days)</label>
            <p className="text-xs text-slate-400 mb-3">How often should the satellite pull an image to run AI checks?</p>
            <input 
              required
              type="number" 
              min="1"
              max="365"
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all font-medium text-slate-800"
              value={formData.monitoring_frequency}
              onChange={e => setFormData({...formData, monitoring_frequency: e.target.value})}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Target Coordinates</label>
          <p className="text-xs text-slate-400 mb-3">Click on the satellite map to lock the target location for orbital imaging.</p>
          <div className="border-2 border-purple-100 rounded-xl overflow-hidden shadow-inner mb-4">
            <MapContainer center={[12.9716, 77.5946]} zoom={12} scrollWheelZoom={false} style={{ height: '300px' }}>
              <TileLayer
                attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              />
              <LocationMarker position={position} setPosition={setPosition} />
            </MapContainer>
          </div>
          
          <button 
            type="button"
            onClick={handlePreview}
            disabled={isPreviewLoading}
            className="w-full py-4 border-2 border-dashed border-purple-200 rounded-xl text-purple-600 font-bold hover:bg-purple-50 hover:border-purple-400 transition-all flex items-center justify-center gap-3 mb-6"
          >
            {isPreviewLoading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                Connecting to Satellite...
              </span>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"/><path d="M12 6a6 6 0 1 0 6 6 6 6 0 0 0-6-6z"/><path d="M12 10a2 2 0 1 0 2 2 2 2 0 0 0-2-2z"/></svg>
                Lock Target & Preview Satellite Shots
              </>
            )}
          </button>

          {previewImages.length > 0 && (
            <div className="grid grid-cols-2 gap-4 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {previewImages.map((img, idx) => (
                <div key={idx} className="relative group overflow-hidden rounded-xl border-2 border-purple-200">
                  <img src={`http://localhost:8000${img}`} alt={`Satellite Shot ${idx+1}`} className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-2 left-2 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-black uppercase px-2 py-1 rounded">
                    Shot {idx + 1} ({idx === 0 ? 'Overview' : 'Detail'})
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-lg uppercase">Lat: {position?.lat.toFixed(6)}</span>
            <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-lg uppercase">Lng: {position?.lng.toFixed(6)}</span>
          </div>
        </div>

        <div className="flex justify-end pt-6 border-t border-purple-50">
          <button 
            type="submit" 
            disabled={previewImages.length === 0}
            className={`px-8 py-3 rounded-xl font-bold uppercase tracking-wider transition-all duration-300 ${
              previewImages.length === 0 
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                : 'bg-purple-600 text-white hover:bg-purple-700 hover:shadow-lg hover:shadow-purple-500/30'
            }`}
          >
            Finalize & Register
          </button>
        </div>
      </form>
    </div>
  );
}
