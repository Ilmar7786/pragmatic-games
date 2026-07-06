import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { Spinner } from '@/shared/ui';

import styles from './AppLayout.module.scss';

export function AppLayout() {
  return (
    <div className={styles.layout}>
      <Suspense fallback={<Spinner className={styles.fallback} />}>
        <Outlet />
      </Suspense>
    </div>
  );
}
