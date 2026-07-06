import { describe, expect, it } from 'vitest';

import { GAME_PIC_BASE_URL } from '@/shared/config';

import { getGamePicUrl } from './getGamePicUrl';

describe('getGamePicUrl', () => {
  it('builds the square thumbnail URL from a game id', () => {
    expect(getGamePicUrl('vs10bbasblitz')).toBe(`${GAME_PIC_BASE_URL}/vs10bbasblitz.png`);
  });
});
