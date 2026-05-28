import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { staticExamOptions } from '../data/examsData';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('catalyst_token');
  });
  
  const [selectedExam, setSelectedExam] = useState(() => {
    return localStorage.getItem('catalyst_selected_exam') || null;
  });

  // Core tracking
  const [syllabusData, setSyllabusData] = useState([]);
  
  // Gamification & Streak State
  const [streak, setStreak] = useState(1);
  const [points, setPoints] = useState(250);
  const [lastLoginDate, setLastLoginDate] = useState('');

  // User Profile Customization State
  const [profileName, setProfileName] = useState('Saurabh');
  const [profileAvatarType, setProfileAvatarType] = useState('emoji');
  const [profileEmoji, setProfileEmoji] = useState('👨‍🎓');
  const [profilePicture, setProfilePicture] = useState('');

  // Advanced features state
  const [notes, setNotes] = useState({}); // { topicId: "note text" }
  const [shortNotes, setShortNotes] = useState({}); // { topicId: "formula/short notes" }
  const [mistakes, setMistakes] = useState({}); // { topicId: "learning from mistakes" }
  const [revisions, setRevisions] = useState({}); // { topicId: { count, lastRevised, nextRevision } }
  const [mockTests, setMockTests] = useState([]); // [{ name, score, date }]
  const [dailyStudy, setDailyStudy] = useState([]); // [{ day, hours }]
  
  // Daily Planner State
  const [todos, setTodos] = useState([]);
  const [dDay, setDDay] = useState(''); // "YYYY-MM-DD"
  const [dDayPhases, setDDayPhases] = useState([]); // [{ id, name, date }]
  const [targetScore, setTargetScore] = useState(0);

  // Enrolled & Custom Exams State
  const [enrolledExams, setEnrolledExams] = useState(['UPSC CSE']);
  const [customExams, setCustomExams] = useState([]);
  const [examStats, setExamStats] = useState({});

  // PYQ State (integrated into Context for MERN)
  const [pyqPapers, setPyqPapers] = useState([]);
  const [pyqProgress, setPyqProgress] = useState({});
  const [pyqCovered, setPyqCovered] = useState({});

  // Snapshots State
  const [snapshots, setSnapshots] = useState([]);
  const [allExamData, setAllExamData] = useState([]);

  const [isLoadingExam, setIsLoadingExam] = useState(false);
  const currentExamRef = useRef(selectedExam);

  // Helper fetch function that automatically appends the Bearer token
  const apiFetch = async (url, options = {}) => {
    const token = localStorage.getItem('catalyst_token');
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const res = await fetch(url, { ...options, headers });
    if (res.status === 401) {
      // Logout on unauthorized
      localStorage.removeItem('catalyst_token');
      localStorage.removeItem('catalyst_selected_exam');
      setIsAuthenticated(false);
      setSelectedExam(null);
      throw new Error('Unauthorized');
    }
    return res;
  };

  // 1. Fetch User Profile & Custom Exams on auth
  useEffect(() => {
    const loadProfile = async () => {
      if (isAuthenticated) {
        try {
          const res = await apiFetch('/api/auth/me');
          const data = await res.json();
          setProfileName(data.name || 'Saurabh');
          setProfileAvatarType(data.avatarType || 'emoji');
          setProfileEmoji(data.emoji || '👨‍🎓');
          setProfilePicture(data.picture || '');
          setEnrolledExams(data.enrolledExams || ['UPSC CSE']);
          setCustomExams(data.customExams || []);
          setExamStats(data.examStats || {});
          if (data.selectedExam) {
            setSelectedExam(data.selectedExam);
            localStorage.setItem('catalyst_selected_exam', data.selectedExam);
          }
        } catch (err) {
          console.error("Error loading user profile", err);
        }
      }
    };
    loadProfile();
  }, [isAuthenticated]);

  // Sync active exam stats to examStats object
  useEffect(() => {
    if (selectedExam) {
      setExamStats(prev => ({
        ...prev,
        [selectedExam]: { dDay, targetScore }
      }));
    }
  }, [selectedExam, dDay, targetScore]);

  // 2. Fetch Active Exam's Data on selectedExam change
  useEffect(() => {
    const loadExamData = async () => {
      if (isAuthenticated && selectedExam) {
        setIsLoadingExam(true);
        try {
          const res = await apiFetch(`/api/exam/${selectedExam}`);
          const data = await res.json();
          
          if (data.notFound) {
            // Load default configuration from static templates
            const matchedStatic = staticExamOptions.find(ex => ex.title.toLowerCase() === selectedExam.toLowerCase());
            setSyllabusData(matchedStatic ? (matchedStatic.syllabus || []) : []);
            setNotes({});
            setShortNotes({});
            setMistakes({});
            setRevisions({});
            setMockTests([]);
            setDailyStudy([]);
            setTodos([]);
            setDDay('');
            setDDayPhases([]);
            setTargetScore(matchedStatic?.defaultTargetScore || 0);
            setStreak(1);
            setPoints(250);
            setLastLoginDate('');
            setPyqPapers([]);
            setPyqProgress({});
            setPyqCovered({});
          } else {
            setSyllabusData(data.syllabusData || []);
            setNotes(data.notes || {});
            setShortNotes(data.shortNotes || {});
            setMistakes(data.mistakes || {});
            setRevisions(data.revisions || {});
            setMockTests(data.mockTests || []);
            setDailyStudy(data.dailyStudy || []);
            setTodos(data.todos || []);
            setDDay(data.dDay || '');
            setDDayPhases(data.dDayPhases || []);
            setTargetScore(data.targetScore || 0);
            setStreak(data.streak || 1);
            setPoints(data.points || 250);
            setLastLoginDate(data.lastLoginDate || '');
            setPyqPapers(data.pyqPapers || []);
            setPyqProgress(data.pyqProgress || {});
            setPyqCovered(data.pyqCovered || {});
          }
          currentExamRef.current = selectedExam;
        } catch (e) {
          console.error("Error loading exam data", e);
        } finally {
          setIsLoadingExam(false);
        }
      }
    };
    loadExamData();
  }, [isAuthenticated, selectedExam]);

  // 3. Auto-save exam state with a 1-second debounce to avoid spamming the backend
  useEffect(() => {
    const autoSave = async () => {
      if (isAuthenticated && selectedExam && selectedExam === currentExamRef.current && !isLoadingExam) {
        const dataToSave = {
          syllabusData,
          notes,
          shortNotes,
          mistakes,
          revisions,
          mockTests,
          dailyStudy,
          todos,
          dDay,
          dDayPhases,
          targetScore,
          streak,
          points,
          lastLoginDate,
          pyqPapers,
          pyqProgress,
          pyqCovered
        };
        try {
          await apiFetch(`/api/exam/${selectedExam}`, {
            method: 'PUT',
            body: JSON.stringify(dataToSave)
          });
        } catch (e) {
          console.error("Autosave exam progress failed", e);
        }
      }
    };

    const delayTimer = setTimeout(() => {
      autoSave();
    }, 1000);

    return () => clearTimeout(delayTimer);
  }, [
    syllabusData, notes, shortNotes, mistakes, revisions, mockTests, dailyStudy,
    todos, dDay, dDayPhases, targetScore, selectedExam, isLoadingExam, isAuthenticated,
    streak, points, lastLoginDate, pyqPapers, pyqProgress, pyqCovered
  ]);

  // 4. Track daily login streak per exam workspace
  useEffect(() => {
    if (isAuthenticated && selectedExam && !isLoadingExam) {
      const todayStr = new Date().toDateString(); // e.g. "Thu May 28 2026"
      
      if (lastLoginDate !== todayStr) {
        if (lastLoginDate) {
          const lastLogin = new Date(lastLoginDate);
          const today = new Date(todayStr);
          const diffTime = Math.abs(today - lastLogin);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          if (diffDays === 1) {
            // Consecutive daily login!
            setStreak(prev => prev + 1);
            setPoints(prev => prev + 15); // +15 XP bonus
          } else if (diffDays > 1) {
            // Streak broken! Reset to 1
            setStreak(1);
            setPoints(prev => prev + 10); // standard daily login reward
          }
        } else {
          // First login tracked on this exam workspace
          setPoints(prev => prev + 10);
        }
        setLastLoginDate(todayStr);
      }
    }
  }, [isAuthenticated, selectedExam, lastLoginDate, isLoadingExam]);

  // 5. Fetch Restore Snapshots
  const fetchSnapshots = async () => {
    if (isAuthenticated) {
      try {
        const res = await apiFetch('/api/snapshots');
        const data = await res.json();
        setSnapshots(data);
      } catch (err) {
        console.error("Failed to fetch snapshots", err);
      }
    }
  };

  useEffect(() => {
    fetchSnapshots();
  }, [isAuthenticated]);

  const fetchAllExamData = async () => {
    if (isAuthenticated) {
      try {
        const res = await apiFetch('/api/exam');
        const data = await res.json();
        setAllExamData(data);
      } catch (err) {
        console.error("Failed to fetch all exam data", err);
      }
    }
  };

  useEffect(() => {
    fetchAllExamData();
  }, [isAuthenticated, selectedExam]);

  // Auth Operations
  const login = async (email, password) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.msg || 'Login failed');
    }
    localStorage.setItem('catalyst_token', data.token);
    setIsAuthenticated(true);
    setProfileName(data.user.name);
    setProfileAvatarType(data.user.avatarType);
    setProfileEmoji(data.user.emoji);
    setProfilePicture(data.user.picture);
    setEnrolledExams(data.user.enrolledExams);
    setCustomExams(data.user.customExams);
    if (data.user.selectedExam) {
      setSelectedExam(data.user.selectedExam);
      localStorage.setItem('catalyst_selected_exam', data.user.selectedExam);
    }
  };

  const signup = async (name, email, password) => {
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.msg || 'Signup failed');
    }
    localStorage.setItem('catalyst_token', data.token);
    setIsAuthenticated(true);
    setProfileName(data.user.name);
    setProfileAvatarType(data.user.avatarType);
    setProfileEmoji(data.user.emoji);
    setProfilePicture(data.user.picture);
    setEnrolledExams(data.user.enrolledExams);
    setCustomExams(data.user.customExams);
    if (data.user.selectedExam) {
      setSelectedExam(data.user.selectedExam);
      localStorage.setItem('catalyst_selected_exam', data.user.selectedExam);
    }
  };

  const sendResetOtp = async (email) => {
    const res = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.msg || 'Failed to send verification OTP');
    }
    return data;
  };

  const verifyResetOtp = async (email, code, newPassword) => {
    const res = await fetch('/api/auth/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code, newPassword })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.msg || 'Failed to verify code and reset password');
    }
  };

  const logout = () => {
    localStorage.removeItem('catalyst_token');
    localStorage.removeItem('catalyst_selected_exam');
    setIsAuthenticated(false);
    setSelectedExam(null);
    setSyllabusData([]);
    setNotes({});
    setShortNotes({});
    setMistakes({});
    setRevisions({});
    setMockTests([]);
    setDailyStudy([]);
    setTodos([]);
    setDDay('');
    setDDayPhases([]);
    setTargetScore(0);
    setStreak(1);
    setPoints(250);
    setLastLoginDate('');
    setPyqPapers([]);
    setPyqProgress({});
    setPyqCovered({});
    setSnapshots([]);
  };

  const updateProfile = async (name, avatarType, emoji, picture) => {
    try {
      const res = await apiFetch('/api/auth/profile', {
        method: 'PUT',
        body: JSON.stringify({ name, avatarType, emoji, picture })
      });
      const data = await res.json();
      setProfileName(data.name);
      setProfileAvatarType(data.avatarType);
      setProfileEmoji(data.emoji);
      setProfilePicture(data.picture);
    } catch (err) {
      console.error("Failed to update profile", err);
    }
  };

  const setEnrolledList = async (list) => {
    try {
      setEnrolledExams(list);
      await apiFetch('/api/auth/enrolled', {
        method: 'PUT',
        body: JSON.stringify({ enrolledExams: list })
      });
    } catch (err) {
      console.error("Failed to save enrolled list", err);
    }
  };

  const setExam = async (examName, initialSyllabus = [], initialMocks = [], initialStudy = [], initialRevisions = {}) => {
    setIsLoadingExam(true);
    setSelectedExam(examName);
    localStorage.setItem('catalyst_selected_exam', examName);
    currentExamRef.current = examName;
    
    const matchedStatic = staticExamOptions.find(ex => ex.title.toLowerCase() === examName.toLowerCase());
    
    setSyllabusData(initialSyllabus);
    setMockTests(initialMocks);
    setDailyStudy(initialStudy);
    setRevisions(initialRevisions);
    setNotes({});
    setShortNotes({});
    setMistakes({});
    setTodos([]);
    setDDay('');
    setDDayPhases([]);
    setTargetScore(matchedStatic?.defaultTargetScore || 0);
    setStreak(1);
    setPoints(250);
    setLastLoginDate('');
    setPyqPapers([]);
    setPyqProgress({});
    setPyqCovered({});
    
    const dataToSave = {
      syllabusData: initialSyllabus,
      notes: {},
      shortNotes: {},
      mistakes: {},
      revisions: initialRevisions,
      mockTests: initialMocks,
      dailyStudy: initialStudy,
      todos: [],
      dDay: '',
      dDayPhases: [],
      targetScore: matchedStatic?.defaultTargetScore || 0,
      streak: 1,
      points: 250,
      lastLoginDate: '',
      pyqPapers: [],
      pyqProgress: {},
      pyqCovered: {}
    };

    try {
      await apiFetch(`/api/exam/${examName}`, {
        method: 'PUT',
        body: JSON.stringify(dataToSave)
      });
      await apiFetch('/api/auth/selected', {
        method: 'PUT',
        body: JSON.stringify({ selectedExam: examName })
      });
    } catch (err) {
      console.error("Failed to initialize exam workspace", err);
    } finally {
      setIsLoadingExam(false);
    }
  };

  const switchExam = async (examName, fallbackSyllabus = []) => {
    setIsLoadingExam(true);
    
    // Save current exam before switching
    if (selectedExam && selectedExam === currentExamRef.current) {
      const dataToSave = {
        syllabusData,
        notes,
        shortNotes,
        mistakes,
        revisions,
        mockTests,
        dailyStudy,
        todos,
        dDay,
        dDayPhases,
        targetScore,
        streak,
        points,
        lastLoginDate,
        pyqPapers,
        pyqProgress,
        pyqCovered
      };
      try {
        await apiFetch(`/api/exam/${selectedExam}`, {
          method: 'PUT',
          body: JSON.stringify(dataToSave)
        });
      } catch (err) {
        console.error("Failed to save progress during switch", err);
      }
    }

    setSelectedExam(examName);
    localStorage.setItem('catalyst_selected_exam', examName);
    currentExamRef.current = examName;

    try {
      await apiFetch('/api/auth/selected', {
        method: 'PUT',
        body: JSON.stringify({ selectedExam: examName })
      });
    } catch (err) {
      console.error("Failed to switch active exam in profile", err);
    }

    // Refresh the local states with the new exam's stored data
    try {
      const res = await apiFetch(`/api/exam/${examName}`);
      const data = await res.json();
      
      const matchedStatic = staticExamOptions.find(ex => ex.title.toLowerCase() === examName.toLowerCase());
      
      if (data.notFound) {
        setSyllabusData(matchedStatic ? (matchedStatic.syllabus || []) : fallbackSyllabus);
        setNotes({});
        setShortNotes({});
        setMistakes({});
        setRevisions({});
        setMockTests([]);
        setDailyStudy([]);
        setTodos([]);
        setDDay('');
        setDDayPhases([]);
        setTargetScore(matchedStatic?.defaultTargetScore || 0);
        setStreak(1);
        setPoints(250);
        setLastLoginDate('');
        setPyqPapers([]);
        setPyqProgress({});
        setPyqCovered({});
      } else {
        setSyllabusData(data.syllabusData || []);
        setNotes(data.notes || {});
        setShortNotes(data.shortNotes || {});
        setMistakes(data.mistakes || {});
        setRevisions(data.revisions || {});
        setMockTests(data.mockTests || []);
        setDailyStudy(data.dailyStudy || []);
        setTodos(data.todos || []);
        setDDay(data.dDay || '');
        setDDayPhases(data.dDayPhases || []);
        setTargetScore(data.targetScore || matchedStatic?.defaultTargetScore || 0);
        setStreak(data.streak || 1);
        setPoints(data.points || 250);
        setLastLoginDate(data.lastLoginDate || '');
        setPyqPapers(data.pyqPapers || []);
        setPyqProgress(data.pyqProgress || {});
        setPyqCovered(data.pyqCovered || {});
      }
    } catch (err) {
      console.error("Failed to load details of switched exam", err);
    } finally {
      setIsLoadingExam(false);
    }
  };

  const addCustomExam = async (title, desc) => {
    try {
      const res = await apiFetch('/api/auth/custom-exams', {
        method: 'POST',
        body: JSON.stringify({ title, desc })
      });
      const data = await res.json();
      setCustomExams(data.customExams);
      return data.customExams;
    } catch (err) {
      console.error("Failed to add custom exam", err);
    }
  };

  // Snapshot System functions
  const createSnapshot = async (id, date, exam, completion, data) => {
    try {
      const res = await apiFetch('/api/snapshots', {
        method: 'POST',
        body: JSON.stringify({ id, date, exam, completion, data })
      });
      const updated = await res.json();
      setSnapshots(updated);
    } catch (err) {
      console.error("Failed to capture restore point", err);
    }
  };

  const deleteSnapshot = async (id) => {
    try {
      const res = await apiFetch(`/api/snapshots/${id}`, {
        method: 'DELETE'
      });
      const updated = await res.json();
      setSnapshots(updated);
    } catch (err) {
      console.error("Failed to remove restore point", err);
    }
  };

  // Syllabus Functions
  const addSubject = (subject) => setSyllabusData([...syllabusData, subject]);
  
  const deleteSubject = (subjectId) => {
    setSyllabusData(syllabusData.filter(sub => sub.id !== subjectId));
  };

  const addTopic = (subjectId, topic) => {
    setSyllabusData(syllabusData.map(subject => 
      subject.id === subjectId ? { ...subject, topics: [...(subject.topics || []), topic] } : subject
    ));
  };

  const deleteTopic = (subjectId, topicId) => {
    setSyllabusData(syllabusData.map(subject => {
      if (subject.id !== subjectId) return subject;
      return {
        ...subject,
        topics: (subject.topics || []).filter(t => t.id !== topicId)
      };
    }));
  };

  const updateSubtopicStatus = (subjectId, topicId, subtopicId, status) => {
    setSyllabusData(prevSyllabus => prevSyllabus.map(subject => {
      if (subject.id !== subjectId) return subject;
      return {
        ...subject,
        topics: (subject.topics || []).map(topic => {
          if (topic.id !== topicId) return topic;
          
          let subtopics = topic.subtopics.map(st => {
            if (st.id === subtopicId) {
              const prevStatus = st.status;
              if (prevStatus !== status) {
                const isMains = subject.round && (
                  subject.round.toLowerCase().includes('main') || 
                  subject.round.toLowerCase().includes('ii') || 
                  subject.round.toLowerCase().includes('advanced')
                );
                const pointsDelta = status === 'done' ? (isMains ? 30 : 20) : (isMains ? -30 : -20);
                setPoints(prevPoints => Math.max(0, prevPoints + pointsDelta));
              }

              const isDone = status === 'done';
              const stageKeys = ['theory', 'videos', 'notes', 'practice', 'notesRevision', 'mockTest', 'shortNotes', 'completed'];
              const currentStages = st.prepStages || {};
              const updatedStages = {};
              stageKeys.forEach(k => {
                updatedStages[k] = {
                  done: isDone,
                  resource: currentStages[k]?.resource || ''
                };
              });

              return { 
                ...st, 
                status, 
                prepStages: updatedStages,
                completion: isDone ? 100 : 0,
                completedAt: isDone ? (st.completedAt || new Date().toISOString()) : undefined 
              };
            }
            return st;
          });
          
          const totalCompletion = subtopics.reduce((sum, st) => sum + (st.completion || 0), 0);
          const completion = subtopics.length > 0 ? Math.round(totalCompletion / subtopics.length) : 0;
          
          let stage = topic.stage;
          if (completion === 100) stage = 'Completed';
          else if (completion > 75) stage = 'Mock Test';
          else if (completion > 50) stage = 'Revision';
          else if (completion > 25) stage = 'Practice';
          else stage = 'Foundation';
          
          return { ...topic, subtopics, completion, stage };
        })
      };
    }));
  };

  const updateTopicPrepStage = (subjectId, topicId, stageKey, field, value) => {
    setSyllabusData(prevSyllabus => prevSyllabus.map(subject => {
      if (subject.id !== subjectId) return subject;
      return {
        ...subject,
        topics: (subject.topics || []).map(topic => {
          if (topic.id !== topicId) return topic;

          const currentStages = topic.prepStages || {};
          const prevStage = currentStages[stageKey] || { done: false, resource: '' };
          
          let nextDone = prevStage.done;
          let nextResource = prevStage.resource;

          if (field === 'done') {
            nextDone = value;
            if (nextDone !== prevStage.done) {
              const isMains = subject.round && (
                subject.round.toLowerCase().includes('main') || 
                subject.round.toLowerCase().includes('ii') || 
                subject.round.toLowerCase().includes('advanced')
              );
              const pointsDelta = nextDone ? (isMains ? 15 : 10) : (isMains ? -15 : -10);
              setPoints(prevPoints => Math.max(0, prevPoints + pointsDelta));
            }
          } else if (field === 'resource') {
            nextResource = value;
          }

          const updatedStages = {
            ...currentStages,
            [stageKey]: { done: nextDone, resource: nextResource }
          };

          const stageKeys = ['theory', 'videos', 'notes', 'practice', 'notesRevision', 'mockTest', 'shortNotes', 'completed'];
          const doneCount = stageKeys.filter(k => updatedStages[k]?.done).length;
          const completion = Math.round((doneCount / stageKeys.length) * 100);

          let stage = topic.stage;
          if (completion === 100) stage = 'Completed';
          else if (completion > 75) stage = 'Mock Test';
          else if (completion > 50) stage = 'Revision';
          else if (completion > 25) stage = 'Practice';
          else stage = 'Foundation';

          return { ...topic, prepStages: updatedStages, completion, stage };
        })
      };
    }));
  };
  
  const updateTopicDetails = (subjectId, topicId, updates) => {
    setSyllabusData(syllabusData.map(subject => {
      if (subject.id !== subjectId) return subject;
      return {
        ...subject,
        topics: (subject.topics || []).map(topic => 
          topic.id === topicId ? { ...topic, ...updates } : topic
        )
      };
    }));
  };

  const addSubtopic = (subjectId, topicId, subtopic) => {
    setSyllabusData(prevSyllabus => prevSyllabus.map(subject => {
      if (subject.id !== subjectId) return subject;
      return {
        ...subject,
        topics: (subject.topics || []).map(topic => {
          if (topic.id !== topicId) return topic;
          const subtopics = [...(topic.subtopics || []), subtopic];
          const totalCompletion = subtopics.reduce((sum, st) => sum + (st.completion || 0), 0);
          const completion = Math.round(totalCompletion / subtopics.length);
          return { ...topic, subtopics, completion };
        })
      };
    }));
  };

  const deleteSubtopic = (subjectId, topicId, subtopicId) => {
    setSyllabusData(prevSyllabus => prevSyllabus.map(subject => {
      if (subject.id !== subjectId) return subject;
      return {
        ...subject,
        topics: (subject.topics || []).map(topic => {
          if (topic.id !== topicId) return topic;
          const subtopics = (topic.subtopics || []).filter(st => st.id !== subtopicId);
          const totalCompletion = subtopics.reduce((sum, st) => sum + (st.completion || 0), 0);
          const completion = subtopics.length > 0 ? Math.round(totalCompletion / subtopics.length) : 0;
          return { ...topic, subtopics, completion };
        })
      };
    }));
  };

  const updateSubtopicPrepStage = (subjectId, topicId, subtopicId, stageKey, field, value) => {
    setSyllabusData(prevSyllabus => prevSyllabus.map(subject => {
      if (subject.id !== subjectId) return subject;
      return {
        ...subject,
        topics: subject.topics.map(topic => {
          if (topic.id !== topicId) return topic;

          const subtopics = (topic.subtopics || []).map(st => {
            if (st.id !== subtopicId) return st;

            const currentStages = st.prepStages || {};
            const prevStage = currentStages[stageKey] || { done: false, resource: '' };

            let nextDone = prevStage.done;
            let nextResource = prevStage.resource;

            if (field === 'done') {
              nextDone = value;
              if (nextDone !== prevStage.done) {
                const isMains = subject.round && (
                  subject.round.toLowerCase().includes('main') || 
                  subject.round.toLowerCase().includes('ii') || 
                  subject.round.toLowerCase().includes('advanced')
                );
                const pointsDelta = nextDone ? (isMains ? 15 : 10) : (isMains ? -15 : -10);
                setPoints(prevPoints => Math.max(0, prevPoints + pointsDelta));
              }
            } else if (field === 'resource') {
              nextResource = value;
            }

            const updatedStages = {
              ...currentStages,
              [stageKey]: { done: nextDone, resource: nextResource }
            };

            const stageKeys = ['theory', 'videos', 'notes', 'practice', 'notesRevision', 'mockTest', 'shortNotes', 'completed'];
            const doneCount = stageKeys.filter(k => updatedStages[k]?.done).length;
            const completion = Math.round((doneCount / stageKeys.length) * 100);
            const status = completion === 100 ? 'done' : 'pending';

            return { ...st, prepStages: updatedStages, completion, status };
          });

          const totalCompletion = subtopics.reduce((sum, st) => sum + (st.completion || 0), 0);
          const completion = subtopics.length > 0 ? Math.round(totalCompletion / subtopics.length) : 0;

          let stage = topic.stage;
          if (completion === 100) stage = 'Completed';
          else if (completion > 75) stage = 'Mock Test';
          else if (completion > 50) stage = 'Revision';
          else if (completion > 25) stage = 'Practice';
          else stage = 'Foundation';

          return { ...topic, subtopics, completion, stage };
        })
      };
    }));
  };

  // Advanced Functions
  const updateNote = (topicId, text) => {
    setNotes({ ...notes, [topicId]: text });
  };

  const updateShortNote = (topicId, text) => {
    setShortNotes({ ...shortNotes, [topicId]: text });
  };

  const updateMistake = (topicId, text) => {
    setMistakes({ ...mistakes, [topicId]: text });
  };

  const logRevision = (topicId) => {
    const prev = revisions[topicId] || { count: 0 };
    const newCount = prev.count + 1;
    
    const intervals = [1, 3, 7, 15, 30];
    const daysToAdd = intervals[Math.min(newCount - 1, intervals.length - 1)];
    
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + daysToAdd);
    
    setRevisions({
      ...revisions,
      [topicId]: {
        count: newCount,
        lastRevised: new Date().toISOString(),
        nextRevision: nextDate.toISOString()
      }
    });
  };

  // Todo Functions
  const addTodo = (text, date) => {
    setTodos([...todos, { id: Date.now().toString(), text, date, status: 'pending', shiftedCount: 0 }]);
  };

  const toggleTodo = (id) => {
    setTodos(prevTodos => {
      let pointsDelta = 0;
      const updated = prevTodos.map(t => {
        if (t.id === id) {
          const nextStatus = t.status === 'done' ? 'pending' : 'done';
          pointsDelta = nextStatus === 'done' ? 15 : -15;
          return { ...t, status: nextStatus };
        }
        return t;
      });

      const todayDateStr = new Date().toISOString().split('T')[0];
      const todayTasks = updated.filter(t => t.date === todayDateStr);
      const totalToday = todayTasks.length;
      const completedToday = todayTasks.filter(t => t.status === 'done').length;

      let bonusPoints = 0;
      if (pointsDelta > 0 && totalToday > 0) {
        const completionPct = Math.round((completedToday / totalToday) * 100);
        if (completionPct === 100) {
          bonusPoints += 40;
        } else if (completionPct >= 75) {
          bonusPoints += 20;
        } else if (completionPct >= 50) {
          bonusPoints += 10;
        }
      }

      const totalDelta = pointsDelta + bonusPoints;
      if (totalDelta !== 0) {
        setPoints(prevPoints => Math.max(0, prevPoints + totalDelta));
      }

      return updated;
    });
  };

  const shiftTodo = (id, newDate) => {
    setTodos(todos.map(t => {
      if (t.id === id) {
        return { ...t, date: newDate, shiftedCount: t.shiftedCount + 1 };
      }
      return t;
    }));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(t => t.id !== id));
  };

  const loadDemoData = () => {
    setStreak(14);
    setPoints(980);
    setEnrolledExams(['UPSC CSE', 'SSC CGL', 'SSC CHSL']);
    
    // Set custom target date (D-Day) and phases
    const today = new Date();
    const dDayDate = new Date();
    dDayDate.setDate(today.getDate() + 90); // 90 days from now
    const dDayStr = dDayDate.toISOString().split('T')[0];
    setDDay(dDayStr);
    
    const phase1 = new Date();
    phase1.setDate(today.getDate() + 30);
    const phase2 = new Date();
    phase2.setDate(today.getDate() + 60);
    
    setDDayPhases([
      { id: 'ph_demo_1', name: 'Phase 1: Revision Block', date: phase1.toISOString().split('T')[0] },
      { id: 'ph_demo_2', name: 'Phase 2: Full Mocks', date: phase2.toISOString().split('T')[0] },
      { id: 'ph_demo_3', name: 'Final Exam D-Day', date: dDayStr }
    ]);

    setTargetScore(175);

    setDailyStudy([
      { day: 'Mon', hours: 5.5 },
      { day: 'Tue', hours: 6.2 },
      { day: 'Wed', hours: 4.8 },
      { day: 'Thu', hours: 7.0 },
      { day: 'Fri', hours: 5.5 },
      { day: 'Sat', hours: 8.0 },
      { day: 'Sun', hours: 3.5 }
    ]);

    setMockTests([
      { name: 'Mock Test 1', score: 135, date: new Date(today.getTime() - 25 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
      { name: 'Mock Test 2', score: 142, date: new Date(today.getTime() - 20 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
      { name: 'Mock Test 3', score: 155, date: new Date(today.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
      { name: 'Mock Test 4', score: 162, date: new Date(today.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
      { name: 'Mock Test 5', score: 170, date: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] }
    ]);

    const todayStr = today.toISOString().split('T')[0];
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    setTodos([
      { id: 'todo_demo_1', text: 'Revise formula sheets and short notes', date: todayStr, status: 'done', shiftedCount: 0 },
      { id: 'todo_demo_2', text: 'Solve 20 high-yield practice questions', date: todayStr, status: 'pending', shiftedCount: 0 },
      { id: 'todo_demo_3', text: 'Analyze yesterday\'s mock test errors', date: todayStr, status: 'done', shiftedCount: 0 },
      { id: 'todo_demo_4', text: 'Read current affairs updates for the week', date: todayStr, status: 'pending', shiftedCount: 0 },
      { id: 'todo_demo_5', text: 'Take short-notes for new topics', date: yesterdayStr, status: 'done', shiftedCount: 0 }
    ]);

    const sampleNotes = {};
    const sampleShortNotes = {};
    const sampleMistakes = {};
    const sampleRevisions = {};

    const updatedSyllabus = syllabusData.map((subject, sIdx) => {
      const updatedTopics = (subject.topics || []).map((topic, tIdx) => {
        let completion = 0;
        let stage = 'Foundation';
        let prepStages = {
          theory: { done: false, resource: '' },
          videos: { done: false, resource: '' },
          notes: { done: false, resource: '' },
          practice: { done: false, resource: '' },
          notesRevision: { done: false, resource: '' },
          mockTest: { done: false, resource: '' },
          shortNotes: { done: false, resource: '' },
          completed: { done: false, resource: '' }
        };

        if (sIdx === 0 && tIdx === 0) {
          completion = 100;
          stage = 'Completed';
          Object.keys(prepStages).forEach(k => {
            prepStages[k] = { done: true, resource: 'Standard Textbook & Video Lectures' };
          });
          sampleNotes[topic.id] = "Key takeaways: Focus on active recall, summary sheets are attached. Highlighted all important formulas.";
          sampleShortNotes[topic.id] = "Short summary: V. Imp formulas & diagrams logged.";
          sampleMistakes[topic.id] = "Silly mistakes: Avoid calculation errors in simple equations. Read questions carefully before checking choices.";
          sampleRevisions[topic.id] = {
            count: 3,
            lastRevised: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            nextRevision: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString()
          };
        } else if (sIdx === 0 && tIdx === 1) {
          completion = 50;
          stage = 'Revision';
          prepStages.theory = { done: true, resource: 'Video Playlist' };
          prepStages.videos = { done: true, resource: 'YouTube' };
          prepStages.notes = { done: true, resource: 'Self Made Notes' };
          prepStages.practice = { done: true, resource: 'Online Test Series' };
          
          sampleNotes[topic.id] = "Initial notes: Conceptual understanding is solid. Needs spacing review.";
          sampleRevisions[topic.id] = {
            count: 1,
            lastRevised: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            nextRevision: new Date().toISOString()
          };
        } else if (sIdx === 1 && tIdx === 0) {
          completion = 25;
          stage = 'Practice';
          prepStages.theory = { done: true, resource: 'Reference Book Chapter 1' };
          prepStages.videos = { done: true, resource: 'Online Portal' };
        }

        const subtopics = (topic.subtopics || []).map((st, stIdx) => {
          let status = 'pending';
          let stCompletion = 0;
          let stPrepStages = { ...prepStages };

          if (completion === 100) {
            status = 'done';
            stCompletion = 100;
            Object.keys(stPrepStages).forEach(k => {
              stPrepStages[k] = { done: true, resource: 'Standard Textbook & Video Lectures' };
            });
          } else if (completion === 50 && stIdx === 0) {
            status = 'done';
            stCompletion = 100;
            Object.keys(stPrepStages).forEach(k => {
              stPrepStages[k] = { done: true, resource: 'Video Playlist' };
            });
          }

          return {
            ...st,
            status,
            completion: stCompletion,
            prepStages: stPrepStages
          };
        });

        return {
          ...topic,
          completion,
          stage,
          prepStages,
          subtopics
        };
      });

      return {
        ...subject,
        topics: updatedTopics
      };
    });

    setSyllabusData(updatedSyllabus);
    setNotes(sampleNotes);
    setShortNotes(sampleShortNotes);
    setMistakes(sampleMistakes);
    setRevisions(sampleRevisions);
  };

  const resetAllUserData = async () => {
    if (!selectedExam) return;
    
    const matchedStatic = staticExamOptions.find(ex => ex.title.toLowerCase() === selectedExam.toLowerCase());
    
    setNotes({});
    setShortNotes({});
    setMistakes({});
    setRevisions({});
    setMockTests([]);
    setDailyStudy([]);
    setTodos([]);
    setStreak(1);
    setPoints(250);
    setLastLoginDate('');
    setPyqPapers([]);
    setPyqProgress({});
    setPyqCovered({});
    
    setProfileName('Saurabh');
    setProfileAvatarType('emoji');
    setProfileEmoji('👨‍🎓');
    setProfilePicture('');

    setEnrolledExams([selectedExam || 'UPSC CSE']);

    let initialSyllabus = [];
    let initialTargetScore = 0;

    if (matchedStatic) {
      initialSyllabus = JSON.parse(JSON.stringify(matchedStatic.syllabus || []));
      setSyllabusData(initialSyllabus);
      setDDay('');
      setDDayPhases([]);
      setTargetScore(matchedStatic.defaultTargetScore || 0);
      initialTargetScore = matchedStatic.defaultTargetScore || 0;
    } else {
      setSyllabusData([]);
      setDDay('');
      setDDayPhases([]);
      setTargetScore(0);
    }

    const dataToSave = {
      syllabusData: initialSyllabus,
      notes: {},
      shortNotes: {},
      mistakes: {},
      revisions: {},
      mockTests: [],
      dailyStudy: [],
      todos: [],
      dDay: '',
      dDayPhases: [],
      targetScore: initialTargetScore,
      streak: 1,
      points: 250,
      lastLoginDate: '',
      pyqPapers: [],
      pyqProgress: {},
      pyqCovered: {}
    };

    try {
      await apiFetch(`/api/exam/${selectedExam}`, {
        method: 'PUT',
        body: JSON.stringify(dataToSave)
      });
      await apiFetch('/api/auth/profile', {
        method: 'PUT',
        body: JSON.stringify({ name: 'Saurabh', avatarType: 'emoji', emoji: '👨‍🎓', picture: '' })
      });
      await apiFetch('/api/auth/enrolled', {
        method: 'PUT',
        body: JSON.stringify({ enrolledExams: [selectedExam] })
      });
    } catch (e) {
      console.error("Reset data on backend failed", e);
    }
  };

  const importBackup = async (examName, backupData) => {
    try {
      await apiFetch(`/api/exam/${examName}`, {
        method: 'PUT',
        body: JSON.stringify({
          syllabusData: backupData.syllabus || backupData.syllabusData || [],
          notes: backupData.notes || {},
          shortNotes: backupData.shortNotes || {},
          mistakes: backupData.mistakes || {},
          revisions: backupData.revisions || {},
          mockTests: backupData.mockTests || [],
          dailyStudy: backupData.dailyStudy || [],
          todos: backupData.todos || [],
          dDay: backupData.dDay || '',
          dDayPhases: backupData.dDayPhases || [],
          targetScore: backupData.targetScore || 0,
          streak: backupData.streak || 1,
          points: backupData.points || 250,
          lastLoginDate: backupData.lastLoginDate || '',
          pyqPapers: backupData.pyqPapers || [],
          pyqProgress: backupData.pyqProgress || {},
          pyqCovered: backupData.pyqCovered || {}
        })
      });
      await switchExam(examName);
    } catch (err) {
      console.error("Import backup to backend failed", err);
      throw err;
    }
  };

  return (
    <AppContext.Provider value={{
      isAuthenticated, login, signup, logout, sendResetOtp, verifyResetOtp,
      selectedExam, setExam, switchExam,
      syllabusData, setSyllabusData,
      notes, updateNote,
      shortNotes, updateShortNote,
      mistakes, updateMistake,
      revisions, logRevision,
      mockTests, setMockTests, dailyStudy, setDailyStudy,
      todos, addTodo, toggleTodo, shiftTodo, deleteTodo,
      dDay, setDDay,
      dDayPhases, setDDayPhases,
      targetScore, setTargetScore,
      enrolledExams, setEnrolledList,
      customExams, addCustomExam, examStats,
      snapshots, createSnapshot, deleteSnapshot, fetchSnapshots,
      allExamData,
      pyqPapers, setPyqPapers,
      pyqProgress, setPyqProgress,
      pyqCovered, setPyqCovered,
      loadDemoData, resetAllUserData, importBackup,
      addSubject, deleteSubject, addTopic, deleteTopic, updateSubtopicStatus, updateTopicPrepStage, updateSubtopicPrepStage, updateTopicDetails, addSubtopic, deleteSubtopic,
      streak, points, isLoadingExam,
      profileName, profileAvatarType, profileEmoji, profilePicture, updateProfile
    }}>
      {children}
    </AppContext.Provider>
  );
};
