import React from 'react';
import { StudyLog } from '../types';
import { getPastWeekDates, calculateStreak } from '../utils/dateUtils';

interface ProgressGraphProps {
  studyLogs: StudyLog[];
  deckId?: string;
}

const ProgressGraph: React.FC<ProgressGraphProps> = ({ studyLogs, deckId }) => {
  // Filter logs by deck if deckId is provided
  const filteredLogs = deckId 
    ? studyLogs.filter(log => log.deckId === deckId) 
    : studyLogs;
  
  // Get dates for the past week
  const pastWeek = getPastWeekDates();
  
  // Calculate study data for each day
  const weekData = pastWeek.map(date => {
    const dayLogs = filteredLogs.filter(log => log.timestamp.startsWith(date));
    const correct = dayLogs.filter(log => log.known).length;
    const total = dayLogs.length;
    
    return {
      date,
      correct,
      total,
      percentage: total > 0 ? (correct / total) * 100 : 0,
    };
  });
  
  // Calculate streak
  const studyDates = filteredLogs.map(log => log.timestamp);
  const streak = calculateStreak(studyDates);
  
  // Calculate overall retention rate
  const totalCorrect = filteredLogs.filter(log => log.known).length;
  const totalReviews = filteredLogs.length;
  const retentionRate = totalReviews > 0 
    ? Math.round((totalCorrect / totalReviews) * 100) 
    : 0;
  
  const weekDay = (date: string): string => {
    return new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
  };

  // Find max value for graph scaling
  const maxTotal = Math.max(...weekData.map(d => d.total), 5);

  return (
    <div className="bg-slate-800 rounded-xl p-4 shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-white">Progress Overview</h3>
        <div className="flex items-center space-x-2">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-indigo-400 rounded-full mr-1"></div>
            <span className="text-xs text-slate-300">Correct</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-pink-400 rounded-full mr-1"></div>
            <span className="text-xs text-slate-300">Total</span>
          </div>
        </div>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-slate-700 rounded-lg p-3">
          <div className="text-slate-400 text-xs mb-1">Retention Rate</div>
          <div className="text-white text-2xl font-bold">{retentionRate}%</div>
        </div>
        <div className="bg-slate-700 rounded-lg p-3">
          <div className="text-slate-400 text-xs mb-1">Study Streak</div>
          <div className="text-white text-2xl font-bold">{streak} {streak === 1 ? 'day' : 'days'}</div>
        </div>
      </div>
      
      {/* Graph */}
      <div className="h-48 flex items-end space-x-2">
        {weekData.map((day, index) => (
          <div key={index} className="flex-1 flex flex-col items-center">
            <div className="w-full flex flex-col-reverse items-center h-40 relative">
              {/* Total reviews bar */}
              <div 
                className="w-full max-w-[24px] bg-pink-400 bg-opacity-20 rounded-t-sm"
                style={{ 
                  height: `${(day.total / maxTotal) * 100}%`,
                }}
              ></div>
              
              {/* Correct reviews bar */}
              <div 
                className="w-full max-w-[24px] bg-indigo-400 rounded-t-sm absolute bottom-0"
                style={{ 
                  height: `${(day.correct / maxTotal) * 100}%`,
                }}
              ></div>
              
              {/* Count label */}
              {day.total > 0 && (
                <div className="absolute top-0 text-xs text-white">
                  {day.total}
                </div>
              )}
            </div>
            <div className="text-xs text-slate-400 mt-2">{weekDay(day.date)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressGraph;