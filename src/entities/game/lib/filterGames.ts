import type { Game } from '../model/types';

/** Sentinel meaning "no type filter applied". */
export const ALL_GAME_TYPES = 'all';

export interface GameFilterCriteria {
  search: string;
  gameTypeID: string;
}

// The API supports neither search nor type filtering, so both happen client-side.
export function filterGames(games: readonly Game[], criteria: GameFilterCriteria): Game[] {
  const query = criteria.search.trim().toLowerCase();
  const { gameTypeID } = criteria;

  if (!query && gameTypeID === ALL_GAME_TYPES) {
    return games as Game[];
  }

  return games.filter((game) => {
    if (gameTypeID !== ALL_GAME_TYPES && game.gameTypeID !== gameTypeID) {
      return false;
    }
    return query === '' || game.gameName.toLowerCase().includes(query);
  });
}
