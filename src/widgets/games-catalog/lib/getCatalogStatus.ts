export type CatalogStatus = 'loading' | 'error' | 'empty' | 'ready';

interface CatalogStatusInput {
  isLoading: boolean;
  isError: boolean;
  isEmpty: boolean;
}

export function getCatalogStatus({
  isLoading,
  isError,
  isEmpty,
}: CatalogStatusInput): CatalogStatus {
  if (isLoading) return 'loading';
  if (isError) return 'error';
  if (isEmpty) return 'empty';
  return 'ready';
}
