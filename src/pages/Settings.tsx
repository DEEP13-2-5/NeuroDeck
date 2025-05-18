import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Moon, Sun, AlertTriangle } from 'lucide-react';

const Settings: React.FC = () => {
  const { state } = useAppContext();
  const [theme, setTheme] = useState<'dark' | 'light'>(state.settings.theme);
  const [cardAnimationSpeed, setCardAnimationSpeed] = useState<'slow' | 'medium' | 'fast'>(
    state.settings.cardAnimationSpeed
  );
  
  const handleClearData = () => {
    if (confirm('Are you sure you want to clear all app data? This cannot be undone.')) {
      localStorage.removeItem('neuroDeckState');
      window.location.reload();
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-slate-300">
          Customize your NeuroDeck experience
        </p>
      </div>
      
      {/* Settings sections */}
      <div className="bg-slate-800 rounded-xl shadow-lg mb-8 overflow-hidden">
        <div className="border-b border-slate-700">
          <div className="px-6 py-5">
            <h3 className="text-lg font-medium text-white mb-6">Appearance</h3>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Theme
              </label>
              <div className="flex space-x-3">
                <button
                  onClick={() => setTheme('dark')}
                  className={`flex items-center justify-center w-12 h-12 rounded-lg ${
                    theme === 'dark' 
                      ? 'bg-slate-900 ring-2 ring-indigo-500 text-indigo-400' 
                      : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                  }`}
                >
                  <Moon size={20} />
                </button>
                <button
                  onClick={() => setTheme('light')}
                  className={`flex items-center justify-center w-12 h-12 rounded-lg ${
                    theme === 'light' 
                      ? 'bg-slate-900 ring-2 ring-indigo-500 text-indigo-400' 
                      : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                  }`}
                >
                  <Sun size={20} />
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Card Animation Speed
              </label>
              <div className="flex flex-col sm:flex-row sm:space-x-3 space-y-2 sm:space-y-0">
                {['slow', 'medium', 'fast'].map((speed) => (
                  <button
                    key={speed}
                    onClick={() => setCardAnimationSpeed(speed as any)}
                    className={`px-4 py-2 rounded-lg capitalize ${
                      cardAnimationSpeed === speed 
                        ? 'bg-indigo-600 text-white' 
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    {speed}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-b border-slate-700">
          <div className="px-6 py-5">
            <h3 className="text-lg font-medium text-white mb-6">Study Settings</h3>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Cards Per Study Session
              </label>
              <select className="w-full bg-slate-700 border-slate-600 text-white rounded-lg p-2">
                <option value="10">10</option>
                <option value="20" selected>20</option>
                <option value="30">30</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Daily New Card Limit
              </label>
              <select className="w-full bg-slate-700 border-slate-600 text-white rounded-lg p-2">
                <option value="5">5</option>
                <option value="10" selected>10</option>
                <option value="20">20</option>
                <option value="30">30</option>
                <option value="50">50</option>
              </select>
            </div>
          </div>
        </div>
        
        <div>
          <div className="px-6 py-5">
            <h3 className="text-lg font-medium text-white mb-6">Data Management</h3>
            
            <div className="bg-slate-700 p-4 rounded-lg border border-slate-600 mb-6">
              <div className="flex">
                <AlertTriangle className="h-5 w-5 text-yellow-500 mr-3 flex-shrink-0" />
                <div>
                  <h4 className="text-white font-medium mb-1">Local Storage Only</h4>
                  <p className="text-slate-300 text-sm">
                    Your data is stored locally in your browser. Clearing browser data will erase your flashcards.
                  </p>
                </div>
              </div>
            </div>
            
            <div>
              <button
                onClick={handleClearData}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Clear All Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;