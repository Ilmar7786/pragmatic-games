/**
 * Grid geometry shared between the CSS tokens and the JS virtualizer.
 * Keep in sync with `--card-min-width`, `--card-aspect` and `--grid-gap` in `_tokens.scss`.
 */
export const GRID = {
  minColumnWidth: 180,
  gap: 18,
  /** Landscape thumbnail aspect ratio (width / height): Figma mock card is 191.11×118. */
  aspectRatio: 191.11 / 118,
  /**
   * Caption block below the thumbnail: card gap (8px, `--space-2`) + single-line
   * name at `--font-size-sm` (14px) with line-height 1 → 22px total.
   */
  captionHeight: 22,
} as const;

/** Row height for a given column width: landscape thumbnail + caption. */
export const estimateCardHeight = (columnWidth: number): number =>
  columnWidth / GRID.aspectRatio + GRID.captionHeight;
