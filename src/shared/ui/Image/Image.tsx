import { useState, type ReactNode } from 'react';

import { cn } from '@/shared/lib';

import { Skeleton } from '../Skeleton';

import styles from './Image.module.scss';

interface ImageProps {
  src: string;
  alt: string;
  /** Shown instead of the image when it fails to load (e.g. a 404 thumbnail). */
  fallback?: ReactNode;
  className?: string;
}

type Status = 'loading' | 'loaded' | 'error';

// Fills its positioned parent. Skeleton while loading, fallback on error;
// native lazy loading + async decoding.
export function Image({ src, alt, fallback, className }: ImageProps) {
  const [status, setStatus] = useState<Status>('loading');

  return (
    <div className={cn(styles.wrapper, className)}>
      {status === 'loading' && <Skeleton className={styles.skeleton} />}
      {status === 'error' && fallback !== undefined && (
        <div className={styles.fallback}>{fallback}</div>
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        draggable={false}
        className={cn(styles.image, status === 'loaded' && styles.imageVisible)}
        onLoad={() => setStatus('loaded')}
        onError={() => setStatus('error')}
      />
    </div>
  );
}
