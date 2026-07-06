import { baseApi } from '@/shared/api';
import { PARTNER_NAME } from '@/shared/config';

import type { Game, GameListResponse } from '../model/types';

// Full catalogue is fetched once; search/filter/pagination are all client-side.
export const gameApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getGames: build.query<Game[], void>({
      query: () => ({
        url: '/game/list',
        params: { partner_name: PARTNER_NAME },
      }),
      transformResponse: (response: GameListResponse) => response.result,
      keepUnusedDataFor: 600,
      providesTags: ['Games'],
    }),
  }),
});

export const { useGetGamesQuery } = gameApi;
