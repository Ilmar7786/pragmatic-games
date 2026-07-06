import type { CSSProperties } from 'react';

import { cn } from '@/shared/lib';

import styles from './Skeleton.module.scss';

interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  radius?: number | string;
  className?: string;
}

export function Skeleton({ width, height, radius, className }: SkeletonProps) {
  const style: CSSProperties = {
    width,
    height,
    borderRadius: radius,
  };

  return <span aria-hidden="true" className={cn(styles.skeleton, className)} style={style} />;
}
