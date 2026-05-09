import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Calendar, AlertTriangle, CheckCircle, Clock, Activity } from 'lucide-react';

export default function AIAnalysis() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  useEffect(() => {
    axios.get(`http://localhost:8000/projects/${id}`)
      .then(res => {
        setProject(res.data);
        if (res.data.progress.length > 0) {
          setSelectedDayIndex(res.data.progress.length - 1);
        }
      })
      .catch(err => console.error(err));
  }, [id]);

  if (!project) return <div className="p-8 text-center font-bold text-purple-500 animate-pulse">Initializing Neural Link...</div>;

  const currentProgress = project.progress[selectedDayIndex];
  
  let recommendation = "Monitoring";
  let recColor = "text-purple-600 bg-purple-50 border-purple-200 ring-purple-100";
  if (project.status === "Flagged") {
    recommendation = "Investigate Flag";
    recColor = "text-rose-600 bg-rose-50 border-rose-200 ring-rose-100";
  } else if (currentProgress && currentProgress.progress_percentage > 80) {
    recommendation = "Approve Release";
    recColor = "text-emerald-600 bg-emerald-50 border-emerald-200 ring-emerald-100";
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header Info */}
      <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-sm border border-purple-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <span className="px-3 py-1 bg-purple-100 text-purple-700 text-[10px] font-black uppercase tracking-widest rounded-lg">PRJ-{project.id.toString().padStart(4, '0')}</span>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{project.amenity_type}</span>
          </div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">{project.name}</h2>
        </div>
        <div className={`px-6 py-4 rounded-xl border ring-4 ${recColor} min-w-[200px]`}>
          <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">AI Recommendation</p>
          <p className="text-xl font-black flex items-center space-x-2">
            {recommendation === "Investigate Flag" && <AlertTriangle size={24} />}
            {recommendation === "Approve Release" && <CheckCircle size={24} />}
            {recommendation === "Monitoring" && <Activity size={24} />}
            <span>{recommendation}</span>
          </p>
        </div>
      </div>

      {/* Timeline Controls */}
      <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-sm border border-purple-100">
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6 flex items-center">
          <Calendar className="mr-2 text-purple-500" size={18} />
          Satellite Data Points
        </h3>
        {project.progress.length === 0 ? (
          <div className="p-8 border-2 border-dashed border-purple-100 rounded-xl text-center">
            <p className="text-slate-500 font-medium">Awaiting next satellite pass.</p>
          </div>
        ) : (
          <div className="flex space-x-4 overflow-x-auto pb-4 custom-scrollbar">
            {project.progress.map((prog, idx) => (
              <button
                key={prog.id}
                onClick={() => setSelectedDayIndex(idx)}
                className={`flex-shrink-0 w-48 p-5 rounded-xl border text-left transition-all duration-300 ${
                  selectedDayIndex === idx 
                    ? 'border-purple-400 bg-purple-600 text-white shadow-lg shadow-purple-500/30 translate-y-[-4px]' 
                    : 'border-purple-100 bg-white hover:border-purple-300 hover:bg-purple-50'
                }`}
              >
                <div className="flex justify-between items-center mb-3">
                  <p className={`text-xs font-black uppercase tracking-wider ${selectedDayIndex === idx ? 'text-purple-200' : 'text-purple-500'}`}>T+{idx * project.monitoring_frequency} Days</p>
                </div>
                <p className={`text-[10px] font-bold mb-4 ${selectedDayIndex === idx ? 'text-purple-100' : 'text-slate-400'}`}>{new Date(prog.date).toLocaleDateString()}</p>
                <p className="text-3xl font-black">{prog.progress_percentage.toFixed(0)}<span className="text-lg opacity-70">%</span></p>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Image Display */}
      {currentProgress && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-purple-100 overflow-hidden flex flex-col">
             <div className="p-5 border-b border-purple-100 bg-white/50">
               <h3 className="font-bold text-slate-800">Raw Sentinel-2 Feed</h3>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Lat: {project.latitude.toFixed(4)}, Lng: {project.longitude.toFixed(4)}</p>
             </div>
             <div className="relative flex-1 bg-slate-900 flex items-center justify-center p-4">
                <img 
                  src={`http://localhost:8000${currentProgress.image_path}`} 
                  alt="Satellite View" 
                  className="max-w-full max-h-[500px] object-contain rounded border border-slate-700 shadow-2xl"
                />
             </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-purple-100 overflow-hidden flex flex-col">
             <div className="p-5 border-b border-purple-100 bg-white/50">
               <h3 className="font-bold text-slate-800">Automated Insights</h3>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Computer Vision Engine</p>
             </div>
             <div className="p-8 flex-1 flex flex-col">
                <div className="mb-10">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Calculated Structural Change</p>
                  <p className="text-6xl font-black text-slate-800 mt-2 bg-clip-text text-transparent bg-gradient-to-br from-purple-700 to-slate-800">
                    {currentProgress.progress_percentage.toFixed(1)}%
                  </p>
                  <div className="w-full bg-purple-100 rounded-full h-3 mt-6 overflow-hidden">
                    <div className="bg-gradient-to-r from-purple-500 to-fuchsia-500 h-3 rounded-full transition-all duration-1000" style={{ width: `${currentProgress.progress_percentage}%` }}></div>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Vision Model Log</p>
                  <div className="p-5 bg-slate-50 rounded-xl border border-slate-200">
                    <p className="text-sm font-medium text-slate-700 font-mono">{currentProgress.notes || 'No automated notes generated.'}</p>
                  </div>
                </div>
                
                {project.alerts && project.alerts.length > 0 && (
                  <div className="mt-auto pt-8">
                    <div className="p-5 bg-rose-50 rounded-xl border border-rose-200 shadow-inner">
                      <p className="text-xs font-black uppercase tracking-widest text-rose-800 flex items-center mb-2">
                        <AlertTriangle size={16} className="mr-2" />
                        System Flag
                      </p>
                      <p className="text-sm font-bold text-rose-700">{project.alerts[project.alerts.length - 1].message}</p>
                    </div>
                  </div>
                )}
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
