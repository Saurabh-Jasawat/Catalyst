import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import SyllabusTracker from './components/SyllabusTracker';
import Login from './components/Login';
import ExamSetup from './components/ExamSetup';
import Planner from './components/Planner';
import { RevisionPage, AnalyticsPage, NotesPage, AchievementsPage, SettingsPage } from './components/Placeholders';
import { AppProvider, useAppContext } from './context/AppContext';

// Component to protect routes requiring authentication and exam setup
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, selectedExam } = useAppContext();
  
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!selectedExam) return <Navigate to="/setup" replace />;
  
  return children;
};

// Component to protect setup route (must be authenticated but no exam selected)
const SetupRoute = ({ children }) => {
  const { isAuthenticated } = useAppContext();
  
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  
  return children;
};

// Component to protect login route (redirect to home if already logged in)
const AuthRoute = ({ children }) => {
  const { isAuthenticated, selectedExam } = useAppContext();
  
  if (isAuthenticated && selectedExam) return <Navigate to="/" replace />;
  if (isAuthenticated && !selectedExam) return <Navigate to="/setup" replace />;
  
  return children;
};

function AppContent() {
  const { isAuthenticated, selectedExam } = useAppContext();

  // If not authenticated or no exam selected, we don't want the sidebar/header layout
  const isFullPage = !isAuthenticated || !selectedExam;

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#f5f5fa' }}>
      {/* Soft decorative blobs */}
      <div className="fixed top-0 left-60 w-96 h-64 bg-amber-200/30 rounded-full -z-0 blur-3xl pointer-events-none"></div>
      <div className="fixed bottom-0 right-0 w-80 h-80 bg-emerald-200/40 rounded-full -z-0 blur-3xl pointer-events-none"></div>

      {!isFullPage && <Sidebar />}
      <div className="flex flex-col flex-1 overflow-hidden relative z-10">
        {!isFullPage && <Header />}
        <main className={`flex-1 overflow-y-auto ${isFullPage ? '' : 'p-6'}`}>
          <Routes>
            <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} />
            <Route path="/setup" element={<SetupRoute><ExamSetup /></SetupRoute>} />
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/syllabus" element={<ProtectedRoute><SyllabusTracker /></ProtectedRoute>} />
            <Route path="/planner" element={<ProtectedRoute><Planner /></ProtectedRoute>} />
            
            {/* Placeholder Routes */}
            <Route path="/revision" element={<ProtectedRoute><RevisionPage /></ProtectedRoute>} />
            <Route path="/analytics" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
            <Route path="/notes" element={<ProtectedRoute><NotesPage /></ProtectedRoute>} />
            <Route path="/achievements" element={<ProtectedRoute><AchievementsPage /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <Router>
        <AppContent />
      </Router>
    </AppProvider>
  );
}

export default App;
