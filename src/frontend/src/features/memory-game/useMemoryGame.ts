import { useState, useCallback, useEffect } from 'react';
import { Card, Level, GameState } from './types';
import { createDeck } from './utils';

const MISMATCH_DELAY = 1000;

export function useMemoryGame(level: Level) {
  const [gameState, setGameState] = useState<GameState>(() => ({
    cards: createDeck(level),
    flippedCards: [],
    moves: 0,
    isLocked: false,
    isComplete: false,
  }));

  // Check for completion
  useEffect(() => {
    const allMatched = gameState.cards.every((card) => card.isMatched);
    if (allMatched && gameState.cards.length > 0 && !gameState.isComplete) {
      setGameState((prev) => ({ ...prev, isComplete: true }));
    }
  }, [gameState.cards, gameState.isComplete]);

  const flipCard = useCallback((cardId: string) => {
    setGameState((prev) => {
      // Prevent flipping if locked or card already flipped/matched
      if (prev.isLocked) return prev;
      
      const card = prev.cards.find((c) => c.id === cardId);
      if (!card || card.isFlipped || card.isMatched) return prev;

      // Prevent flipping more than 2 cards
      if (prev.flippedCards.length >= 2) return prev;

      const updatedCards = prev.cards.map((c) =>
        c.id === cardId ? { ...c, isFlipped: true } : c
      );

      const newFlippedCards = [...prev.flippedCards, card];

      // If this is the second card flipped
      if (newFlippedCards.length === 2) {
        const [first, second] = newFlippedCards;
        const isMatch = first.value === second.value;

        if (isMatch) {
          // Match found
          const cardsWithMatch = updatedCards.map((c) =>
            c.id === first.id || c.id === second.id
              ? { ...c, isMatched: true }
              : c
          );
          return {
            ...prev,
            cards: cardsWithMatch,
            flippedCards: [],
            moves: prev.moves + 1,
          };
        } else {
          // No match - lock and schedule flip back
          setTimeout(() => {
            setGameState((current) => ({
              ...current,
              cards: current.cards.map((c) =>
                c.id === first.id || c.id === second.id
                  ? { ...c, isFlipped: false }
                  : c
              ),
              flippedCards: [],
              isLocked: false,
            }));
          }, MISMATCH_DELAY);

          return {
            ...prev,
            cards: updatedCards,
            flippedCards: newFlippedCards,
            moves: prev.moves + 1,
            isLocked: true,
          };
        }
      }

      return {
        ...prev,
        cards: updatedCards,
        flippedCards: newFlippedCards,
      };
    });
  }, []);

  const resetGame = useCallback((newLevel?: Level) => {
    const lvl = newLevel || level;
    setGameState({
      cards: createDeck(lvl),
      flippedCards: [],
      moves: 0,
      isLocked: false,
      isComplete: false,
    });
  }, [level]);

  return {
    cards: gameState.cards,
    moves: gameState.moves,
    isLocked: gameState.isLocked,
    isComplete: gameState.isComplete,
    flipCard,
    resetGame,
  };
}
