import { BombIcon } from './BombIcon';
import styles from './ProviderHeader.module.scss';

interface ProviderHeaderProps {
  name: string;
}

export function ProviderHeader({ name }: ProviderHeaderProps) {
  return (
    <h1 className={styles.heading}>
      <span className={styles.icon}>
        <BombIcon />
      </span>
      {name}
    </h1>
  );
}
