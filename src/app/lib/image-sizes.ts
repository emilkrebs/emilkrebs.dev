/**
 * next/image `sizes` for every image slot, next to the layout widths they
 * derive from. When `sizes` contains a bare `NNvw` term, next/image drops
 * every srcset width below 640 × NN%; the story cards spell their mobile
 * width as calc() so their 256 and 512 variants stay in srcset.
 */

// The 1120px container (1072px of content): landing and Healthstack.
export const FULL_WIDTH_SIZES = "(min-width: 1120px) 1072px, 100vw";
export const HALF_WIDTH_SIZES = "(min-width: 1120px) 524px, (min-width: 768px) 50vw, 100vw";

// The story column: max-w-4xl minus px-6 and the era gutter leaves 792px,
// three compact or two regular cards per row. Below md one card fills the
// viewport minus px-6 and the era gutter (5.5rem).
export const STORY_CARD_SIZES = "(min-width: 768px) 384px, calc(100vw - 5.5rem)";
export const STORY_COMPACT_CARD_SIZES = "(min-width: 768px) 256px, calc(100vw - 5.5rem)";
