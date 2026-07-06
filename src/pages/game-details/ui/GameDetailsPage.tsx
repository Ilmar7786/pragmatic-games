import { Link, useParams } from 'react-router-dom';

import { getGamePicUrl, getGameTypeLabel, useGetGamesQuery } from '@/entities/game';
import { Image, StatusView } from '@/shared/ui';

import styles from './GameDetailsPage.module.scss';

// Lazy-loaded route; resolves the game from the cached catalog (no per-game endpoint).
export function GameDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { game, isLoading } = useGetGamesQuery(undefined, {
    selectFromResult: ({ data, isLoading }) => ({
      game: data?.find((item) => item.gameID === id),
      isLoading,
    }),
  });

  if (isLoading) {
    return (
      <StatusView icon="🎰" title="Loading game..." description={`Identifier: ${id ?? '—'}`} />
    );
  }

  if (!game) {
    return (
      <StatusView
        icon="🎰"
        title="Game not found"
        description={`Identifier: ${id ?? '—'}`}
        action={<Link to="/">← Back to catalog</Link>}
      />
    );
  }

  return (
    <article className={styles.page}>
      <Link to="/" className={styles.back}>
        ← Back to catalog
      </Link>
      <div className={styles.content}>
        <span className={styles.cover}>
          <Image
            src={getGamePicUrl(game.gameID)}
            alt={game.gameName}
            fallback={<span>{game.gameName.charAt(0)}</span>}
          />
        </span>
        <div className={styles.meta}>
          <h1 className={styles.title}>{game.gameName}</h1>
          <dl className={styles.specs}>
            <dt>ID</dt>
            <dd>{game.gameID}</dd>
            <dt>Type</dt>
            <dd>{getGameTypeLabel(game.gameTypeID)}</dd>
            <dt>Technology</dt>
            <dd>{game.technology}</dd>
            <dt>Platforms</dt>
            <dd>{game.platform}</dd>
          </dl>
        </div>
      </div>
    </article>
  );
}
