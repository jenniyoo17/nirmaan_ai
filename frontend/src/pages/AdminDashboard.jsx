import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const COLORS = ['#9333EA', '#F3E8FF']; // Neon Purple for completed, Very light purple for remaining

export default function AdminDashboard() {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch projects
    axios.get('http://localhost:8000/projects')
      .then(res => setProjects(res.data))
      .catch(err => console.error(err));
  }, []);

  const selectedProject = selectedProjectId 
    ? projects.find(p => p.id === selectedProjectId)
    : null;

  // Calculate progress data for pie chart
  let progressValue = 0;
  if (selectedProject) {
    const latestProgress = selectedProject.progress.length > 0 
      ? selectedProject.progress[selectedProject.progress.length - 1].progress_percentage 
      : 0;
    progressValue = latestProgress;
  } else if (projects.length > 0) {
    let total = 0;
    projects.forEach(p => {
      const latest = p.progress.length > 0 ? p.progress[p.progress.length - 1].progress_percentage : 0;
      total += latest;
    });
    progressValue = total / projects.length;
  }

  const pieData = [
    { name: 'Completed Work', value: progressValue },
    { name: 'Remaining Work', value: 100 - progressValue }
  ];

  return (
    <div className="flex flex-col md:flex-row gap-8 h-full">
      {/* Left Side: Project List */}
      <div className="w-full md:w-1/2 bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-purple-100 overflow-hidden flex flex-col">
        <div className="p-5 border-b border-purple-100 bg-white/50 flex justify-between items-center">
          <h3 className="font-bold text-slate-800 text-lg">Monitored Projects</h3>
          <button 
            onClick={() => setSelectedProjectId(null)}
            className="text-xs text-purple-600 hover:text-purple-800 font-bold uppercase tracking-wider"
          >
            Clear Selection
          </button>
        </div>
        <div className="overflow-y-auto flex-1 p-3">
          {projects.map(project => (
            <div 
              key={project.id}
              onClick={() => setSelectedProjectId(project.id)}
              className={`p-5 mb-3 rounded-xl cursor-pointer border transition-all duration-300 shadow-sm hover:shadow-md ${
                selectedProjectId === project.id 
                  ? 'border-purple-400 bg-purple-50 ring-2 ring-purple-100' 
                  : 'border-transparent bg-white hover:border-purple-100'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-black text-purple-400 mb-1 tracking-widest uppercase">PRJ-{project.id.toString().padStart(4, '0')}</p>
                  <h4 className="font-bold text-slate-800 text-lg">{project.name}</h4>
                  <p className="text-sm text-slate-500 font-medium">{project.amenity_type} • Monitored every {project.monitoring_frequency} days</p>
                </div>
                <span className={`px-3 py-1 text-xs font-black uppercase tracking-wider rounded-lg ${
                  project.status === 'Active' ? 'bg-purple-100 text-purple-800' :
                  project.status === 'Flagged' ? 'bg-rose-100 text-rose-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {project.status}
                </span>
              </div>
              <div className="mt-5 flex justify-between items-end">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/analysis/${project.id}`);
                  }}
                  className="text-sm font-bold bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-purple-600 hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300"
                >
                  View AI Analysis
                </button>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sanctioned Budget</p>
                  <p className="text-base font-black text-slate-800">₹{(project.budget/100000).toFixed(2)} Lakhs</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Side: Pie Chart */}
      <div className="w-full md:w-1/2 bg-transparent p-6 flex flex-col items-center justify-center">
        <h3 className="font-black text-slate-800 text-2xl mb-2 self-start">
          {selectedProject ? `Progress: ${selectedProject.name}` : 'Overall Portfolio Progress'}
        </h3>
        <p className="text-sm font-medium text-slate-500 mb-8 self-start">
          {selectedProject 
            ? 'Based on the latest AI satellite analysis.'
            : 'Average completion across all registered projects.'}
        </p>

        <div className="w-full h-96 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={100}
                outerRadius={140}
                paddingAngle={8}
                dataKey="value"
                stroke="none"
                cornerRadius={10}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value.toFixed(1)}%`} cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-6xl font-black text-slate-800 bg-clip-text text-transparent bg-gradient-to-br from-purple-700 to-slate-800">{progressValue.toFixed(0)}%</span>
            <span className="text-xs font-bold text-purple-500 uppercase tracking-widest mt-1">Complete</span>
          </div>
        </div>
      </div>
    </div>
  );
}
