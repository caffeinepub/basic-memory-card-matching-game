export type CardValue = string;

export interface Card {
  id: string;
  value: CardValue;
  isFlipped: boolean;
  isMatched: boolean;
}

export type Level = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export interface DifficultyConfig {
  pairs: number;
  gridCols: string;
  label: string;
}

export const DIFFICULTY_CONFIGS: Record<Level, DifficultyConfig> = {
  1: {
    pairs: 4,
    gridCols: 'grid-cols-2 sm:grid-cols-4',
    label: 'Level 1 (4 pairs)',
  },
  2: {
    pairs: 6,
    gridCols: 'grid-cols-3 sm:grid-cols-4',
    label: 'Level 2 (6 pairs)',
  },
  3: {
    pairs: 8,
    gridCols: 'grid-cols-4',
    label: 'Level 3 (8 pairs)',
  },
  4: {
    pairs: 10,
    gridCols: 'grid-cols-4 sm:grid-cols-5',
    label: 'Level 4 (10 pairs)',
  },
  5: {
    pairs: 12,
    gridCols: 'grid-cols-4 sm:grid-cols-6',
    label: 'Level 5 (12 pairs)',
  },
  6: {
    pairs: 14,
    gridCols: 'grid-cols-4 sm:grid-cols-7',
    label: 'Level 6 (14 pairs)',
  },
  7: {
    pairs: 16,
    gridCols: 'grid-cols-4 sm:grid-cols-6 md:grid-cols-8',
    label: 'Level 7 (16 pairs)',
  },
  8: {
    pairs: 18,
    gridCols: 'grid-cols-4 sm:grid-cols-6 md:grid-cols-9',
    label: 'Level 8 (18 pairs)',
  },
  9: {
    pairs: 20,
    gridCols: 'grid-cols-4 sm:grid-cols-5 md:grid-cols-10',
    label: 'Level 9 (20 pairs)',
  },
  10: {
    pairs: 24,
    gridCols: 'grid-cols-4 sm:grid-cols-6 md:grid-cols-8',
    label: 'Level 10 (24 pairs)',
  },
};

export interface GameState {
  cards: Card[];
  flippedCards: Card[];
  moves: number;
  isLocked: boolean;
  isComplete: boolean;
}
