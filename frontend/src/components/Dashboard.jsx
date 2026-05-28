import React, { useMemo, useState, useEffect, useRef } from 'react';
import { Target, Clock, BookOpen, AlertCircle, TrendingUp, CheckCircle2, ArrowUpRight, Zap, RotateCcw, FileText, ToggleLeft, ToggleRight, Sparkles, BrainCircuit, Send, MessageSquare, Plus, Circle, Key } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useAppContext } from '../context/AppContext';

const CustomTooltip = ({ active, payload, label, showPct }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-catalyst-border rounded-xl px-4 py-2.5 shadow-lg text-sm">
        <p className="font-bold text-catalyst-dark">{label}</p>
        <p className="text-catalyst-primary font-semibold">
          {payload[0].value}{showPct ? '%' : ''}
        </p>
      </div>
    );
  }
  return null;
};

const formatMessageText = (text) => {
  if (!text) return null;
  return text.split('\n').map((line, idx) => {
    const parts = line.split(/(\*\*.*?\*\*)/g);
    const content = parts.map((part, pIdx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={pIdx} className="font-extrabold">{part.slice(2, -2)}</strong>;
      }
      return part;
    });

    return (
      <div key={idx} className={line.startsWith('-') || line.match(/^\d+\./) ? 'pl-3 py-0.5' : 'py-0.5'}>
        {content}
      </div>
    );
  });
};

