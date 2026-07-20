// ui.js — HUD, score, lives display, and overlay screens
// Draws the score counter (top-left), ball-life icons (top-right),
// floating "+N" popups on brick hits, and win/lose overlay screens.

// --- Score state ---
let score = 0;

// --- Floating score popups ---
// Each popup: { x, y, text, alpha, vy }
// Popups float upward and fade out over ~0.8 seconds
let popups = [];

/**
 * Add points to the current score.
 *
 * @param {number} points - How many points to add
 */
export function addScore(points) {
    score += points;
}

/**
 * Reset the score back to zero (e.g., on game restart).
 */
export function resetScore() {
    score = 0;
    popups = [];
}

/**
 * Spawn a floating score popup at a position.
 * The text floats upward and fades over time.
 *
 * @param {number} x - Center x position
 * @param {number} y - Center y position
 * @param {string} text - The text to show (e.g. "+1")
 */
export function addScorePopup(x, y, text) {
    popups.push({ x, y, text, alpha: 1, vy: -70 }); // floats up at 70px/s
}

/**
 * Update all floating popups each frame.
 *
 * @param {number} dt - Seconds since last frame
 */
export function updatePopups(dt) {
    for (const p of popups) {
        p.y += p.vy * dt;       // float upward
        p.alpha -= dt * 1.5;    // fade out over ~0.67s
    }
    // Remove fully faded popups
    popups = popups.filter(p => p.alpha > 0);
}

/**
 * Draw the HUD (score counter + lives) at the top of the canvas.
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {HTMLCanvasElement} canvas
 * @param {number} lives - How many balls the player has left
 */
export function render(ctx, canvas, lives) {
    // --- Score (top-left) ---
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "18px monospace";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText(`Score: ${score}`, 10, 8);

    // --- Lives (top-right, drawn as mini ball icons) ---
    const iconRadius = 6;
    const spacing = 20;
    const iconY = 14;
    const startX = canvas.width - 80;

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "14px monospace";
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    ctx.fillText("Lives:", startX - 8, iconY);

    for (let i = 0; i < lives; i++) {
        const x = startX + i * spacing;

        // Mini ball — white fill with blue glow
        ctx.save();
        ctx.shadowColor = "#4488FF";
        ctx.shadowBlur = 4;
        ctx.beginPath();
        ctx.arc(x, iconY, iconRadius, 0, Math.PI * 2);
        ctx.fillStyle = "#FFFFFF";
        ctx.fill();
        ctx.strokeStyle = "#0000AA";
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.restore();
    }
}

/**
 * Draw all floating score popups.
 *
 * @param {CanvasRenderingContext2D} ctx
 */
export function renderPopups(ctx) {
    for (const p of popups) {
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = "#FFD700"; // gold
        ctx.font = "bold 16px monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        // Subtle glow behind the text for readability
        ctx.shadowColor = "rgba(0, 0, 0, 0.6)";
        ctx.shadowBlur = 3;
        ctx.fillText(p.text, p.x, p.y);
        ctx.restore();
    }
}

/**
 * Draw a semi-transparent overlay with a message.
 * Used for "You Win!" and "Game Over" screens.
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {HTMLCanvasElement} canvas
 * @param {string} title - Big text (e.g. "You Win!")
 * @param {string} subtitle - Smaller text (e.g. "Press R to restart")
 */
export function renderOverlay(ctx, canvas, title, subtitle) {
    // Dim the background
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Title — large, centered
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 48px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(title, canvas.width / 2, canvas.height / 2 - 20);

    // Subtitle — smaller, below the title
    ctx.font = "20px monospace";
    ctx.fillStyle = "#AAAAAA";
    ctx.fillText(subtitle, canvas.width / 2, canvas.height / 2 + 30);

    // Final score
    ctx.font = "16px monospace";
    ctx.fillStyle = "#888888";
    ctx.fillText(`Final Score: ${score}`, canvas.width / 2, canvas.height / 2 + 60);
}

