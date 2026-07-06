import { createBrowserRouter } from 'react-router-dom';

import { GamesPage } from '@/pages/games';
import { NotFoundPage } from '@/pages/not-found';

import { AppLayout } from '../../ui/AppLayout';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <GamesPage /> },
      {
        // Code-split: fetched only when first visited.
        path: 'game/:id',
        lazy: async () => {
          const { GameDetailsPage } = await import('@/pages/game-details');
          return { Component: GameDetailsPage };
        },
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
