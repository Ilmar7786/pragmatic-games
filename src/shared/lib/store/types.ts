import type { ThunkDispatch, UnknownAction } from '@reduxjs/toolkit';

// Intentionally empty: each slice/API augments it via declaration merging, so
// `shared` stays agnostic of concrete features while the store type stays fully
// typed. See `baseApi` and `gameFiltersSlice`.
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface RootState {}

export type AppDispatch = ThunkDispatch<RootState, unknown, UnknownAction>;
