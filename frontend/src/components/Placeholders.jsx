import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import { Award, BookOpen, Clock, Calendar, Save, Trash2, ShieldAlert, LineChart, Plus, Copy, Check, UploadCloud, RotateCcw, Sparkles } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

// ==========================================
// 1. REVISION PAGE
// ==========================================
export const RevisionPage = () => {
  const { syllabusData, revisions, logRevision } = useAppContext();

  // Gather all topics with their revision data
  const revisionTopics = [];
  syllabusData.forEach(subject => {
    (subject.topics || []).forEach(topic => {
      const rev = revisions[topic.id];
      if (rev) {
        revisionTopics.push({
          ...topic,
          subjectName: subject.name,
          ...rev
        });
      }
    });
  });

  // Sort: Overdue first, then upcoming
  const sortedTopics = [...revisionTopics].sort((a, b) => new Date(a.nextRevision) - new Date(b.nextRevision));

  const isOverdue = (dateStr) => new Date(dateStr) < new Date();

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-black text-catalyst-dark flex items-center gap-2">
          <Clock className="text-amber-500" />
          Spaced Repetition Scheduler
        </h2>
        <p className="text-catalyst-muted text-sm font-medium">Keep track of items due for revision to move them to permanent memory.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-4 bg-red-50 border-red-200">
          <p className="text-xs font-bold text-red-600 uppercase tracking-wider">Overdue Revisions</p>
          <p className="text-3xl font-black text-red-800">{sortedTopics.filter(t => isOverdue(t.nextRevision)).length}</p>
        </div>
        <div className="card p-4 bg-blue-50 border-blue-200">
          <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">Total Scheduled Revisions</p>
          <p className="text-3xl font-black text-blue-800">{sortedTopics.length}</p>
        </div>
        <div className="card p-4 bg-emerald-50 border-emerald-200">
          <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Completed Sessions</p>
          <p className="text-3xl font-black text-emerald-800">
            {sortedTopics.reduce((acc, curr) => acc + (curr.count || 0), 0)}
          </p>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-bold text-catalyst-dark mb-4">Revision Queue</h3>
        {sortedTopics.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-sm font-medium text-catalyst-muted">No revision sessions scheduled yet. Make sure to complete syllabus topics first!</p>
          </div>
        ) : (
          <div className="divide-y divide-catalyst-border">
            {sortedTopics.map(topic => {
              const overdue = isOverdue(topic.nextRevision);
              return (
                <div key={topic.id} className="py-4 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-catalyst-primary uppercase bg-catalyst-primary/10 px-2 py-0.5 rounded-full mr-2">
                      {topic.subjectName}
                    </span>
                    <h4 className="text-sm font-bold text-catalyst-dark inline-block">{topic.name}</h4>
                    <div className="flex gap-4 mt-1 text-xs text-catalyst-muted font-medium">
                      <span>Revision Count: {topic.count}</span>
                      <span>Next Due: {new Date(topic.nextRevision).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {overdue && (
                      <span className="badge-red text-[10px] font-bold uppercase tracking-wider">Overdue</span>
                    )}
                    <button 
                      onClick={() => logRevision(topic.id)}
                      className="btn-primary py-1.5 px-4 text-xs"
                    >
                      Log Session
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

// ==========================================
// 2. ANALYTICS PAGE
// ==========================================
export const AnalyticsPage = () => {
  const { mockTests, setMockTests } = useAppContext();
  const [mockName, setMockName] = useState('');
  const [mockScore, setMockScore] = useState('');
  const [mockDate, setMockDate] = useState('');

  const handleAddMock = (e) => {
    e.preventDefault();
    if (!mockName || !mockScore) return;
    const test = {
      name: mockName,
      score: parseInt(mockScore),
      date: mockDate || new Date().toISOString().split('T')[0]
    };
    const updated = [...mockTests, test];
    setMockTests(updated);
    setMockName('');
    setMockScore('');
    setMockDate('');
  };

  const avgScore = mockTests.length ? Math.round(mockTests.reduce((acc, curr) => acc + curr.score, 0) / mockTests.length) : 0;
  const highestScore = mockTests.length ? Math.max(...mockTests.map(t => t.score)) : 0;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-black text-catalyst-dark flex items-center gap-2">
          <LineChart className="text-catalyst-primary" />
          Mock Analytics
        </h2>
        <p className="text-catalyst-muted text-sm font-medium">Analyze score patterns to identify performance bottlenecks.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Input Card */}
        <div className="card p-5 h-fit">
          <h3 className="text-sm font-black text-catalyst-dark uppercase tracking-wider mb-4">Add Mock Test</h3>
          <form onSubmit={handleAddMock} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-catalyst-dark mb-1">Test Name</label>
              <input 
                type="text" 
                placeholder="e.g. Mock Test 12" 
                value={mockName} 
                onChange={(e) => setMockName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-catalyst-border focus:outline-none focus:border-catalyst-primary text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-catalyst-dark mb-1">Score Obtained</label>
              <input 
                type="number" 
                placeholder="e.g. 135" 
                value={mockScore} 
                onChange={(e) => setMockScore(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-catalyst-border focus:outline-none focus:border-catalyst-primary text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-catalyst-dark mb-1">Date Attempted</label>
              <input 
                type="date" 
                value={mockDate} 
                onChange={(e) => setMockDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-catalyst-border focus:outline-none focus:border-catalyst-primary text-sm"
              />
            </div>
            <button type="submit" className="w-full btn-primary py-2 text-sm flex items-center justify-center gap-1">
              <Plus size={16} /> Save Score
            </button>
          </form>
        </div>

        {/* Analytics Card */}
        <div className="card p-5 md:col-span-2 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-black text-catalyst-dark uppercase tracking-wider mb-4">Performance Curve</h3>
            <div className="w-full h-64">
              {mockTests.length === 0 ? (
                <div className="flex items-center justify-center h-full text-catalyst-muted text-sm">
                  Add mock test scores on the left to generate the visual report.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mockTests}>
                    <defs>
                      <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip />
                    <Area type="monotone" dataKey="score" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#scoreGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-catalyst-border">
            <div className="text-center">
              <p className="text-xs font-bold text-catalyst-muted uppercase">Average Score</p>
              <p className="text-2xl font-black text-catalyst-dark">{avgScore}</p>
            </div>
            <div className="text-center">
              <p className="text-xs font-bold text-catalyst-muted uppercase">Highest Score</p>
              <p className="text-2xl font-black text-catalyst-dark">{highestScore}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 3. PREVIOUS YEAR QUESTIONS (PYQ) & ANALYSIS PAGE
// ==========================================
const examTrends = {
  'UPPSC PCS': {
    overview: "In UPPSC PCS, the General Studies papers shifted closer to the UPSC pattern, especially in GS-V and GS-VI which are now completely dedicated to Uttar Pradesh static and current GK. Conceptual clarity, multi-statement questions, and specific UP-centric demographic data are now highly prioritized.",
    trends: [
      {
        subject: "GS-I & II (History, Society, Polity)",
        trend: "Heavy focus on chronicling local UP freedom fighters and pre-1857 uprisings. Polity continues to emphasize articles of the Constitution, Panchayati Raj systems, and governor/state judiciary powers.",
        yield: "High Yield"
      },
      {
        subject: "GS-V & VI (Uttar Pradesh Special)",
        trend: "Dedicated papers for UP geographical location, demography, budgets, One District One Product (ODOP) policies, tourism, and environmental issues of UP. This makes UP-specific current affairs extremely high yield.",
        yield: "Critical Yield"
      },
      {
        subject: "GS-III & IV (Economy, Security, Ethics)",
        trend: "Security challenges in border areas, cyber-security rules, and environmental impact assessments. Ethics features standard definitions paired with UP administrative case studies.",
        yield: "Medium-High Yield"
      }
    ],
    highYieldAreas: [
      "Uttar Pradesh Special GS-V & VI (ODOP, Demography)",
      "Panchayati Raj & Local Self Government of UP",
      "UP Soil, Water, Air, Forests and National Parks",
      "Bilateral Agreements & Bilateral relations of India",
      "Agriculture and Land Reforms in UP"
    ]
  },
  'UPSC CSE': {
    overview: "Over recent years, UPSC CSE Prelims has undergone major shifts. The most prominent change is the introduction and dominant use of pairing options ('Only one pair', 'Only two pairs'), which has effectively eliminated traditional elimination techniques, making deep conceptual clarity mandatory.",
    trends: [
      {
        subject: "Polity & Governance",
        trend: "Questions shifted from rote memorization of articles to constitutional philosophy and application. Questions on 'Due Process of Law' vs 'Procedure Established by Law' and the precise powers of the President/Governor are prominent.",
        yield: "High Yield"
      },
      {
        subject: "Environment & Ecology",
        trend: "Heavy emphasis on specific wildlife species' behaviors (e.g., nocturnal animals, filter feeders) and geographic mappings of wetlands, national parks, and biosphere reserves. High density of questions in recent years.",
        yield: "Critical Yield"
      },
      {
        subject: "Economy",
        trend: "Focus on capital markets, bond yields, public tech infrastructure (DPI), banking regulations, and global trade dynamics. Standard definitions are rarely asked; questions check real-world monetary policy impacts.",
        yield: "High Yield"
      },
      {
        subject: "Science & Technology",
        trend: "Questions focused heavily on emerging tech like AI/Large Language Models, Space missions (Aditya-L1, Chandrayaan-3), CRISPR gene editing, and green hydrogen technologies.",
        yield: "Medium-High Yield"
      },
      {
        subject: "History & Art & Culture",
        trend: "Timeline-specific chronological arrangements of medieval dynasties (e.g. Kakatiya, Hoysala) and direct links between archaeological sites and modern river basins.",
        yield: "Medium Yield"
      }
    ],
    highYieldAreas: [
      "Wetlands & Wildlife Sanctuary Mappings",
      "Constitutional Amendments & Judicial Interpretations",
      "RBI Monetary Policy Instruments & Bond Yields",
      "Modern History Timeline (1915 - 1947)",
      "Emerging Tech (AI, Quantum, Biotech)"
    ]
  },
  'IIT JEE': {
    overview: "In recent years, JEE Main and Advanced showed a steady rise in calculation-intensive multi-concept questions. Scoring requires speed in the MCQ section and extreme precision in numerical/integer-type questions.",
    trends: [
      {
        subject: "Physics",
        trend: "Mechanics and Electrodynamics continue to dominate (40%+ of questions). Modern Physics (Dual nature, Semiconductors) remains the highest scoring block with high-yield, formula-direct questions in almost every shift.",
        yield: "High Yield"
      },
      {
        subject: "Mathematics",
        trend: "Considered the toughest section in recent years. Vector & 3D Geometry has the highest yield (4-5 questions per shift), followed by Definite Integration, Coordinate Geometry, and Probability. Speed and algebraic manipulation are key.",
        yield: "Critical Yield"
      },
      {
        subject: "Chemistry",
        trend: "Organic Chemistry mechanisms (Named reactions like Aldol, Cannizzaro) were heavily queried. Physical Chemistry was mostly pushed to integer-type numericals (Thermodynamics, Electrochemistry). Inorganic blocks centered on coordination compounds.",
        yield: "High Yield"
      }
    ],
    highYieldAreas: [
      "Vector & 3D Geometry (Lines & Planes)",
      "Modern Physics & Semiconductor Logic Gates",
      "Coordination Compounds & Bonding",
      "Organic Named Reactions & Mechanisms",
      "Electrochemistry & Thermodynamics Numericals"
    ]
  },
  'SSC CGL': {
    overview: "The pattern over recent years shows an increase in advanced math concepts in the Quantitative Aptitude section and a heavier reliance on static GK history and article-based polity in General Awareness.",
    trends: [
      {
        subject: "Quantitative Aptitude",
        trend: "Algebra, Geometry, Trigonometry, and Mensuration comprised 40-45% of the math section. Arithmetic questions were straightforward but required rapid calculation speeds (e.g. compound interest cycles).",
        yield: "High Yield"
      },
      {
        subject: "General Awareness",
        trend: "Heavy emphasis on static GK (classical dances of India, music instruments and their maestros, battle timelines) and fundamental articles of the Constitution. Current affairs focused on sports awards and new government schemes.",
        yield: "Critical Yield"
      },
      {
        subject: "English Comprehension",
        trend: "Reading comprehension and PQRS paragraph jumbles dominated the Tier-2 weightage. Synonyms/Antonyms and spotting errors followed predictable historical CGL patterns.",
        yield: "Medium-High Yield"
      }
    ],
    highYieldAreas: [
      "Trigonometry & Geometry Theorems",
      "Constitutional Articles & Fundamental Rights",
      "Classical Art Forms & Cultural Honors",
      "Active/Passive & Narrative Direct/Indirect Voice",
      "Cloze Test & Paragraph Jumble Sequences"
    ]
  },
  'GATE': {
    overview: "Recent GATE papers have shown a significant rise in MSQ (Multiple Select Questions) and NAT (Numerical Answer Type) types, which penalize partial knowledge and test rigorous boundary conditions.",
    trends: [
      {
        subject: "General Aptitude & Mathematics",
        trend: "Compulsory scoring zones. Linear Algebra (Eigenvalues/systems) and Calculus (theorems, integration limits) along with Probability distributions constituted 15% of the total score.",
        yield: "Critical Yield"
      },
      {
        subject: "Technical Core Concepts",
        trend: "MSQs were focused on core operating system scheduling, data structures, and computer network protocols. NATs tested exact formula applications (e.g., pipeline execution cycles, database queries).",
        yield: "High Yield"
      }
    ],
    highYieldAreas: [
      "Linear Algebra Eigenvalues & Eigenvectors",
      "Operating Systems Process Scheduling & Deadlock",
      "Data Structures & Algorithm Complexity (Big O)",
      "Database SQL Queries & Normalization (3NF/BCNF)",
      "Computer Networks TCP/IP Headers & Subnetting"
    ]
  }
};

export const NotesPage = () => {
  const { 
    notes, updateNote, shortNotes, updateShortNote, mistakes, updateMistake, syllabusData, selectedExam,
    pyqPapers, setPyqPapers, pyqProgress, setPyqProgress, pyqCovered: coveredNotes, setPyqCovered: setCoveredNotes
  } = useAppContext();
  const [activeSubTab, setActiveSubTab] = useState('papers'); // 'papers', 'weightage', 'trends', 'mistakes'
  const [searchTerm, setSearchTerm] = useState('');
  const [editingTopicId, setEditingTopicId] = useState(null);
  const [editVal, setEditVal] = useState('');

  const exam = selectedExam || 'UPSC CSE';

  const activeTrendData = useMemo(() => {
    const examLower = exam.toLowerCase();
    if (examLower.includes('uppsc') || examLower.includes('pcs')) return examTrends['UPPSC PCS'];
    if (examLower.includes('upsc')) return examTrends['UPSC CSE'];
    if (examLower.includes('jee') || examLower.includes('neet')) return examTrends['IIT JEE'];
    if (examLower.includes('cgl')) return examTrends['SSC CGL'];
    if (examLower.includes('gate')) return examTrends['GATE'];
    return examTrends['UPSC CSE']; // Default fallback
  }, [exam]);

  // 1. Generate Past Year Papers list based on active exam
  const getDefaultPapers = (examName) => {
    return [
      { id: `${examName}_2024`, year: 2024, name: `${examName} Previous Year Paper - I`, maxMarks: 200 },
      { id: `${examName}_2023`, year: 2023, name: `${examName} Previous Year Paper - I`, maxMarks: 200 },
      { id: `${examName}_2022`, year: 2022, name: `${examName} Previous Year Paper - I`, maxMarks: 200 },
      { id: `${examName}_2021`, year: 2021, name: `${examName} Previous Year Paper - I`, maxMarks: 200 },
      { id: `${examName}_2020`, year: 2020, name: `${examName} Previous Year Paper - I`, maxMarks: 200 },
    ];
  };

  // Keep papers list initialized if empty
  useEffect(() => {
    if (exam && (!pyqPapers || pyqPapers.length === 0)) {
      setPyqPapers(getDefaultPapers(exam));
    }
  }, [exam, pyqPapers, setPyqPapers]);

  const [isAddingPaper, setIsAddingPaper] = useState(false);
  const [newPaperYear, setNewPaperYear] = useState('');
  const [newPaperName, setNewPaperName] = useState('');
  const [newPaperMaxMarks, setNewPaperMaxMarks] = useState('200');

  const handleAddPaper = () => {
    const yearNum = parseInt(newPaperYear);
    const marksNum = parseInt(newPaperMaxMarks);
    if (!newPaperName.trim() || !yearNum || !marksNum) {
      alert("Please fill all fields with valid information.");
      return;
    }
    
    const newId = `pyq_${exam}_${Date.now()}`;
    const newPaper = {
      id: newId,
      year: yearNum,
      name: newPaperName.trim(),
      maxMarks: marksNum
    };
    
    const updatedPapers = [...(pyqPapers || []), newPaper].sort((a, b) => b.year - a.year);
    setPyqPapers(updatedPapers);
    
    // Reset form states
    setIsAddingPaper(false);
    setNewPaperName('');
    setNewPaperYear('');
    setNewPaperMaxMarks('200');
  };

  const handleRemovePaper = (id, name) => {
    if (window.confirm(`Are you sure you want to delete the PYQ paper "${name}"? All associated attempt progress and scores will be permanently deleted.`)) {
      const updatedPapers = (pyqPapers || []).filter(p => p.id !== id);
      setPyqPapers(updatedPapers);
      
      // Clean up progress from pyqProgress
      const updatedProgress = { ...(pyqProgress || {}) };
      delete updatedProgress[id];
      savePyqProgress(updatedProgress);
    }
  };

  const savePyqProgress = (updated) => {
    setPyqProgress(updated);
  };

  // State and Helpers for Mistakes & Important Points addition directly from PYQ page
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [newNoteType, setNewNoteType] = useState('mistakes'); // 'mistakes' | 'formulas' | 'general'
  const [newNoteTopicId, setNewNoteTopicId] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');

  const allSyllabusTopics = useMemo(() => {
    const list = [];
    syllabusData.forEach(sub => {
      if (sub.topics) {
        sub.topics.forEach(topic => {
          list.push({
            id: topic.id,
            name: topic.name,
            subjectName: sub.name
          });
        });
      }
    });
    return list;
  }, [syllabusData]);

  const handleAddNote = () => {
    if (!newNoteTopicId || !newNoteContent.trim()) {
      alert("Please select a topic and enter content.");
      return;
    }

    if (newNoteType === 'general') {
      updateNote(newNoteTopicId, newNoteContent.trim());
    } else if (newNoteType === 'formulas') {
      updateShortNote(newNoteTopicId, newNoteContent.trim());
    } else if (newNoteType === 'mistakes') {
      updateMistake(newNoteTopicId, newNoteContent.trim());
    }

    setIsAddingNote(false);
    setNewNoteContent('');
    setActiveNotesTab(newNoteType);
  };

  const handleDeleteNote = (topicId, type, topicName) => {
    const displayType = type === 'general' ? 'General Note' : type === 'formulas' ? 'Formula' : 'Mistakes';
    if (window.confirm(`Are you sure you want to delete the ${displayType} entry for "${topicName}"?`)) {
      if (type === 'general') updateNote(topicId, '');
      else if (type === 'formulas') updateShortNote(topicId, '');
      else if (type === 'mistakes') updateMistake(topicId, '');
      
      // Also clear covered status if deleted
      const key = `${topicId}_${type}`;
      if (coveredNotes[key]) {
        const updatedCovered = { ...(coveredNotes || {}) };
        delete updatedCovered[key];
        setCoveredNotes(updatedCovered);
      }
    }
  };

  const handleToggleCovered = (topicId, type) => {
    const key = `${topicId}_${type}`;
    const updated = {
      ...(coveredNotes || {}),
      [key]: !coveredNotes[key]
    };
    setCoveredNotes(updated);
  };

  const handleStatusChange = (id, status) => {
    const updated = {
      ...pyqProgress,
      [id]: {
        ...pyqProgress[id],
        status
      }
    };
    savePyqProgress(updated);
  };

  const handleScoreChange = (id, scoreVal) => {
    const score = parseInt(scoreVal) || 0;
    const updated = {
      ...pyqProgress,
      [id]: {
        ...pyqProgress[id],
        score
      }
    };
    savePyqProgress(updated);
  };

  const toggleChecklist = (id, field) => {
    const current = pyqProgress[id]?.[field] || false;
    const updated = {
      ...pyqProgress,
      [id]: {
        ...pyqProgress[id],
        [field]: !current
      }
    };
    savePyqProgress(updated);
  };

  // Calculating stats
  const safePapers = pyqPapers || [];
  const safeProgress = pyqProgress || {};
  const totalPapers = safePapers.length;
  const completedPapers = safePapers.filter(p => safeProgress[p.id]?.status === 'Completed').length;
  const inProgressPapers = safePapers.filter(p => safeProgress[p.id]?.status === 'Attempting').length;

  const scoredPapers = safePapers.filter(p => safeProgress[p.id]?.score > 0);
  const avgScore = scoredPapers.length > 0 
    ? Math.round(scoredPapers.reduce((acc, p) => acc + (safeProgress[p.id]?.score || 0), 0) / scoredPapers.length) 
    : 0;

  const totalChecks = safePapers.reduce((acc, p) => {
    const progress = safeProgress[p.id] || {};
    let count = 0;
    if (progress.checkedMistakes) count++;
    if (progress.savedTraps) count++;
    if (progress.revisedTwice) count++;
    return acc + count;
  }, 0);
  const maxChecks = totalPapers * 3;
  const checkRate = maxChecks > 0 ? Math.round((totalChecks / maxChecks) * 100) : 0;

  // 2. Generate weightage data based on exam type
  const weightageData = useMemo(() => {
    return syllabusData.map((sub, idx) => {
      let qCount = 15;
      let priority = "Medium Yield";
      let colorClass = "text-amber-700 bg-amber-50 border-amber-200";

      const subName = sub.name.toLowerCase();
      if (exam.includes('UPSC') || exam.includes('UPPSC')) {
        if (subName.includes('gs-v') || subName.includes('gs-vi') || subName.includes('uttar pradesh')) {
          qCount = 20;
          priority = "Critical";
          colorClass = "text-rose-700 bg-rose-50 border-rose-200";
        } else if (subName.includes('history') || subName.includes('culture') || subName.includes('gs-i')) {
          qCount = 18;
          priority = "High Yield";
          colorClass = "text-emerald-700 bg-emerald-50 border-emerald-200";
        } else if (subName.includes('polity') || subName.includes('gs-ii')) {
          qCount = 16;
          priority = "High Yield";
          colorClass = "text-emerald-700 bg-emerald-50 border-emerald-200";
        } else if (subName.includes('economy') || subName.includes('gs-iii')) {
          qCount = 17;
          priority = "High Yield";
          colorClass = "text-emerald-700 bg-emerald-50 border-emerald-200";
        } else if (subName.includes('environment') || subName.includes('gs-iv')) {
          qCount = 15;
          priority = "High Yield";
          colorClass = "text-emerald-700 bg-emerald-50 border-emerald-200";
        }
      } else if (exam.includes('JEE') || exam.includes('NEET')) {
        if (subName.includes('physics')) {
          qCount = 30;
          priority = "High Yield";
          colorClass = "text-emerald-700 bg-emerald-50 border-emerald-200";
        } else if (subName.includes('chemistry')) {
          qCount = 30;
          priority = "High Yield";
          colorClass = "text-emerald-700 bg-emerald-50 border-emerald-200";
        } else if (subName.includes('math') || subName.includes('biology')) {
          qCount = 60;
          priority = "Critical";
          colorClass = "text-rose-700 bg-rose-50 border-rose-200";
        }
      }
      return {
        id: sub.id,
        name: sub.name,
        avgQuestions: qCount,
        priority,
        colorClass
      };
    });
  }, [syllabusData, exam]);

  // 3. Compile saved notes, formulas, and mistakes so no data is lost
  const [activeNotesTab, setActiveNotesTab] = useState('mistakes'); // default to mistakes first
  const notesList = useMemo(() => {
    const list = [];
    syllabusData.forEach(subject => {
      (subject.topics || []).forEach(topic => {
        let text = '';
        if (activeNotesTab === 'general') text = notes[topic.id] || '';
        else if (activeNotesTab === 'formulas') text = shortNotes[topic.id] || '';
        else if (activeNotesTab === 'mistakes') text = mistakes[topic.id] || '';

        if (text) {
          list.push({
            topicId: topic.id,
            topicName: topic.name,
            subjectName: subject.name,
            text
          });
        }
      });
    });
    return list;
  }, [syllabusData, notes, shortNotes, mistakes, activeNotesTab]);

  const filteredNotes = notesList.filter(n => 
    n.topicName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    n.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startEdit = (noteObj) => {
    setEditingTopicId(noteObj.topicId);
    setEditVal(noteObj.text);
  };

  const saveEdit = () => {
    if (activeNotesTab === 'general') updateNote(editingTopicId, editVal);
    else if (activeNotesTab === 'formulas') updateShortNote(editingTopicId, editVal);
    else if (activeNotesTab === 'mistakes') updateMistake(editingTopicId, editVal);
    setEditingTopicId(null);
  };

  const getTabTitle = () => {
    if (activeNotesTab === 'general') return 'General Study Notes';
    if (activeNotesTab === 'formulas') return 'Easy-Go Formulas';
    return 'Mistakes & Trap Questions';
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* Title Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-catalyst-dark flex items-center gap-2">
            <BookOpen className="text-indigo-500" />
            Previous Year Questions (PYQs) & Analysis
          </h2>
          <p className="text-catalyst-muted text-sm font-medium">
            Analyze, attempt, and revise past exam papers. Tracking and logging your PYQ mistakes is the ultimate success accelerator.
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="card p-4 bg-indigo-50/50 border-indigo-100">
          <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Attempted Papers</p>
          <div className="flex items-baseline gap-2 mt-1">
            <p className="text-3xl font-black text-indigo-900">{completedPapers}</p>
            <p className="text-xs text-indigo-500 font-bold">of {totalPapers} completed ({inProgressPapers} in progress)</p>
          </div>
        </div>

        <div className="card p-4 bg-emerald-50/50 border-emerald-100">
          <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Average PYQ Score</p>
          <div className="flex items-baseline gap-2 mt-1">
            <p className="text-3xl font-black text-emerald-900">{avgScore || '--'}</p>
            <p className="text-xs text-emerald-500 font-bold">marks average (out of 200)</p>
          </div>
        </div>

        <div className="card p-4 bg-amber-50/50 border-amber-100">
          <p className="text-xs font-bold text-amber-600 uppercase tracking-wider">Analysis checklist rate</p>
          <div className="flex items-baseline gap-2 mt-1">
            <p className="text-3xl font-black text-amber-900">{checkRate}%</p>
            <p className="text-xs text-amber-500 font-bold">mistake logging & revision completed</p>
          </div>
        </div>
      </div>

      {/* Sub Tabs Toggle Row */}
      <div className="flex items-center gap-2 border-b border-catalyst-border pb-1">
        <button 
          onClick={() => setActiveSubTab('papers')}
          className={`px-4 py-2 text-xs font-black rounded-lg transition-colors ${activeSubTab === 'papers' ? 'bg-indigo-50 text-indigo-600 border border-indigo-200' : 'text-catalyst-muted hover:text-catalyst-dark'}`}
        >
          Past Year Papers
        </button>
        <button 
          onClick={() => setActiveSubTab('weightage')}
          className={`px-4 py-2 text-xs font-black rounded-lg transition-colors ${activeSubTab === 'weightage' ? 'bg-indigo-50 text-indigo-600 border border-indigo-200' : 'text-catalyst-muted hover:text-catalyst-dark'}`}
        >
          Subject Weightage Analysis
        </button>
        <button 
          onClick={() => setActiveSubTab('trends')}
          className={`px-4 py-2 text-xs font-black rounded-lg transition-colors ${activeSubTab === 'trends' ? 'bg-indigo-50 text-indigo-600 border border-indigo-200' : 'text-catalyst-muted hover:text-catalyst-dark'}`}
        >
          PYQ Trends Analysis
        </button>
        <button 
          onClick={() => setActiveSubTab('mistakes')}
          className={`px-4 py-2 text-xs font-black rounded-lg transition-colors ${activeSubTab === 'mistakes' ? 'bg-indigo-50 text-indigo-600 border border-indigo-200' : 'text-catalyst-muted hover:text-catalyst-dark'}`}
        >
          Mistakes & Important Points
        </button>
      </div>

      {/* Main Tab Rendering */}
      {activeSubTab === 'papers' && (
        <div className="space-y-4">
          <div className="card p-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 pb-2 border-b border-catalyst-border/40">
              <h3 className="text-sm font-black text-catalyst-dark uppercase tracking-wider">Past Years Paper</h3>
              
              {!isAddingPaper && (
                <button
                  onClick={() => {
                    setIsAddingPaper(true);
                    setNewPaperName(`${exam} Previous Year Paper`);
                    setNewPaperYear(new Date().getFullYear().toString());
                    setNewPaperMaxMarks('200');
                  }}
                  className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border border-indigo-200 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Plus size={12} /> Add Past Paper
                </button>
              )}
            </div>

            {isAddingPaper && (
              <div className="bg-catalyst-bg/50 border border-catalyst-border/60 rounded-xl p-4 mb-5 space-y-3">
                <h4 className="text-xs font-black text-catalyst-dark uppercase tracking-wider">Add Custom PYQ Paper</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-catalyst-muted mb-1">Paper Year</label>
                    <input
                      type="number"
                      placeholder="e.g. 2025"
                      value={newPaperYear}
                      onChange={(e) => setNewPaperYear(e.target.value)}
                      className="w-full bg-white border border-catalyst-border rounded-lg text-xs py-1.5 px-3 font-semibold outline-none text-catalyst-dark focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-catalyst-muted mb-1">Paper Name</label>
                    <input
                      type="text"
                      placeholder="e.g. GS Paper - II"
                      value={newPaperName}
                      onChange={(e) => setNewPaperName(e.target.value)}
                      className="w-full bg-white border border-catalyst-border rounded-lg text-xs py-1.5 px-3 font-semibold outline-none text-catalyst-dark focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-catalyst-muted mb-1">Max Marks</label>
                    <input
                      type="number"
                      placeholder="e.g. 200"
                      value={newPaperMaxMarks}
                      onChange={(e) => setNewPaperMaxMarks(e.target.value)}
                      className="w-full bg-white border border-catalyst-border rounded-lg text-xs py-1.5 px-3 font-semibold outline-none text-catalyst-dark focus:border-indigo-500"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    onClick={() => setIsAddingPaper(false)}
                    className="px-3 py-1.5 border border-catalyst-border hover:bg-catalyst-bg rounded-lg text-xs font-bold text-catalyst-muted transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddPaper}
                    className="px-4 py-1.5 bg-catalyst-primary hover:bg-catalyst-primary/95 text-white rounded-lg text-xs font-bold shadow-md transition-all cursor-pointer"
                  >
                    Save Paper
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-4 divide-y divide-catalyst-border">
              {pyqPapers.length === 0 ? (
                <div className="text-center py-10 bg-catalyst-bg/20 rounded-2xl border border-catalyst-border/60">
                  <p className="text-catalyst-muted text-xs font-bold">No PYQ papers added yet. Start by adding one!</p>
                </div>
              ) : (
                pyqPapers.map((paper) => {
                  const currentStatus = pyqProgress[paper.id]?.status || 'Not Started';
                  const currentScore = pyqProgress[paper.id]?.score || '';
                  const progress = pyqProgress[paper.id] || {};

                  return (
                    <div key={paper.id} className="pt-4 first:pt-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="badge-purple font-black text-[9px] uppercase">{paper.year}</span>
                          <h4 className="text-sm font-bold text-catalyst-dark">{paper.name}</h4>
                        </div>
                        <p className="text-[11px] text-catalyst-muted font-medium">Max marks: {paper.maxMarks}</p>
                      </div>

                      <div className="flex flex-wrap items-center gap-4">
                        {/* Attempt Status */}
                        <div>
                          <label className="block text-[10px] font-bold text-catalyst-muted mb-0.5">Attempt Status</label>
                          <select 
                            value={currentStatus}
                            onChange={(e) => handleStatusChange(paper.id, e.target.value)}
                            className="bg-white border border-catalyst-border rounded-lg text-xs py-1 px-2.5 font-bold outline-none text-catalyst-dark focus:border-indigo-500"
                          >
                            <option value="Not Started">Not Started</option>
                            <option value="Attempting">Attempting</option>
                            <option value="Completed">Completed & Evaluated</option>
                          </select>
                        </div>

                        {/* Score Obtained */}
                        <div>
                          <label className="block text-[10px] font-bold text-catalyst-muted mb-0.5">Score</label>
                          <input 
                            type="number" 
                            placeholder="Marks"
                            value={currentScore}
                            onChange={(e) => handleScoreChange(paper.id, e.target.value)}
                            className="w-20 bg-white border border-catalyst-border rounded-lg text-xs py-1 px-2.5 font-bold outline-none text-catalyst-dark focus:border-indigo-500"
                          />
                        </div>

                        {/* Micro Checklist */}
                        <div className="flex gap-3 bg-catalyst-bg/40 border border-catalyst-border/60 rounded-xl px-3 py-1.5 mt-1">
                          <label className="flex items-center gap-1.5 text-[10px] font-bold text-catalyst-dark cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={!!progress.checkedMistakes}
                              onChange={() => toggleChecklist(paper.id, 'checkedMistakes')}
                              className="rounded border-catalyst-border text-indigo-600 focus:ring-0 cursor-pointer"
                            />
                            Checked Mistakes
                          </label>
                          <label className="flex items-center gap-1.5 text-[10px] font-bold text-catalyst-dark cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={!!progress.savedTraps}
                              onChange={() => toggleChecklist(paper.id, 'savedTraps')}
                              className="rounded border-catalyst-border text-indigo-600 focus:ring-0 cursor-pointer"
                            />
                            Logged Traps
                          </label>
                          <label className="flex items-center gap-1.5 text-[10px] font-bold text-catalyst-dark cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={!!progress.revisedTwice}
                              onChange={() => toggleChecklist(paper.id, 'revisedTwice')}
                              className="rounded border-catalyst-border text-indigo-600 focus:ring-0 cursor-pointer"
                            />
                            Revised twice
                          </label>
                        </div>

                        {/* Delete Button */}
                        <button 
                          onClick={() => handleRemovePaper(paper.id, paper.name)}
                          className="text-catalyst-muted hover:text-red-500 p-1.5 transition-colors cursor-pointer border border-catalyst-border/40 hover:border-red-200 rounded-lg hover:bg-red-50/50 mt-1"
                          title="Delete Paper"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'weightage' && (
        <div className="card p-5 space-y-4">
          <div className="flex justify-between items-center mb-2">
            <div>
              <h3 className="text-sm font-black text-catalyst-dark uppercase tracking-wider">Subject-Wise PYQ Distribution</h3>
              <p className="text-[11px] text-catalyst-muted font-medium mt-0.5">Average number of questions asked per subject over the last 5 years in {exam}</p>
            </div>
            <span className="badge-purple font-black text-[9px] uppercase tracking-wider">Source: Past Exam Papers Analysis</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-semibold text-catalyst-dark">
              <thead>
                <tr className="border-b border-catalyst-border bg-catalyst-bg/50">
                  <th className="py-2.5 px-3">Subject Name</th>
                  <th className="py-2.5 px-3">Avg. Questions Asked</th>
                  <th className="py-2.5 px-3">Yield Category</th>
                  <th className="py-2.5 px-3">Relevance Priority</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-catalyst-border/60">
                {weightageData.map((row) => (
                  <tr key={row.id} className="hover:bg-catalyst-bg/20">
                    <td className="py-3 px-3 font-bold">{row.name}</td>
                    <td className="py-3 px-3 font-black text-indigo-600">{row.avgQuestions} Qs</td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-full border text-[9px] font-black uppercase ${row.colorClass}`}>
                        {row.priority}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-catalyst-muted">
                      {row.avgQuestions > 20 
                        ? '🔥 High impact area. Re-attempt questions 3x.' 
                        : row.avgQuestions > 14 
                        ? '📚 Core focus. Attempt mock sub-topics.' 
                        : '💡 Medium coverage area.'}
                    </td>
                  </tr>
                ))}

                {weightageData.length === 0 && (
                  <tr>
                    <td colSpan="4" className="py-8 text-center text-catalyst-muted font-bold">
                      No subject data available. Set up your syllabus first to view the distribution map!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeSubTab === 'trends' && (
        <div className="space-y-6">
          <div className="card p-5 bg-gradient-to-br from-indigo-50 to-purple-50/30 border-indigo-100">
            <h3 className="text-sm font-black text-indigo-900 uppercase tracking-wider mb-2 flex items-center gap-2">
              <span>🔥</span> Exam Pattern & Trend Overview
            </h3>
            <p className="text-xs font-semibold text-indigo-950 leading-relaxed">
              {activeTrendData.overview}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Trend Details */}
            <div className="md:col-span-2 card p-5 space-y-4">
              <h3 className="text-sm font-black text-catalyst-dark uppercase tracking-wider mb-2">
                Subject-Wise Trend Analysis
              </h3>
              <div className="space-y-3.5 divide-y divide-catalyst-border">
                {activeTrendData.trends.map((item, index) => (
                  <div key={index} className="pt-3.5 first:pt-0 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black text-catalyst-dark">{item.subject}</h4>
                      <span className={`px-2 py-0.5 rounded-full border text-[8px] font-black uppercase ${
                        item.yield.includes('Critical') 
                          ? 'bg-rose-50 border-rose-200 text-rose-700' 
                          : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                      }`}>
                        {item.yield}
                      </span>
                    </div>
                    <p className="text-[11px] text-catalyst-muted font-semibold leading-relaxed">
                      {item.trend}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* High-Yield Checklist */}
            <div className="card p-5 bg-white space-y-4 h-fit">
              <div>
                <h3 className="text-sm font-black text-catalyst-dark uppercase tracking-wider">
                  🎯 Must-Prepare High-Yield Areas
                </h3>
                <p className="text-[10px] text-catalyst-muted font-medium mt-0.5">Based on question frequency in past year papers.</p>
              </div>
              <ul className="space-y-2">
                {activeTrendData.highYieldAreas.map((area, index) => (
                  <li key={index} className="flex items-start gap-2.5 text-xs font-semibold text-catalyst-dark">
                    <span className="w-5 h-5 rounded-lg bg-indigo-50 text-indigo-600 font-black text-[10px] flex items-center justify-center shrink-0">
                      {index + 1}
                    </span>
                    <span className="pt-0.5 leading-snug">{area}</span>
                  </li>
                ))}
              </ul>

              <div className="border-t border-catalyst-border pt-4 text-center">
                <p className="text-[10px] font-bold text-catalyst-muted italic leading-relaxed">
                  💡 Double down on these areas when creating your Revision checklists in the Syllabus tracker.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'mistakes' && (
        <div className="space-y-5">
          {/* Add Entry section */}
          {isAddingNote ? (
            <div className="bg-catalyst-bg/50 border border-catalyst-border/60 rounded-xl p-4 space-y-3">
              <h4 className="text-xs font-black text-catalyst-dark uppercase tracking-wider">Add Mistakes & Notes Entry</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-catalyst-muted mb-1">Select Topic</label>
                  <select
                    value={newNoteTopicId}
                    onChange={(e) => setNewNoteTopicId(e.target.value)}
                    className="w-full bg-white border border-catalyst-border rounded-lg text-xs py-1.5 px-3 font-semibold outline-none text-catalyst-dark focus:border-indigo-500"
                  >
                    <option value="">-- Choose Subject & Topic --</option>
                    {allSyllabusTopics.map(t => (
                      <option key={t.id} value={t.id}>
                        [{t.subjectName}] {t.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-catalyst-muted mb-1">Entry Category</label>
                  <select
                    value={newNoteType}
                    onChange={(e) => setNewNoteType(e.target.value)}
                    className="w-full bg-white border border-catalyst-border rounded-lg text-xs py-1.5 px-3 font-semibold outline-none text-catalyst-dark focus:border-indigo-500"
                  >
                    <option value="mistakes">Mistakes Register</option>
                    <option value="formulas">Easy-Go Formulas</option>
                    <option value="general">General Notes</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-catalyst-muted mb-1">Notes / Mistakes Content</label>
                <textarea
                  placeholder="Enter mistakes, warnings, key formulae, or notes for this topic..."
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                  className="w-full h-24 p-3 bg-white border border-catalyst-border rounded-lg text-xs font-medium focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  onClick={() => { setIsAddingNote(false); setNewNoteContent(''); }}
                  className="px-3 py-1.5 border border-catalyst-border hover:bg-catalyst-bg rounded-lg text-xs font-bold text-catalyst-muted transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddNote}
                  className="px-4 py-1.5 bg-catalyst-primary hover:bg-catalyst-primary/95 text-white rounded-lg text-xs font-bold shadow-md transition-all cursor-pointer"
                >
                  Save Entry
                </button>
              </div>
            </div>
          ) : (
            <div className="flex justify-end">
              <button
                onClick={() => {
                  setIsAddingNote(true);
                  setNewNoteTopicId('');
                  setNewNoteContent('');
                  setNewNoteType(activeNotesTab);
                }}
                className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border border-indigo-200 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Plus size={12} /> Add Entry
              </button>
            </div>
          )}

          {/* Notes Filtering Controls */}
          <div className="flex flex-wrap md:flex-nowrap justify-between items-center gap-4 bg-white p-3 border border-catalyst-border rounded-2xl">
            <div className="flex gap-2">
              <button 
                onClick={() => { setActiveNotesTab('mistakes'); setEditingTopicId(null); }}
                className={`px-3.5 py-1.5 text-[11px] font-black rounded-lg transition-colors ${activeNotesTab === 'mistakes' ? 'bg-indigo-50 text-indigo-600 border border-indigo-200' : 'text-catalyst-muted hover:text-catalyst-dark'}`}
              >
                Mistakes Register
              </button>
              <button 
                onClick={() => { setActiveNotesTab('formulas'); setEditingTopicId(null); }}
                className={`px-3.5 py-1.5 text-[11px] font-black rounded-lg transition-colors ${activeNotesTab === 'formulas' ? 'bg-indigo-50 text-indigo-600 border border-indigo-200' : 'text-catalyst-muted hover:text-catalyst-dark'}`}
              >
                Easy-Go Formulas
              </button>
              <button 
                onClick={() => { setActiveNotesTab('general'); setEditingTopicId(null); }}
                className={`px-3.5 py-1.5 text-[11px] font-black rounded-lg transition-colors ${activeNotesTab === 'general' ? 'bg-indigo-50 text-indigo-600 border border-indigo-200' : 'text-catalyst-muted hover:text-catalyst-dark'}`}
              >
                General Notes
              </button>
            </div>

            <input 
              type="text" 
              placeholder="Search logged mistakes & notes..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white border border-catalyst-border rounded-xl py-1.5 px-3.5 text-xs text-catalyst-text focus:outline-none focus:border-catalyst-primary w-64"
            />
          </div>

          {/* Grid list of notes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredNotes.map(n => {
              const isCovered = coveredNotes ? !!coveredNotes[`${n.topicId}_${activeNotesTab}`] : false;
              
              return (
                <div key={n.topicId} className={`card p-5 flex flex-col justify-between space-y-4 transition-all duration-300 ${
                  isCovered ? 'opacity-65 border-emerald-200/60 bg-emerald-50/10' : ''
                }`}>
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase text-indigo-500 bg-indigo-50 px-2.5 py-0.5 rounded-full">
                          {n.subjectName}
                        </span>
                        {isCovered && (
                          <span className="text-[9px] font-black uppercase text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                            ✓ Covered
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-bold text-catalyst-muted">{n.topicName}</span>
                    </div>

                    {editingTopicId === n.topicId ? (
                      <textarea 
                        value={editVal}
                        onChange={(e) => setEditVal(e.target.value)}
                        className="w-full h-32 p-3 bg-catalyst-bg border border-catalyst-border rounded-xl text-sm font-medium focus:outline-none focus:border-indigo-500"
                      />
                    ) : (
                      <p className={`text-sm font-semibold text-catalyst-dark leading-relaxed whitespace-pre-line bg-catalyst-bg/40 p-3 rounded-xl border border-catalyst-border/40 ${
                        isCovered ? 'line-through text-catalyst-muted' : ''
                      }`}>
                        {n.text}
                      </p>
                    )}
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-catalyst-border/30">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleToggleCovered(n.topicId, activeNotesTab)}
                        className={`text-xs font-bold px-2.5 py-1 rounded-lg border transition-all ${
                          isCovered 
                            ? 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100' 
                            : 'border-catalyst-border text-catalyst-muted hover:text-catalyst-dark hover:bg-catalyst-bg'
                        }`}
                      >
                        {isCovered ? 'Mark Active' : 'Mark Covered'}
                      </button>
                      <button 
                        onClick={() => handleDeleteNote(n.topicId, activeNotesTab, n.topicName)}
                        className="text-xs font-bold text-red-500 hover:text-red-700 border border-transparent hover:border-red-100 hover:bg-red-50 px-2.5 py-1 rounded-lg transition-all"
                      >
                        Delete
                      </button>
                    </div>

                    {editingTopicId === n.topicId ? (
                      <button onClick={saveEdit} className="btn-primary py-1 px-3 text-xs flex items-center gap-1 bg-indigo-500 hover:bg-indigo-600">
                        <Save size={12} /> Save
                      </button>
                    ) : (
                      <button onClick={() => startEdit(n)} className="text-xs font-bold text-indigo-500 hover:underline">
                        Edit Entry
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            {filteredNotes.length === 0 && (
              <div className="col-span-full card p-10 text-center text-catalyst-muted font-bold">
                No entries found in {getTabTitle()}. Go to Syllabus page, expand a subject, and click notes/mistakes icon on any subtopic to start recording concepts from your PYQ errors!
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 4. ACHIEVEMENTS PAGE
// ==========================================
export const AchievementsPage = () => {
  const { mockTests, syllabusData, revisions } = useAppContext();

  // Overall syllabus calculation
  const totalTopicsCount = syllabusData.flatMap(s => s.topics || []).length;
  const completedTopicsCount = syllabusData.flatMap(s => s.topics || []).filter(t => t.stage === 'Completed').length;
  const overallPct = totalTopicsCount === 0 ? 0 : Math.round((completedTopicsCount / totalTopicsCount) * 100);

  // Predictions heuristics
  const getReadinessPrediction = () => {
    if (overallPct === 100) {
      return {
        label: "Syllabus Completed! 🎉",
        desc: "Prediction: You have hit full readiness status. Focus entirely on timing strategies during mock exams to secure maximum scores.",
        color: "bg-emerald-500",
        bg: "bg-emerald-50/50 border-emerald-200 text-emerald-950"
      };
    }
    if (overallPct >= 75) {
      return {
        label: "High Readiness 🚀",
        desc: "Prediction: Outstanding trajectory. The core syllabus is locked. Allocate remaining days to Formula revision sheets and active recall.",
        color: "bg-lime-500",
        bg: "bg-lime-50/50 border-lime-200 text-lime-950"
      };
    }
    if (overallPct >= 50) {
      return {
        label: "Moderate Readiness 📈",
        desc: "Prediction: Moving in the right direction. Weak areas in quantitative or advanced topics must be targeted next. Maintain momentum.",
        color: "bg-amber-500",
        bg: "bg-amber-50/50 border-amber-200 text-amber-950"
      };
    }
    if (overallPct >= 25) {
      return {
        label: "Initial Progress ⏳",
        desc: "Prediction: Syllabus coverage is in early practice phase. Prioritize fundamental concepts to clear base level thresholds.",
        color: "bg-orange-500",
        bg: "bg-orange-50/50 border-orange-200 text-orange-950"
      };
    }
    return {
      label: "Critical Acceleration Required ⚠️",
      desc: "Prediction: Syllabus coverage is extremely low. Plan immediate daily mock runs and crash foundation topics to prevent downfall.",
      color: "bg-red-500",
      bg: "bg-red-50/50 border-red-200 text-red-950"
    };
  };

  const prediction = getReadinessPrediction();

  // Basic milestone system
  const achievements = [
    {
      id: 'first_step',
      title: 'First Step',
      desc: 'Completed your first subtopic in any subject.',
      unlocked: completedTopicsCount > 0,
      icon: '🚀'
    },
    {
      id: 'topic_master',
      title: 'Topic Master',
      desc: 'Mastered a complete topic (reached 100% completion).',
      unlocked: completedTopicsCount > 0,
      icon: '🏆'
    },
    {
      id: 'analyst',
      title: 'Mock Analyst',
      desc: 'Logged at least 2 mock tests to review analytics.',
      unlocked: mockTests.length >= 2,
      icon: '📊'
    },
    {
      id: 'revisionist',
      title: 'Revisionist Pro',
      desc: 'Logged at least 3 spaced repetition revision sessions.',
      unlocked: Object.values(revisions).reduce((acc, curr) => acc + (curr.count || 0), 0) >= 3,
      icon: '🧠'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Title */}
      <div>
        <h2 className="text-2xl font-black text-catalyst-dark flex items-center gap-2">
          <Award className="text-yellow-500" />
          Insights & Forecasts
        </h2>
        <p className="text-catalyst-muted text-sm font-medium">Review your milestone stats and predictive exam completion forecasts.</p>
      </div>

      {/* Predictive Overall Exam Prep Summary Card */}
      <div className={`card p-6 border flex flex-col justify-between overflow-hidden relative ${prediction.bg}`}>
        <div className="absolute top-0 left-0 right-0 h-1.5 flex">
          <div className={`h-full ${prediction.color}`} style={{ width: `${overallPct}%` }}></div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-1">
          <div>
            <p className="text-[10px] font-black uppercase tracking-wider text-catalyst-muted">Predictive Exam Readiness</p>
            <h3 className="text-lg font-black mt-0.5">{prediction.label}</h3>
            <p className="text-xs font-semibold leading-relaxed mt-1 max-w-2xl">{prediction.desc}</p>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-black text-catalyst-muted uppercase">Syllabus Completion</span>
            <p className="text-3xl font-black text-catalyst-dark leading-none mt-1">{overallPct}%</p>
          </div>
        </div>
      </div>

      {/* Subject Summary Predictions Grid */}
      <div className="card p-5">
        <h3 className="font-black text-sm text-catalyst-dark uppercase tracking-wider mb-4">Subject Summary Predictions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {syllabusData.map(sub => {
            const finishedCount = (sub.topics || []).filter(t => t.stage === 'Completed').length;
            const subPct = (sub.topics || []).length === 0 ? 0 : Math.round((finishedCount / (sub.topics || []).length) * 100);
            
            let statusLabel = "Needs Work 🔴";
            let labelColor = "text-red-600 bg-red-50 border-red-200";
            if (subPct === 100) {
              statusLabel = "Perfect Coverage 🟢";
              labelColor = "text-emerald-700 bg-emerald-50 border-emerald-200";
            } else if (subPct >= 75) {
              statusLabel = "Almost Ready 🟢";
              labelColor = "text-lime-700 bg-lime-50 border-lime-200";
            } else if (subPct >= 50) {
              statusLabel = "Satisfactory 🟡";
              labelColor = "text-amber-700 bg-amber-50 border-amber-200";
            } else if (subPct >= 25) {
              statusLabel = "In Progress 🟠";
              labelColor = "text-orange-700 bg-orange-50 border-orange-200";
            }

            return (
              <div key={sub.id} className="p-3 bg-catalyst-bg/40 border border-catalyst-border rounded-2xl flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-black text-catalyst-dark">{sub.name}</h4>
                  <p className="text-[10px] font-semibold text-catalyst-muted mt-0.5">{finishedCount} of {(sub.topics || []).length} topics done</p>
                </div>
                <div className="text-right">
                  <span className={`text-[9px] font-black px-2 py-0.5 border rounded-full ${labelColor}`}>{statusLabel}</span>
                  <p className="text-xs font-black text-catalyst-dark mt-1">{subPct}%</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Achievements & Milestones Section Header */}
      <div className="pt-4 border-t border-catalyst-border/40">
        <h3 className="font-black text-sm text-catalyst-dark uppercase tracking-wider">Achievements & Milestones</h3>
        <p className="text-[11px] text-catalyst-muted font-medium mt-1">Track unlocked achievements based on your progress and study habits.</p>
      </div>

      {/* Classic Achievements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {achievements.map(a => (
          <div key={a.id} className={`card p-5 flex items-start gap-4 transition-all ${a.unlocked ? 'border-yellow-200 bg-yellow-50/20' : 'opacity-60 bg-white'}`}>
            <span className="text-3xl filter saturate-[0.8]">{a.icon}</span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-catalyst-dark text-sm">{a.title}</h3>
                {a.unlocked ? (
                  <span className="badge-yellow text-[8px] font-black uppercase tracking-wider bg-yellow-400/20 text-yellow-700">Unlocked</span>
                ) : (
                  <span className="bg-slate-100 text-slate-400 text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">Locked</span>
                )}
              </div>
              <p className="text-xs font-semibold text-catalyst-muted mt-1 leading-relaxed">{a.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// 5. SETTINGS PAGE
// ==========================================
export const SettingsPage = () => {
  const { 
    logout, selectedExam, switchExam, syllabusData, notes, shortNotes, mistakes, 
    revisions, mockTests, dailyStudy, todos, dDay,
    profileName, profileAvatarType, profileEmoji, profilePicture, updateProfile,
    loadDemoData, resetAllUserData, targetScore,
    streak, points, lastLoginDate, pyqPapers, pyqProgress, pyqCovered,
    snapshots, createSnapshot, deleteSnapshot, importBackup
  } = useAppContext();

  const [name, setName] = useState(profileName);
  const [avatarType, setAvatarType] = useState(profileAvatarType);
  const [selectedEmoji, setSelectedEmoji] = useState(profileEmoji);
  const [selectedPicture, setSelectedPicture] = useState(profilePicture);

  const [syncCode, setSyncCode] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);
  const [importVal, setImportVal] = useState('');
  const fileInputRef = useRef(null);
  const photoInputRef = useRef(null);

  const emojiOptions = ['👨‍🎓', '👩‍🎓', '🧑‍💻', '👩‍💻', '🚀', '🎯', '🦁', '🐼', '🦊', '🧠', '🏆', '💡'];

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("File size too large! Please upload an image under 2MB.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedPicture(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const saveProfile = () => {
    if (!name.trim()) {
      alert("Full name cannot be blank!");
      return;
    }
    updateProfile(name, avatarType, selectedEmoji, selectedPicture);
    alert('Profile saved successfully!');
  };

  const handleResetProgress = () => {
    if (!selectedExam) return;
    if (window.confirm(`Are you sure you want to reset all progress for ${selectedExam}?`)) {
      resetAllUserData();
      alert('Exam progress reset successfully!');
    }
  };

  // Create recovery snapshot
  const handleCreateSnapshot = () => {
    if (!selectedExam) {
      alert("No active exam selected to snapshot.");
      return;
    }
    
    // Calculate overall completion
    const totalTopicsCount = syllabusData.flatMap(s => s.topics || []).length;
    const completedTopicsCount = syllabusData.flatMap(s => s.topics || []).filter(t => t.stage === 'Completed').length;
    const overallPct = totalTopicsCount === 0 ? 0 : Math.round((completedTopicsCount / totalTopicsCount) * 100);

    const backupObj = {
      exam: selectedExam,
      syllabus: syllabusData,
      notes,
      shortNotes,
      mistakes,
      revisions,
      mockTests,
      dailyStudy,
      todos,
      dDay,
      targetScore,
      streak,
      points,
      lastLoginDate,
      pyqPapers,
      pyqProgress,
      pyqCovered
    };

    createSnapshot(`snap_${Date.now()}`, new Date().toLocaleString(), selectedExam, overallPct, backupObj);
    alert("System restore point captured successfully!");
  };

  const handleRestoreFromSnapshot = async (snap) => {
    if (window.confirm(`Are you sure you want to restore workspace data to the snapshot from ${snap.date}? Your current unsaved progress on ${selectedExam} will be overwritten.`)) {
      try {
        await importBackup(snap.exam, snap.data);
        alert(`Workspace restored to ${snap.exam} (${snap.date}) snapshot successfully!`);
      } catch (err) {
        alert("Restore point load failed. Please try again.");
      }
    }
  };

  const handleDeleteSnapshot = (id) => {
    deleteSnapshot(id);
  };

  // JSON File upload handler
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (!parsed.exam) {
          alert("Invalid backup file. Ensure it is a valid Catalyst JSON backup.");
          return;
        }
        if (window.confirm(`Import backup file for ${parsed.exam}? This will overwrite active database records.`)) {
          await importBackup(parsed.exam, parsed);
          alert(`Backup imported successfully for ${parsed.exam}!`);
        }
      } catch (err) {
        alert("Failed to parse or import backup file.");
      }
    };
    reader.readAsText(file);
    e.target.value = null; // Clear input
  };

  // Data Export & Sync Handlers
  const handleExportData = () => {
    const backupObj = {
      exam: selectedExam,
      syllabus: syllabusData,
      notes,
      shortNotes,
      mistakes,
      revisions,
      mockTests,
      dailyStudy,
      todos,
      dDay,
      targetScore
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupObj));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `catalyst_backup_${selectedExam || 'workspace'}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleGenerateSyncCode = () => {
    const backupObj = {
      exam: selectedExam,
      syllabus: syllabusData,
      notes,
      shortNotes,
      mistakes,
      revisions,
      mockTests,
      dailyStudy,
      todos,
      dDay,
      targetScore
    };
    try {
      const code = btoa(unescape(encodeURIComponent(JSON.stringify(backupObj))));
      setSyncCode(code);
      navigator.clipboard.writeText(code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch (e) {
      alert("Could not generate sync code. Please use JSON backup export.");
    }
  };

  const handleImportBackup = async () => {
    if (!importVal.trim()) {
      alert("Please paste backup code or JSON content.");
      return;
    }
    try {
      let parsed;
      if (importVal.trim().startsWith('{')) {
        parsed = JSON.parse(importVal.trim());
      } else {
        parsed = JSON.parse(decodeURIComponent(escape(atob(importVal.trim()))));
      }
      
      if (!parsed.exam) {
        alert("Invalid backup format. Exam field missing.");
        return;
      }

      await importBackup(parsed.exam, parsed);
      alert(`Workspace backup loaded successfully for ${parsed.exam}!`);
      setImportVal('');
    } catch (e) {
      alert("Error importing workspace data. Make sure string is correct.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-black text-catalyst-dark flex items-center gap-2">
          Profile Settings
        </h2>
        <p className="text-catalyst-muted text-sm font-medium">Update account properties, manage manual backup files, and synchronize data.</p>
      </div>

      {/* Profile info card */}
      <div className="card p-6 space-y-6">
        <h3 className="text-base font-black text-catalyst-dark">Basic Info & Avatar</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name input */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-catalyst-dark mb-1">Full Name</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                title="Your student name displayed across the system"
                className="w-full px-3.5 py-2.5 rounded-xl border border-catalyst-border bg-white text-sm font-semibold focus:border-catalyst-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-catalyst-dark mb-1.5">Avatar Type</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setAvatarType('emoji')}
                  title="Use a cartoon emoji type avatar"
                  className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                    avatarType === 'emoji'
                      ? 'bg-catalyst-primary/10 text-catalyst-primary border-catalyst-primary'
                      : 'bg-white text-catalyst-text border-catalyst-border hover:bg-catalyst-bg'
                  }`}
                >
                  Cartoon Emoji
                </button>
                <button
                  type="button"
                  onClick={() => setAvatarType('picture')}
                  title="Upload your own picture for profile"
                  className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                    avatarType === 'picture'
                      ? 'bg-catalyst-primary/10 text-catalyst-primary border-catalyst-primary'
                      : 'bg-white text-catalyst-text border-catalyst-border hover:bg-catalyst-bg'
                  }`}
                >
                  Custom Photo
                </button>
              </div>
            </div>

            <button onClick={saveProfile} className="btn-primary py-2.5 px-6 text-sm" title="Save profile settings changes">
              Save Profile Changes
            </button>
          </div>

          {/* Avatar Options panel */}
          <div className="border-l border-catalyst-border pl-0 md:pl-6 flex flex-col justify-center">
            {avatarType === 'emoji' ? (
              <div className="space-y-3">
                <label className="block text-xs font-bold text-catalyst-dark">Select Cartoon Emoji</label>
                <div className="grid grid-cols-4 gap-2.5">
                  {emojiOptions.map(emo => (
                    <button
                      key={emo}
                      type="button"
                      onClick={() => setSelectedEmoji(emo)}
                      title={`Select ${emo} avatar`}
                      className={`w-11 h-11 text-xl flex items-center justify-center rounded-xl border transition-all cursor-pointer ${
                        selectedEmoji === emo
                          ? 'border-catalyst-primary bg-catalyst-primary/10 scale-105 shadow-sm'
                          : 'border-catalyst-border bg-white hover:bg-catalyst-bg hover:scale-105'
                      }`}
                    >
                      {emo}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-3 flex flex-col items-center">
                <label className="block text-xs font-bold text-catalyst-dark self-start">Upload Photo</label>
                <div className="relative group w-20 h-20 rounded-full border border-catalyst-border bg-catalyst-bg overflow-hidden flex items-center justify-center">
                  {selectedPicture ? (
                    <img src={selectedPicture} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs text-catalyst-muted font-bold">No Photo</span>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <input
                    type="file"
                    ref={photoInputRef}
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => photoInputRef.current.click()}
                    title="Choose image file from local files"
                    className="px-3.5 py-2 border border-catalyst-border text-catalyst-dark text-xs font-bold rounded-xl hover:bg-catalyst-bg transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <UploadCloud size={14} />
                    Choose File
                  </button>
                  {selectedPicture && (
                    <button
                      type="button"
                      onClick={() => setSelectedPicture('')}
                      title="Remove uploaded image file"
                      className="px-3.5 py-2 border border-red-200 text-red-600 text-xs font-bold rounded-xl hover:bg-red-50 transition-all cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <p className="text-[10px] text-catalyst-muted font-semibold text-center mt-1">PNG, JPG or WEBP up to 2MB. Stored locally.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Snapshots & Restore points */}
      <div className="card p-6 space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-base font-black text-catalyst-dark flex items-center gap-1.5">
              <RotateCcw className="text-catalyst-primary" size={18} />
              Workspace Snapshot History
            </h3>
            <p className="text-xs text-catalyst-muted font-semibold mt-0.5">
              Save local restore points to go back in time if you make mistakes. (Max 5 points saved)
            </p>
          </div>
          <button 
            onClick={handleCreateSnapshot}
            className="px-4 py-2 bg-catalyst-primary/10 text-catalyst-primary text-xs font-black rounded-xl hover:bg-catalyst-primary/20 transition-all"
          >
            Create Snapshot
          </button>
        </div>

        {snapshots.length === 0 ? (
          <div className="text-center py-6 border border-dashed border-catalyst-border rounded-2xl bg-catalyst-bg/20">
            <p className="text-xs font-semibold text-catalyst-muted">No local restore points created yet. Click above to save one!</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {snapshots.map((snap) => (
              <div key={snap.id} className="p-3 bg-catalyst-bg/40 border border-catalyst-border rounded-xl flex items-center justify-between text-xs">
                <div>
                  <p className="font-black text-catalyst-dark">{snap.exam}</p>
                  <p className="text-[10px] text-catalyst-muted font-semibold mt-0.5">Completion: {snap.completion}% | Captured: {snap.date}</p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleRestoreFromSnapshot(snap)}
                    className="px-2.5 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold rounded-lg hover:bg-emerald-100 transition-colors"
                  >
                    Restore
                  </button>
                  <button 
                    onClick={() => handleDeleteSnapshot(snap.id)}
                    className="px-2.5 py-1.5 bg-red-50 border border-red-200 text-red-600 font-bold rounded-lg hover:bg-red-100 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Backup and restore panel */}
      <div className="card p-6 space-y-4">
        <h3 className="text-base font-black text-catalyst-dark">Backup & Synchronization</h3>
        <p className="text-xs font-semibold text-catalyst-muted leading-relaxed">
          Export your complete syllabus completion details, mock history, and notes registry to a local file or copy a secure Base64 sync code to prevent accidental reset.
        </p>

        <div className="flex flex-wrap gap-3 pt-1">
          <button 
            onClick={handleExportData}
            className="px-4 py-2 bg-catalyst-primary text-white text-xs font-black rounded-xl hover:opacity-90 active:scale-95 transition-all"
          >
            Export JSON Backup
          </button>
          
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept=".json" 
            className="hidden" 
          />
          <button 
            onClick={() => fileInputRef.current.click()}
            className="px-4 py-2 border border-catalyst-border text-catalyst-dark text-xs font-black rounded-xl hover:bg-catalyst-bg active:scale-95 transition-all flex items-center gap-1.5"
          >
            <UploadCloud size={14} />
            Import Backup File
          </button>
          
          <button 
            onClick={handleGenerateSyncCode}
            className="px-4 py-2 border border-catalyst-border text-catalyst-dark text-xs font-black rounded-xl hover:bg-catalyst-bg active:scale-95 transition-all flex items-center gap-1.5"
          >
            {copiedCode ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
            {copiedCode ? 'Copied Sync Code!' : 'Copy Sync Code'}
          </button>
        </div>

        {syncCode && (
          <div className="mt-3 p-3 bg-catalyst-bg rounded-xl border border-catalyst-border">
            <p className="text-[10px] font-black text-catalyst-muted uppercase">Sync Code (Base64 string)</p>
            <textarea 
              readOnly 
              value={syncCode} 
              className="w-full text-[10px] font-mono mt-1 p-2 bg-white border border-catalyst-border rounded-lg outline-none h-16 resize-none"
            />
          </div>
        )}

        <div className="pt-4 border-t border-catalyst-border space-y-3">
          <label className="block text-xs font-bold text-catalyst-dark">Restore / Import Data via Code</label>
          <p className="text-[10px] text-catalyst-muted font-medium">Paste backup JSON or Base64 sync code string below to reload the workspace:</p>
          <textarea 
            placeholder="Paste your sync code or JSON string here..."
            value={importVal}
            onChange={(e) => setImportVal(e.target.value)}
            className="w-full text-xs font-mono p-3 bg-white border border-catalyst-border rounded-xl outline-none h-20 focus:border-catalyst-primary resize-none"
          />
          <button 
            onClick={handleImportBackup}
            className="px-4 py-2 bg-emerald-600 text-white text-xs font-black rounded-xl hover:opacity-90 active:scale-95 transition-all"
          >
            Restore Workspace Code
          </button>
        </div>
      </div>

      {/* Demo Sandbox Control Panel */}
      <div className="card p-6 space-y-4">
        <h3 className="text-base font-black text-catalyst-dark flex items-center gap-1.5">
          <Sparkles className="text-amber-500" size={18} />
          Demo Playground & Workspace Sandbox
        </h3>
        <p className="text-xs font-semibold text-catalyst-muted leading-relaxed">
          Test Catalyst features with realistic, pre-populated student study statistics (logs, streaks, mocks, notes, and checklist items) to see how the system operates, then clear it back to the template defaults.
        </p>

        <div className="flex flex-wrap gap-3 pt-1">
          <button 
            onClick={() => {
              loadDemoData();
              alert("Premium study demo data populated successfully! Go check the Dashboard, Syllabus, and Calendar.");
            }}
            className="px-5 py-2.5 bg-amber-500 text-white text-xs font-black rounded-xl hover:bg-amber-600 active:scale-95 transition-all shadow-md shadow-amber-500/10 flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles size={14} />
            Load Sample Study Data
          </button>
          
          <button 
            onClick={() => {
              if (window.confirm("This will wipe all custom logs, mock scores, streaks, planner items, and restore the selected exam's syllabus to clean defaults. Continue?")) {
                resetAllUserData();
                alert("Workspace reset to clean default inbuilt syllabus successfully!");
              }
            }}
            className="px-5 py-2.5 border border-catalyst-border text-catalyst-dark hover:bg-catalyst-bg text-xs font-black rounded-xl active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw size={14} />
            Reset Custom User Data
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="card p-6 border-red-200 bg-red-50/10 space-y-4">
        <div className="flex items-center gap-2">
          <ShieldAlert className="text-red-500" />
          <h3 className="text-base font-black text-red-700">Danger Zone</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-4 border-b border-red-100 pb-4">
            <div>
              <p className="text-sm font-bold text-catalyst-dark">Reset Active Exam Progress</p>
              <p className="text-xs text-catalyst-muted font-medium">This will clear all syllabus completions, mock scores, revisions, and notes for {selectedExam || 'none'}.</p>
            </div>
            <button 
              onClick={handleResetProgress}
              disabled={!selectedExam}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white text-xs font-black rounded-xl transition"
            >
              Reset Progress
            </button>
          </div>

          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-sm font-bold text-catalyst-dark">Sign Out of Account</p>
              <p className="text-xs text-catalyst-muted font-medium">Disconnect the account from this browser session.</p>
            </div>
            <button 
              onClick={logout}
              className="px-4 py-2 border border-red-500 text-red-500 hover:bg-red-50 text-xs font-black rounded-xl transition"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
