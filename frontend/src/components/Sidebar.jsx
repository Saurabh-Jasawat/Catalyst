import React from 'react';
import { Home, BookOpen, Target, BarChart2, Calendar, FileText, Trophy, Users, Settings } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import Logo from './Logo';

// ... (navItems, bottomItems, etc. unchanged)
const navItems = [
  { icon: Home, label: 'Dashboard', path: '/' },
  { icon: BookOpen, label: 'Syllabus', path: '/syllabus' },
  { icon: Target, label: 'Revision', path: '/revision' },
  { icon: BarChart2, label: 'Mock Analytics', path: '/analytics' },
  { icon: Calendar, label: 'Daily Planner', path: '/planner' },
  { icon: FileText, label: 'Previous Year Questions', path: '/notes' },
];

const bottomItems = [
  { icon: Trophy, label: 'Insights', path: '/achievements' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

const Sidebar = () => {
  const location = useLocation();
  const { selectedExam, profileName, profileAvatarType, profileEmoji, profilePicture } = useAppContext();

  const NavLink = ({ item }) => {
    const isActive = location.pathname === item.path;
    return (
      <Link
        to={item.path}
        className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
          isActive
            ? 'bg-white/15 text-white shadow-sm'
            : 'text-white/50 hover:text-white/80 hover:bg-white/8'
        }`}
      >
        <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} />
        {item.label}
      </Link>
    );
  };

  return (
    <aside
      className="w-60 flex flex-col h-full shrink-0"
      style={{ background: '#16162a' }}
    >
      {/* Logo */}
      <div className="px-5 pt-7 pb-8">
        <div className="flex items-center gap-2">
          <Logo size={32} className="animate-pulse shrink-0" />
          <div className="flex items-center gap-2">
            <span className="text-white font-black text-xl tracking-tight">Catalyst</span>
            <div className="h-6 w-px bg-white/15" />
            <div className="flex flex-col text-[7px] font-extrabold text-white/40 tracking-wider uppercase leading-none gap-0.5 select-none">
              <span>Plan</span>
              <span>Track</span>
              <span>Conquer</span>
            </div>
          </div>
        </div>
        <p className="text-white/35 text-[9px] font-bold mt-2 tracking-wider uppercase leading-snug whitespace-nowrap">
          Track every step towards success
        </p>
      </div>

      {/* Main Nav */}
      <nav className="flex-1 px-3 space-y-0.5">
        <p className="px-4 text-white/25 text-[10px] font-bold uppercase tracking-widest mb-2">Navigation</p>
        {navItems.map(item => <NavLink key={item.path} item={item} />)}
      </nav>

      {/* Bottom Nav */}
      <div className="px-3 pb-4 space-y-0.5 border-t border-white/8 pt-4">
        {bottomItems.map(item => <NavLink key={item.path} item={item} />)}
      </div>

      {/* User Card */}
      <div className="px-4 pb-6">
        <div className="bg-white/8 rounded-xl p-3.5 flex items-center">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center text-white font-black text-sm shrink-0 overflow-hidden">
              {profileAvatarType === 'picture' && profilePicture ? (
                <img src={profilePicture} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-base select-none">{profileEmoji || '👨‍🎓'}</span>
              )}
            </div>
            <div className="min-w-0">
              <p className="text-white font-bold text-sm truncate">{profileName || 'Student'}</p>
              <p className="text-white/40 text-[10px] font-bold uppercase tracking-wider truncate">{selectedExam || 'No Exam Active'}</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
