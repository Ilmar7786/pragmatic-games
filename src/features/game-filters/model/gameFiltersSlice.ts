import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { ALL_GAME_TYPES } from '@/entities/game';

export interface GameFiltersState {
  /** Committed search query (applied on submit). */
  search: string;
  /** Selected `gameTypeID`, or `ALL_GAME_TYPES`. */
  gameTypeID: string;
}

const initialState: GameFiltersState = {
  search: '',
  gameTypeID: ALL_GAME_TYPES,
};

export const gameFiltersSlice = createSlice({
  name: 'gameFilters',
  initialState,
  reducers: {
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
    },
    setGameType(state, action: PayloadAction<string>) {
      state.gameTypeID = action.payload;
    },
    resetFilters: () => initialState,
  },
  selectors: {
    selectSearch: (state) => state.search,
    selectGameType: (state) => state.gameTypeID,
  },
});

export const { setSearch, setGameType, resetFilters } = gameFiltersSlice.actions;
export const { selectSearch, selectGameType } = gameFiltersSlice.selectors;
export const gameFiltersReducer = gameFiltersSlice.reducer;

declare module '@/shared/lib/store' {
  interface RootState {
    gameFilters: GameFiltersState;
  }
}
