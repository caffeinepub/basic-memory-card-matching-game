import { Card } from './types';
import { cn } from '@/lib/utils';

interface MemoryCardProps {
  card: Card;
  onFlip: (cardId: string) => void;
  disabled: boolean;
  cardBackSrc?: string;
}

export function MemoryCard({ card, onFlip, disabled, cardBackSrc = '/assets/generated/card-back.dim_1024x1024.png' }: MemoryCardProps) {
  const handleClick = () => {
    if (!disabled && !card.isMatched) {
      onFlip(card.id);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled || card.isMatched}
      className={cn(
        'flip-card relative aspect-square w-full rounded-xl transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        !card.isMatched && !disabled && 'hover:scale-105 active:scale-95',
        card.isMatched && 'opacity-60 cursor-default',
        card.isFlipped && 'flipped'
      )}
      aria-label={card.isFlipped ? `Card showing ${card.value}` : 'Face down card'}
    >
      <div className="flip-card-inner">
        {/* Card Back */}
        <div className="flip-card-front rounded-xl overflow-hidden shadow-lg border-2 border-border bg-card">
          <img
            src={cardBackSrc}
            alt="Card back"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Card Front */}
        <div className="flip-card-back rounded-xl shadow-lg border-2 border-primary/20 bg-gradient-to-br from-accent/30 to-accent/10 flex items-center justify-center">
          <span className="text-5xl sm:text-6xl md:text-7xl" role="img" aria-label={card.value}>
            {card.value}
          </span>
        </div>
      </div>
    </button>
  );
}
