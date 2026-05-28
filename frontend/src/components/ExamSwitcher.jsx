import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { ChevronDown, BookOpen, Check } from 'lucide-react';
import { staticExamOptions } from '../data/examsData';

const ExamSwitcher = () => {
  const { selectedExam, switchExam, dDay, targetScore, enrolledExams, customExams, examStats } = useAppContext();
  const navigate = useNavigate();
  
  const getExamStats = (exam) => {
    const isSelected = selectedExam === exam.title;
    let examDDay = '';
    let examTargetScore = 0;

    if (isSelected) {
      examDDay = dDay;
      examTargetScore = targetScore;
    } else {
      const stats = examStats[exam.title];
      if (stats) {
        examDDay = stats.dDay || '';
        examTargetScore = stats.targetScore || 0;
      }
    }

    let daysLeft = null;
    if (examDDay) {
      const diff = new Date(examDDay).setHours(0, 0, 0, 0) - new Date().setHours(0, 0, 0, 0);
      daysLeft = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
    }

    return { daysLeft, targetScore: examTargetScore };
  };
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = React.useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const allExams = [...staticExamOptions, ...customExams].filter(exam => enrolledExams.includes(exam.title));

  const handleSelectExam = (exam) => {
    switchExam(exam.title, exam.syllabus || []);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={containerRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            setIsOpen(!isOpen);
          }
        }}
        title="Switch active exam goal"
        className="flex items-center gap-2 px-4 py-2 bg-catalyst-bg hover:bg-catalyst-border/40 active:scale-95 transition-all text-catalyst-dark font-bold text-sm rounded-xl border border-catalyst-border shadow-sm cursor-pointer"
      >
        <BookOpen size={16} className="text-catalyst-primary" />
        <span>{selectedExam || 'Select Exam'}</span>
        <ChevronDown size={14} className={`text-catalyst-muted transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-80 bg-white border border-catalyst-border rounded-2xl shadow-xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex items-center justify-between mb-3 border-b border-catalyst-border pb-2">
            <span className="text-xs font-black text-catalyst-muted uppercase tracking-wider">Your Enrolled Exams</span>
          </div>

          <div className="space-y-1 max-h-64 overflow-y-auto pr-1">
            {allExams.map((exam) => {
              const isSelected = selectedExam === exam.title;
              const { daysLeft, targetScore } = getExamStats(exam);
              return (
                <button
                  key={exam.id}
                  onClick={() => handleSelectExam(exam)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSelectExam(exam);
                    }
                  }}
                  title={`Switch workspace to ${exam.title}`}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-colors cursor-pointer ${
                    isSelected ? 'bg-catalyst-primary/10 text-catalyst-primary border border-catalyst-primary/20' : 'text-catalyst-text hover:bg-catalyst-bg hover:text-catalyst-dark'
                  }`}
                >
                  <div className="flex-1 min-w-0 pr-2">
                    <p className="text-sm font-bold truncate">{exam.title}</p>
                    <p className="text-[10px] text-catalyst-muted font-semibold truncate mb-1">{exam.desc}</p>
                    <div className="flex items-center gap-1.5">
                      {daysLeft !== null && (
                        <span className="bg-rose-50 border border-rose-100 text-rose-600 text-[9px] font-black px-1.5 py-0.5 rounded select-none">
                          {daysLeft}d left
                        </span>
                      )}
                      {targetScore > 0 && (
                        <span className="bg-indigo-50 border border-indigo-100 text-indigo-600 text-[9px] font-black px-1.5 py-0.5 rounded select-none">
                          Target: {targetScore}
                        </span>
                      )}
                    </div>
                  </div>
                  {isSelected && <Check size={16} className="text-catalyst-primary shrink-0" />}
                </button>
              );
            })}
          </div>

          <div className="border-t border-catalyst-border pt-2.5 mt-2 flex justify-center">
            <button
              onClick={() => {
                setIsOpen(false);
                navigate('/setup');
              }}
              className="text-xs font-bold text-catalyst-primary hover:underline flex items-center gap-1 cursor-pointer"
            >
              ⚙️ Manage & Add Exams
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default ExamSwitcher;
