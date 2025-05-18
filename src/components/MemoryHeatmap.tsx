import React from 'react';
import { Card, StudyLog } from '../types';

interface MemoryHeatmapProps {
  cards: Card[];
  logs: StudyLog[];
}

const MemoryHeatmap: React.FC<MemoryHeatmapProps> = ({ cards, logs }) => {
  const cardRetention = new Map<string, number>();
  
  cards.forEach(card => {
    const cardLogs = logs.filter(log => log.cardId === card.id);
    const totalReviews = cardLogs.length;
    const correctReviews = cardLogs.filter(log => log.known).length;
    
    const retention = totalReviews > 0 
      ? (correctReviews / totalReviews) * 100 
      : card.reviewCount > 0 ? 0 : 50;
    
    cardRetention.set(card.id, retention);
  });

  // Generate vibrant RGB colors
  const getRandomRGBColor = () => {
    const r = Math.floor(Math.random() * 156) + 100; // 100-255
    const g = Math.floor(Math.random() * 156) + 100; // 100-255
    const b = Math.floor(Math.random() * 156) + 100; // 100-255
    return `rgb(${r}, ${g}, ${b})`;
  };
  
  // Organize cells in rows (approximately square layout)
  const columns = Math.ceil(Math.sqrt(cards.length));
  const rows = Math.ceil(cards.length / columns);
  
  const cellsArray = Array.from({ length: rows }, (_, rowIndex) => {
    return Array.from({ length: columns }, (_, colIndex) => {
      const index = rowIndex * columns + colIndex;
      if (index < cards.length) {
        const card = cards[index];
        const retention = cardRetention.get(card.id) || 0;
        return { card, retention };
      }
      return null;
    });
  });

  return (
    <div className="bg-slate-800 rounded-xl p-4 shadow-lg">
      <h3 className="text-lg font-medium text-white mb-4">Memory Heatmap</h3>
      
      <div className="grid gap-2" style={{ gridTemplateRows: `repeat(${rows}, 1fr)` }}>
        {cellsArray.map((row, rowIndex) => (
          <div key={`row-${rowIndex}`} className="grid gap-2" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
            {row.map((cell, colIndex) => 
              cell ? (
                <div 
                  key={`cell-${rowIndex}-${colIndex}`}
                  className="aspect-square rounded-lg relative group cursor-pointer transform transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
                  style={{
                    background: getRandomRGBColor(),
                    transform: `rotate(${Math.random() * 6 - 3}deg)`,
                  }}
                >
                  <div className="opacity-0 group-hover:opacity-100 absolute inset-0 bg-black bg-opacity-80 rounded-lg flex items-center justify-center transition-opacity p-1">
                    <div className="text-white text-xs text-center truncate">
                      {cell.card.front}
                    </div>
                  </div>
                </div>
              ) : (
                <div 
                  key={`cell-${rowIndex}-${colIndex}`}
                  className="aspect-square rounded-lg bg-slate-700 bg-opacity-20"
                ></div>
              )
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-4 flex items-center justify-center space-x-2">
        <div className="flex items-center">
          <span className="text-xs text-slate-300">Hover over cards to see content</span>
        </div>
      </div>
    </div>
  );
};

export default MemoryHeatmap;