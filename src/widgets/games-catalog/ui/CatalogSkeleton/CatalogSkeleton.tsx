import { Skeleton } from '@/shared/ui';

import styles from './CatalogSkeleton.module.scss';

interface CatalogSkeletonProps {
  count?: number;
}

export function CatalogSkeleton({ count = 18 }: CatalogSkeletonProps) {
  return (
    <div className={styles.grid} aria-hidden="true">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className={styles.cell}>
          <Skeleton className={styles.thumb} />
          <Skeleton width="70%" height={12} />
        </div>
      ))}
    </div>
  );
}
