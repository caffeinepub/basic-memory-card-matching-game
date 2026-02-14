import { Card, Level, DIFFICULTY_CONFIGS } from './types';

// Emoji sets for card faces
const EMOJI_SETS = [
  '🎨', '🎭', '🎪', '🎯', '🎲', '🎸', '🎹', '🎺',
  '🎻', '🎬', '🎮', '🎰', '🏀', '⚽', '🏈', '⚾',
  '🎾', '🏐', '🏉', '🎱', '🏓', '🏸', '🏒', '🏑',
  '🎿', '⛷️', '🏂', '🤿', '🏹', '🎣', '🥊', '🥋',
  '🥅', '⛳', '🏏', '🏑', '🏒', '🥍', '🏓', '🏸',
  '🥏', '🎳', '🎯', '🎱', '🔮', '🎰', '🎲', '🧩',
];

export function createDeck(level: Level): Card[] {
  const config = DIFFICULTY_CONFIGS[level];
  const pairCount = config.pairs;
  
  // Select random emojis for this game
  const selectedEmojis = [...EMOJI_SETS]
    .sort(() => Math.random() - 0.5)
    .slice(0, pairCount);
  
  // Create pairs
  const cards: Card[] = [];
  selectedEmojis.forEach((emoji, index) => {
    cards.push(
      {
        id: `${index}-a`,
        value: emoji,
        isFlipped: false,
        isMatched: false,
      },
      {
        id: `${index}-b`,
        value: emoji,
        isFlipped: false,
        isMatched: false,
      }
    );
  });
  
  // Shuffle
  return shuffleArray(cards);
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function getGridClass(level: Level): string {
  return DIFFICULTY_CONFIGS[level].gridCols;
}
