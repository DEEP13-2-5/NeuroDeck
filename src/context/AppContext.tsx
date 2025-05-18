import React, { createContext, useContext, useEffect, useState } from 'react';
import { Card, Deck, StudyLog, AppState } from '../types';
import { calculateDueCards, getNextReviewDate } from '../utils/spacedRepetition';
import { generateSampleDecks } from '../utils/sampleData';

// Initial state
const initialState: AppState = {
  decks: [],
  studyLogs: [],
  settings: {
    theme: 'dark',
    cardAnimationSpeed: 'medium',
  }
};

// Create context
const AppContext = createContext<{
  state: AppState;
  addDeck: (deck: Deck) => void;
  updateDeck: (deck: Deck) => void;
  deleteDeck: (deckId: string) => void;
  addCard: (deckId: string, card: Card) => void;
  updateCard: (deckId: string, card: Card) => void;
  deleteCard: (deckId: string, cardId: string) => void;
  logStudySession: (log: StudyLog) => void;
  updateCardReviewStatus: (deckId: string, cardId: string, known: boolean) => void;
  getDueCardCount: (deckId: string) => number;
}>({
  state: initialState,
  addDeck: () => {},
  updateDeck: () => {},
  deleteDeck: () => {},
  addCard: () => {},
  updateCard: () => {},
  deleteCard: () => {},
  logStudySession: () => {},
  updateCardReviewStatus: () => {},
  getDueCardCount: () => 0,
});

// Provider component
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(initialState);

  // Load data from localStorage on initial render
  useEffect(() => {
    const savedState = localStorage.getItem('neuroDeckState');
    
    if (savedState) {
      setState(JSON.parse(savedState));
    } else {
      // Generate sample data for first-time users
      const sampleData = generateSampleDecks();
      setState(prev => ({ ...prev, decks: sampleData }));
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('neuroDeckState', JSON.stringify(state));
  }, [state]);

  // Add a new deck
  const addDeck = (deck: Deck) => {
    setState(prev => ({
      ...prev,
      decks: [...prev.decks, deck],
    }));
  };

  // Update an existing deck
  const updateDeck = (deck: Deck) => {
    setState(prev => ({
      ...prev,
      decks: prev.decks.map(d => d.id === deck.id ? deck : d),
    }));
  };

  // Delete a deck
  const deleteDeck = (deckId: string) => {
    setState(prev => ({
      ...prev,
      decks: prev.decks.filter(d => d.id !== deckId),
    }));
  };

  // Add a card to a deck
  const addCard = (deckId: string, card: Card) => {
    setState(prev => ({
      ...prev,
      decks: prev.decks.map(deck => {
        if (deck.id === deckId) {
          return {
            ...deck,
            cards: [...deck.cards, card],
          };
        }
        return deck;
      }),
    }));
  };

  // Update a card in a deck
  const updateCard = (deckId: string, card: Card) => {
    setState(prev => ({
      ...prev,
      decks: prev.decks.map(deck => {
        if (deck.id === deckId) {
          return {
            ...deck,
            cards: deck.cards.map(c => c.id === card.id ? card : c),
          };
        }
        return deck;
      }),
    }));
  };

  // Delete a card from a deck
  const deleteCard = (deckId: string, cardId: string) => {
    setState(prev => ({
      ...prev,
      decks: prev.decks.map(deck => {
        if (deck.id === deckId) {
          return {
            ...deck,
            cards: deck.cards.filter(c => c.id !== cardId),
          };
        }
        return deck;
      }),
    }));
  };

  // Log a study session
  const logStudySession = (log: StudyLog) => {
    setState(prev => ({
      ...prev,
      studyLogs: [...prev.studyLogs, log],
    }));
  };

  // Update card review status (after answering Know/Don't Know)
  const updateCardReviewStatus = (deckId: string, cardId: string, known: boolean) => {
    setState(prev => ({
      ...prev,
      decks: prev.decks.map(deck => {
        if (deck.id === deckId) {
          return {
            ...deck,
            cards: deck.cards.map(card => {
              if (card.id === cardId) {
                const newEaseFactor = known 
                  ? Math.min(card.easeFactor + 0.1, 2.5) 
                  : Math.max(card.easeFactor - 0.2, 1.3);
                
                const newInterval = known 
                  ? Math.round(card.interval * card.easeFactor) 
                  : 1;
                
                return {
                  ...card,
                  easeFactor: newEaseFactor,
                  interval: newInterval,
                  reviewCount: card.reviewCount + 1,
                  correctCount: known ? card.correctCount + 1 : card.correctCount,
                  lastReviewed: new Date().toISOString(),
                  nextReview: getNextReviewDate(newInterval),
                };
              }
              return card;
            }),
          };
        }
        return deck;
      }),
      studyLogs: [...prev.studyLogs, {
        id: crypto.randomUUID(),
        deckId,
        cardId,
        timestamp: new Date().toISOString(),
        known,
      }],
    }));
  };

  // Get due card count for a deck
  const getDueCardCount = (deckId: string): number => {
    const deck = state.decks.find(d => d.id === deckId);
    if (!deck) return 0;
    
    return calculateDueCards(deck.cards).length;
  };

  const contextValue = {
    state,
    addDeck,
    updateDeck,
    deleteDeck,
    addCard,
    updateCard,
    deleteCard,
    logStudySession,
    updateCardReviewStatus,
    getDueCardCount,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the context
export const useAppContext = () => useContext(AppContext);