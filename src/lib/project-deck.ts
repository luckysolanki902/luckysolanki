/** Let tall cards finish scrolling before pinning their bottom inside the viewport. */
export function deckPinTop(viewportHeight: number, cardHeight: number, index: number) {
  return Math.min(88 + index * 14, viewportHeight - cardHeight - 24);
}

/** Complete the depth effect while the incoming card is still visible on small screens. */
export function deckProgress(viewportHeight: number, nextTop: number, nextPinTop: number) {
  const start = viewportHeight * 0.65;
  const end = Math.min(start - 1, Math.max(88, nextPinTop));
  return Math.max(0, Math.min(1, (start - nextTop) / (start - end)));
}
