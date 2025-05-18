// App State
export interface AppState {
  decks: Deck[];
  studyLogs: StudyLog[];
  settings: {
    theme: 'light' | 'dark';
    cardAnimationSpeed: 'slow' | 'medium' | 'fast';
  };
}

// Deck Model
export interface Deck {
  id: string;
  title: string;
  description: string;
  tags: string[];
  createdAt: string;
  lastStudied?: string;
  cards: Card[];
}

// Card Model
export interface Card {
  id: string;
  front: string;
  back: string;
  tags: string[];
  createdAt: string;
  lastReviewed?: string;
  nextReview?: string;
  interval: number; // Days until next review
  easeFactor: number; // SM-2 ease factor (multiplier for intervals)
  reviewCount: number;
  correctCount: number;
}

// Study Log Model
export interface StudyLog {
  id: string;
  deckId: string;
  cardId: string;
  timestamp: string;
  known: boolean;
}

// Retention Data for Graphs
export interface RetentionData {
  date: string;
  correct: number;
  total: number;
  percentage: number;
}

// Study Stats
export interface StudyStats {
  totalCards: number;
  masteredCards: number;
  learningCards: number;
  newCards: number;
  retention: number;
  streak: number;
  lastStudied?: string;
}