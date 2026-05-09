import { useState, useEffect } from 'react';
import axios from 'axios';
import { AlertTriangle, Info, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/alerts')
      .then(res => setAlerts(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-purple-100 overflow-hidden">
        <div className="p-8 border-b border-purple-100 bg-white/50 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black text-slate-800 flex items-center tracking-tight">
              <ShieldAlert className="mr-3 text-purple-600" size={28} />
              System Alerts
            </h2>
            <p className="text-sm font-medium text-slate-500 mt-2">AI-detected anomalies and flagged projects requiring immediate review.</p>
          </div>
          <div className="bg-rose-100 text-rose-800 px-4 py-2 rounded-xl text-sm font-black uppercase tracking-widest shadow-sm ring-1 ring-rose-200">
            {alerts.filter(a => a.severity === 'High').length} Critical
          </div>
        </div>

        <div className="divide-y divide-purple-50">
          {alerts.length === 0 ? (
            <div className="p-12 text-center text-slate-500 flex flex-col items-center">
              <div className="bg-emerald-50 p-4 rounded-full mb-4">
                <Info size={32} className="text-emerald-500" />
              </div>
              <p className="font-bold text-lg text-slate-700">No active alerts.</p>
              <p className="text-sm">All projects are proceeding nominally.</p>
            </div>
          ) : (
            alerts.map(alert => (
              <div key={alert.id} className="p-8 flex items-start space-x-6 hover:bg-purple-50/30 transition-all duration-300">
                <div className={`mt-1 flex-shrink-0 p-3 rounded-xl shadow-sm ${alert.severity === 'High' ? 'bg-rose-100 text-rose-600 ring-1 ring-rose-200' : 'bg-orange-100 text-orange-600 ring-1 ring-orange-200'}`}>
                  <AlertTriangle size={24} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-slate-800">Project: PRJ-{alert.project_id.toString().padStart(4, '0')}</h3>
                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{new Date(alert.date).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm font-medium text-slate-600 mb-4 leading-relaxed">{alert.message}</p>
                  <Link 
                    to={`/analysis/${alert.project_id}`}
                    className="inline-flex items-center space-x-2 text-xs font-black uppercase tracking-widest text-purple-600 hover:text-white hover:bg-purple-600 px-4 py-2 rounded-lg transition-all duration-300 ring-1 ring-purple-200 hover:ring-transparent"
                  >
                    <span>Review Analysis</span>
                    <span>&rarr;</span>
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
