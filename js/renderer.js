// renderer.js — Background rendering
// Draws a dark gradient (navy → black) behind the game. To swap in an
// image or animated background, only this file needs to change.

/**
 * Draws the background — a subtle dark gradient.
 * Navy at the top fading to black at the bottom creates depth.
 * Future phases can swap in images or animated backgrounds here
 * without changing any other file.
 *
 * @param {CanvasRenderingContext2D} ctx - The canvas drawing context
 * @param {number} width - Canvas width in pixels
 * @param {number} height - Canvas height in pixels
 */
export function renderBackground(ctx, width, height) {
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, "#0a0a1e");   // dark navy at top
    gradient.addColorStop(0.5, "#050510");  // near-black in the middle
    gradient.addColorStop(1, "#000000");    // pure black at the bottom
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
}
