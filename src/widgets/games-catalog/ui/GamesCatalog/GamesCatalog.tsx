import { useCallback, useMemo, useState } from 'react';

import { filterGames, getAvailableGameTypes, useGetGamesQuery, type Game } from '@/entities/game';
import {
  GameSearch,
  GameTypeSelect,
  resetFilters,
  selectGameType,
  selectSearch,
} from '@/features/game-filters';
import { CATALOG_PAGE_SIZE } from '@/shared/config';
import { cn, useAppDispatch, useAppSelector, useInfiniteScroll } from '@/shared/lib';

import { getCatalogStatus } from '../../lib/getCatalogStatus';
import { CatalogResults } from '../CatalogResults';
import { ProviderHeader } from '../ProviderHeader';

import styles from './GamesCatalog.module.scss';

const EMPTY_GAMES: Game[] = [];

// Wires filter controls to RTK Query data, then applies client-side filtering,
// chunked infinite scroll and grid virtualization.
export function GamesCatalog() {
  const dispatch = useAppDispatch();
  const { data: games = EMPTY_GAMES, isLoading, isError, refetch } = useGetGamesQuery();

  const search = useAppSelector(selectSearch);
  const gameTypeID = useAppSelector(selectGameType);

  const availableTypes = useMemo(() => getAvailableGameTypes(games), [games]);
  const filtered = useMemo(
    () => filterGames(games, { search, gameTypeID }),
    [games, search, gameTypeID],
  );

  // How many filtered games are rendered; reset to the first page on filter
  // change via the adjust-state-during-render pattern (no effect).
  const [loadedCount, setLoadedCount] = useState(CATALOG_PAGE_SIZE);
  const filterKey = `${search} ${gameTypeID}`;
  const [prevFilterKey, setPrevFilterKey] = useState(filterKey);
  if (filterKey !== prevFilterKey) {
    setPrevFilterKey(filterKey);
    setLoadedCount(CATALOG_PAGE_SIZE);
  }

  const visible = useMemo(() => filtered.slice(0, loadedCount), [filtered, loadedCount]);
  const hasMore = loadedCount < filtered.length;

  const loadMore = useCallback(() => {
    setLoadedCount((count) => count + CATALOG_PAGE_SIZE);
  }, []);
  const sentinelRef = useInfiniteScroll<HTMLDivElement>({ hasMore, onLoadMore: loadMore });

  const status = getCatalogStatus({ isLoading, isError, isEmpty: filtered.length === 0 });

  return (
    <section className={styles.catalog}>
      <div className={styles.topbar}>
        <div className={cn(styles.substrate, styles.typeSelect)}>
          <GameTypeSelect availableTypes={availableTypes} />
        </div>
        <div className={styles.substrate}>
          <GameSearch />
        </div>
      </div>

      <div className={styles.content}>
        <ProviderHeader name="Pragmatic Play" />
        <p className="visually-hidden" aria-live="polite">
          {isLoading ? 'Loading games' : `${filtered.length} games found`}
        </p>
        <CatalogResults
          status={status}
          games={visible}
          hasMore={hasMore}
          sentinelRef={sentinelRef}
          onRetry={() => void refetch()}
          onResetFilters={() => dispatch(resetFilters())}
        />
      </div>
    </section>
  );
}
