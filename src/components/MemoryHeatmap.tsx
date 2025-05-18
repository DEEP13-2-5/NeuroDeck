import React, { useState } from 'react';
import { Card, StudyLog } from '../types';

interface MemoryHeatmapProps {
  cards: Card[];
  logs: StudyLog[];
}

const MemoryHeatmap: React.FC<MemoryHeatmapProps> = ({ cards, logs }) => {
  const [flippedCardIds, setFlippedCardIds] = useState<Set<string>>(new Set());

  const toggleFlip = (cardId: string) => {
    setFlippedCardIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(cardId)) {
        newSet.delete(cardId);
      } else {
        newSet.add(cardId);
      }
      return newSet;
    });
  };

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

  const getRandomRGBColor = () => {
    const r = Math.floor(Math.random() * 156) + 100;
    const g = Math.floor(Math.random() * 156) + 100;
    const b = Math.floor(Math.random() * 156) + 100;
    return `rgb(${r}, ${g}, ${b})`;
  };

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
                  className="aspect-square perspective"
                  onClick={() => toggleFlip(cell.card.id)}
                >
                  <div
                    className={`relative w-full h-full transition-transform duration-500 transform-style-preserve-3d ${
                      flippedCardIds.has(cell.card.id) ? 'rotate-y-180' : ''
                    }`}
                  >
                    {/* Front Side */}
                    <div
                      className="absolute w-full h-full rounded-lg"
                      style={{
                        background: getRandomRGBColor(),
                        transform: `rotate(${Math.random() * 6 - 3}deg)`,
                        backfaceVisibility: 'hidden',
                      }}
                    ></div>

                    {/* Back Side */}
                    <div
                      className="absolute w-full h-full rounded-lg bg-black bg-opacity-80 text-white flex items-center justify-center text-xs p-1 text-center truncate transform rotate-y-180"
                      style={{
                        backfaceVisibility: 'hidden',
                      }}
                    >
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
        <span className="text-xs text-slate-300">Click cards to flip and reveal</span>
      </div>

      {/* Add CSS styles */}
      <style>{`
        .perspective {
          perspective: 1000px;
        }
        .transform-style-preserve-3d {
          transform-style: preserve-3d;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
};

export default MemoryHeatmap;
