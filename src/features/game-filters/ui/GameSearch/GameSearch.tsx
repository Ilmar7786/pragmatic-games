import { useId, useState, type FormEvent } from 'react';

import { useAppDispatch, useAppSelector } from '@/shared/lib';
import { Button, TextField } from '@/shared/ui';

import { selectSearch, setSearch } from '../../model/gameFiltersSlice';

import styles from './GameSearch.module.scss';

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
    <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// The query is applied on submit (button / Enter), not while typing.
export function GameSearch() {
  const dispatch = useAppDispatch();
  const committed = useAppSelector(selectSearch);

  const [value, setValue] = useState(committed);
  const [error, setError] = useState<string | null>(null);
  const errorId = useId();

  // Sync the input when the committed query changes elsewhere (e.g. "Reset filters").
  const [prevCommitted, setPrevCommitted] = useState(committed);
  if (committed !== prevCommitted) {
    setPrevCommitted(committed);
    setValue(committed);
    setError(null);
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const query = value.trim();
    if (query === '') {
      // Empty submit clears an active search; warn only when there's nothing to reset.
      if (committed !== '') {
        setError(null);
        dispatch(setSearch(''));
      } else {
        setError('Enter a game name to search');
      }
      return;
    }
    setError(null);
    dispatch(setSearch(query));
  };

  const handleClear = () => {
    setValue('');
    setError(null);
    dispatch(setSearch(''));
  };

  return (
    <form className={styles.search} role="search" noValidate onSubmit={handleSubmit}>
      <span className={styles.label} aria-hidden="true">
        Search
      </span>
      <div className={styles.row}>
        <TextField
          type="search"
          label="Search game"
          placeholder="Search"
          value={value}
          onValueChange={(next) => {
            setValue(next);
            if (error) setError(null);
          }}
          onClear={handleClear}
          icon={<SearchIcon />}
          accent
          error={error !== null}
          autoComplete="off"
          className={styles.field}
          aria-invalid={error !== null}
          aria-describedby={error ? errorId : undefined}
        />
        <Button type="submit" className={styles.button}>
          Search
        </Button>
      </div>
      {error && (
        <p id={errorId} className={styles.error} role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
