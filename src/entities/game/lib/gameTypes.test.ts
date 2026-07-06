import { describe, expect, it } from 'vitest';

import type { Game } from '../model/types';

import { getAvailableGameTypes, getGameTypeLabel } from './gameTypes';

const makeGame = (gameTypeID: string, gameID: string): Game => ({
  gameID,
  gameName: gameID,
  gameTypeID,
  technology: 'html5',
  platform: 'WEB',
  firstSeenAt: '2026-01-01T00:00:00Z',
});

describe('getGameTypeLabel', () => {
  it('returns a curated label for known types', () => {
    expect(getGameTypeLabel('vs')).toBe('Video Slots');
  });

  it('falls back to the upper-cased code for unknown types', () => {
    expect(getGameTypeLabel('cs')).toBe('CS');
  });
});

describe('getAvailableGameTypes', () => {
  it('returns distinct types ordered by frequency (most first)', () => {
    const games = [
      makeGame('lg', '1'),
      makeGame('vs', '2'),
      makeGame('vs', '3'),
      makeGame('vs', '4'),
      makeGame('lg', '5'),
      makeGame('rl', '6'),
    ];
    expect(getAvailableGameTypes(games)).toEqual(['vs', 'lg', 'rl']);
  });

  it('returns an empty array for no games', () => {
    expect(getAvailableGameTypes([])).toEqual([]);
  });
});
