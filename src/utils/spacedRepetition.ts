import { Card } from '../types';

// Calculate next review date based on interval
export const getNextReviewDate = (interval: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + interval);
  return date.toISOString();
};

// Check if a card is due for review
export const isCardDue = (card: Card): boolean => {
  if (!card.nextReview) return true; // New card that's never been reviewed
  
  const nextReviewDate = new Date(card.nextReview);
  const now = new Date();
  
  return nextReviewDate <= now;
};

// Get all cards due for review in a deck
export const calculateDueCards = (cards: Card[]): Card[] => {
  return cards.filter(isCardDue);
};

// Calculate retention rate (percentage of correct answers)
export const calculateRetention = (correctCount: number, totalCount: number): number => {
  if (totalCount === 0) return 0;
  return Math.round((correctCount / totalCount) * 100);
};

// Categorize cards by learning status
export const categorizeCards = (cards: Card[]): { new: Card[], learning: Card[], mastered: Card[] } => {
  return {
    new: cards.filter(card => card.reviewCount === 0),
    learning: cards.filter(card => card.reviewCount > 0 && card.interval < 30),
    mastered: cards.filter(card => card.interval >= 30)
  };
};

// Calculate mastery level (0-100%) based on average interval and ease factor
export const calculateMasteryLevel = (card: Card): number => {
  // A card with interval of 60+ days and high ease factor is considered fully mastered
  const intervalFactor = Math.min(card.interval / 60, 1);
  const easeFactor = (card.easeFactor - 1.3) / 1.2; // Normalize between 0-1
  
  return Math.round((intervalFactor * 0.7 + easeFactor * 0.3) * 100);
};

// Sort cards by due date (most urgent first)
export const sortCardsByDue = (cards: Card[]): Card[] => {
  return [...cards].sort((a, b) => {
    // New cards first
    if (!a.nextReview && b.nextReview) return -1;
    if (a.nextReview && !b.nextReview) return 1;
    if (!a.nextReview && !b.nextReview) return 0;
    
    // Then sort by due date
    return new Date(a.nextReview!).getTime() - new Date(b.nextReview!).getTime();
  });
};

// Get optimized study list (balances review and new cards)
export const getOptimizedStudyList = (cards: Card[], maxCards: number = 20): Card[] => {
  // First get due cards
  const dueCards = sortCardsByDue(calculateDueCards(cards));
  
  // If we have enough due cards, just return them
  if (dueCards.length >= maxCards) {
    return dueCards.slice(0, maxCards);
  }
  
  // Otherwise, add new cards to reach the max
  const newCards = cards
    .filter(card => card.reviewCount === 0)
    .slice(0, maxCards - dueCards.length);
  
  return [...dueCards, ...newCards];
};