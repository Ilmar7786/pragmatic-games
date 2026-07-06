import { useRef } from 'react';

import { GameCard, type Game } from '@/entities/game';
import { useWindowVirtualizer } from '@/shared/lib';

import { GRID, estimateCardHeight } from '../../config';

import styles from './VirtualGameGrid.module.scss';

interface VirtualGameGridProps {
  games: Game[];
}

// Only the cards near the viewport are mounted (see `useWindowVirtualizer`).
export function VirtualGameGrid({ games }: VirtualGameGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { totalHeight, virtualItems } = useWindowVirtualizer({
    itemCount: games.length,
    containerRef,
    minColumnWidth: GRID.minColumnWidth,
    estimateRowHeight: estimateCardHeight,
    gap: GRID.gap,
  });

  return (
    <div
      ref={containerRef}
      className={styles.grid}
      style={{ height: totalHeight }}
      role="list"
      aria-label="List of games"
    >
      {virtualItems.map((item) => {
        const game = games[item.index];
        if (!game) return null;
        return (
          <div
            key={game.gameID}
            role="listitem"
            className={styles.cell}
            style={{
              transform: `translate(${item.x}px, ${item.y}px)`,
              width: item.width,
              height: item.height,
            }}
          >
            <GameCard game={game} />
          </div>
        );
      })}
    </div>
  );
}
