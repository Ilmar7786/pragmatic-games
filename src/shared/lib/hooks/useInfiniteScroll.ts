import { useCallback, useEffect, useRef } from 'react';

interface UseInfiniteScrollOptions {
  hasMore: boolean;
  onLoadMore: () => void;
  /** Pre-fetch distance — how early to trigger before the sentinel is visible. */
  rootMargin?: string;
}

/**
 * IntersectionObserver-based infinite scroll — no third-party libraries.
 *
 * Attach the returned ref to a sentinel at the end of the list: when it enters
 * the pre-fetch zone and `hasMore` is true, `onLoadMore` fires one page at a
 * time. A `loading` guard caps in-flight loads at one until the caller commits.
 *
 * The observer only reports enter/exit transitions, so on a tall/zoomed-out
 * viewport a single page may not push the sentinel out and loading would stall.
 * To cover that, after each commit we measure the sentinel directly and load
 * again if it is still in the zone.
 */
export function useInfiniteScroll<T extends Element = HTMLDivElement>({
  hasMore,
  onLoadMore,
  rootMargin = '300px',
}: UseInfiniteScrollOptions) {
  // Latest callback/flag in refs so the observer isn't recreated every render.
  const onLoadMoreRef = useRef(onLoadMore);
  const hasMoreRef = useRef(hasMore);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const nodeRef = useRef<T | null>(null);
  const loadingRef = useRef(false);
  const prefetchPx = parseInt(rootMargin, 10) || 0;

  useEffect(() => {
    onLoadMoreRef.current = onLoadMore;
    hasMoreRef.current = hasMore;
  });

  // After each commit: release the guard and measure the sentinel; if it is
  // still in the pre-fetch zone, load the next page (see the tall-viewport case).
  useEffect(() => {
    loadingRef.current = false;
    const node = nodeRef.current;
    if (!node || !hasMore) return;
    const { top } = node.getBoundingClientRect();
    if (top <= window.innerHeight + prefetchPx) {
      loadingRef.current = true;
      onLoadMoreRef.current();
    }
  });

  const setSentinel = useCallback(
    (node: T | null) => {
      observerRef.current?.disconnect();
      observerRef.current = null;
      nodeRef.current = node;
      loadingRef.current = false;
      if (!node) return;

      observerRef.current = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (entry?.isIntersecting && hasMoreRef.current && !loadingRef.current) {
            loadingRef.current = true;
            onLoadMoreRef.current();
          }
        },
        { rootMargin },
      );
      observerRef.current.observe(node);
    },
    [rootMargin],
  );

  useEffect(() => () => observerRef.current?.disconnect(), []);

  return setSentinel;
}