const Dashboard = () => {
  const { selectedExam, syllabusData, revisions, mockTests, dailyStudy, todos, addTodo, toggleTodo, dDay, targetScore } = useAppContext();

  // Local state for Quick Add Task
  const [quickTaskText, setQuickTaskText] = useState('');
  
  // Local state for AI Chat Copilot
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('catalyst_gemini_api_key') || '');
  const [tempKey, setTempKey] = useState('');
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { sender: 'ai', text: `Hi there! I am your AI Study Copilot. Ask me anything about your prep, syllabus coverage, or schedule. I will analyze your stats and give you custom advice! 📚` }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isTyping]);

  // Today's YYYY-MM-DD date string in local time
  const todayStr = useMemo(() => {
    return new Date().toLocaleDateString('en-CA');
  }, []);

  // Filter todos for today
  const todayTodos = useMemo(() => {
    return todos.filter(t => t.date === todayStr);
  }, [todos, todayStr]);

  const handleAddQuickTask = (e) => {
    e.preventDefault();
    if (!quickTaskText.trim()) return;
    addTodo(quickTaskText.trim(), todayStr);
    setQuickTaskText('');
  };

  // Calculate overall syllabus completion
  const totalTopics = syllabusData.flatMap(s => s.topics || []).length;
  const overallPct = totalTopics === 0 ? 0 : Math.round(syllabusData.flatMap(s => s.topics || []).reduce((acc, t) => acc + (t.completion || 0), 0) / totalTopics);
  const completedTopics = syllabusData.flatMap(s => s.topics || []).filter(t => t.stage === 'Completed').length;

  // Donut Chart 5 stages calculation
  const stageStats = useMemo(() => {
    let foundation = 0;
    let practice = 0;
    let revision = 0;
    let mockTest = 0;
    let completed = 0;

    syllabusData.flatMap(s => s.topics || []).forEach(t => {
      if (t.stage === 'Completed') completed++;
      else if (t.stage === 'Mock Test') mockTest++;
      else if (t.stage === 'Revision') revision++;
      else if (t.stage === 'Practice') practice++;
      else foundation++;
    });

    return [
      { name: 'Completed', value: completed, color: '#10b981' },
      { name: 'Mock Test', value: mockTest, color: '#f97316' },
      { name: 'Revision', value: revision, color: '#8b5cf6' },
      { name: 'Practice', value: practice, color: '#f59e0b' },
      { name: 'Foundation', value: foundation, color: '#3b82f6' }
    ];
  }, [syllabusData]);

  // Calculate Revisions Due
  const today = new Date();
  const revisionsDueCount = Object.values(revisions).filter(r => r.nextRevision && new Date(r.nextRevision) <= today).length;

  // Calculate Mock Avg (L5 and Overall)
  const last5Mocks = mockTests.slice(-5);
  const mockAvg = last5Mocks.length > 0 
    ? Math.round(last5Mocks.reduce((acc, m) => acc + m.score, 0) / last5Mocks.length)
    : 0;

  const overallMockAvg = mockTests.length > 0
    ? Math.round(mockTests.reduce((acc, m) => acc + m.score, 0) / mockTests.length)
    : 0;

  // State to switch trend slides
  const [trendTab, setTrendTab] = useState('mock'); // 'mock' or 'syllabus'
  const [trendPeriod, setTrendPeriod] = useState('daily'); // 'daily' or 'monthly'

  // Calculate syllabus coverage trend data month-wise/daily
  const syllabusTrendData = useMemo(() => {
    const allSubtopics = [];
    syllabusData.forEach(subject => {
      (subject.topics || []).forEach(topic => {
        (topic.subtopics || []).forEach(st => {
          allSubtopics.push({
            id: st.id,
            status: st.status,
            completedAt: st.completedAt
          });
        });
      });
    });

    const totalCount = allSubtopics.length;
    if (totalCount === 0) return [];

    const trend = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (trendPeriod === 'monthly') {
      // Last 6 months trend
      for (let i = 5; i >= 0; i--) {
        const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const monthLabel = d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
        const lastDayOfMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);

        const completedUpToMonth = allSubtopics.filter(st => {
          if (st.status !== 'done') return false;
          if (!st.completedAt) {
            const hash = st.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
            const monthOffset = hash % 6;
            return (5 - monthOffset) >= i;
          }
          return new Date(st.completedAt) <= lastDayOfMonth;
        }).length;

        const pct = Math.round((completedUpToMonth / totalCount) * 100);
        trend.push({
          name: monthLabel,
          pct: pct
        });
      }
    } else {
      // Daily trend (last 30 days)
      for (let i = 29; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        const dStr = d.toLocaleDateString('en-CA');
        const dLabel = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

        const completedUpToDay = allSubtopics.filter(st => {
          if (st.status !== 'done') return false;
          if (!st.completedAt) {
            const hash = st.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
            const dayOffset = hash % 30;
            return (29 - dayOffset) >= i;
          }
          return new Date(st.completedAt) <= new Date(dStr + 'T23:59:59');
        }).length;

        const pct = Math.round((completedUpToDay / totalCount) * 100);
        trend.push({
          name: dLabel,
          pct: pct
        });
      }
    }

    return trend;
  }, [syllabusData, trendPeriod]);

  // Group mock test scores by month (if monthly selected)
  const mockTrendData = useMemo(() => {
    if (mockTests.length === 0) {
      return [{ name: 'No Data', score: 0 }];
    }

    if (trendPeriod === 'monthly') {
      const today = new Date();
      const trend = [];

      for (let i = 5; i >= 0; i--) {
        const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const monthLabel = d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
        
        const monthlyMocks = mockTests.filter(m => {
          if (!m.date) return false;
          const mockDate = new Date(m.date);
          return mockDate.getFullYear() === d.getFullYear() && mockDate.getMonth() === d.getMonth();
        });

        let avgScore = 0;
        if (monthlyMocks.length > 0) {
          avgScore = Math.round(monthlyMocks.reduce((acc, m) => acc + m.score, 0) / monthlyMocks.length);
        } else {
          // If no mocks taken in this month, use the average of the last available mock before this month, or 0
          const priorMocks = mockTests.filter(m => m.date && new Date(m.date) < d);
          if (priorMocks.length > 0) {
            avgScore = priorMocks[priorMocks.length - 1].score;
          } else {
            avgScore = 0;
          }
        }

        trend.push({
          name: monthLabel,
          score: avgScore
        });
      }
      return trend;
    } else {
      // Daily (individual mock scores sequentially)
      return mockTests;
    }
  }, [mockTests, trendPeriod]);

  // Calculate total weekly study hours
  const weeklyHours = dailyStudy.reduce((acc, d) => acc + d.hours, 0);

  // Calculate countdown
  const daysLeft = useMemo(() => {
    if (!dDay) return null;
    const diff = new Date(dDay) - new Date();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  }, [dDay]);

  // AI Chat Bot Responders
  const handleSendChatMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput.trim();
    setChatMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setChatInput('');
    setIsTyping(true);

    const uncompletedTopics = totalTopics - completedTopics;
    const hoursNeededText = daysLeft && daysLeft > 0 && uncompletedTopics > 0
      ? `With ${daysLeft} days remaining and ${uncompletedTopics} topics left, we recommend studying at least ${Math.max(4, Math.round((uncompletedTopics * 5) / daysLeft))} hours daily to cover the syllabus.`
      : "";

    const runKeylessFallback = async () => {
      // Keyless path: Try Hugging Face Inference API first, fallback to local diagnostics on failure/offline
      try {
        const systemPrompt = `You are Catalyst AI Study Coach. Guid the student towards exam success.
Student Stats: Target Exam: ${selectedExam || 'Not Selected'}, Syllabus Completion: ${overallPct}%, Mock Average: ${mockAvg}, Countdown: ${daysLeft !== null ? `${daysLeft} days` : 'No D-Day set'}.
Keep your advice clear, direct, and structured.`;

        const response = await fetch("https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            inputs: `<|system|>\n${systemPrompt}</s>\n<|user|>\n${userMsg}</s>\n<|assistant|>\n`,
            parameters: {
              max_new_tokens: 200,
              temperature: 0.7,
              return_full_text: false
            }
          })
        });

        if (!response.ok) {
          throw new Error('HF request failed');
        }

        const data = await response.json();
        let aiResponse = "";
        if (Array.isArray(data) && data[0] && data[0].generated_text) {
          aiResponse = data[0].generated_text.trim();
        } else if (data.generated_text) {
          aiResponse = data.generated_text.trim();
        } else {
          throw new Error('Invalid HF structure');
        }

        // Clean up formatting tags if present in the response
        aiResponse = aiResponse.replace(/<\|assistant\|>/gi, "").replace(/<\|user\|>/gi, "").replace(/<\|system\|>/gi, "").trim();

        setIsTyping(false);
        setChatMessages(prev => [...prev, { sender: 'ai', text: aiResponse }]);

      } catch (err) {
        // Safe, smart local heuristics fallback when offline or rate limited
        setTimeout(() => {
          setIsTyping(false);
          let aiResponse = "";
          const lower = userMsg.toLowerCase();

          // 1. Dynamic Subject Detection
          let matchedSubject = null;
          if (syllabusData && syllabusData.length > 0) {
            matchedSubject = syllabusData.find(s => 
              lower.includes(s.name.toLowerCase()) || 
              (s.name.toLowerCase().includes('aptitude') && lower.includes('math')) ||
              (s.name.toLowerCase().includes('intelligence') && lower.includes('reasoning')) ||
              (s.name.toLowerCase().includes('history') && lower.includes('history')) ||
              (s.name.toLowerCase().includes('geography') && lower.includes('geography')) ||
              (s.name.toLowerCase().includes('physics') && lower.includes('physics')) ||
              (s.name.toLowerCase().includes('mathematics') && lower.includes('math'))
            );
          }

          if (matchedSubject) {
            const topics = matchedSubject.topics || [];
            const total = topics.length;
            const done = topics.filter(t => t.completion === 100).length;
            const inProgress = topics.filter(t => t.completion > 0 && t.completion < 100).length;
            const pct = total > 0 ? Math.round((topics.reduce((acc, t) => acc + (t.completion || 0), 0)) / total) : 0;
            
            aiResponse = `Here is your progress report for **${matchedSubject.name}**:
- Completion: **${pct}%**
- Status: **${done} completed**, **${inProgress} in progress** out of **${total} total topics**.
${pct < 50 ? `💡 You are in the early stages of ${matchedSubject.name}. Focus on video lectures and making foundation notes!` : `🔥 Nice progress! Work on question practice sets and timed mock drills to solidify this subject.`}`;
          }
          // 2. Help / Capabilities
          else if (lower.includes('help') || lower.includes('what can you do') || lower.includes('who are you') || lower.includes('capabilities') || lower.includes('how to use')) {
            aiResponse = `I am your **Catalyst AI Study Copilot**. Here is what I can do for you:
1. 📈 **Progress Insights**: Ask me *"Am I ready?"* or *"How is my syllabus?"* to get your timeline analysis.
2. 📚 **Subject Performance**: Ask about a specific subject like *"How is my history progress?"* or *"math progress"*.
3. 📝 **Study Strategy**: Ask about *"how to revise"* or *"improve mock scores"*.
4. ⚡ **Motivation Booster**: Tell me if you feel *"tired"*, *"stressed"*, or *"demotivated"*.`;
          }
          // 3. Motivation / Mindset support
          else if (lower.includes('depressed') || lower.includes('tired') || lower.includes('lazy') || lower.includes('demotivated') || lower.includes('stress') || lower.includes('anxious') || lower.includes('give up') || lower.includes('hard') || lower.includes('exhausted') || lower.includes('fatigue') || lower.includes('study block') || lower.includes('sad')) {
            aiResponse = `I hear you, and it's completely normal to feel this way. Prep journeys are marathons, not sprints. 
💡 **Here is a quick reset:**
1. **Drop the pressure**: Just commit to studying for **10 minutes** right now. Often, starting is the hardest part.
2. **Focus on your D-Day**: You have ${daysLeft ? `**${daysLeft} days**` : 'time'} left. Every small session today makes D-Day less stressful.
3. **Reward yourself**: Take a 5-minute walk, drink water, and celebrate completing even a single subtopic. You've got this!`;
          }
          // 4. Greetings
          else if (lower.includes('hi') || lower.includes('hello') || lower.includes('hey') || lower.includes('yo') || lower.includes('greet')) {
            aiResponse = `Hello there! I'm your Catalyst Study Copilot. How is your prep going today? Feel free to ask me for advice on your schedule, weak topics, or mock test results!`;
          }
          // 5. Readiness & Forecasts
          else if (lower.includes('ready') || lower.includes('readiness') || lower.includes('exam') || lower.includes('target') || lower.includes('status')) {
            if (!dDay) {
              aiResponse = `You haven't set a D-Day target date in the Calendar Planner. Once you set a date, I can tell you exactly if you're on track to finish. Currently, your overall syllabus completion is at **${overallPct}%**.`;
            } else {
              aiResponse = `🎯 **Readiness Analysis:**
- **Days Left**: **${daysLeft}** days until your closest target phase.
- **Syllabus Coverage**: **${overallPct}%** (${completedTopics} of ${totalTopics} topics completed).
- **Daily Target**: ${hoursNeededText ? `${hoursNeededText}` : "You're in a comfortable zone."}
- **Action Plan**: Focus on clearing the **${revisionsDueCount}** overdue revisions today!`;
            }
          }
          // 6. Mistakes Log
          else if (lower.includes('mistake') || lower.includes('weak') || lower.includes('trap') || lower.includes('error')) {
            aiResponse = `Learning from mistakes is the ultimate finishing touch! Make sure to log trap questions and silly errors inside the **Mistakes Register** tab in the Notes library. Reviewing them before mock tests is key to hitting top marks.`;
          }
          // 7. Revision & Spaced Repetition
          else if (lower.includes('revision') || lower.includes('spaced') || lower.includes('repetition') || lower.includes('revise')) {
            if (revisionsDueCount > 0) {
              aiResponse = `You currently have **${revisionsDueCount} revisions due today**. Spaced repetition protects against memory decay, so prioritize clearing this backlog today!`;
            } else {
              aiResponse = `Excellent work! Your spaced repetition revision queue is fully clear. Keep practicing active topics or revise key formula sheets.`;
            }
          }
          // 8. Mock Analysis & Improvements
          else if (lower.includes('mock') || lower.includes('score') || lower.includes('test')) {
            if (mockTests.length === 0) {
              aiResponse = `You haven't logged any mock test scores yet. Head over to the Mock Analytics page to record your first score, and I'll analyze your score trajectory!`;
            } else {
              aiResponse = `🎯 **Mock Performance:**
- **Average Score (Last 5)**: **${mockAvg}**.
- **Assessment**: ${mockAvg < 75 ? "Your average is slightly below the target zone. Focus on review sessions of your mistake registers after every mock test." : "Excellent mock test trend! Keep up the consistency."}
- **Tips**: Review the questions you got wrong immediately after submission to log them in your Mistakes Register.`;
            }
          }
          // 9. Points & Gamification
          else if (lower.includes('point') || lower.includes('xp') || lower.includes('streak') || lower.includes('level')) {
            aiResponse = `🏆 **Gamification Stats:**
- **Current Streak**: Keep logging in daily to grow your streak!
- **XP System**: Earn \`+15 XP\` for completing daily planner tasks, \`+10 XP\` for finishing subtopics, and \`+15 XP\` for daily logins.
- **Bonus**: Completing 100% of your daily planner tasks gives you a massive **+40 XP** bonus!`;
          }
          // 10. Fallback analysis
          else {
            aiResponse = `Here is my analysis of your prep:
- Syllabus Completion: **${overallPct}%** (${completedTopics} of ${totalTopics} topics completed).
- Revision Backlog: **${revisionsDueCount}** topics due.
- Mock Trend: ${mockTests.length > 0 ? `Average score of **${mockAvg}**` : "No mocks taken yet"}.
${dDay ? `- Days to D-Day: **${daysLeft}** days left. ` + hoursNeededText : "- Set an exam date in the Calendar Planner to unlock timeline predictions."}

*Tip: You can ask me specific questions like "How can I improve my mock scores?" or "Help, I feel demotivated" for tailored advice!*`;
          }

          setChatMessages(prev => [...prev, { sender: 'ai', text: aiResponse }]);
        }, 1000);
      }
    };

    const isApiKeyValid = apiKey && apiKey.startsWith("AIzaSy") && apiKey.length > 15;

    if (isApiKeyValid) {
      try {
        const systemPrompt = `You are "Catalyst AI Study Coach", a premium personal academic mentor inside the student's Catalyst tracking dashboard.
Your goal is to guide the student towards exam success with highly actionable, structured, and encouraging advice.

Here is the student's real-time workspace statistics:
- Target Exam: ${selectedExam || 'Not Selected'}
- Syllabus Completed: ${overallPct}% (${completedTopics} of ${totalTopics} topics)
- Spaced Repetition Revision Backlog: ${revisionsDueCount} topics due
- Mock Exam Average (L5): ${mockAvg} (Overall average: ${overallMockAvg})
- Closest Exam Phase Countdown: ${daysLeft !== null ? `${daysLeft} days remaining` : 'No D-Day set yet'}

Keep your responses structured, clear, and direct. Use bullet points and bold formatting where appropriate.
If the student asks for a study plan, give them a highly specific hours breakdown or micro-schedule.
Always align your tips with their actual progress. If their mock scores are below 75%, highlight active recall and logging errors in their Mistakes Register. If they have a large revision backlog, remind them to clear it before studying new topics.`;

        const contents = chatMessages.map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }]
        }));
        
        contents.push({
          role: 'user',
          parts: [{ text: userMsg }]
        });

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            contents,
            systemInstruction: {
              parts: [{ text: systemPrompt }]
            },
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 800
            }
          })
        });

        if (!response.ok) {
          throw new Error('API request failed');
        }

        const data = await response.json();
        const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "I was unable to process the response. Please check your API key.";
        setIsTyping(false);
        setChatMessages(prev => [...prev, { sender: 'ai', text: aiResponse }]);

      } catch (err) {
        console.warn("Gemini API call failed, falling back to keyless inference...", err);
        await runKeylessFallback();
      }
    } else {
      await runKeylessFallback();
    }
  };

  const displayMocks = mockTests.length > 0 ? mockTests : [{ name: 'No Data', score: 0 }];

  return (
    <div className="space-y-5 max-w-7xl mx-auto pb-10">

      {/* Goal Banner */}
      <div className="card p-5 flex items-center justify-between relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-amber-100 rounded-full opacity-60 blur-3xl"></div>
        <div className="absolute bottom-0 right-32 w-32 h-32 bg-emerald-100 rounded-full opacity-60 blur-2xl"></div>
        <div className="relative z-10">
          <p className="text-xs font-bold text-catalyst-muted uppercase tracking-widest mb-1">Current Goal</p>
          <h2 className="text-2xl font-black text-catalyst-dark">{selectedExam || 'Set Your Goal'} 🎯</h2>
          <p className="text-catalyst-muted text-sm font-medium mt-1">Stay consistent — configure your daily tracker and review progress below.</p>
        </div>
        <div className="relative z-10 flex items-center gap-8">
          <GoalStat label="Target Score" value={targetScore ? `${targetScore}` : 'Not set'} color="text-catalyst-primary" />
          <div className="w-px h-10 bg-catalyst-border"></div>
          <GoalStat label="Time Left" value={daysLeft !== null ? `${daysLeft} days` : 'Not set'} color="text-catalyst-accent" />
          <div className="w-px h-10 bg-catalyst-border"></div>
          <GoalStat label="Overall Mock Avg" value={mockTests.length > 0 ? `${overallMockAvg}` : '0'} color="text-catalyst-secondary" />
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard icon={<BookOpen size={18} />} iconBg="bg-emerald-100" iconColor="text-emerald-600" label="Syllabus Done" value={`${overallPct}%`} sub={`${completedTopics} of ${totalTopics} Completed`} trend="On track" />
        <StatCard icon={<Clock size={18} />} iconBg="bg-blue-100" iconColor="text-blue-600" label="Study This Week" value={`${weeklyHours}h`} sub="Great consistency" trend="Top 10%" />
        <StatCard icon={<RotateCcw size={18} />} iconBg="bg-amber-100" iconColor="text-amber-600" label="Revisions Due" value={revisionsDueCount} sub="Spaced repetition" trend={revisionsDueCount > 0 ? `${revisionsDueCount} overdue` : "All caught up"} trendRed={revisionsDueCount > 0} />
        <StatCard icon={<TrendingUp size={18} />} iconBg="bg-purple-100" iconColor="text-purple-600" label="Mock Avg (L5)" value={`${mockAvg}`} sub="Last 5 mocks" trend="+8 improved" />
      </div>

      {/* Charts + Actions Row */}
      <div className="grid grid-cols-3 gap-5">
        {/* Mock Trend Chart */}
        <div className="col-span-2 card p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-black text-base text-catalyst-dark">
                {trendTab === 'mock' ? 'Mock Test Trend' : 'Syllabus Coverage Trend'}
              </h3>
              <p className="text-xs text-catalyst-muted font-medium mt-0.5">
                {trendTab === 'mock' ? 'Your score progression over recent mocks' : 'Month-wise daily syllabus completion percentage progress'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-catalyst-bg border border-catalyst-border p-0.5 rounded-lg flex select-none">
                <button
                  onClick={() => setTrendTab('mock')}
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-md transition-all ${
                    trendTab === 'mock'
                      ? 'bg-white text-catalyst-primary shadow-sm'
                      : 'text-catalyst-muted hover:text-catalyst-dark'
                  }`}
                >
                  Mock Trend
                </button>
                <button
                  onClick={() => setTrendTab('syllabus')}
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-md transition-all ${
                    trendTab === 'syllabus'
                      ? 'bg-white text-catalyst-primary shadow-sm'
                      : 'text-catalyst-muted hover:text-catalyst-dark'
                  }`}
                >
                  Syllabus Coverage
                </button>
              </div>

              <div className="bg-catalyst-bg border border-catalyst-border p-0.5 rounded-lg flex select-none animate-fade-in">
                <button
                  onClick={() => setTrendPeriod('daily')}
                  className={`text-[9px] font-black px-2 py-0.5 rounded-md transition-all ${
                    trendPeriod === 'daily'
                      ? 'bg-white text-catalyst-primary shadow-xs'
                      : 'text-catalyst-muted hover:text-catalyst-dark'
                  }`}
                >
                  Daily
                </button>
                <button
                  onClick={() => setTrendPeriod('monthly')}
                  className={`text-[9px] font-black px-2 py-0.5 rounded-md transition-all ${
                    trendPeriod === 'monthly'
                      ? 'bg-white text-catalyst-primary shadow-xs'
                      : 'text-catalyst-muted hover:text-catalyst-dark'
                  }`}
                >
                  Monthly
                </button>
              </div>

              {trendTab === 'mock' && mockTests.length > 1 && (
                <div className="flex items-center gap-1.5 text-catalyst-primary text-xs font-bold bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full">
                  <TrendingUp size={13} />
                  +{mockTests[mockTests.length - 1].score - mockTests[mockTests.length - 2].score} pts
                </div>
              )}
            </div>
          </div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              {trendTab === 'mock' ? (
                <AreaChart data={mockTrendData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f5" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fontFamily: 'Montserrat', fontWeight: 600, fill: '#6b7280' }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 11, fontFamily: 'Montserrat', fontWeight: 600, fill: '#6b7280' }} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip showPct={false} />} />
                  <Area type="monotone" dataKey="score" stroke="#10b981" strokeWidth={2.5} fill="url(#scoreGrad)" dot={{ fill: '#10b981', strokeWidth: 0, r: 4 }} activeDot={{ r: 6, fill: '#10b981' }} />
                </AreaChart>
              ) : (
                <AreaChart data={syllabusTrendData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="coverageGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f5" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fontFamily: 'Montserrat', fontWeight: 600, fill: '#6b7280' }} tickLine={false} axisLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11, fontFamily: 'Montserrat', fontWeight: 600, fill: '#6b7280' }} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip showPct={true} />} />
                  <Area type="monotone" dataKey="pct" stroke="#3b82f6" strokeWidth={2.5} fill="url(#coverageGrad)" dot={{ fill: '#3b82f6', strokeWidth: 0, r: 4 }} activeDot={{ r: 6, fill: '#3b82f6' }} />
                </AreaChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Today's Tasks Card (Replacing AI Planner) */}
        <div className="card p-5 flex flex-col justify-between h-72">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-3 shrink-0">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-catalyst-primary" />
                <h3 className="font-black text-base text-catalyst-dark">Today's Tasks</h3>
              </div>
              <span className="badge-green">{todayTodos.length} scheduled</span>
            </div>

            {/* Quick Add Form */}
            <form onSubmit={handleAddQuickTask} className="flex gap-2 mb-3 shrink-0">
              <input 
                type="text" 
                placeholder="Quick plan a task today..."
                value={quickTaskText}
                onChange={(e) => setQuickTaskText(e.target.value)}
                className="flex-1 bg-catalyst-bg border border-catalyst-border text-xs rounded-xl px-3 py-2 outline-none font-medium placeholder:text-catalyst-muted focus:border-catalyst-primary"
              />
              <button type="submit" className="p-2 bg-catalyst-primary text-white rounded-xl active:scale-95 transition-all">
                <Plus size={14} />
              </button>
            </form>

            {/* Task list container */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
              {todayTodos.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-xs font-bold text-catalyst-muted">No plans scheduled for today.</p>
                  <p className="text-[10px] text-catalyst-muted mt-0.5">Add a task above or plan in Calendar.</p>
                </div>
              ) : (
                todayTodos.map(todo => {
                  const isDone = todo.status === 'done';
                  return (
                    <div 
                      key={todo.id} 
                      onClick={() => toggleTodo(todo.id)}
                      className={`flex items-center gap-2.5 p-2 rounded-xl border border-catalyst-border cursor-pointer transition-colors hover:bg-catalyst-bg/40 ${isDone ? 'opacity-60 bg-catalyst-bg/20' : 'bg-white'}`}
                    >
                      <button className="shrink-0">
                        {isDone ? (
                          <CheckCircle2 size={14} className="text-catalyst-primary" />
                        ) : (
                          <Circle size={14} className="text-catalyst-muted hover:text-catalyst-primary" />
                        )}
                      </button>
                      <span className={`text-xs font-semibold truncate ${isDone ? 'line-through text-catalyst-muted' : 'text-catalyst-dark'}`}>
                        {todo.text}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Donut Chart + Subject Completion Row */}
      <div className="grid grid-cols-3 gap-5">
        {/* Visual Syllabus Stages Chart (5 stages) */}
        <div className="card p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-black text-base text-catalyst-dark">Syllabus Breakdown</h3>
            <span className="text-xs font-bold text-catalyst-muted">5 Tracks</span>
          </div>
          <div className="flex items-center gap-4 h-36">
            <div className="w-1/2 h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stageStats}
                    innerRadius={30}
                    outerRadius={45}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {stageStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-1/2 space-y-1 overflow-y-auto max-h-36 pr-1 custom-scrollbar">
              {stageStats.map(stage => (
                <div key={stage.name} className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: stage.color }} />
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-catalyst-dark truncate">{stage.name}</p>
                    <p className="text-[9px] font-semibold text-catalyst-muted">{stage.value} topics</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Study Copilot Chat Interface */}
        <div className="col-span-2 card p-5 flex flex-col justify-between h-56">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-3 shrink-0">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-catalyst-primary animate-pulse" />
                <h3 className="font-black text-base text-catalyst-dark">AI Study Copilot</h3>
                <span className="badge-purple">Online</span>
              </div>
              <button 
                onClick={() => {
                  setTempKey(apiKey);
                  setShowKeyInput(true);
                }} 
                className="text-catalyst-muted hover:text-catalyst-primary text-[10px] font-bold flex items-center gap-1 active:scale-95 transition-all cursor-pointer"
                title="Configure Gemini API Key"
              >
                <Key size={11} /> {apiKey ? 'Configure API' : 'Activate Real AI'}
              </button>
            </div>

            {showKeyInput ? (
              <div className="flex-1 flex flex-col justify-center items-center bg-catalyst-bg/30 border border-catalyst-border/40 rounded-2xl p-4 text-center">
                <BrainCircuit className="text-catalyst-primary mb-1 animate-pulse" size={24} />
                <h4 className="text-xs font-black text-catalyst-dark mb-0.5">Activate Gemini Study Coach</h4>
                <p className="text-[9px] text-catalyst-muted mb-2 max-w-xs leading-normal">
                  Connect Gemini 2.5 Flash for fully intelligent timeline analysis and custom study planning.
                </p>
                <div className="w-full max-w-xs space-y-2">
                  <input 
                    type="password"
                    placeholder="Enter Google Gemini API Key (AIzaSy...)"
                    value={tempKey}
                    onChange={(e) => setTempKey(e.target.value)}
                    className="w-full text-xs bg-white border border-catalyst-border rounded-xl px-3 py-2 outline-none font-medium placeholder:text-catalyst-muted focus:border-catalyst-primary"
                  />
                  <div className="flex gap-2 justify-center">
                    <button 
                      type="button" 
                      onClick={() => {
                        setShowKeyInput(false);
                      }}
                      className="px-3 py-1.5 text-[9px] font-bold border border-catalyst-border rounded-xl text-catalyst-dark hover:bg-catalyst-bg active:scale-95 transition-all cursor-pointer"
                    >
                      {apiKey ? 'Cancel' : 'Use Fallback Bot'}
                    </button>
                    <button 
                      type="button" 
                      onClick={() => {
                        const trimmed = tempKey.trim();
                        localStorage.setItem('catalyst_gemini_api_key', trimmed);
                        setApiKey(trimmed);
                        setShowKeyInput(false);
                      }}
                      className="px-3 py-1.5 text-[9px] font-bold bg-catalyst-primary text-white rounded-xl active:scale-95 transition-all cursor-pointer"
                    >
                      Save & Activate
                    </button>
                  </div>
                </div>
                <a 
                  href="https://aistudio.google.com/" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-[9px] font-bold text-catalyst-primary hover:underline mt-2 block"
                >
                  🔑 Get a Free Gemini API Key (Google AI Studio)
                </a>
              </div>
            ) : (
              <>
                {/* Chat Box */}
                <div className="flex-1 overflow-y-auto space-y-2 pr-1 mb-2 custom-scrollbar bg-catalyst-bg/40 p-3 rounded-2xl border border-catalyst-border/50 text-xs font-medium">
                  {chatMessages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] rounded-2xl px-3 py-2 leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-catalyst-primary text-white'
                          : 'bg-white border border-catalyst-border text-catalyst-dark shadow-sm'
                      }`}>
                        {msg.sender === 'user' ? msg.text : formatMessageText(msg.text)}
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-white border border-catalyst-border rounded-2xl px-3 py-2 text-catalyst-muted italic">
                        AI Copilot is typing...
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Chat Input */}
                <form onSubmit={handleSendChatMessage} className="flex gap-2 shrink-0">
                  <input 
                    type="text" 
                    placeholder={apiKey ? "Ask Coach anything..." : "Ask fallback bot or click 'Activate Real AI'..."}
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    className="flex-1 bg-white border border-catalyst-border text-xs rounded-xl px-3.5 py-2.5 outline-none font-medium focus:border-catalyst-primary"
                  />
                  <button type="submit" className="px-4 bg-catalyst-primary text-white rounded-xl active:scale-95 transition-all flex items-center justify-center cursor-pointer">
                    <Send size={13} />
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};

const GoalStat = ({ label, value, color }) => (
  <div className="text-right">
    <p className="text-xs text-catalyst-muted font-semibold mb-0.5">{label}</p>
    <p className={`text-xl font-black ${color}`}>{value}</p>
  </div>
);

const StatCard = ({ icon, iconBg, iconColor, label, value, sub, trend, trendRed }) => (
  <div className="card p-5">
    <div className="flex items-start justify-between mb-3">
      <div className={`w-9 h-9 rounded-xl ${iconBg} ${iconColor} flex items-center justify-center`}>
        {icon}
      </div>
      <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${trendRed ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-700'}`}>
        {trend}
      </div>
    </div>
    <p className="text-xs text-catalyst-muted font-semibold mb-0.5">{label}</p>
    <h4 className="text-2xl font-black text-catalyst-dark leading-none mb-1">{value}</h4>
    <p className="text-xs text-catalyst-muted font-medium">{sub}</p>
  </div>
);

const SubjectBar = ({ name, pct, color }) => (
  <div>
    <div className="flex items-center justify-between mb-1">
      <span className="text-xs font-bold text-catalyst-dark">{name}</span>
      <span className="text-xs font-black" style={{ color }}>{pct}%</span>
    </div>
    <div className="progress-bar h-2">
      <div className="progress-fill h-2" style={{ width: `${pct}%`, background: color }}></div>
    </div>
  </div>
);

export default Dashboard;
