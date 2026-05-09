import { useState } from 'react';
import axios from 'axios';
import { Microscope, Upload, Cpu, ArrowRight } from 'lucide-react';

export default function ModelTesting() {
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file1 || !file2) return;
    
    setLoading(true);
    const formData = new FormData();
    formData.append('file1', file1);
    formData.append('file2', file2);

    try {
      const res = await axios.post('http://localhost:8000/analyze-custom', formData);
      setResult(res.data);
    } catch (err) {
      console.error(err);
      alert('Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="bg-gradient-to-r from-purple-900 to-fuchsia-900 rounded-2xl p-8 text-white shadow-xl shadow-purple-500/20">
        <h2 className="text-3xl font-black flex items-center tracking-tight mb-2">
          <Microscope className="mr-3" size={32} />
          Model Testing Sandbox
        </h2>
        <p className="text-purple-200 font-medium max-w-2xl">
          Upload two satellite images below to run a live demonstration of the change detection algorithm. The neural engine will calculate structural changes and identify anomalies like demolition vs. construction.
        </p>
      </div>

      <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-purple-100 overflow-hidden p-8">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* File 1 Input */}
            <div className="border-2 border-dashed border-purple-200 rounded-xl p-8 text-center hover:bg-purple-50 transition-colors">
              <Upload className="mx-auto text-purple-400 mb-4" size={32} />
              <label className="block text-sm font-bold text-slate-700 mb-2 cursor-pointer">
                Select Base Image (T=0)
                <input 
                  type="file" 
                  accept="image/*"
                  className="hidden" 
                  onChange={e => setFile1(e.target.files[0])}
                />
              </label>
              <p className="text-xs font-medium text-slate-400 truncate">
                {file1 ? file1.name : 'No file chosen'}
              </p>
            </div>

            {/* File 2 Input */}
            <div className="border-2 border-dashed border-purple-200 rounded-xl p-8 text-center hover:bg-purple-50 transition-colors">
              <Upload className="mx-auto text-purple-400 mb-4" size={32} />
              <label className="block text-sm font-bold text-slate-700 mb-2 cursor-pointer">
                Select Current Image (T+N)
                <input 
                  type="file" 
                  accept="image/*"
                  className="hidden" 
                  onChange={e => setFile2(e.target.files[0])}
                />
              </label>
              <p className="text-xs font-medium text-slate-400 truncate">
                {file2 ? file2.name : 'No file chosen'}
              </p>
            </div>
          </div>

          <div className="flex justify-center">
            <button 
              type="submit" 
              disabled={loading || !file1 || !file2}
              className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <span className="animate-pulse">Processing...</span>
              ) : (
                <>
                  <Cpu size={20} />
                  <span>Execute Analysis</span>
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {result && (
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-purple-100 overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
           <div className="p-6 border-b border-purple-100 bg-purple-50/50 flex justify-between items-center">
             <h3 className="font-bold text-slate-800">Live Analysis Results</h3>
             {result.anomaly && (
               <span className="bg-rose-100 text-rose-700 px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest">Anomaly Detected</span>
             )}
           </div>
           <div className="p-8 flex flex-col md:flex-row gap-8 items-center">
              <div className="text-center md:text-left flex-1">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Calculated Structural Change</p>
                <p className={`text-7xl font-black mt-2 ${result.anomaly ? 'text-rose-600' : 'bg-clip-text text-transparent bg-gradient-to-br from-purple-700 to-slate-800'}`}>
                  {result.progress_percentage.toFixed(1)}%
                </p>
              </div>
              <div className="flex-1 w-full">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Model Inference Log</p>
                <div className={`p-5 rounded-xl border font-mono text-sm ${result.anomaly ? 'bg-rose-50 border-rose-200 text-rose-800' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
                  {result.notes}
                </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
