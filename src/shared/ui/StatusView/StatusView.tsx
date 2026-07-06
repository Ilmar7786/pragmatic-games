import type { ReactNode } from 'react';

import styles from './StatusView.module.scss';

interface StatusViewProps {
  icon?: ReactNode;
  title: string;
  description?: ReactNode;
  action?: ReactNode;
  /** `assertive` for errors so screen readers announce immediately. */
  tone?: 'polite' | 'assertive';
}

export function StatusView({ icon, title, description, action, tone = 'polite' }: StatusViewProps) {
  return (
    <div className={styles.root} role="status" aria-live={tone}>
      {icon && <div className={styles.icon}>{icon}</div>}
      <p className={styles.title}>{title}</p>
      {description && <p className={styles.description}>{description}</p>}
      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
}
