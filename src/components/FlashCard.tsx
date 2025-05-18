import React from 'react';
import { Card } from '../types';

interface FlashCardProps {
  card: Card;
  onCardResponse: (known: boolean) => void;
}

const FlashCard: React.FC<FlashCardProps> = ({ card, onCardResponse }) => {
  // Generate vibrant RGB colors
  const getRandomRGBColor = () => {
    const r = Math.floor(Math.random() * 156) + 100;
    const g = Math.floor(Math.random() * 156) + 100;
    const b = Math.floor(Math.random() * 156) + 100;
    return `rgb(${r}, ${g}, ${b})`;
  };

  const frontColor = getRandomRGBColor();

  return (
    <div
      id={`card-${card.id}`}
      className="w-full max-w-lg mx-auto h-64 sm:h-80 p-6 rounded-xl shadow-xl flex flex-col justify-between"
      style={{ background: frontColor }}
    >
      {/* Card Front Content */}
      <div className="flex-1 flex items-center justify-center">
        <p className="text-slate-800 text-xl sm:text-2xl font-semibold text-center">
          {card.front}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4 mt-4">
        <button
          onClick={() => onCardResponse(false)}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          Don’t Know
        </button>
        <button
          onClick={() => onCardResponse(true)}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          Know
        </button>
      </div>
    </div>
  );
};

export default FlashCard;
