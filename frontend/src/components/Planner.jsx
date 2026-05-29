import React, { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { Calendar, CheckCircle2, Circle, ArrowRight, Plus, Trash2, Zap, BrainCircuit, AlertCircle, Sparkles, ChevronLeft, ChevronRight, Settings, Clock, X } from 'lucide-react';

const Planner = () => {
  const { todos, addTodo, toggleTodo, shiftTodo, deleteTodo, syllabusData, dDay, setDDay, dDayPhases, setDDayPhases, targetScore, setTargetScore } = useAppContext();
  
  const [newTaskText, setNewTaskText] = useState('');
  const [showPhaseManager, setShowPhaseManager] = useState(false);
  
  // Today's Date String YYYY-MM-DD
  const todayStr = useMemo(() => {
    return new Date().toLocaleDateString('en-CA');
  }, []);

  // Active Selected Date (defaults to today)
  const [selectedDate, setSelectedDate] = useState(todayStr);

  // Generate 7-day row surrounding the selected date
  const dateRow = useMemo(() => {
    const dates = [];
    const base = new Date(selectedDate);
    // 3 days before, today, 3 days after
    for (let i = -3; i <= 3; i++) {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      const iso = d.toLocaleDateString('en-CA');
      const label = d.toLocaleDateString('en-US', { weekday: 'short' });
      const dayNum = d.getDate();
      dates.push({ iso, label, dayNum });
    }
    return dates;
  }, [selectedDate]);

  // Tasks for the selected date
  const selectedTodos = useMemo(() => {
    return todos.filter(t => t.date === selectedDate);
  }, [todos, selectedDate]);

  // Selected date statistics
  const totalCount = selectedTodos.length;
  const doneCount = selectedTodos.filter(t => t.status === 'done').length;
  const datePct = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

  // Spaced repetition/syllabus metrics
  const totalTopics = syllabusData.flatMap(s => s.topics || []).length;
  const completedTopics = syllabusData.flatMap(s => s.topics || []).filter(t => t.stage === 'Completed').length;
  const uncompletedTopics = totalTopics - completedTopics;

  // Calculate countdown days left based on closest upcoming phase
  const getClosestPhaseInfo = useMemo(() => {
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
  }, [dDay, dDayPhases]);

  const daysLeft = getClosestPhaseInfo ? getClosestPhaseInfo.days : null;

  // Calculate consistency over last 7 days (yesterday and 6 days prior)
  const consistencyStats = useMemo(() => {
    let planned = 0;
    let completed = 0;
    
    // Look at previous 7 days (excluding selectedDate)
    for (let i = 1; i <= 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const iso = d.toLocaleDateString('en-CA');
      
      const dayTasks = todos.filter(t => t.date === iso);
      planned += dayTasks.length;
      completed += dayTasks.filter(t => t.status === 'done').length;
    }
    
    const rate = planned > 0 ? Math.round((completed / planned) * 100) : 100;
    return { rate, planned, completed };
  }, [todos]);

  // Work acceleration alert
  const accelerationInfo = useMemo(() => {
    if (!daysLeft || daysLeft === 0 || uncompletedTopics <= 0) return null;
    
    // Assume 5 hours required per topic (Foundation + Practice + Revision)
    const baseHoursNeeded = uncompletedTopics * 5;
    const neededDailyHours = (baseHoursNeeded / daysLeft).toFixed(1);
    
    // If consistency is low, suggest speed adjustment
    const baselineDailyHours = 4.0;
    const currentRateFactor = consistencyStats.rate / 100;
    const effectiveHoursDaily = baselineDailyHours * (currentRateFactor || 0.5);
    const deficitPct = Math.max(0, Math.round(((neededDailyHours - effectiveHoursDaily) / effectiveHoursDaily) * 100));

    return {
      neededDailyHours,
      deficitPct,
      uncompletedTopics
    };
  }, [daysLeft, uncompletedTopics, consistencyStats.rate]);

  const handleAddTodo = (e) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    addTodo(newTaskText.trim(), selectedDate);
    setNewTaskText('');
  };

  const handleShiftTomorrow = (todoId) => {
    const current = new Date(selectedDate);
    current.setDate(current.getDate() + 1);
    const tomorrowStr = current.toLocaleDateString('en-CA');
    shiftTodo(todoId, tomorrowStr);
  };

  const handleShiftPrevDay = (todoId) => {
    const current = new Date(selectedDate);
    current.setDate(current.getDate() - 1);
    const prevStr = current.toLocaleDateString('en-CA');
    shiftTodo(todoId, prevStr);
  };

  const formatHeaderDate = (isoString) => {
    return new Date(isoString).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="max-w-7xl mx-auto pb-10 space-y-6">
      
      {/* Title & D-Day Settings */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-catalyst-dark flex items-center gap-2">
            <Calendar size={28} className="text-catalyst-primary" />
            Calendar & Progress Planner
          </h2>
          <p className="text-catalyst-muted text-sm font-medium mt-0.5">
            Plan your daily studies, track completion rates, and verify your D-Day countdown status.
          </p>
        </div>
        
        {/* D-Day Set Panel (Multi-Phase) */}
        <div className="card p-4 bg-white shadow-sm border border-catalyst-border w-full md:max-w-md relative">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-catalyst-primary/10 flex items-center justify-center text-catalyst-primary shrink-0">
                <Clock size={18} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-catalyst-muted uppercase tracking-wider">Closest Phase</p>
                <h4 className="text-sm font-black text-catalyst-dark">
                  {getClosestPhaseInfo ? getClosestPhaseInfo.name : 'No Target Set'}
                </h4>
              </div>
            </div>
            <div className="w-px h-8 bg-catalyst-border"></div>
            <div className="flex-1 min-w-[70px]">
              <p className="text-[10px] font-bold text-catalyst-muted uppercase">Countdown</p>
              <p className="text-md font-black text-catalyst-accent">
                {daysLeft !== null ? `${daysLeft} Days` : '--'}
              </p>
            </div>
            <button
              onClick={() => setShowPhaseManager(!showPhaseManager)}
              className={`p-1.5 rounded-lg border transition-all ${
                showPhaseManager 
                  ? 'bg-catalyst-primary text-white border-catalyst-primary' 
                  : 'border-catalyst-border hover:bg-catalyst-bg hover:text-catalyst-primary text-catalyst-muted'
              }`}
              title="Manage Exam Rounds & Phases"
            >
              <Settings size={16} />
            </button>
          </div>

          {/* Expandable Phase Manager Panel */}
          {showPhaseManager && (
            <div className="mt-4 pt-3 border-t border-catalyst-border space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-catalyst-dark flex items-center gap-1">
                  <Settings size={12} className="text-catalyst-primary" /> Configure Exam Phases / Rounds
                </p>
                <button 
                  onClick={() => setShowPhaseManager(false)}
                  className="text-catalyst-muted hover:text-catalyst-accent p-0.5"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Target Score Configuration */}
              <div className="flex items-center justify-between p-2.5 bg-slate-50 border border-catalyst-border rounded-xl">
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Target Exam Score</p>
                  <p className="text-[9px] font-semibold text-catalyst-muted">Enter target marks in numbers</p>
                </div>
                <input
                  type="number"
                  placeholder="e.g. 155"
                  value={targetScore || ''}
                  onChange={(e) => setTargetScore(Number(e.target.value))}
                  className="w-24 text-center text-xs font-black text-catalyst-dark bg-white border border-catalyst-border rounded-lg py-1.5 px-2 focus:outline-none focus:ring-2 focus:ring-catalyst-primary/10 focus:border-catalyst-primary"
                />
              </div>

              {/* List of Phases */}
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {dDayPhases.length === 0 ? (
                  <div className="p-3 bg-catalyst-bg rounded-lg border border-dashed border-catalyst-border text-center">
                    <p className="text-[11px] font-medium text-catalyst-muted mb-2">No custom phases configured.</p>
                    {dDay && (
                      <button
                        type="button"
                        onClick={() => setDDayPhases([{ id: 'phase_1', name: 'Main Exam', date: dDay }])}
                        className="btn bg-catalyst-primary text-white text-[10px] px-2.5 py-1"
                      >
                        Import Single D-Day as Phase 1
                      </button>
                    )}
                  </div>
                ) : (
                  dDayPhases.map((phase, idx) => (
                    <div key={phase.id} className="flex items-center gap-2 bg-catalyst-bg/40 p-2 rounded-lg border border-catalyst-border/60">
                      <input
                        type="text"
                        value={phase.name}
                        placeholder="Phase Name"
                        onChange={(e) => {
                          const updated = dDayPhases.map(p => p.id === phase.id ? { ...p, name: e.target.value } : p);
                          setDDayPhases(updated);
                        }}
                        className="flex-1 text-[11px] font-bold text-catalyst-dark bg-white border border-catalyst-border rounded px-1.5 py-0.5 outline-none focus:border-catalyst-primary"
                      />
                      <input
                        type="date"
                        value={phase.date}
                        onChange={(e) => {
                          const updated = dDayPhases.map(p => p.id === phase.id ? { ...p, date: e.target.value } : p);
                          setDDayPhases(updated);
                          if (idx === 0) setDDay(e.target.value);
                        }}
                        className="text-[11px] font-bold text-catalyst-dark bg-white border border-catalyst-border rounded px-1.5 py-0.5 outline-none focus:border-catalyst-primary"
                      />
                      <button
                        onClick={() => {
                          const updated = dDayPhases.filter(p => p.id !== phase.id);
                          setDDayPhases(updated);
                          if (updated.length > 0) {
                            setDDay(updated[0].date);
                          } else {
                            setDDay('');
                          }
                        }}
                        className="text-red-500 hover:text-red-700 p-0.5 shrink-0"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Add New Phase Button */}
              <button
                onClick={() => {
                  const nextId = `phase_${Date.now()}`;
                  const newPhase = { id: nextId, name: `Phase ${dDayPhases.length + 1}`, date: todayStr };
                  const updated = [...dDayPhases, newPhase];
                  setDDayPhases(updated);
                  if (updated.length === 1) setDDay(todayStr);
                }}
                className="w-full flex items-center justify-center gap-1.5 border border-dashed border-catalyst-primary/40 hover:border-catalyst-primary/80 bg-catalyst-primary/5 hover:bg-catalyst-primary/10 text-catalyst-primary rounded-lg py-1 text-[11px] font-bold transition-all"
              >
                <Plus size={12} /> Add Exam Phase / Round
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Comeback vs Downfall Banners */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Consistency Dashboard Card */}
        <div className="card p-5 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-catalyst-muted uppercase tracking-widest">7-Day Consistency</p>
            <h4 className="text-2xl font-black text-catalyst-dark mt-1">{consistencyStats.rate}%</h4>
            <p className="text-xs font-medium text-catalyst-muted mt-1">
              Completed {consistencyStats.completed} of {consistencyStats.planned} tasks
            </p>
          </div>
          <div className="w-14 h-14 rounded-full border-4 border-catalyst-primary/20 flex items-center justify-center relative">
            <span className="text-xs font-black text-catalyst-primary">{consistencyStats.rate}%</span>
          </div>
        </div>

        {/* Dynamic Warning/Comeback Indicator */}
        <div className="col-span-1 md:col-span-2 card p-5 flex items-start gap-4 bg-white relative overflow-hidden">
          {consistencyStats.rate >= 70 ? (
            <>
              <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-emerald-200">
                <Zap size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-black text-emerald-800 text-sm">⚡ Comeback Mode Active</h3>
                  <span className="badge-green">High consistency</span>
                </div>
                <p className="text-xs font-semibold text-emerald-700 leading-relaxed">
                  You are logging consistent study habits. Remaining topics are in focus, and your schedule is fully aligned. Maintain this rate to maximize exam success score!
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="w-10 h-10 rounded-xl bg-red-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-red-200">
                <AlertCircle size={20} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-black text-red-900 text-sm">⚠️ Downfall Warning</h3>
                  <span className="badge-red">At Risk</span>
                </div>
                <p className="text-xs font-semibold text-red-700 leading-relaxed">
                  Consistency dropped to {consistencyStats.rate}%. 
                  {accelerationInfo ? (
                    ` To complete the remaining ${accelerationInfo.uncompletedTopics} topics, you need to accelerate your study pace by ${accelerationInfo.deficitPct}% (approx ${accelerationInfo.neededDailyHours} hrs/day target).`
                  ) : (
                    " Plan more study tasks or adjust target dates to complete the syllabus in time."
                  )}
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Date Browser Row */}
      <div className="card p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Navigation Arrow Left */}
        <div className="flex items-center gap-2">
          <button 
            onClick={() => {
              const d = new Date(selectedDate);
              d.setDate(d.getDate() - 1);
              setSelectedDate(d.toLocaleDateString('en-CA'));
            }}
            className="p-1.5 hover:bg-catalyst-bg rounded-lg border border-catalyst-border transition-colors text-catalyst-dark"
          >
            <ChevronLeft size={16} />
          </button>
          
          <span className="text-sm font-black text-catalyst-dark min-w-44 text-center">
            {formatHeaderDate(selectedDate)}
          </span>

          <button 
            onClick={() => {
              const d = new Date(selectedDate);
              d.setDate(d.getDate() + 1);
              setSelectedDate(d.toLocaleDateString('en-CA'));
            }}
            className="p-1.5 hover:bg-catalyst-bg rounded-lg border border-catalyst-border transition-colors text-catalyst-dark"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Date Row Selection Bar */}
        <div className="flex items-center gap-2 overflow-x-auto py-1">
          {dateRow.map(d => {
            const isSelected = d.iso === selectedDate;
            const hasTasks = todos.some(t => t.date === d.iso);
            return (
              <button
                key={d.iso}
                onClick={() => setSelectedDate(d.iso)}
                className={`px-3.5 py-1.5 rounded-xl border text-center transition-all flex flex-col items-center shrink-0 min-w-[54px] relative ${
                  isSelected 
                    ? 'bg-catalyst-primary border-catalyst-primary text-white shadow-md shadow-catalyst-primary/20 scale-105' 
                    : 'bg-white border-catalyst-border text-catalyst-dark hover:border-catalyst-muted'
                }`}
              >
                <span className="text-[9px] font-black uppercase tracking-wider opacity-60">{d.label}</span>
                <span className="text-sm font-black mt-0.5">{d.dayNum}</span>
                {hasTasks && (
                  <span className={`w-1.5 h-1.5 rounded-full absolute bottom-1 ${isSelected ? 'bg-white' : 'bg-catalyst-accent'}`}></span>
                )}
              </button>
            );
          })}
        </div>

        {/* Manual Date Input Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-catalyst-muted">Jump to:</span>
          <input 
            type="date" 
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="text-xs font-bold text-catalyst-dark border border-catalyst-border rounded-lg p-1.5 outline-none focus:border-catalyst-primary bg-white"
          />
        </div>
      </div>

      {/* Main planner grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Planner Left Card: Quick Add + Progress Summary */}
        <div className="lg:col-span-1 space-y-4">
          <div className="card p-5 space-y-4">
            <h3 className="font-black text-base text-catalyst-dark flex items-center gap-2">
              <CheckCircle2 size={16} className="text-catalyst-primary" />
              Day Progress
            </h3>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-black">
                <span className="text-catalyst-muted">Task Completion</span>
                <span className="text-catalyst-primary">{datePct}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill bg-catalyst-primary" style={{ width: `${datePct}%` }}></div>
              </div>
            </div>

            <div className="pt-2 border-t border-catalyst-border text-xs font-semibold text-catalyst-muted space-y-1.5">
              <div className="flex justify-between">
                <span>Total Tasks Scheduled:</span>
                <span className="font-bold text-catalyst-dark">{totalCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Completed Tasks:</span>
                <span className="font-bold text-catalyst-dark">{doneCount}</span>
              </div>
            </div>
          </div>

          {/* Quick Add Form */}
          <div className="card p-5">
            <h3 className="font-black text-base text-catalyst-dark mb-3">Add Custom Task</h3>
            <form onSubmit={handleAddTodo} className="space-y-3">
              <input 
                type="text" 
                placeholder="What is your plan for this date?" 
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                className="w-full px-3 py-2 border border-catalyst-border rounded-xl text-xs font-semibold text-catalyst-dark placeholder-catalyst-muted focus:border-catalyst-primary outline-none"
                required
              />
              <button 
                type="submit" 
                className="w-full btn-primary py-2 text-xs font-bold"
              >
                Schedule Task
              </button>
            </form>
          </div>
        </div>

        {/* Planner Right Section: Task Cards List */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-black text-catalyst-dark text-base uppercase tracking-wider">Scheduled Tasks</h3>
            <span className="bg-catalyst-primary/20 text-catalyst-primary text-xs font-bold px-2.5 py-0.5 rounded-full">
              {totalCount} planned
            </span>
          </div>

          <div className="space-y-3">
            {selectedTodos.map(todo => {
              const isDone = todo.status === 'done';
              const hasShifted = (todo.shiftedCount || 0) > 0;
              return (
                <div 
                  key={todo.id} 
                  className={`card p-4 transition-all flex items-start gap-3 ${
                    isDone ? 'opacity-65 bg-catalyst-bg/40' : 'bg-white hover:border-catalyst-primary shadow-sm'
                  }`}
                >
                  <button 
                    onClick={() => toggleTodo(todo.id)} 
                    className="mt-0.5 shrink-0 transition-transform active:scale-90"
                  >
                    {isDone ? (
                      <CheckCircle2 size={18} className="text-catalyst-primary" />
                    ) : (
                      <Circle size={18} className="text-catalyst-muted hover:text-catalyst-primary transition-colors" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold transition-all ${isDone ? 'text-catalyst-muted line-through' : 'text-catalyst-dark'}`}>
                      {todo.text}
                    </p>
                    
                    {hasShifted && !isDone && (
                      <div className="flex items-center gap-1 mt-1">
                        <AlertCircle size={10} className="text-amber-500" />
                        <span className="text-[9px] font-black text-amber-600 uppercase tracking-widest">
                          Shifted {todo.shiftedCount}x
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-3">
                      <button 
                        onClick={() => deleteTodo(todo.id)}
                        className="text-[10px] font-bold text-catalyst-muted hover:text-red-500 flex items-center gap-1 transition-colors"
                      >
                        <Trash2 size={10} /> Delete
                      </button>
                      
                      {!isDone && (
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleShiftPrevDay(todo.id)}
                            className="text-[9px] font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded transition-colors"
                            title="Shift to previous day"
                          >
                            ← Postpone Prev
                          </button>
                          <button 
                            onClick={() => handleShiftTomorrow(todo.id)}
                            className="text-[9px] font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded transition-colors"
                            title="Shift to tomorrow"
                          >
                            Postpone Next →
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {totalCount === 0 && (
              <div className="card p-10 text-center border-dashed bg-transparent shadow-none">
                <p className="text-xs font-bold text-catalyst-muted">No study plans scheduled for this date.</p>
                <p className="text-[10px] text-catalyst-muted mt-1">Start by adding a task or custom subject topic to your day!</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Planner;
