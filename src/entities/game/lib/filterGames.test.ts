import { describe, expect, it } from 'vitest';

import type { Game } from '../model/types';

import { ALL_GAME_TYPES, filterGames } from './filterGames';

const makeGame = (overrides: Partial<Game>): Game => ({
  gameID: 'id',
  gameName: 'Game',
  gameTypeID: 'vs',
  technology: 'html5',
  platform: 'WEB',
  firstSeenAt: '2026-01-01T00:00:00Z',
  ...overrides,
});

const games: Game[] = [
  makeGame({ gameID: 'a', gameName: 'Gates of Olympus', gameTypeID: 'vs' }),
  makeGame({ gameID: 'b', gameName: 'Sweet Bonanza', gameTypeID: 'vs' }),
  makeGame({ gameID: 'c', gameName: 'Roulette Live', gameTypeID: 'rl' }),
  makeGame({ gameID: 'd', gameName: 'Blackjack Pro', gameTypeID: 'bj' }),
];

describe('filterGames', () => {
  it('returns the same array reference when no filter is applied', () => {
    const result = filterGames(games, { search: '', gameTypeID: ALL_GAME_TYPES });
    expect(result).toBe(games);
  });

  it('filters by game type', () => {
    const result = filterGames(games, { search: '', gameTypeID: 'vs' });
    expect(result.map((g) => g.gameID)).toEqual(['a', 'b']);
  });

  it('filters by name, case-insensitively and trimmed', () => {
    const result = filterGames(games, { search: '  OLYMPUS ', gameTypeID: ALL_GAME_TYPES });
    expect(result.map((g) => g.gameID)).toEqual(['a']);
  });

  it('combines type and search filters', () => {
    const result = filterGames(games, { search: 'live', gameTypeID: 'rl' });
    expect(result.map((g) => g.gameID)).toEqual(['c']);
  });

  it('returns an empty array when nothing matches', () => {
    const result = filterGames(games, { search: 'nonexistent', gameTypeID: ALL_GAME_TYPES });
    expect(result).toEqual([]);
  });
});
