import { configureStore } from '@reduxjs/toolkit';

import { gameFiltersReducer } from '@/features/game-filters';
import { baseApi } from '@/shared/api';

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    gameFilters: gameFiltersReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
});
