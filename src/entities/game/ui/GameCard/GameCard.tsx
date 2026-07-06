import { memo } from 'react';
import { Link } from 'react-router-dom';

import { Image } from '@/shared/ui';

import { getGamePicUrl } from '../../lib/getGamePicUrl';
import type { Game } from '../../model/types';

import styles from './GameCard.module.scss';

interface GameCardProps {
  game: Game;
}

// Memoized: the virtualized grid re-renders on every scroll frame.
export const GameCard = memo(function GameCard({ game }: GameCardProps) {
  return (
    <Link to={`/game/${game.gameID}`} className={styles.card} title={game.gameName}>
      <span className={styles.thumb}>
        <Image
          src={getGamePicUrl(game.gameID)}
          alt={game.gameName}
          fallback={<span className={styles.fallbackText}>{game.gameName.charAt(0)}</span>}
        />
      </span>
      <span className={styles.name}>{game.gameName}</span>
    </Link>
  );
});
