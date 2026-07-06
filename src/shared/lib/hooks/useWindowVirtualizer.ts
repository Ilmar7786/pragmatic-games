import { useLayoutEffect, useMemo, useRef, useState, type RefObject } from 'react';

export interface VirtualItem {
  index: number;
  /** Offset from the container's left edge, px. */
  x: number;
  /** Offset from the container's top edge, px. */
  y: number;
  width: number;
  height: number;
}

interface UseWindowVirtualizerOptions {
  itemCount: number;
  /** The (position: relative) grid container the items are absolutely placed in. */
  containerRef: RefObject<HTMLElement | null>;
  /** Minimum card width; column count is derived from the container width. */
  minColumnWidth: number;
  /** Row height for a given column width, e.g. `(w) => w + captionHeight`. */
  estimateRowHeight: (columnWidth: number) => number;
  gap: number;
  /** Extra rows rendered above/below the viewport to avoid flashes on fast scroll. */
  overscanRows?: number;
}

interface WindowVirtualizerResult {
  columns: number;
  columnWidth: number;
  totalHeight: number;
  virtualItems: VirtualItem[];
}

interface Metrics {
  width: number;
  /** Container top relative to the viewport (getBoundingClientRect().top). */
  rectTop: number;
  viewportHeight: number;
}

/**
 * Window-scroll grid virtualizer — renders only the cards near the viewport, so
 * a 1000+ item catalog keeps a light DOM. No third-party libraries.
 *
 * Column count adapts to the container width (like `auto-fill minmax`), items
 * are absolutely positioned inside a full-height spacer, scroll/resize reads
 * are rAF-throttled.
 */
export function useWindowVirtualizer({
  itemCount,
  containerRef,
  minColumnWidth,
  estimateRowHeight,
  gap,
  overscanRows = 3,
}: UseWindowVirtualizerOptions): WindowVirtualizerResult {
  const [metrics, setMetrics] = useState<Metrics>({ width: 0, rectTop: 0, viewportHeight: 0 });
  const rafRef = useRef(0);

  // `useLayoutEffect`: the initial measure must commit the real column count
  // before paint, else the first frame stacks every card in one column (width
  // still 0) and pushes the infinite-scroll sentinel out of reach.
  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const measure = () => {
      const rect = el.getBoundingClientRect();
      setMetrics((prev) => {
        if (
          prev.width === rect.width &&
          prev.rectTop === rect.top &&
          prev.viewportHeight === window.innerHeight
        ) {
          return prev;
        }
        return { width: rect.width, rectTop: rect.top, viewportHeight: window.innerHeight };
      });
    };

    const schedule = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    const resizeObserver = new ResizeObserver(schedule);
    resizeObserver.observe(el);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      resizeObserver.disconnect();
    };
  }, [containerRef]);

  return useMemo<WindowVirtualizerResult>(() => {
    const columns =
      metrics.width > 0
        ? Math.max(1, Math.floor((metrics.width + gap) / (minColumnWidth + gap)))
        : 1;
    const columnWidth =
      columns > 0 ? (metrics.width - gap * (columns - 1)) / columns : metrics.width;
    const rowHeight = Math.max(1, estimateRowHeight(columnWidth));
    const rowStride = rowHeight + gap;
    const rowCount = Math.ceil(itemCount / columns);
    const totalHeight = rowCount > 0 ? rowCount * rowHeight + (rowCount - 1) * gap : 0;

    const startRow = Math.max(0, Math.floor(-metrics.rectTop / rowStride) - overscanRows);
    const visibleRows = Math.ceil(metrics.viewportHeight / rowStride) + overscanRows * 2;
    const endRow = Math.min(rowCount, startRow + visibleRows);

    const virtualItems: VirtualItem[] = [];
    for (let row = startRow; row < endRow; row += 1) {
      for (let col = 0; col < columns; col += 1) {
        const index = row * columns + col;
        if (index >= itemCount) break;
        virtualItems.push({
          index,
          x: col * (columnWidth + gap),
          y: row * rowStride,
          width: columnWidth,
          height: rowHeight,
        });
      }
    }

    return { columns, columnWidth, totalHeight, virtualItems };
  }, [metrics, itemCount, minColumnWidth, estimateRowHeight, gap, overscanRows]);
}
