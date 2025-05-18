import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ChevronRight, PlusCircle, Brain, Sparkles } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import ProgressGraph from '../components/ProgressGraph';
import { calculateDueCards } from '../utils/spacedRepetition';

const Dashboard: React.FC = () => {
  const { state, getDueCardCount, addDeck } = useAppContext();
  
  const handleAddDeck = () => {
    const newDeck = {
      id: crypto.randomUUID(),
      title: 'New Deck',
      description: 'Add a description for your deck',
      tags: ['new'],
      createdAt: new Date().toISOString(),
      cards: []
    };
    addDeck(newDeck);
  };
  
  // Calculate total due cards across all decks
  const totalDueCards = state.decks.reduce(
    (sum, deck) => sum + getDueCardCount(deck.id), 
    0
  );
  
  // Today's date for the greeting
  const today = new Date();
  const hours = today.getHours();
  
  let greeting = "Good morning";
  if (hours >= 12 && hours < 17) {
    greeting = "Good afternoon";
  } else if (hours >= 17) {
    greeting = "Good evening";
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{greeting}!</h1>
        <p className="text-slate-300">
          {totalDueCards > 0 
            ? `You have ${totalDueCards} cards due for review today.` 
            : "You're all caught up with your reviews!"}
        </p>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gradient-to-br from-indigo-900 to-indigo-800 rounded-xl p-4 shadow-lg">
          <div className="flex justify-between items-center">
            <h3 className="text-indigo-200 font-medium">Due Cards</h3>
            <Brain className="h-5 w-5 text-indigo-300" />
          </div>
          <p className="text-3xl font-bold text-white mt-2">{totalDueCards}</p>
        </div>
        
        <div className="bg-gradient-to-br from-purple-900 to-purple-800 rounded-xl p-4 shadow-lg">
          <div className="flex justify-between items-center">
            <h3 className="text-purple-200 font-medium">Total Decks</h3>
            <BookOpen className="h-5 w-5 text-purple-300" />
          </div>
          <p className="text-3xl font-bold text-white mt-2">{state.decks.length}</p>
        </div>
        
        <div className="bg-gradient-to-br from-pink-900 to-pink-800 rounded-xl p-4 shadow-lg">
          <div className="flex justify-between items-center">
            <h3 className="text-pink-200 font-medium">Total Cards</h3>
            <Sparkles className="h-5 w-5 text-pink-300" />
          </div>
          <p className="text-3xl font-bold text-white mt-2">
            {state.decks.reduce((sum, deck) => sum + deck.cards.length, 0)}
          </p>
        </div>
      </div>
      
      {/* Study Progress */}
      <div className="mb-8">
        <ProgressGraph studyLogs={state.studyLogs} />
      </div>
      
      {/* Decks */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">My Decks</h2>
          <button 
            onClick={handleAddDeck}
            className="flex items-center text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            <PlusCircle className="h-4 w-4 mr-1" />
            Add Deck
          </button>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          {state.decks.map((deck) => {
            const dueCardCount = getDueCardCount(deck.id);
            
            return (
              <Link
                key={deck.id}
                to={`/deck/${deck.id}`}
                className="bg-slate-800 rounded-xl p-4 hover:bg-slate-750 transition-colors flex justify-between items-center group"
              >
                <div>
                  <h3 className="text-lg font-medium text-white mb-1">{deck.title}</h3>
                  <p className="text-slate-400 text-sm mb-2">{deck.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {deck.tags.map((tag) => (
                      <span 
                        key={tag} 
                        className="text-xs px-2 py-1 rounded-full bg-slate-700 text-slate-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex flex-col items-end">
                  <div className="mb-2">
                    <span className="text-sm text-slate-400">
                      {dueCardCount} {dueCardCount === 1 ? 'card' : 'cards'} due
                    </span>
                  </div>
                  
                  <div className="flex items-center text-indigo-400 group-hover:text-indigo-300">
                    <span className="text-sm mr-1">View</span>
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;