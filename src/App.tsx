import React from 'react';
import { useEffect, useState } from 'react';
import { BrainCog } from 'lucide-react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import DeckView from './pages/DeckView';
import StudySession from './pages/StudySession';
import Stats from './pages/Stats';
import Settings from './pages/Settings';
import { AppProvider } from './context/AppContext';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AppProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white flex flex-col">
        <Header setSidebarOpen={setSidebarOpen} />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/deck/:deckId" element={<DeckView />} />
              <Route path="/study/:deckId" element={<StudySession />} />
              <Route path="/stats" element={<Stats />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </AppProvider>
  );
}

export default App;