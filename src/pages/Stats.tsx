import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import ProgressGraph from '../components/ProgressGraph';
import { formatDate, calculateStreak, getPastWeekDates, getPastYearMonths } from '../utils/dateUtils';

const Stats: React.FC = () => {
  const { state } = useAppContext();
  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month' | 'year'>('week');
  
  // Calculate study dates
  const studyDates = state.studyLogs.map(log => log.timestamp);
  const streak = calculateStreak(studyDates);
  
  // Calculate total reviews
  const totalReviews = state.studyLogs.length;
  const correctReviews = state.studyLogs.filter(log => log.known).length;
  const retentionRate = totalReviews > 0 
    ? Math.round((correctReviews / totalReviews) * 100) 
    : 0;
  
  // Calculate review data by timeframe
  const pastWeek = getPastWeekDates();
  const pastMonths = getPastYearMonths();
  
  // Group logs by date for the heatmap
  const logsByDate = new Map<string, number>();
  
  state.studyLogs.forEach(log => {
    const date = log.timestamp.split('T')[0];
    logsByDate.set(date, (logsByDate.get(date) || 0) + 1);
  });
  
  // Find max reviews in a day for coloring
  const maxDailyReviews = Math.max(...Array.from(logsByDate.values()), 1);
  
  // Calculate color intensity based on number of reviews
  const getColorIntensity = (count: number): string => {
    if (count === 0) return 'bg-slate-800';
    
    const intensity = Math.min(Math.ceil((count / maxDailyReviews) * 5), 5);
    
    switch (intensity) {
      case 1: return 'bg-indigo-900';
      case 2: return 'bg-indigo-800';
      case 3: return 'bg-indigo-700';
      case 4: return 'bg-indigo-600';
      case 5: return 'bg-indigo-500';
      default: return 'bg-slate-800';
    }
  };
  
  // Generate last 90 days for heatmap
  const calendarDays = Array.from({ length: 90 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split('T')[0];
  }).reverse();
  
  // Group by week
  const calendarWeeks: string[][] = [];
  for (let i = 0; i < calendarDays.length; i += 7) {
    calendarWeeks.push(calendarDays.slice(i, i + 7));
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Study Statistics</h1>
        <p className="text-slate-300">
          Track your progress and memory retention over time
        </p>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-800 rounded-xl p-4 shadow-lg">
          <div className="text-slate-400 text-xs mb-1">Cards Reviewed</div>
          <div className="text-white text-2xl font-bold">{totalReviews}</div>
        </div>
        <div className="bg-slate-800 rounded-xl p-4 shadow-lg">
          <div className="text-slate-400 text-xs mb-1">Retention Rate</div>
          <div className="text-white text-2xl font-bold">{retentionRate}%</div>
        </div>
        <div className="bg-slate-800 rounded-xl p-4 shadow-lg">
          <div className="text-slate-400 text-xs mb-1">Study Streak</div>
          <div className="text-white text-2xl font-bold">{streak} days</div>
        </div>
        <div className="bg-slate-800 rounded-xl p-4 shadow-lg">
          <div className="text-slate-400 text-xs mb-1">Total Decks</div>
          <div className="text-white text-2xl font-bold">{state.decks.length}</div>
        </div>
      </div>
      
      {/* Progress Graph */}
      <div className="mb-8">
        <ProgressGraph studyLogs={state.studyLogs} />
      </div>
      
      {/* Activity Calendar */}
      <div className="bg-slate-800 rounded-xl p-4 shadow-lg mb-8">
        <h3 className="text-lg font-medium text-white mb-4">Activity Calendar</h3>
        
        <div className="overflow-x-auto pb-2">
          <div className="min-w-max">
            <div className="grid grid-cols-7 gap-1 mb-1">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-xs text-slate-500 text-center">
                  {day}
                </div>
              ))}
            </div>
            
            {calendarWeeks.map((week, weekIndex) => (
              <div key={weekIndex} className="grid grid-cols-7 gap-1 mb-1">
                {week.map((day, dayIndex) => {
                  const reviewCount = logsByDate.get(day) || 0;
                  
                  return (
                    <div
                      key={`${weekIndex}-${dayIndex}`}
                      className={`w-8 h-8 ${getColorIntensity(reviewCount)} rounded-sm cursor-pointer flex items-center justify-center`}
                      title={`${day}: ${reviewCount} reviews`}
                    >
                      {reviewCount > 0 && (
                        <span className="text-xs text-white">{reviewCount}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-3 flex items-center justify-center space-x-1">
          <div className="text-xs text-slate-400 mr-1">Fewer</div>
          <div className="w-3 h-3 bg-slate-800 border border-slate-700 rounded-sm"></div>
          <div className="w-3 h-3 bg-indigo-900 rounded-sm"></div>
          <div className="w-3 h-3 bg-indigo-800 rounded-sm"></div>
          <div className="w-3 h-3 bg-indigo-700 rounded-sm"></div>
          <div className="w-3 h-3 bg-indigo-600 rounded-sm"></div>
          <div className="w-3 h-3 bg-indigo-500 rounded-sm"></div>
          <div className="text-xs text-slate-400 ml-1">More</div>
        </div>
      </div>
      
      {/* Deck Performance */}
      <div className="bg-slate-800 rounded-xl p-4 shadow-lg">
        <h3 className="text-lg font-medium text-white mb-4">Deck Performance</h3>
        
        <div className="space-y-4">
          {state.decks.map(deck => {
            const deckLogs = state.studyLogs.filter(log => log.deckId === deck.id);
            const totalDeckReviews = deckLogs.length;
            const correctDeckReviews = deckLogs.filter(log => log.known).length;
            const deckRetention = totalDeckReviews > 0 
              ? Math.round((correctDeckReviews / totalDeckReviews) * 100) 
              : 0;
            
            return (
              <div key={deck.id} className="pb-4 border-b border-slate-700">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium text-white">{deck.title}</h4>
                  <span className="text-sm text-slate-400">{totalDeckReviews} reviews</span>
                </div>
                
                <div className="relative h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-indigo-600 to-indigo-400 rounded-full"
                    style={{ width: `${deckRetention}%` }}
                  ></div>
                </div>
                
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-slate-400">Retention</span>
                  <span className="text-xs font-medium text-indigo-400">{deckRetention}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Stats;