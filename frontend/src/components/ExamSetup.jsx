import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { BookOpen, GraduationCap, Building2, Calculator, School, Users, Plus, Check } from 'lucide-react';
import Logo from './Logo';
import { staticExamOptions } from '../data/examsData';

const ExamSetup = () => {
  const { setExam, enrolledExams, setEnrolledList, selectedExam, customExams, addCustomExam } = useAppContext();
  const navigate = useNavigate();

  const [selectedTitles, setSelectedTitles] = useState(() => {
    // If they already have enrolled exams, pre-populate
    return enrolledExams && enrolledExams.length > 0 ? enrolledExams : ['UPSC CSE'];
  });

  const getExamStats = (exam) => {
    const saved = localStorage.getItem(`catalyst_exam_data_${exam.title}`);
    
    if (!saved) {
      return { daysLeft: null, targetScore: 0 };
    }

    let examDDay = '';
    let examTargetScore = 0;
    try {
      const data = JSON.parse(saved);
      examDDay = data.dDay || '';
      examTargetScore = data.targetScore || 0;
    } catch (_) {}

    let daysLeft = null;
    if (examDDay) {
      const diff = new Date(examDDay).setHours(0, 0, 0, 0) - new Date().setHours(0, 0, 0, 0);
      daysLeft = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
    }

    return { daysLeft, targetScore: examTargetScore };
  };

  const handleToggleSelect = (examTitle) => {
    if (selectedTitles.includes(examTitle)) {
      if (selectedTitles.length > 1) {
        setSelectedTitles(selectedTitles.filter(t => t !== examTitle));
      } else {
        alert("Please keep at least one exam selected!");
      }
    } else {
      setSelectedTitles([...selectedTitles, examTitle]);
    }
  };

  const [showModal, setShowModal] = useState(false);
  const [newExam, setNewExam] = useState({ title: '', desc: '' });

  const handleAddCustom = async () => {
    if (!newExam.title.trim()) return;
    await addCustomExam(newExam.title.trim(), newExam.desc.trim() || 'Custom Study Plan');
    setSelectedTitles([...selectedTitles, newExam.title.trim()]);
    setNewExam({ title: '', desc: '' });
    setShowModal(false);
  };

  const handleProceed = () => {
    if (selectedTitles.length === 0) return;
    setEnrolledList(selectedTitles);
    
    // Switch to active selectedExam if it's already in the selected list, 
    // otherwise set the first selected exam as the active exam workspace
    if (!selectedExam || !selectedTitles.includes(selectedExam)) {
      const matched = [...staticExamOptions, ...customExams].find(ex => ex.title === selectedTitles[0]);
      if (matched) {
        const initialSyllabus = JSON.parse(JSON.stringify(matched.syllabus || []));
        setExam(matched.title, initialSyllabus, [], [], {});
      } else {
        setExam(selectedTitles[0], [], [], [], {});
      }
    }
    navigate('/');
  };

  const renderExamCard = (exam) => {
    const { daysLeft, targetScore } = getExamStats(exam);
    const isSelected = selectedTitles.includes(exam.title);
    return (
      <button
        key={exam.id}
        type="button"
        onClick={() => handleToggleSelect(exam.title)}
        className={`card p-6 border-2 text-left transition-all hover:-translate-y-1 hover:shadow-lg flex flex-col justify-between min-h-[190px] relative ${
          isSelected 
            ? 'border-catalyst-primary bg-catalyst-primary/5 hover:border-catalyst-primary' 
            : exam.color
        }`}
      >
        {isSelected && (
          <div className="absolute top-4 right-4 w-6 h-6 bg-catalyst-primary text-white rounded-full flex items-center justify-center shadow-lg border border-white">
            <Check size={14} strokeWidth={3} />
          </div>
        )}
        <div>
          <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-4">
            {typeof exam.icon === 'string' ? <BookOpen size={24} className="text-gray-500" /> : exam.icon}
          </div>
          <h3 className="text-xl font-black text-catalyst-dark mb-1">{exam.title}</h3>
          <p className="text-sm font-semibold text-catalyst-muted mb-4">{exam.desc}</p>
        </div>
        <div className="flex items-center gap-2 mt-auto">
          {daysLeft !== null && (
            <span className="bg-rose-50 border border-rose-100 text-rose-600 text-xs font-black px-2.5 py-1 rounded-lg">
              {daysLeft} days left
            </span>
          )}
          {targetScore > 0 && (
            <span className="bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-black px-2.5 py-1 rounded-lg">
              Target: {targetScore}
            </span>
          )}
        </div>
      </button>
    );
  };

  return (
    <div className={selectedExam ? "fixed inset-0 z-[100] bg-[#f5f5fa]/80 backdrop-blur-md flex items-center justify-center overflow-y-auto py-10 px-4 animate-in fade-in duration-200" : "min-h-screen flex items-center justify-center bg-[#f5f5fa] relative overflow-hidden py-10 px-4"}>
      {!selectedExam && (
        <>
          <div className="absolute top-[10%] left-[10%] w-[40%] h-[40%] bg-blue-200/30 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-[10%] right-[10%] w-[40%] h-[40%] bg-purple-200/30 rounded-full blur-3xl pointer-events-none" />
        </>
      )}

      <div className="w-full max-w-4xl relative z-10 my-auto">
        <div className="text-center mb-10 flex flex-col items-center">
          <Logo size={64} className="mb-4 drop-shadow-md animate-bounce" />
          <h1 className="text-4xl font-black text-catalyst-dark mb-3 tracking-tight">What are you preparing for?</h1>
          <p className="text-catalyst-muted font-medium text-lg">Select the exams you want to prepare for. You can choose multiple options.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {staticExamOptions.map((exam) => renderExamCard(exam))}
          {customExams.map((exam) => renderExamCard(exam))}
          {/* Add Custom Exam Card */}
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="card p-6 border-2 border-dashed text-center text-catalyst-muted hover:bg-white/10 transition flex flex-col items-center justify-center min-h-[190px]"
          >
            <Plus size={32} className="mx-auto mb-2 text-catalyst-muted" />
            <span className="text-sm font-semibold">Add Custom Exam</span>
          </button>
        </div>

        <div className="mt-8 flex flex-col items-center gap-4">
          <div className="flex gap-4">
            {selectedExam && (
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-8 py-3.5 border border-catalyst-border hover:bg-catalyst-bg text-catalyst-dark font-black text-base rounded-2xl transition-all cursor-pointer"
              >
                Cancel
              </button>
            )}
            <button
              type="button"
              onClick={handleProceed}
              disabled={selectedTitles.length === 0}
              className="px-8 py-3.5 bg-catalyst-primary hover:bg-catalyst-primary/95 text-white font-black text-base rounded-2xl shadow-xl shadow-catalyst-primary/20 active:scale-95 disabled:opacity-50 transition-all cursor-pointer flex items-center gap-2"
            >
              {selectedExam ? 'Confirm & Update 🚀' : 'Confirm & Start My Journey 🚀'}
            </button>
          </div>
          
          <div className="text-sm font-bold text-catalyst-muted bg-white/50 backdrop-blur-sm p-4 rounded-xl inline-block mx-auto text-center max-w-lg leading-relaxed border border-catalyst-border/40">
            💡 Select all desired exams. They will be available to switch instantly in the header workspace dropdown.
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && createPortal(
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-[9999] animate-in fade-in duration-200">
          <div className="bg-catalyst-dark rounded-xl p-6 w-full max-w-md mx-4 border border-catalyst-border shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-1">Add Custom Exam</h2>
            <p className="text-xs font-semibold text-white/50 mb-4">Create a custom study plan template.</p>
            <input
              type="text"
              placeholder="Exam Title"
              className="w-full mb-3 p-2.5 rounded bg-white/10 text-white placeholder-gray-400 border border-white/10 outline-none focus:border-catalyst-primary"
              value={newExam.title}
              onChange={(e) => setNewExam({ ...newExam, title: e.target.value })}
            />
            <textarea
              placeholder="Description (optional)"
              className="w-full mb-3 p-2.5 rounded bg-white/10 text-white placeholder-gray-400 border border-white/10 outline-none focus:border-catalyst-primary"
              rows={3}
              value={newExam.desc}
              onChange={(e) => setNewExam({ ...newExam, desc: e.target.value })}
            />
            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                className="px-4 py-2 border border-white/15 text-white/75 hover:bg-white/5 rounded-xl text-xs font-bold transition-all"
                onClick={() => setShowModal(false)}
              >Cancel</button>
              <button
                type="button"
                className="px-5 py-2 bg-catalyst-primary text-white rounded-xl text-xs font-black hover:opacity-90 active:scale-95 transition-all"
                onClick={handleAddCustom}
              >Add</button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default ExamSetup;
