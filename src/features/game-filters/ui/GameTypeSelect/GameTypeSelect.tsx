import { useId } from 'react';

import { ALL_GAME_TYPES, getGameTypeLabel } from '@/entities/game';
import { useAppDispatch, useAppSelector } from '@/shared/lib';

import { selectGameType, setGameType } from '../../model/gameFiltersSlice';

import styles from './GameTypeSelect.module.scss';

const ChevronIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

interface GameTypeSelectProps {
  availableTypes: string[];
}

export function GameTypeSelect({ availableTypes }: GameTypeSelectProps) {
  const dispatch = useAppDispatch();
  const selected = useAppSelector(selectGameType);
  const id = useId();

  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        Game Type
      </label>
      <div className={styles.control}>
        <select
          id={id}
          className={styles.select}
          value={selected}
          onChange={(event) => dispatch(setGameType(event.target.value))}
        >
          <option value={ALL_GAME_TYPES}>All</option>
          {availableTypes.map((type) => (
            <option key={type} value={type}>
              {getGameTypeLabel(type)}
            </option>
          ))}
        </select>
        <span className={styles.chevron} aria-hidden="true">
          <ChevronIcon />
        </span>
      </div>
    </div>
  );
}
