import { Deck, Card } from '../types';

// Create a new card with default values
const createDefaultCard = (id: string, front: string, back: string): Card => ({
  id,
  front,
  back,
  tags: [],
  createdAt: new Date().toISOString(),
  interval: 1,
  easeFactor: 2.5,
  reviewCount: 0,
  correctCount: 0,
});

// Generate sample decks with cards for new users
export const generateSampleDecks = (): Deck[] => {
  const neuroscienceDeck: Deck = {
    id: '1',
    title: 'Neuroscience Basics',
    description: 'Fundamental concepts in neuroscience and brain function',
    tags: ['science', 'biology', 'brain'],
    createdAt: new Date().toISOString(),
    cards: [
      createDefaultCard('101', 'What is a neuron?', 'A specialized cell that transmits nerve impulses; the basic building block of the nervous system.'),
      createDefaultCard('102', 'What are the three main parts of a neuron?', '1. Cell body (soma)\n2. Dendrites\n3. Axon'),
      createDefaultCard('103', 'What is synaptogenesis?', 'The formation of synapses between neurons during development or learning.'),
      createDefaultCard('104', 'What is neuroplasticity?', 'The ability of the brain to form new neural connections and adapt throughout life.'),
      createDefaultCard('105', 'What is myelin?', 'A fatty substance that surrounds axons and helps speed up neural transmission.'),
    ],
  };

  const memoryDeck: Deck = {
    id: '2',
    title: 'Memory Formation',
    description: 'How memories are formed, stored, and retrieved',
    tags: ['memory', 'learning', 'brain'],
    createdAt: new Date().toISOString(),
    cards: [
      createDefaultCard('201', 'What are the three stages of memory processing?', '1. Encoding\n2. Storage\n3. Retrieval'),
      createDefaultCard('202', 'What is the difference between explicit and implicit memory?', 'Explicit memory involves conscious recall, while implicit memory is unconscious and involves skills and habits.'),
      createDefaultCard('203', 'What is the hippocampus responsible for?', 'The formation of new memories and connecting emotions and senses to memories.'),
      createDefaultCard('204', 'What is the spacing effect?', 'The phenomenon where learning is more effective when study sessions are spaced out over time rather than crammed together.'),
      createDefaultCard('205', 'What is state-dependent memory?', 'The phenomenon where information learned in one state is better recalled when in the same state.'),
    ],
  };

  const spanishDeck: Deck = {
    id: '3',
    title: 'Spanish Vocabulary',
    description: 'Basic Spanish vocabulary for beginners',
    tags: ['language', 'spanish', 'vocabulary'],
    createdAt: new Date().toISOString(),
    cards: [
      createDefaultCard('301', 'Hola', 'Hello'),
      createDefaultCard('302', 'Adiós', 'Goodbye'),
      createDefaultCard('303', 'Por favor', 'Please'),
      createDefaultCard('304', 'Gracias', 'Thank you'),
      createDefaultCard('305', 'Buenos días', 'Good morning'),
    ],
  };

  return [neuroscienceDeck, memoryDeck, spanishDeck];
};