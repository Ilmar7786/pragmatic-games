import type { Game } from '@/entities/game';
import { Button, Spinner, StatusView } from '@/shared/ui';

import type { CatalogStatus } from '../../lib/getCatalogStatus';
import { CatalogSkeleton } from '../CatalogSkeleton';
import { VirtualGameGrid } from '../VirtualGameGrid';

import styles from './CatalogResults.module.scss';

interface CatalogResultsProps {
  status: CatalogStatus;
  games: Game[];
  hasMore: boolean;
  sentinelRef: (node: HTMLDivElement | null) => void;
  onRetry: () => void;
  onResetFilters: () => void;
}

export function CatalogResults({
  status,
  games,
  hasMore,
  sentinelRef,
  onRetry,
  onResetFilters,
}: CatalogResultsProps) {
  switch (status) {
    case 'loading':
      return <CatalogSkeleton />;

    case 'error':
      return (
        <StatusView
          tone="assertive"
          icon="⚠️"
          title="Failed to load games"
          description="Check your connection and try again."
          action={<Button onClick={onRetry}>Retry</Button>}
        />
      );

    case 'empty':
      return (
        <StatusView
          icon="🔍"
          title="Nothing found"
          description="Try a different search query or reset the filters."
          action={
            <Button variant="ghost" onClick={onResetFilters}>
              Reset filters
            </Button>
          }
        />
      );

    case 'ready':
      return (
        <>
          <VirtualGameGrid games={games} />
          {hasMore && (
            <div ref={sentinelRef} className={styles.sentinel}>
              <Spinner size={24} />
            </div>
          )}
        </>
      );
  }
}
