import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Bell, Search, Flame, Award, Calendar, Menu } from 'lucide-react';
import ExamSwitcher from './ExamSwitcher';
import { useAppContext } from '../context/AppContext';

const Header = () => {
  const { streak, points, dDay, dDayPhases, todos, selectedExam, syllabusData, allExamData, isSidebarOpen, setIsSidebarOpen } = useAppContext();
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getClosestPhaseInfo = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const phasesList = dDayPhases && dDayPhases.length > 0
      ? dDayPhases
      : dDay ? [{ id: 'default', name: 'Exam', date: dDay }] : [];

    if (phasesList.length === 0) return null;

    const upcoming = phasesList.filter(p => new Date(p.date).setHours(0, 0, 0, 0) >= today);
    let targetPhase = null;

    if (upcoming.length > 0) {
      targetPhase = upcoming.sort((a, b) => new Date(a.date) - new Date(b.date))[0];
    } else {
      targetPhase = phasesList.sort((a, b) => new Date(a.date) - new Date(b.date))[phasesList.length - 1];
    }

    const diff = new Date(targetPhase.date).setHours(0, 0, 0, 0) - today;
    const days = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
    
    return { name: targetPhase.name, days };
  };

  const phaseInfo = getClosestPhaseInfo();

  // Dynamically calculate failures, overdue items, or syllabus speed warnings across all configured exams
  const globalNotifications = useMemo(() => {
    const list = [];
    const todayStr = new Date().toLocaleDateString('en-CA');
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (allExamData && Array.isArray(allExamData)) {
      allExamData.forEach(data => {
        const examName = data.examName;
        if (!examName) return;
        
        const examTodos = examName === selectedExam ? todos : (data.todos || []);
        const examDDay = examName === selectedExam ? dDay : (data.dDay || '');
        const examPhases = examName === selectedExam ? dDayPhases : (data.dDayPhases || []);
        const examSyllabus = examName === selectedExam ? syllabusData : (data.syllabusData || []);

        // 1. Overdue tasks
        const overdue = examTodos.filter(t => t.date < todayStr && t.status === 'pending');
        overdue.forEach(t => {
          list.push({
            id: `overdue_${examName}_${t.id}`,
            exam: examName,
            type: 'overdue',
            message: `Task "${t.text}" is overdue since ${t.date}`,
            severity: 'critical'
          });
        });

        // 2. Target deadlines approaching
        const phases = examPhases && examPhases.length > 0
          ? examPhases
          : examDDay ? [{ name: 'Exam', date: examDDay }] : [];

        phases.forEach(phase => {
          if (!phase.date) return;
          const pDate = new Date(phase.date);
          pDate.setHours(0, 0, 0, 0);
          const diff = pDate - today;
          const daysLeft = Math.ceil(diff / (1000 * 60 * 60 * 24));
          
          if (daysLeft >= 0 && daysLeft <= 7) {
            list.push({
              id: `deadline_${examName}_${phase.name}`,
              exam: examName,
              type: 'deadline',
              message: `Phase "${phase.name}" is in ${daysLeft} days!`,
              severity: daysLeft <= 3 ? 'critical' : 'warning'
            });
          }
        });

        // 3. Syllabus completion speed warning
        const totalTopics = examSyllabus.flatMap(s => s.topics || []).length;
        const completedTopics = examSyllabus.flatMap(s => s.topics || []).filter(t => t.stage === 'Completed').length;
        const uncompletedTopics = totalTopics - completedTopics;

        const upcoming = phases.filter(p => new Date(p.date).setHours(0,0,0,0) >= today);
        let closestPhase = null;
        if (upcoming.length > 0) {
          closestPhase = upcoming.sort((a,b) => new Date(a.date) - new Date(b.date))[0];
        } else if (phases.length > 0) {
          closestPhase = phases[phases.length - 1];
        }

        if (closestPhase && uncompletedTopics > 0) {
          const diff = new Date(closestPhase.date).setHours(0, 0, 0, 0) - today;
          const days = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
          if (days > 0) {
            const baseHoursNeeded = uncompletedTopics * 5;
            const neededDailyHours = baseHoursNeeded / days;
            if (neededDailyHours > 6) {
              list.push({
                id: `pace_${examName}`,
                exam: examName,
                type: 'pace',
                message: `Need to study ${neededDailyHours.toFixed(1)}h/day to finish ${uncompletedTopics} topics before ${closestPhase.name}`,
                severity: neededDailyHours > 10 ? 'critical' : 'warning'
              });
            }
          }
        }
      });
    }

    // Add smart system notifications / guidance tips to keep notifications board fully active and helpful
    const totalTopics = syllabusData.flatMap(s => s.topics || []).length;
    const completedTopics = syllabusData.flatMap(s => s.topics || []).filter(t => t.stage === 'Completed').length;
    const overallPct = totalTopics === 0 ? 0 : Math.round((completedTopics / totalTopics) * 100);

    if (overallPct === 0 && list.length === 0) {
      list.push({
        id: 'welcome_notification',
        exam: selectedExam || 'Catalyst',
        type: 'welcome',
        message: '🚀 Welcome to your study workspace! Go to the "Syllabus" tab to mark your first topic, or set your target date in the "Daily Planner" to begin.',
        severity: 'info'
      });
    } else {
      list.push({
        id: 'tip_revision',
        exam: 'Catalyst',
        type: 'tip',
        message: '💡 Spaced repetition alert: Review notes for previously completed topics under the "Revision" tab to maximize retention.',
        severity: 'info'
      });

      list.push({
        id: 'tip_syllabus',
        exam: 'Catalyst',
        type: 'guidance',
        message: '🎯 Focus Area: Break down larger topics into small, bite-sized tasks under the Daily Planner to avoid burnout.',
        severity: 'info'
      });

      list.push({
        id: 'tip_points',
        exam: 'System',
        type: 'streak info',
        message: '🔥 Keep the streak alive! Log in consecutive days to earn +15 XP bonus multiplier.',
        severity: 'info'
      });
    }

    return list;
  }, [selectedExam, todos, dDay, dDayPhases, syllabusData, allExamData]);

  return (
    <header className="relative z-30 h-16 px-4 sm:px-6 flex items-center justify-between border-b border-catalyst-border bg-white/60 backdrop-blur-md shrink-0">
      <div className="flex items-center gap-2 sm:gap-4 min-w-0">
        {/* Hamburger Menu Toggle Button */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 -ml-2 rounded-xl text-catalyst-muted hover:text-catalyst-text hover:bg-catalyst-bg lg:hidden transition-colors shrink-0"
          title="Toggle Navigation Menu"
        >
          <Menu size={20} />
        </button>

        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-catalyst-muted" size={15} />
          <input
            type="text"
            placeholder="Search topics, mocks, notes..."
            title="Search active exam topics, tasks, or study materials"
            className="bg-catalyst-bg border border-catalyst-border rounded-xl py-2 pl-9 pr-4 text-sm text-catalyst-text placeholder:text-catalyst-muted focus:outline-none focus:ring-2 focus:ring-catalyst-accent/20 focus:border-catalyst-accent transition-all w-72 font-medium"
          />
        </div>
        <ExamSwitcher />
      </div>

      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        {/* Points Display */}
        <div 
          className="flex items-center gap-1.5 sm:gap-2 bg-indigo-50 border border-indigo-200 text-indigo-700 px-2.5 sm:px-3 py-1.5 rounded-full select-none"
          title="Earned experience points (XP) based on study tasks completed"
        >
          <Award size={14} className="text-indigo-600 animate-pulse" />
          <span className="text-[10px] sm:text-xs font-bold">{points} XP</span>
        </div>

        {/* Date Display (Hidden on Mobile) */}
        <div 
          className="hidden sm:flex items-center gap-2 bg-slate-50 border border-slate-200 text-slate-700 px-3.5 py-1.5 rounded-full select-none"
          title="Current date"
        >
          <Calendar size={14} className="text-slate-500" />
          <span className="text-xs font-bold">{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
        </div>

        {/* Streak (Conditional) */}
        {streak > 0 && (
          <div 
            className="flex items-center gap-1.5 sm:gap-2 bg-amber-50 border border-amber-200 text-amber-700 px-2.5 sm:px-3 py-1.5 rounded-full select-none"
            title="Consecutive daily study streak"
          >
            <Flame size={14} className="text-orange-500 animate-bounce" style={{ animationDuration: '2s' }} />
            <span className="text-[10px] sm:text-xs font-bold">{streak} Day</span>
          </div>
        )}

        {/* D-Day Display Pill (Hidden on Mobile & Tablets) */}
        <div 
          className="hidden md:flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-700 px-3 py-1.5 rounded-full select-none"
          title="Active exam target D-Day date"
        >
          <Calendar size={14} className="text-rose-500" />
          <span className="text-xs font-bold">
            {dDay ? `D-Day: ${new Date(dDay).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}` : 'D-Day: Not Set'}
          </span>
        </div>

        {/* Bell Button and Dropdown Container */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className={`relative w-9 h-9 rounded-xl border flex items-center justify-center transition-all ${
              showNotifications
                ? 'bg-catalyst-primary text-white border-catalyst-primary'
                : 'border-catalyst-border bg-white text-catalyst-muted hover:text-catalyst-text hover:border-catalyst-accent/40'
            }`}
            title="View notifications and alerts board"
          >
            <Bell size={16} />
            {globalNotifications.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-red-500 text-white text-[8px] font-black rounded-full flex items-center justify-center animate-pulse border border-white">
                {globalNotifications.length}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-11 mt-2 w-96 bg-white border border-catalyst-border shadow-2xl rounded-2xl z-50 p-4 max-h-[450px] overflow-y-auto space-y-3">
              <div className="flex items-center justify-between border-b border-catalyst-border pb-2.5">
                <h3 className="text-xs font-black text-catalyst-dark flex items-center gap-1.5">
                  <Bell size={14} className="text-catalyst-accent" /> Notification Alert Board
                </h3>
                <span className="badge-red text-[9px] font-bold">
                  {globalNotifications.length} Alerts & Tips
                </span>
              </div>

              <div className="space-y-2">
                {globalNotifications.length === 0 ? (
                  <div className="py-6 text-center">
                    <p className="text-xs font-semibold text-emerald-600">⚡ Everything is perfectly on track!</p>
                    <p className="text-[10px] text-catalyst-muted mt-1 font-medium">No overdue tasks or lagging syllabus phases across your goals.</p>
                  </div>
                ) : (
                  globalNotifications.map(notif => (
                    <div 
                      key={notif.id} 
                      className={`p-2.5 rounded-xl border flex items-start gap-2.5 transition-all text-left ${
                        notif.severity === 'critical' 
                          ? 'bg-red-50/50 border-red-100 hover:bg-red-50' 
                          : notif.severity === 'info'
                            ? 'bg-indigo-50/50 border-indigo-100 hover:bg-indigo-50'
                            : 'bg-amber-50/50 border-amber-100 hover:bg-amber-50'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                        notif.severity === 'critical' 
                          ? 'bg-red-500 animate-ping' 
                          : notif.severity === 'info'
                            ? 'bg-indigo-500 animate-pulse'
                            : 'bg-amber-500'
                      }`}></span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${
                            notif.severity === 'critical' 
                              ? 'bg-red-100 text-red-700' 
                              : notif.severity === 'info'
                                ? 'bg-indigo-100 text-indigo-700'
                                : 'bg-amber-100 text-amber-700'
                          }`}>
                            {notif.exam}
                          </span>
                          <span className="text-[9px] font-bold text-catalyst-muted capitalize">
                            {notif.type}
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-catalyst-dark mt-1 leading-relaxed">
                          {notif.message}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
