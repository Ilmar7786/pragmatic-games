import type { Game } from '../model/types';

const GAME_TYPE_LABELS: Record<string, string> = {
  vs: 'Video Slots',
  lg: 'Live Casino',
  sc: 'Scratch Cards',
  bj: 'Blackjack',
  rl: 'Roulette',
  bc: 'Baccarat',
  vp: 'Video Poker',
  ar: 'Arcade',
};

export function getGameTypeLabel(gameTypeID: string): string {
  return GAME_TYPE_LABELS[gameTypeID] ?? gameTypeID.toUpperCase();
}

// Distinct type codes present in the data, ordered by frequency (most first).
export function getAvailableGameTypes(games: readonly Game[]): string[] {
  const counts = new Map<string, number>();
  for (const game of games) {
    counts.set(game.gameTypeID, (counts.get(game.gameTypeID) ?? 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([id]) => id);
}
