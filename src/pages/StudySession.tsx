import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import FlashCard from '../components/FlashCard';
import { getOptimizedStudyList } from '../utils/spacedRepetition';

const StudySession: React.FC = () => {
  const { deckId } = useParams<{ deckId: string }>();
  const navigate = useNavigate();
  const { state, updateCardReviewStatus } = useAppContext();
  
  const [studyList, setStudyList] = useState<string[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [stats, setStats] = useState({ correct: 0, incorrect: 0 });
  
  // Find the current deck
  const deck = state.decks.find(d => d.id === deckId);
  
  // Redirect if deck not found
  useEffect(() => {
    if (!deck) {
      navigate('/');
    } else {
      // Initialize study list
      const cardsToStudy = getOptimizedStudyList(deck.cards, 20);
      setStudyList(cardsToStudy.map(card => card.id));
    }
  }, [deck, navigate]);
  
  if (!deck) return null;
  
  // Get current card
  const currentCardId = studyList[currentCardIndex];
  const currentCard = currentCardId 
    ? deck.cards.find(card => card.id === currentCardId) 
    : null;
  
  // Handle card response
  const handleCardResponse = (known: boolean) => {
    if (!currentCard) return;
    
    // Update card review status
    updateCardReviewStatus(deck.id, currentCard.id, known);
    
    // Update stats
    if (known) {
      setStats(prev => ({ ...prev, correct: prev.correct + 1 }));
    } else {
      setStats(prev => ({ ...prev, incorrect: prev.incorrect + 1 }));
    }
    
    // Move to next card or complete session
    if (currentCardIndex < studyList.length - 1) {
      setCurrentCardIndex(prev => prev + 1);
    } else {
      setIsComplete(true);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <Link to={`/deck/${deck.id}`} className="mr-3 p-2 rounded-full hover:bg-slate-700 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-xl font-bold text-white">Studying: {deck.title}</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center text-green-400">
            <CheckCircle className="h-4 w-4 mr-1" />
            <span>{stats.correct}</span>
          </div>
          <div className="flex items-center text-red-400">
            <XCircle className="h-4 w-4 mr-1" />
            <span>{stats.incorrect}</span>
          </div>
          <div className="text-slate-400 text-sm">
            {currentCardIndex + 1}/{studyList.length}
          </div>
        </div>
      </div>
      
      {/* Study content */}
      {isComplete ? (
        <div className="bg-slate-800 rounded-xl p-8 shadow-lg text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Session Complete!</h2>
          
          <div className="grid grid-cols-2 gap-6 max-w-xs mx-auto mb-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-1">{stats.correct}</div>
              <div className="text-slate-400">Correct</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-400 mb-1">{stats.incorrect}</div>
              <div className="text-slate-400">Incorrect</div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 justify-center">
            <Link
              to={`/deck/${deck.id}`}
              className="inline-flex items-center justify-center px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
            >
              Back to Deck
            </Link>
            <button
              onClick={() => {
                // Reset the session
                setCurrentCardIndex(0);
                setIsComplete(false);
                setStats({ correct: 0, incorrect: 0 });
                
                // Get a fresh study list
                const cardsToStudy = getOptimizedStudyList(deck.cards, 20);
                setStudyList(cardsToStudy.map(card => card.id));
              }}
              className="inline-flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Study Again
            </button>
          </div>
        </div>
      ) : (
        <div>
          {currentCard && (
            <FlashCard 
              card={currentCard} 
              onCardResponse={handleCardResponse}
              animationSpeed="medium"
            />
          )}
          
          <div className="mt-6 text-center text-slate-400 text-sm">
            Tip: Click the card to flip it, then choose "Know" or "Don't Know"
          </div>
        </div>
      )}
    </div>
  );
};

export default StudySession;