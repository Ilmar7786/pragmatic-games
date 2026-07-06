import { configureStore } from '@reduxjs/toolkit';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { describe, expect, it } from 'vitest';

import { gameFiltersReducer, selectSearch } from '../../model/gameFiltersSlice';

import { GameSearch } from './GameSearch';

function renderWithStore() {
  const store = configureStore({ reducer: { gameFilters: gameFiltersReducer } });
  render(
    <Provider store={store}>
      <GameSearch />
    </Provider>,
  );
  return store;
}

describe('GameSearch', () => {
  it('applies the query only on submit, not while typing', async () => {
    const user = userEvent.setup();
    const store = renderWithStore();

    await user.type(screen.getByRole('searchbox', { name: /search game/i }), 'olympus');
    expect(selectSearch(store.getState())).toBe('');

    await user.click(screen.getByRole('button', { name: /search/i }));
    expect(selectSearch(store.getState())).toBe('olympus');
  });

  it('shows a validation error and does not search on an empty submit', async () => {
    const user = userEvent.setup();
    const store = renderWithStore();

    await user.click(screen.getByRole('button', { name: /search/i }));

    expect(screen.getByRole('alert')).toHaveTextContent(/enter a game name/i);
    expect(selectSearch(store.getState())).toBe('');
  });

  it('clears an active search on an empty submit instead of erroring', async () => {
    const user = userEvent.setup();
    const store = renderWithStore();

    const input = screen.getByRole('searchbox', { name: /search game/i });
    await user.type(input, 'olympus');
    await user.click(screen.getByRole('button', { name: /search/i }));
    expect(selectSearch(store.getState())).toBe('olympus');

    // Manually erase the text and submit again: this should reset the search
    // (show all games), not show the "enter a game name" validation error.
    await user.clear(input);
    await user.click(screen.getByRole('button', { name: /search/i }));

    expect(selectSearch(store.getState())).toBe('');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('trims whitespace before applying the query', async () => {
    const user = userEvent.setup();
    const store = renderWithStore();

    await user.type(screen.getByRole('searchbox', { name: /search game/i }), '  bonanza  ');
    await user.click(screen.getByRole('button', { name: /search/i }));

    expect(selectSearch(store.getState())).toBe('bonanza');
  });
});
