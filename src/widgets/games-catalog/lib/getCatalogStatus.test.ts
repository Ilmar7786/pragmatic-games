import { describe, expect, it } from 'vitest';

import { getCatalogStatus } from './getCatalogStatus';

describe('getCatalogStatus', () => {
  it('prioritizes loading over everything else', () => {
    expect(getCatalogStatus({ isLoading: true, isError: true, isEmpty: true })).toBe('loading');
  });

  it('prioritizes error over empty', () => {
    expect(getCatalogStatus({ isLoading: false, isError: true, isEmpty: true })).toBe('error');
  });

  it('returns empty when there are no results', () => {
    expect(getCatalogStatus({ isLoading: false, isError: false, isEmpty: true })).toBe('empty');
  });

  it('returns ready when data is loaded and non-empty', () => {
    expect(getCatalogStatus({ isLoading: false, isError: false, isEmpty: false })).toBe('ready');
  });
});
