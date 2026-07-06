import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import type { Game } from '../../model/types';

import { GameCard } from './GameCard';

const game: Game = {
  gameID: 'vs10bbasblitz',
  gameName: 'Big Bass Blast',
  gameTypeID: 'vs',
  technology: 'html5',
  platform: 'WEB',
  firstSeenAt: '2026-01-01T00:00:00Z',
};

const renderCard = () =>
  render(
    <MemoryRouter>
      <GameCard game={game} />
    </MemoryRouter>,
  );

describe('GameCard', () => {
  it('renders the game name and links to the game page', () => {
    renderCard();
    const link = screen.getByRole('link', { name: /Big Bass Blast/ });
    expect(link).toHaveAttribute('href', '/game/vs10bbasblitz');
  });

  it('exposes an accessible thumbnail with the game name as alt text', () => {
    renderCard();
    expect(screen.getByRole('img', { name: 'Big Bass Blast' })).toBeInTheDocument();
  });
});
