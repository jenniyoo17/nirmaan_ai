import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, Activity, Bell, Microscope } from 'lucide-react';

export default function Layout() {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Register Project', path: '/register', icon: PlusCircle },
    { name: 'Model Testing', path: '/testing', icon: Microscope },
    { name: 'Alerts', path: '/alerts', icon: Bell },
  ];

  return (
    <div className="min-h-screen flex bg-[#FDFBFF]">
      {/* Sidebar - Sleek White & Purple */}
      <aside className="w-64 bg-white border-r border-purple-100 flex flex-col shadow-[4px_0_24px_rgba(147,51,234,0.05)]">
        <div className="p-6 border-b border-purple-50">
          <h1 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-fuchsia-500">NIRMAAN AI</h1>
          <p className="text-purple-400/80 text-xs font-semibold uppercase tracking-wider mt-1">Monitoring Platform</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  isActive 
                    ? 'bg-purple-50 text-purple-700 font-bold shadow-sm ring-1 ring-purple-100' 
                    : 'text-slate-500 hover:bg-purple-50/50 hover:text-purple-600 font-medium'
                }`}
              >
                <Icon size={20} className={isActive ? 'text-purple-600' : 'text-slate-400'} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-purple-50 bg-white">
          <div className="flex items-center space-x-3 bg-purple-50 p-3 rounded-xl">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-fuchsia-500 flex items-center justify-center text-white shadow-md">
              <span className="text-xs font-bold">GOV</span>
            </div>
            <div className="text-sm">
              <p className="font-bold text-purple-900">Authorized Official</p>
              <p className="text-purple-500 text-xs font-semibold">ID: GOV-8492</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="bg-white/80 backdrop-blur-md border-b border-purple-100 px-8 py-4 flex justify-between items-center z-10">
          <h2 className="text-xl font-bold text-slate-800">
            {navItems.find(i => location.pathname.startsWith(i.path))?.name || 'Monitoring Panel'}
          </h2>
          <div className="flex items-center space-x-4 bg-purple-50 px-4 py-1.5 rounded-full ring-1 ring-purple-100">
            <span className="flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-2.5 w-2.5 rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-purple-600"></span>
            </span>
            <span className="text-xs text-purple-700 font-bold uppercase tracking-wider">System Online</span>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-8 relative z-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-fuchsia-200/20 rounded-full blur-3xl -z-10 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-300/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
