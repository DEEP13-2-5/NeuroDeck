import React, { useState, useRef, useEffect } from 'react';
import { Card } from '../types';

interface FlashCardProps {
  card: Card;
  onCardResponse: (known: boolean) => void;
  animationSpeed?: 'slow' | 'medium' | 'fast';
}

const FlashCard: React.FC<FlashCardProps> = ({ 
  card, 
  onCardResponse,
  animationSpeed = 'medium', 
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const frontEl = useRef<HTMLDivElement>(null);
  const backEl = useRef<HTMLDivElement>(null);

  const speedMap = {
    slow: 800,
    medium: 500,
    fast: 300,
  };
  
  const duration = speedMap[animationSpeed];

  const handleClick = () => {
    if (isFlipping) return;
    setIsFlipped(!isFlipped);
  };

  const handleResponse = (known: boolean) => {
    if (isFlipping) return;
    onCardResponse(known);
  };

  // Generate vibrant RGB colors
  const getRandomRGBColor = () => {
    const r = Math.floor(Math.random() * 156) + 100; // 100-255
    const g = Math.floor(Math.random() * 156) + 100; // 100-255
    const b = Math.floor(Math.random() * 156) + 100; // 100-255
    return `rgb(${r}, ${g}, ${b})`;
  };

  const frontColor = useRef(getRandomRGBColor());
  const backColor = useRef(getRandomRGBColor());

  return (
    <div 
      id={`card-${card.id}`}
      className="relative w-full max-w-lg mx-auto h-64 sm:h-80 perspective-1000"
    >
      <div
        className={`relative w-full h-full transition-transform duration-500 preserve-3d shadow-xl rounded-xl cursor-pointer ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
        style={{ 
          transformStyle: 'preserve-3d',
          transition: `transform ${duration}ms ease-in-out`,
        }}
        onClick={handleClick}
      >
        {/* Front */}
        <div
          ref={frontEl}
          className="absolute inset-0 backface-hidden rounded-xl p-6 flex flex-col"
          style={{ 
            backfaceVisibility: 'hidden',
            background: frontColor.current,
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          }}
        >
          <div className="flex-1 flex items-center justify-center">
            <p className="text-slate-800 text-xl sm:text-2xl font-medium text-center">
              {card.front}
            </p>
          </div>
          <div className="text-xs text-slate-600 text-center">
            Click to flip
          </div>
        </div>
        
        {/* Back */}
        <div
          ref={backEl}
          className="absolute inset-0 backface-hidden rounded-xl p-6 flex flex-col"
          style={{ 
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            background: backColor.current,
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          }}
        >
          <div className="flex-1 flex items-center justify-center overflow-auto">
            <p className="text-slate-800 text-lg sm:text-xl text-center">
              {card.back}
            </p>
          </div>
          
          {/* Response buttons */}
          <div className="flex justify-center space-x-4 mt-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleResponse(false);
              }}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Don't Know
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleResponse(true);
              }}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Know
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlashCard;