import React, { useState, useRef } from 'react';
import { ChevronDown, ChevronRight, CheckCircle2, Circle, Plus, BookOpen, Clock, Edit2, Sparkles, AlertCircle, ArrowUpRight, RotateCcw, Trash2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { staticExamOptions } from '../data/examsData';

const PREP_STAGES = [
  { key: 'theory', name: 'Theory', category: 'Foundation' },
  { key: 'videos', name: 'Video Lectures', category: 'Foundation' },
  { key: 'notes', name: 'Notes', category: 'Foundation' },
  { key: 'practice', name: 'Question Practice sets', category: 'Practice' },
  { key: 'notesRevision', name: 'Notes Revision', category: 'Revision' },
  { key: 'mockTest', name: 'Mocktest', category: 'Mock Test' },
  { key: 'shortNotes', name: 'Shortnotes', category: 'Revision' },
  { key: 'completed', name: 'Completed', category: 'Completed' }
];

const parseResourceUrls = (text) => {
  if (!text) return [];
  // Extracts HTTP/HTTPS links from text separated by commas, semicolons, or whitespace
  const urlRegex = /(https?:\/\/[^\s,;]+)/g;
  const matches = text.match(urlRegex);
  return matches || [];
};

const ResourceListTracker = ({ value, onChange, placeholder = "Add resource or link..." }) => {
  const [tempInput, setTempInput] = useState('');
  const inputRef = useRef(null);
  const lines = value ? value.split('\n').filter(Boolean) : [];

  const handleAddLine = (lineText) => {
    const trimmed = lineText.trim();
    if (!trimmed) return;
    // Prevent duplicate lines
    if (lines.includes(trimmed)) {
      setTempInput('');
      return;
    }
    const newLines = [...lines, trimmed];
    onChange(newLines.join('\n'));
    setTempInput('');
    // Put cursor back to input
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 0);
  };

  const handleDeleteLine = (idxToDelete) => {
    const newLines = lines.filter((_, idx) => idx !== idxToDelete);
    onChange(newLines.join('\n'));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddLine(tempInput);
    }
  };

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {lines.map((line, idx) => {
        const isUrl = line.startsWith('http://') || line.startsWith('https://');
        return (
          <div key={idx} className="flex items-center justify-between gap-2 bg-catalyst-bg/40 border border-catalyst-border/40 text-[10px] font-semibold rounded-lg pl-2 pr-1 py-1 group/line">
            <div className="truncate flex-1 min-w-0">
              {isUrl ? (
                <a href={line} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1 font-bold">
                  <ArrowUpRight size={10} className="shrink-0" />
                  <span className="truncate">{line}</span>
                </a>
              ) : (
                <span className="text-catalyst-dark truncate block">{line}</span>
              )}
            </div>
            <button 
              onClick={() => handleDeleteLine(idx)}
              className="text-catalyst-muted hover:text-red-500 text-xs font-black px-1.5 transition-colors shrink-0"
              title="Delete line"
            >
              ×
            </button>
          </div>
        );
      })}
      
      <div className="relative flex items-center w-full">
        <span className="absolute left-2 text-catalyst-muted pointer-events-none">
          <Edit2 size={10} className="opacity-60" />
        </span>
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={tempInput}
          onChange={(e) => setTempInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full bg-catalyst-bg/60 border border-catalyst-border text-[11px] rounded-lg pl-6 pr-8 py-1 outline-none font-semibold placeholder:text-catalyst-muted/50 focus:border-catalyst-primary focus:bg-white transition-all"
        />
        {tempInput.trim() && (
          <button
            onClick={() => handleAddLine(tempInput)}
            className="absolute right-2 text-catalyst-primary hover:text-catalyst-primary-dark font-extrabold text-[12px] hover:scale-110 transition-transform cursor-pointer"
            title="Click to add line"
          >
            ↵
          </button>
        )}
      </div>
      <span className="text-[8px] text-catalyst-muted font-bold ml-1 select-none leading-none">
        Press Enter key or click ↵ to save line. Cursor stays focused.
      </span>
    </div>
  );
};

const STAGES = ['Foundation', 'Practice', 'Revision', 'Mock Test', 'Completed'];

