import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { API_BASE_URL } from '@/shared/config';

// Single API instance; slices attach endpoints via `injectEndpoints`.
// `baseUrl` is the same-origin `/api` proxy (see `shared/config`).
export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  tagTypes: ['Games'],
  endpoints: () => ({}),
});

declare module '@/shared/lib/store' {
  interface RootState {
    baseApi: ReturnType<typeof baseApi.reducer>;
  }
}
