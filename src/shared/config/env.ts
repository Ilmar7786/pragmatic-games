// The upstream API sends no CORS headers, so the browser calls a same-origin
// `/api` prefix proxied to it (Vite proxy in dev; prod needs its own proxy).
export const API_BASE_URL = '/api';

export const PARTNER_NAME = 'belparyaj';

export const GAME_PIC_BASE_URL = 'https://bsw-dk1.pragmaticplay.net/game_pic/square/200';

/** Cards appended per infinite-scroll step. */
export const CATALOG_PAGE_SIZE = 48;
