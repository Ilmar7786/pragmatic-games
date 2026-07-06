import { GAME_PIC_BASE_URL } from '@/shared/config';

export function getGamePicUrl(gameID: string): string {
  return `${GAME_PIC_BASE_URL}/${gameID}.png`;
}