const STAGE_COLORS = {
  Foundation: { bg: 'bg-blue-100', text: 'text-blue-700', dot: 'bg-blue-500' },
  Practice:   { bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500' },
  Revision:   { bg: 'bg-purple-100', text: 'text-purple-700', dot: 'bg-purple-500' },
  'Mock Test': { bg: 'bg-orange-100', text: 'text-orange-700', dot: 'bg-orange-500' },
  Completed:   { bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500' },
};

const CONFIDENCE = {
  Low:    'bg-red-100 text-red-600',
  Medium: 'bg-amber-100 text-amber-700',
  High:   'bg-emerald-100 text-emerald-700',
};

const SyllabusTracker = () => {
  const { syllabusData, addSubject, setSyllabusData, selectedExam } = useAppContext();
  const [isAddingSubject, setIsAddingSubject] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newSubjectRound, setNewSubjectRound] = useState('');
  const [selectedRoundFilter, setSelectedRoundFilter] = useState('All');
  const [showImportModal, setShowImportModal] = useState(false);
  const [importText, setImportText] = useState('');
  const [importFormat, setImportFormat] = useState('text'); // 'text' | 'json'
  const [replaceMode, setReplaceMode] = useState(false);

  const availableRounds = React.useMemo(() => {
    const rounds = new Set();
    syllabusData.forEach(sub => {
      if (sub.round) {
        rounds.add(sub.round);
      }
    });
    const arr = Array.from(rounds);
    return arr.length > 0 ? ['All', ...arr] : [];
  }, [syllabusData]);

  React.useEffect(() => {
    if (availableRounds.length > 0 && !availableRounds.includes(selectedRoundFilter)) {
      setSelectedRoundFilter('All');
    }
  }, [availableRounds, selectedRoundFilter]);

  const filteredSyllabus = React.useMemo(() => {
    if (selectedRoundFilter === 'All' || !availableRounds.includes(selectedRoundFilter)) {
      return syllabusData;
    }
    return syllabusData.filter(sub => sub.round === selectedRoundFilter);
  }, [syllabusData, selectedRoundFilter, availableRounds]);

  const handleAddSubject = () => {
    if (!newSubjectName.trim()) return;
    addSubject({
      id: `s_${Date.now()}`,
      name: newSubjectName,
      emoji: '📚',
      round: newSubjectRound.trim() || undefined,
      topics: []
    });
    setNewSubjectName('');
    setNewSubjectRound('');
    setIsAddingSubject(false);
  };

  const handleImportSyllabus = () => {
    if (!importText.trim()) return;
    try {
      let importedSubjects = [];
      if (importFormat === 'json') {
        const parsed = JSON.parse(importText);
        const list = Array.isArray(parsed) ? parsed : [parsed];
        
        importedSubjects = list.map(sub => ({
          id: sub.id || `s_${Date.now()}_${Math.random()}`,
          name: sub.name || 'Untitled Subject',
          emoji: sub.emoji || '📚',
          round: sub.round || undefined,
          topics: (sub.topics || []).map(topic => ({
            id: topic.id || `t_${Date.now()}_${Math.random()}`,
            name: topic.name || 'Untitled Topic',
            stage: topic.stage || 'Foundation',
            completion: topic.completion || 0,
            confidence: topic.confidence || 'Low',
            subtopics: (topic.subtopics || []).map(st => makeSubtopic(st.id || `st_${Date.now()}_${Math.random()}`, st.name || st))
          }))
        }));
      } else {
        // Smart Text Parser
        const lines = importText.split('\n');
        let currentSubject = null;
        let currentTopic = null;

        lines.forEach(line => {
          const trimmed = line.trim();
          if (!trimmed) return;

          const leadingSpaces = line.match(/^\s*/)[0].length;
          
          const isSubjectHeader = /^(gs|general studies|paper|subject|unit)/i.test(trimmed);
          const hasBullet = /^[-*•]/.test(trimmed);
          const isSubtopicListItem = /^\([a-z0-9]+\)/i.test(trimmed);

          if ((leadingSpaces === 0 && !hasBullet && !isSubtopicListItem) || isSubjectHeader) {
            if (currentSubject) {
              importedSubjects.push(currentSubject);
            }
            currentSubject = {
              id: `s_${Date.now()}_${Math.random()}`,
              name: trimmed.replace(/^[#=\s]*/, ''),
              emoji: '📚',
              topics: []
            };
            currentTopic = null;
          } else if (isSubtopicListItem || (leadingSpaces > 4) || (currentTopic && hasBullet && leadingSpaces > 2)) {
            if (currentTopic) {
              const nameClean = trimmed.replace(/^[-*•\s]*/, '').replace(/^\([a-z0-9]+\)\s*/i, '');
              currentTopic.subtopics.push(makeSubtopic(`st_${Date.now()}_${Math.random()}`, nameClean));
            } else if (currentSubject) {
              const nameClean = trimmed.replace(/^[-*•\s]*/, '').replace(/^\([a-z0-9]+\)\s*/i, '');
              currentTopic = {
                id: `t_${Date.now()}_${Math.random()}`,
                name: nameClean,
                stage: 'Foundation',
                completion: 0,
                confidence: 'Low',
                subtopics: []
              };
              currentSubject.topics.push(currentTopic);
            }
          } else {
            if (currentSubject) {
              const nameClean = trimmed.replace(/^[-*•\s]*/, '').replace(/^\d+[-.:]\s*/, '');
              currentTopic = {
                id: `t_${Date.now()}_${Math.random()}`,
                name: nameClean,
                stage: 'Foundation',
                completion: 0,
                confidence: 'Low',
                subtopics: []
              };
              currentSubject.topics.push(currentTopic);
            } else {
              currentSubject = {
                id: `s_${Date.now()}_${Math.random()}`,
                name: 'General Syllabus',
                emoji: '📚',
                topics: []
              };
              const nameClean = trimmed.replace(/^[-*•\s]*/, '').replace(/^\d+[-.:]\s*/, '');
              currentTopic = {
                id: `t_${Date.now()}_${Math.random()}`,
                name: nameClean,
                stage: 'Foundation',
                completion: 0,
                confidence: 'Low',
                subtopics: []
              };
              currentSubject.topics.push(currentTopic);
            }
          }
        });

        if (currentSubject) {
          importedSubjects.push(currentSubject);
        }
      }

      if (importedSubjects.length === 0) {
        alert('Could not parse any subjects or topics from the input. Please verify the format!');
        return;
      }

      if (replaceMode) {
        setSyllabusData(importedSubjects);
      } else {
        setSyllabusData([...syllabusData, ...importedSubjects]);
      }

      setImportText('');
      setShowImportModal(false);
    } catch (err) {
      alert('Failed to parse syllabus. Details: ' + err.message);
    }
  };

  const handleResetToDefault = () => {
    if (!selectedExam) return;
    if (window.confirm("Are you sure you want to reset the current exam's syllabus back to the default? This will wipe your customization and progress for this exam.")) {
      const matchedStatic = staticExamOptions.find(ex => ex.title.toLowerCase() === selectedExam.toLowerCase());
      if (matchedStatic) {
        // Clone the default syllabus to reset progress
        const initialSyllabus = JSON.parse(JSON.stringify(matchedStatic.syllabus));
        setSyllabusData(initialSyllabus);
      } else {
        alert("No default template found for this exam. Custom exams cannot be reset.");
      }
    }
  };

  const totalTopics = syllabusData.flatMap(s => s.topics || []).length;
  const overallPct = totalTopics === 0 ? 0 : Math.round(syllabusData.flatMap(s => s.topics || []).reduce((acc, t) => acc + (t.completion || 0), 0) / totalTopics);

  return (
    <div className="max-w-7xl mx-auto pb-10 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-catalyst-dark">Syllabus Tracker</h2>
          <p className="text-catalyst-muted text-sm font-medium mt-0.5">
            Customize and track your mastery journey — topic by topic.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button 
            onClick={handleResetToDefault} 
            className="px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer"
            title="Reset active syllabus to original default structure"
          >
            <RotateCcw size={12} />
            Reset to Default
          </button>

          <button 
            onClick={() => setShowImportModal(true)} 
            className="px-4 py-2 border-2 border-catalyst-primary text-catalyst-primary hover:bg-catalyst-primary hover:text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer"
          >
            Import Syllabus
          </button>
          
          {isAddingSubject ? (
            <div className="flex flex-wrap items-center gap-2 bg-white border border-catalyst-border p-2 rounded-xl shadow-md">
              <input 
                type="text" 
                value={newSubjectName}
                onChange={(e) => setNewSubjectName(e.target.value)}
                placeholder="Subject Name"
                className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-catalyst-border focus:border-catalyst-primary outline-none w-32 sm:w-40"
                autoFocus
              />
              <input 
                type="text" 
                value={newSubjectRound}
                onChange={(e) => setNewSubjectRound(e.target.value)}
                placeholder="Round (e.g. Prelims/Mains)"
                className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-catalyst-border focus:border-catalyst-primary outline-none w-28 sm:w-32"
              />
              <div className="flex items-center gap-1.5">
                <button onClick={handleAddSubject} className="btn-primary text-xs py-1.5 px-3">Add</button>
                <button onClick={() => { setIsAddingSubject(false); setNewSubjectRound(''); }} className="text-xs font-bold text-catalyst-muted hover:text-catalyst-dark px-1">Cancel</button>
              </div>
            </div>
          ) : (
            <button onClick={() => setIsAddingSubject(true)} className="btn-primary flex items-center gap-2">
              <Plus size={15} />
              Add Subject
            </button>
          )}
        </div>
      </div>

      <div className="card p-5 flex flex-col md:flex-row md:items-center gap-6 md:gap-8">
        <div className="flex-1 w-full">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-catalyst-dark">Overall Completion</span>
            <span className="text-sm font-black text-catalyst-primary">{overallPct}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill bg-catalyst-primary" style={{ width: `${overallPct}%` }}></div>
          </div>
        </div>
        <div className="hidden md:block w-px h-10 bg-catalyst-border"></div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 w-full md:w-auto">
          {STAGES.map(stage => {
            const count = syllabusData.flatMap(s => s.topics || []).filter(t => t.stage === stage).length;
            const c = STAGE_COLORS[stage];
            return (
              <div key={stage} className="text-center">
                <p className={`text-base sm:text-lg font-black ${c.text}`}>{count}</p>
                <p className="text-[9px] sm:text-[10px] font-bold text-catalyst-muted uppercase tracking-wide">{stage}</p>
              </div>
            );
          })}
        </div>
      </div>

      {availableRounds.length > 1 && (
        <div className="flex gap-2 p-1 bg-catalyst-bg/80 border border-catalyst-border/60 rounded-2xl w-fit">
          {availableRounds.map(rnd => (
            <button
              key={rnd}
              onClick={() => setSelectedRoundFilter(rnd)}
              className={`px-4 py-1.5 text-xs font-black uppercase tracking-wider rounded-xl transition-all ${
                selectedRoundFilter === rnd
                  ? 'bg-white text-catalyst-primary shadow-sm border border-catalyst-border/40 font-black'
                  : 'text-catalyst-muted hover:text-catalyst-dark font-bold'
              }`}
            >
              {rnd}
            </button>
          ))}
        </div>
      )}

      <div className="space-y-4">
        {filteredSyllabus.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-2xl border-2 border-dashed border-catalyst-border">
            <p className="text-catalyst-muted font-bold">No subjects added yet in this category. Start by adding one!</p>
          </div>
        ) : (
          filteredSyllabus.map(subject => (
            <SubjectCard key={subject.id} subject={subject} />
          ))
        )}
      </div>

      {/* Syllabus Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-[9999] p-4">
          <div className="bg-white rounded-2xl border border-catalyst-border/60 shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 pb-4 border-b border-catalyst-border/60 bg-gradient-to-r from-catalyst-primary/5 to-transparent">
              <h3 className="text-lg font-black text-catalyst-dark uppercase tracking-wider">Syllabus Data Importer</h3>
              <p className="text-xs font-semibold text-catalyst-muted mt-1 leading-relaxed">
                Add custom syllabus subjects and topics to your active exam tracker workspace.
              </p>
            </div>
            
            <div className="p-6 space-y-4">
              {/* Formats Selector */}
              <div className="flex gap-2 p-1 bg-catalyst-bg rounded-xl border border-catalyst-border/60">
                <button
                  onClick={() => setImportFormat('text')}
                  className={`flex-1 py-2 text-xs font-black uppercase tracking-wider rounded-lg transition-all ${importFormat === 'text' ? 'bg-white text-catalyst-primary shadow-sm' : 'text-catalyst-muted hover:text-catalyst-dark'}`}
                >
                  Smart Text Parser
                </button>
                <button
                  onClick={() => setImportFormat('json')}
                  className={`flex-1 py-2 text-xs font-black uppercase tracking-wider rounded-lg transition-all ${importFormat === 'json' ? 'bg-white text-catalyst-primary shadow-sm' : 'text-catalyst-muted hover:text-catalyst-dark'}`}
                >
                  Structured JSON
                </button>
              </div>

              {/* Text Input */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-catalyst-muted mb-1.5">
                  {importFormat === 'text' ? 'Hierarchy Text input' : 'Syllabus JSON block'}
                </label>
                <textarea
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                  placeholder={
                    importFormat === 'text'
                      ? "Example:\nGeneral Studies Paper I\n  Modern History\n    1857 Uprising and political consequences\n    Socio-religious reforms of 19th Century\n  Geography\n    Oceanic currents and thermal structures"
                      : "[\n  {\n    \"name\": \"General Studies Paper I\",\n    \"topics\": [\n      {\n        \"name\": \"Modern History\",\n        \"subtopics\": [\"1857 Uprising\"]\n      }\n    ]\n  }\n]"
                  }
                  className="w-full h-48 p-3 text-xs font-semibold font-mono text-catalyst-dark bg-catalyst-bg/50 border border-catalyst-border rounded-xl focus:border-catalyst-primary focus:bg-white outline-none resize-none placeholder:text-catalyst-muted/40 transition-all"
                />
              </div>

              {/* Replace/Append Selection */}
              <div className="flex items-center gap-6 text-xs font-bold text-catalyst-dark bg-catalyst-bg/30 p-3 rounded-xl border border-catalyst-border/40">
                <span className="text-catalyst-muted select-none">Mode:</span>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="radio"
                    name="importMode"
                    checked={!replaceMode}
                    onChange={() => setReplaceMode(false)}
                    className="accent-catalyst-primary"
                  />
                  <span>Append to current</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer select-none text-red-600">
                  <input
                    type="radio"
                    name="importMode"
                    checked={replaceMode}
                    onChange={() => setReplaceMode(true)}
                    className="accent-red-500"
                  />
                  <span>Wipe & Replace current</span>
                </label>
              </div>
            </div>

            <div className="p-6 pt-2 border-t border-catalyst-border/60 bg-catalyst-bg/30 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowImportModal(false)}
                className="px-4 py-2 text-xs font-black text-catalyst-muted hover:text-catalyst-dark uppercase tracking-wider transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleImportSyllabus}
                disabled={!importText.trim()}
                className="px-5 py-2.5 bg-catalyst-primary hover:bg-catalyst-primary/95 text-white disabled:bg-catalyst-muted/40 disabled:text-catalyst-muted/80 rounded-xl text-xs font-black uppercase tracking-wider shadow-lg shadow-catalyst-primary/20 transition-all cursor-pointer"
              >
                Load Syllabus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const SubjectCard = ({ subject }) => {
  const [open, setOpen] = useState(true);
  const { addTopic, deleteSubject } = useAppContext();
  const [isAddingTopic, setIsAddingTopic] = useState(false);
  const [newTopicName, setNewTopicName] = useState('');

  const totalPct = (subject.topics || []).length === 0 ? 0 : Math.round((subject.topics || []).reduce((a, t) => a + (t.completion || 0), 0) / (subject.topics || []).length);

  const handleAddTopic = () => {
    if (!newTopicName.trim()) return;
    addTopic(subject.id, {
      id: `t_${Date.now()}`,
      name: newTopicName,
      stage: 'Foundation',
      completion: 0,
      confidence: 'Low',
      subtopics: []
    });
    setNewTopicName('');
    setIsAddingTopic(false);
    setOpen(true);
  };

  return (
    <div className="card overflow-hidden">
      <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 hover:bg-catalyst-bg transition-colors">
        <button onClick={() => setOpen(!open)} className="flex items-center gap-3 flex-1 text-left w-full min-w-0">
          <span className="text-2xl shrink-0">{subject.emoji}</span>
          <div className="text-left flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-black text-base text-catalyst-dark truncate">{subject.name}</h3>
              {subject.round && (
                <span className="px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider bg-catalyst-primary/10 text-catalyst-primary border border-catalyst-primary/20 rounded-full shrink-0">
                  {subject.round}
                </span>
              )}
            </div>
            <p className="text-xs text-catalyst-muted font-medium">{(subject.topics || []).length} topics</p>
          </div>
        </button>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-catalyst-border/40 sm:border-none">
          <div className="flex items-center gap-3 w-full sm:w-44 justify-between sm:justify-start">
            <div className="progress-bar flex-1">
              <div className="progress-fill" style={{ width: `${totalPct}%`, background: '#10b981' }}></div>
            </div>
            <span className="text-xs font-black text-catalyst-primary w-8 shrink-0">{totalPct}%</span>
          </div>
          
          <div className="flex items-center justify-between sm:justify-end gap-2 border-t sm:border-t-0 sm:border-l-2 border-catalyst-border pt-3 sm:pt-0 sm:pl-4 w-full sm:w-auto">
            {isAddingTopic ? (
              <div className="flex items-center gap-2">
                <input 
                  type="text" 
                  value={newTopicName}
                  onChange={(e) => setNewTopicName(e.target.value)}
                  placeholder="Topic Name"
                  className="px-2 py-1 text-xs rounded border-2 border-catalyst-border outline-none w-28 sm:w-32"
                  autoFocus
                />
                <button onClick={handleAddTopic} className="text-xs font-bold text-catalyst-primary">Add</button>
                <button onClick={() => setIsAddingTopic(false)} className="text-xs font-bold text-catalyst-muted">Cancel</button>
              </div>
            ) : (
              <button onClick={() => setIsAddingTopic(true)} className="text-xs font-bold text-catalyst-accent hover:underline flex items-center gap-1">
                <Plus size={12} /> Add Topic
              </button>
            )}
            <div className="flex items-center gap-2 pl-2">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm(`Are you sure you want to delete the subject "${subject.name}"? This will delete all its topics and progress.`)) {
                    deleteSubject(subject.id);
                  }
                }}
                className="p-1 text-catalyst-muted hover:text-red-500 transition-colors cursor-pointer"
                title="Delete Subject"
              >
                <Trash2 size={15} />
              </button>
              <button onClick={() => setOpen(!open)} className="text-catalyst-muted">
                {open ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {open && (
        <div className="border-t border-catalyst-border">
          {(subject.topics || []).length === 0 ? (
            <div className="p-4 text-sm text-catalyst-muted text-center italic">No topics yet.</div>
          ) : (
            (subject.topics || []).map((topic, idx) => (
              <TopicRow key={topic.id} subjectId={subject.id} topic={topic} isLast={idx === (subject.topics || []).length - 1} />
            ))
          )}
        </div>
      )}
    </div>
  );
};

const TopicRow = ({ subjectId, topic, isLast }) => {
  const [open, setOpen] = useState(false);
  const { 
    updateSubtopicStatus, addSubtopic, deleteSubtopic, deleteTopic, updateTopicPrepStage, updateSubtopicPrepStage, updateTopicDetails, 
    notes, updateNote, shortNotes, updateShortNote, mistakes, updateMistake,
    revisions, logRevision 
  } = useAppContext();
  const [isAddingSubtopic, setIsAddingSubtopic] = useState(false);
  const [newSubtopicName, setNewSubtopicName] = useState('');
  const [activeTab, setActiveTab] = useState('subtopics'); // 'subtopics' | 'notes' | 'shortNotes' | 'mistakes' | 'revisions'
  const [expandedSubtopicId, setExpandedSubtopicId] = useState(null);

  const stageC = STAGE_COLORS[topic.stage] || STAGE_COLORS.Foundation;
  const noteContent = notes[topic.id] || '';
  const shortNoteContent = shortNotes[topic.id] || '';
  const mistakeContent = mistakes[topic.id] || '';
  const revisionData = revisions[topic.id] || { count: 0, nextRevision: null };

  const handleAddSubtopic = () => {
    if (!newSubtopicName.trim()) return;
    addSubtopic(subjectId, topic.id, {
      id: `st_${Date.now()}`,
      name: newSubtopicName,
      status: 'pending',
      completion: 0,
      prepStages: {
        theory: { done: false, resource: '' },
        videos: { done: false, resource: '' },
        notes: { done: false, resource: '' },
        practice: { done: false, resource: '' },
        notesRevision: { done: false, resource: '' },
        mockTest: { done: false, resource: '' },
        shortNotes: { done: false, resource: '' },
        completed: { done: false, resource: '' }
      }
    });
    setNewSubtopicName('');
    setIsAddingSubtopic(false);
  };

  const cycleConfidence = () => {
    const next = topic.confidence === 'Low' ? 'Medium' : topic.confidence === 'Medium' ? 'High' : 'Low';
    updateTopicDetails(subjectId, topic.id, { confidence: next });
  };

  const formatDays = (dateStr) => {
    if (!dateStr) return 'Not scheduled';
    const diff = new Date(dateStr) - new Date();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    if (days < 0) return 'Overdue';
    if (days === 0) return 'Today';
    if (days === 1) return 'Tomorrow';
    return `In ${days} days`;
  };

  return (
    <div className={`${isLast ? '' : 'border-b border-catalyst-border'}`}>
      {/* Main Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 sm:px-6 py-3.5 hover:bg-catalyst-bg transition-colors">
        <div className="flex items-center gap-2 flex-1 min-w-0 w-full">
          <button onClick={() => setOpen(!open)} className="text-catalyst-muted hover:text-catalyst-dark transition-colors shrink-0">
            {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>

          <span className="font-bold text-sm text-catalyst-dark truncate flex-1 min-w-0" title={topic.name}>{topic.name}</span>

          <button 
            onClick={(e) => {
              e.stopPropagation();
              if (window.confirm(`Are you sure you want to delete the topic "${topic.name}"? This will delete all its subtopics and progress.`)) {
                deleteTopic(subjectId, topic.id);
              }
            }}
            className="text-catalyst-muted hover:text-red-500 p-1 transition-colors cursor-pointer shrink-0 ml-1"
            title="Delete Topic"
          >
            <Trash2 size={14} />
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-between sm:justify-end gap-3 sm:gap-4 w-full sm:w-auto border-t sm:border-t-0 pt-2.5 sm:pt-0 border-catalyst-border/40 sm:border-none">
          {/* Confidence */}
          <button 
            onClick={cycleConfidence}
            className={`text-[10px] font-black px-2.5 py-1 rounded-full hover:opacity-80 transition-opacity shrink-0 ${CONFIDENCE[topic.confidence]}`}
          >
            {topic.confidence}
          </button>

          {/* Stage Pills */}
          <div className="flex items-center gap-1 shrink-0">
            {STAGES.map((s, idx) => {
              const currentIdx = STAGES.indexOf(topic.stage);
              const isPast = idx < currentIdx;
              const isCurrent = idx === currentIdx;
              return (
                <div key={s} title={s} className={`h-5 rounded-full text-[9px] font-black flex items-center justify-center transition-all ${
                  isCurrent ? `px-2.5 ${stageC.bg} ${stageC.text}` :
                  isPast ? 'w-5 bg-emerald-50' : 'w-5 bg-catalyst-bg'
                }`}>
                  {isCurrent ? s : isPast ? '✓' : ''}
                </div>
              );
            })}
          </div>

          {/* Progress */}
          <div className="flex items-center gap-2.5 w-28 sm:w-32 shrink-0">
            <div className="progress-bar flex-1">
              <div className="progress-fill" style={{ width: `${topic.completion || 0}%`, background: stageC.dot?.replace('bg-', '') === topic.stage ? '#10b981' : getColorFromStage(topic.stage) }}></div>
            </div>
            <span className="text-[11px] font-black text-catalyst-dark w-7 shrink-0">{topic.completion || 0}%</span>
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      {open && (
        <div className="bg-catalyst-bg border-t border-catalyst-border p-4">
          
          {/* Tabs */}
          <div className="flex items-center gap-5 mb-4 border-b border-catalyst-border pb-2 px-2 overflow-x-auto">
            <button 
              onClick={() => setActiveTab('subtopics')} 
              className={`text-xs font-bold shrink-0 ${activeTab === 'subtopics' ? 'text-catalyst-primary' : 'text-catalyst-muted hover:text-catalyst-dark'}`}
            >
              Prep Stage & Resources Tracker
            </button>
            <button 
              onClick={() => setActiveTab('notes')} 
              className={`text-xs font-bold shrink-0 flex items-center gap-1 ${activeTab === 'notes' ? 'text-catalyst-primary' : 'text-catalyst-muted hover:text-catalyst-dark'}`}
            >
              <BookOpen size={12} /> Notes
            </button>
            <button 
              onClick={() => setActiveTab('shortNotes')} 
              className={`text-xs font-bold shrink-0 flex items-center gap-1 ${activeTab === 'shortNotes' ? 'text-catalyst-primary' : 'text-catalyst-muted hover:text-catalyst-dark'}`}
            >
              <Sparkles size={12} className="text-amber-500" /> Easy-Go Formulas
            </button>
            <button 
              onClick={() => setActiveTab('mistakes')} 
              className={`text-xs font-bold shrink-0 flex items-center gap-1 ${activeTab === 'mistakes' ? 'text-catalyst-primary' : 'text-catalyst-muted hover:text-catalyst-dark'}`}
            >
              <AlertCircle size={12} className="text-red-500" /> Mistakes Log
            </button>
            <button 
              onClick={() => setActiveTab('revisions')} 
              className={`text-xs font-bold shrink-0 flex items-center gap-1 ${activeTab === 'revisions' ? 'text-catalyst-primary' : 'text-catalyst-muted hover:text-catalyst-dark'}`}
            >
              <Clock size={12} /> Revisions ({revisionData.count})
            </button>
          </div>

          {/* Prep Stage & Resources Tracker Tab */}
          {activeTab === 'subtopics' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-black text-catalyst-dark uppercase tracking-wider">
                    {(!topic.subtopics || topic.subtopics.length === 0) 
                      ? "Topic-Level Milestone Tracker" 
                      : "Subtopic Milestone Trackers"
                    }
                  </h4>
                  <p className="text-[10px] text-catalyst-muted font-semibold mt-0.5">
                    {(!topic.subtopics || topic.subtopics.length === 0)
                      ? "Track standard progress milestones for this entire topic"
                      : "Expand any subtopic below to manage its specific milestone checklists"
                    }
                  </p>
                </div>
                {!isAddingSubtopic && (
                  <button 
                    onClick={() => setIsAddingSubtopic(true)} 
                    className="text-xs font-bold text-catalyst-accent hover:underline flex items-center gap-1"
                  >
                    <Plus size={12} /> Add Subtopic
                  </button>
                )}
              </div>

              {isAddingSubtopic && (
                <div className="flex items-center gap-2 bg-white p-3 rounded-xl border border-catalyst-border shadow-sm">
                  <input 
                    type="text" 
                    value={newSubtopicName}
                    onChange={(e) => setNewSubtopicName(e.target.value)}
                    placeholder="Enter custom subtopic name (e.g. Friction, Case study)..."
                    className="px-3 py-1.5 text-xs rounded-lg border border-catalyst-border outline-none flex-1 focus:border-catalyst-primary font-semibold"
                    autoFocus
                  />
                  <button onClick={handleAddSubtopic} className="text-xs font-bold text-white bg-catalyst-primary px-3.5 py-1.5 rounded-lg hover:opacity-90">Add Subtopic</button>
                  <button onClick={() => setIsAddingSubtopic(false)} className="text-xs font-bold text-catalyst-muted">Cancel</button>
                </div>
              )}

              {(!topic.subtopics || topic.subtopics.length === 0) ? (
                <div className="space-y-3">
                  <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2 text-xs font-black text-catalyst-muted uppercase tracking-wider border-b border-catalyst-border">
                    <div className="col-span-1">Status</div>
                    <div className="col-span-2">Category</div>
                    <div className="col-span-4">Milestone Task</div>
                    <div className="col-span-5">Resource Options / Reference</div>
                  </div>
                  
                  <div className="space-y-2">
                    {PREP_STAGES.map(stage => {
                      const stageData = topic.prepStages?.[stage.key] || { done: false, resource: '' };
                      
                      return (
                        <div key={stage.key} className="flex flex-col md:grid md:grid-cols-12 md:items-center gap-2 md:gap-4 p-3 bg-white rounded-xl border border-catalyst-border shadow-sm hover:border-catalyst-primary/30 transition-colors">
                          {/* Checkbox */}
                          <div className="col-span-1 flex items-center">
                            <button
                              onClick={() => updateTopicPrepStage(subjectId, topic.id, stage.key, 'done', !stageData.done)}
                              className="flex items-center gap-2 select-none outline-none"
                            >
                              {stageData.done ? (
                                <CheckCircle2 size={17} className="text-emerald-500 fill-emerald-50" />
                              ) : (
                                <Circle size={17} className="text-catalyst-muted hover:text-catalyst-primary transition-colors" />
                              )}
                              <span className="md:hidden text-xs font-bold text-catalyst-muted uppercase">Mark Done</span>
                            </button>
                          </div>

                          {/* Category */}
                          <div className="col-span-2">
                            <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
                              stage.category === 'Foundation' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                              stage.category === 'Practice' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                              stage.category === 'Revision' ? 'bg-purple-50 text-purple-600 border border-purple-100' :
                              stage.category === 'Mock Test' ? 'bg-orange-50 text-orange-600 border border-orange-100' :
                              'bg-emerald-50 text-emerald-600 border border-emerald-100'
                            }`}>
                              {stage.category}
                            </span>
                          </div>

                          {/* Task Name */}
                          <div className="col-span-4 flex items-center gap-2">
                            <span className={`text-xs font-bold ${stageData.done ? 'text-catalyst-muted line-through' : 'text-catalyst-dark'}`}>
                              {stage.name}
                            </span>
                          </div>

                          {/* Resource Options */}
                          <div className="col-span-5">
                            <ResourceListTracker
                              value={stageData.resource || ''}
                              onChange={(val) => updateTopicPrepStage(subjectId, topic.id, stage.key, 'resource', val)}
                              placeholder="Add link/note..."
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {topic.subtopics.map(st => {
                    const isExpanded = expandedSubtopicId === st.id;
                    const doneCount = PREP_STAGES.filter(stage => st.prepStages?.[stage.key]?.done).length;
                    
                    return (
                      <div key={st.id} className="bg-white rounded-xl border border-catalyst-border overflow-hidden hover:border-catalyst-primary/20 transition-all shadow-sm">
                        {/* Subtopic Header */}
                        <div className="flex items-center justify-between p-4 hover:bg-catalyst-bg/40 transition-colors">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <button 
                              onClick={() => updateSubtopicStatus(subjectId, topic.id, st.id, st.status === 'done' ? 'pending' : 'done')}
                              className="shrink-0"
                              title={st.status === 'done' ? "Mark all milestones as incomplete" : "Mark all milestones as completed"}
                            >
                              {st.status === 'done'
                                ? <CheckCircle2 size={18} className="text-emerald-500 fill-emerald-50" />
                                : <Circle size={18} className="text-catalyst-muted hover:text-catalyst-primary transition-colors" />
                              }
                            </button>
                            
                            <button 
                              onClick={() => setExpandedSubtopicId(isExpanded ? null : st.id)}
                              className="flex-1 text-left min-w-0"
                            >
                              <span className={`text-sm font-bold block ${st.status === 'done' ? 'text-catalyst-muted line-through font-semibold' : 'text-catalyst-dark'}`}>
                                {st.name}
                              </span>
                              <span className="text-[10px] text-catalyst-muted font-semibold mt-0.5">
                                {doneCount} of 8 Milestones Complete ({st.completion || 0}%)
                              </span>
                            </button>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="w-24 bg-catalyst-border h-2 rounded-full overflow-hidden hidden sm:block">
                              <div className="bg-emerald-500 h-full transition-all" style={{ width: `${st.completion || 0}%` }}></div>
                            </div>
                            <button 
                              onClick={() => setExpandedSubtopicId(isExpanded ? null : st.id)}
                              className="text-catalyst-muted hover:text-catalyst-dark transition-colors p-1"
                              title="Toggle milestone checklist"
                            >
                              {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                            </button>
                            <button 
                              onClick={() => {
                                if (window.confirm(`Are you sure you want to delete the subtopic "${st.name}"?`)) {
                                  deleteSubtopic(subjectId, topic.id, st.id);
                                }
                              }}
                              className="text-xs text-red-500 hover:underline px-2 font-bold cursor-pointer"
                            >
                              Delete
                            </button>
                          </div>
                        </div>

                        {/* Expanded subtopic prep stage tracker */}
                        {isExpanded && (
                          <div className="bg-catalyst-bg/30 border-t border-catalyst-border p-4 space-y-3">
                            <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-1 text-[10px] font-black text-catalyst-muted uppercase tracking-wider">
                              <div className="col-span-1">Status</div>
                              <div className="col-span-2">Category</div>
                              <div className="col-span-4">Milestone Task</div>
                              <div className="col-span-5">Resource Options / Reference</div>
                            </div>

                            <div className="space-y-2">
                              {PREP_STAGES.map(stage => {
                                const stageData = st.prepStages?.[stage.key] || { done: false, resource: '' };
                                
                                return (
                                  <div key={stage.key} className="flex flex-col md:grid md:grid-cols-12 md:items-center gap-2 md:gap-4 p-3 bg-white rounded-xl border border-catalyst-border shadow-xs hover:border-catalyst-primary/20 transition-all">
                                    {/* Checkbox */}
                                    <div className="col-span-1 flex items-center">
                                      <button
                                        onClick={() => updateSubtopicPrepStage(subjectId, topic.id, st.id, stage.key, 'done', !stageData.done)}
                                        className="flex items-center gap-2 select-none outline-none"
                                      >
                                        {stageData.done ? (
                                          <CheckCircle2 size={16} className="text-emerald-500 fill-emerald-50" />
                                        ) : (
                                          <Circle size={16} className="text-catalyst-muted hover:text-catalyst-primary transition-colors" />
                                        )}
                                        <span className="md:hidden text-xs font-bold text-catalyst-muted uppercase">Mark Done</span>
                                      </button>
                                    </div>

                                    {/* Category */}
                                    <div className="col-span-2">
                                      <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
                                        stage.category === 'Foundation' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                                        stage.category === 'Practice' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                                        stage.category === 'Revision' ? 'bg-purple-50 text-purple-600 border border-purple-100' :
                                        stage.category === 'Mock Test' ? 'bg-orange-50 text-orange-600 border border-orange-100' :
                                        'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                      }`}>
                                        {stage.category}
                                      </span>
                                    </div>

                                    {/* Task Name */}
                                    <div className="col-span-4 flex items-center gap-2">
                                      <span className={`text-xs font-bold ${stageData.done ? 'text-catalyst-muted line-through' : 'text-catalyst-dark'}`}>
                                        {stage.name}
                                      </span>
                                    </div>

                                    {/* Resource Options */}
                                    <div className="col-span-5">
                                      <ResourceListTracker
                                        value={stageData.resource || ''}
                                        onChange={(val) => updateSubtopicPrepStage(subjectId, topic.id, st.id, stage.key, 'resource', val)}
                                        placeholder="Add link/note..."
                                      />
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Notes Tab */}
          {activeTab === 'notes' && (
            <div className="px-2">
              <textarea
                value={noteContent}
                onChange={(e) => updateNote(topic.id, e.target.value)}
                placeholder="Add your core study notes, theory references, or links here..."
                className="w-full h-32 p-3 text-sm font-medium text-catalyst-dark bg-white border border-catalyst-border rounded-xl focus:border-catalyst-primary focus:outline-none resize-none"
              ></textarea>
            </div>
          )}

          {/* Easy-Go Formulas Tab */}
          {activeTab === 'shortNotes' && (
            <div className="px-2 space-y-1.5">
              <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest">⚡ Formula / Easy-Go Sheet (Finishing Touches)</p>
              <textarea
                value={shortNoteContent}
                onChange={(e) => updateShortNote(topic.id, e.target.value)}
                placeholder="Equations, short definitions, constants, quick-recall facts..."
                className="w-full h-32 p-3 text-sm font-medium text-catalyst-dark bg-white border border-catalyst-border rounded-xl focus:border-catalyst-primary focus:outline-none resize-none"
              ></textarea>
            </div>
          )}

          {/* Mistakes Log Tab */}
          {activeTab === 'mistakes' && (
            <div className="px-2 space-y-1.5">
              <p className="text-[10px] font-black text-red-500 uppercase tracking-widest">⚠️ Mistakes & Traps Register (Final Review)</p>
              <textarea
                value={mistakeContent}
                onChange={(e) => updateMistake(topic.id, e.target.value)}
                placeholder="Log wrong assumptions, silly errors from mock tests, and traps to avoid..."
                className="w-full h-32 p-3 text-sm font-medium text-red-900 bg-red-50/20 border border-red-200 rounded-xl focus:border-red-500 focus:outline-none resize-none"
              ></textarea>
            </div>
          )}

          {/* Revisions Tab */}
          {activeTab === 'revisions' && (
            <div className="px-2 flex flex-col md:flex-row items-stretch md:items-start gap-4 md:gap-6">
              <div className="flex-1 bg-white p-4 rounded-xl border border-catalyst-border">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-sm font-black text-catalyst-dark">Spaced Repetition</h4>
                    <p className="text-xs font-medium text-catalyst-muted mt-0.5">Track revisions to solidify memory</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-catalyst-muted">Revision Count</p>
                    <p className="text-lg font-black text-catalyst-primary">{revisionData.count}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm font-semibold mb-4">
                  <span className="text-catalyst-dark">Next Due:</span>
                  <span className={`px-2 py-1 rounded text-xs font-bold ${formatDays(revisionData.nextRevision) === 'Overdue' ? 'bg-red-100 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                    {formatDays(revisionData.nextRevision)}
                  </span>
                </div>
                
                <button 
                  onClick={() => logRevision(topic.id)}
                  className="w-full btn-primary py-2 text-sm flex items-center justify-center gap-2"
                >
                  <CheckCircle2 size={16} />
                  Log Revision Today
                </button>
              </div>
              <div className="flex-1 p-4">
                <h4 className="text-xs font-bold text-catalyst-muted mb-3 uppercase tracking-wide">How it works</h4>
                <ul className="text-xs font-medium text-catalyst-dark space-y-2">
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div> 1st revision: Next day</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div> 2nd revision: In 3 days</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div> 3rd revision: In 7 days</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div> 4th revision: In 15 days</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div> 5th+ revision: Monthly</li>
                </ul>
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
};

function getColorFromStage(stage) {
  const map = {
    Foundation: '#3b82f6',
    Practice: '#f59e0b',
    Revision: '#8b5cf6',
    'Mock Test': '#f97316',
    Completed: '#10b981',
  };
  return map[stage] || '#10b981';
}

export default SyllabusTracker;
