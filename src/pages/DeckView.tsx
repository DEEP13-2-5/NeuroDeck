import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Play, 
  PlusCircle, 
  Edit, 
  Trash2,
  Calendar,
  AlertCircle,
  X,
  Check
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import MemoryHeatmap from '../components/MemoryHeatmap';
import { formatDate } from '../utils/dateUtils';
import { categorizeCards } from '../utils/spacedRepetition';

const DeckView: React.FC = () => {
  const { deckId } = useParams<{ deckId: string }>();
  const navigate = useNavigate();
  const { state, getDueCardCount, addCard, updateCard, deleteCard } = useAppContext();
  const [selectedTab, setSelectedTab] = useState<'all' | 'due'>('all');
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [editingCard, setEditingCard] = useState<string | null>(null);
  const [newCard, setNewCard] = useState({ front: '', back: '' });
  
  // Find the current deck
  const deck = state.decks.find(d => d.id === deckId);
  
  if (!deck) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <AlertCircle className="h-12 w-12 text-pink-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Deck Not Found</h2>
        <p className="text-slate-300 mb-6">The deck you're looking for doesn't exist.</p>
        <Link 
          to="/"
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Back to Dashboard
        </Link>
      </div>
    );
  }
  
  // Get stats
  const dueCards = getDueCardCount(deck.id);
  const { new: newCards, learning, mastered } = categorizeCards(deck.cards);
  
  // Get deck-specific logs
  const deckLogs = state.studyLogs.filter(log => log.deckId === deck.id);

  const handleAddCard = () => {
    if (newCard.front.trim() && newCard.back.trim()) {
      const card = {
        id: crypto.randomUUID(),
        front: newCard.front.trim(),
        back: newCard.back.trim(),
        tags: [],
        createdAt: new Date().toISOString(),
        interval: 1,
        easeFactor: 2.5,
        reviewCount: 0,
        correctCount: 0
      };
      
      addCard(deck.id, card);
      setNewCard({ front: '', back: '' });
      setIsAddingCard(false);
    }
  };

  const handleEditCard = (cardId: string) => {
    const card = deck.cards.find(c => c.id === cardId);
    if (card) {
      setEditingCard(cardId);
      setNewCard({ front: card.front, back: card.back });
    }
  };

  const handleSaveEdit = (cardId: string) => {
    const card = deck.cards.find(c => c.id === cardId);
    if (card && newCard.front.trim() && newCard.back.trim()) {
      updateCard(deck.id, {
        ...card,
        front: newCard.front.trim(),
        back: newCard.back.trim(),
      });
      setEditingCard(null);
      setNewCard({ front: '', back: '' });
    }
  };

  const handleDeleteCard = (cardId: string) => {
    if (confirm('Are you sure you want to delete this card?')) {
      deleteCard(deck.id, cardId);
    }
  };

  // Generate random pastel color
  const getRandomColor = () => {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 70%, 85%)`;
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 flex items-center">
            <BookOpen className="h-6 w-6 mr-2 text-indigo-400" />
            {deck.title}
          </h1>
          <p className="text-slate-300 mb-2">{deck.description}</p>
          <div className="flex flex-wrap gap-2 mb-4">
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
        
        <div className="flex space-x-2">
          <Link
            to={`/study/${deck.id}`}
            className={`inline-flex items-center px-4 py-2 rounded-lg transition-colors ${
              dueCards > 0
                ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                : 'bg-slate-700 text-slate-300'
            }`}
          >
            <Play className="h-4 w-4 mr-2" />
            {dueCards > 0 ? `Study (${dueCards})` : 'Study'}
          </Link>
        </div>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-800 rounded-xl p-4 shadow-lg">
          <div className="text-slate-400 text-xs mb-1">Total Cards</div>
          <div className="text-white text-2xl font-bold">{deck.cards.length}</div>
        </div>
        <div className="bg-slate-800 rounded-xl p-4 shadow-lg">
          <div className="text-slate-400 text-xs mb-1">Due Cards</div>
          <div className="text-white text-2xl font-bold">{dueCards}</div>
        </div>
        <div className="bg-slate-800 rounded-xl p-4 shadow-lg">
          <div className="text-slate-400 text-xs mb-1">New Cards</div>
          <div className="text-white text-2xl font-bold">{newCards.length}</div>
        </div>
        <div className="bg-slate-800 rounded-xl p-4 shadow-lg">
          <div className="text-slate-400 text-xs mb-1">Mastered</div>
          <div className="text-white text-2xl font-bold">{mastered.length}</div>
        </div>
      </div>
      
      {/* Heatmap */}
      <div className="mb-8">
        <MemoryHeatmap cards={deck.cards} logs={deckLogs} />
      </div>
      
      {/* Cards */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-bold text-white">Cards</h2>
            <div className="flex rounded-lg bg-slate-800 p-1">
              <button
                onClick={() => setSelectedTab('all')}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  selectedTab === 'all'
                    ? 'bg-slate-700 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setSelectedTab('due')}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  selectedTab === 'due'
                    ? 'bg-slate-700 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Due ({dueCards})
              </button>
            </div>
          </div>
          <button 
            onClick={() => setIsAddingCard(true)}
            className="flex items-center text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            <PlusCircle className="h-4 w-4 mr-1" />
            Add Card
          </button>
        </div>
        
        {/* Add Card Form */}
        {isAddingCard && (
          <div className="bg-slate-800 rounded-xl p-4 mb-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-white">Add New Card</h3>
              <button 
                onClick={() => {
                  setIsAddingCard(false);
                  setNewCard({ front: '', back: '' });
                }}
                className="p-1 hover:bg-slate-700 rounded-full transition-colors"
              >
                <X className="h-4 w-4 text-slate-400" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Front
                </label>
                <textarea
                  value={newCard.front}
                  onChange={(e) => setNewCard(prev => ({ ...prev, front: e.target.value }))}
                  className="w-full bg-slate-700 border-slate-600 rounded-lg p-2 text-white"
                  rows={2}
                  placeholder="Question or prompt"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Back
                </label>
                <textarea
                  value={newCard.back}
                  onChange={(e) => setNewCard(prev => ({ ...prev, back: e.target.value }))}
                  className="w-full bg-slate-700 border-slate-600 rounded-lg p-2 text-white"
                  rows={2}
                  placeholder="Answer or explanation"
                />
              </div>
              <div className="flex justify-end">
                <button
                  onClick={handleAddCard}
                  disabled={!newCard.front.trim() || !newCard.back.trim()}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Card
                </button>
              </div>
            </div>
          </div>
        )}
        
        <div className="space-y-3">
          {deck.cards.length === 0 ? (
            <div className="bg-slate-800 rounded-xl p-6 text-center">
              <p className="text-slate-400">No cards in this deck yet.</p>
              <button 
                onClick={() => setIsAddingCard(true)}
                className="mt-3 inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Your First Card
              </button>
            </div>
          ) : (
            deck.cards.map((card) => {
              const isEditing = editingCard === card.id;
              const cardColor = getRandomColor();
              
              return (
                <div 
                  key={card.id}
                  className="rounded-xl p-4 hover:shadow-lg transition-all transform hover:-translate-y-1 group"
                  style={{
                    background: cardColor,
                    transform: 'rotate(-1deg)',
                  }}
                >
                  {isEditing ? (
                    <div className="space-y-3">
                      <textarea
                        value={newCard.front}
                        onChange={(e) => setNewCard(prev => ({ ...prev, front: e.target.value }))}
                        className="w-full bg-white/50 rounded-lg p-2 text-slate-800"
                        rows={2}
                        placeholder="Question or prompt"
                      />
                      <textarea
                        value={newCard.back}
                        onChange={(e) => setNewCard(prev => ({ ...prev, back: e.target.value }))}
                        className="w-full bg-white/50 rounded-lg p-2 text-slate-800"
                        rows={2}
                        placeholder="Answer or explanation"
                      />
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => {
                            setEditingCard(null);
                            setNewCard({ front: '', back: '' });
                          }}
                          className="p-2 rounded-lg bg-slate-700 text-white hover:bg-slate-600 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleSaveEdit(card.id)}
                          className="p-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-slate-800 mb-2">{card.front}</h3>
                        <p className="text-slate-700 text-sm mb-1">{card.back}</p>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleEditCard(card.id)}
                          className="p-2 rounded-lg bg-white/30 text-slate-700 hover:bg-white/50 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteCard(card.id)}
                          className="p-2 rounded-lg bg-white/30 text-slate-700 hover:bg-red-600 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {card.nextReview && !isEditing && (
                    <div className="mt-2 flex items-center text-xs text-slate-600">
                      <Calendar className="h-3 w-3 mr-1" />
                      Next review: {formatDate(card.nextReview)}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default DeckView;