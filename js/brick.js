// brick.js — LEGO-style brick rendering and crack generation
// Side-view bricks with gradient shading. Cylinder studs protrude from
// the top row only (hidden when a brick sits above). Damage shown as
// spidering cracks that grow with each hit.

/**
 * Draw all bricks in the array.
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {Array} bricks - Array of brick objects
 */
export function renderBricks(ctx, bricks) {
    for (const brick of bricks) {
        drawBrick(ctx, brick);
    }
}

/**
 * Generate a new spidering crack for a damaged brick.
 * Each crack is a jagged horizontal path with random vertical jitter.
 * Cracks start near the left side and work toward the right.
 * Stored on the brick object so they're consistent frame to frame.
 *
 * @param {{x: number, y: number, width: number, height: number}} brick
 * @returns {Array<{x: number, y: number}>}
 */
export function generateCrack(brick) {
    const points = [];
    const segments = 3 + Math.floor(Math.random() * 4); // 3 to 6 segments
    let cx = brick.x + Math.random() * brick.width * 0.25; // start near left
    let cy = brick.y + Math.random() * brick.height;
    points.push({ x: cx, y: cy });

    for (let i = 0; i < segments; i++) {
        // Move mostly rightward with some vertical jitter
        cx += (0.3 + Math.random() * 0.5) * brick.width / segments;
        cy += (Math.random() - 0.5) * brick.height * 0.8;
        // Clamp inside the brick (with 1px padding)
        cx = Math.max(brick.x + 1, Math.min(brick.x + brick.width - 1, cx));
        cy = Math.max(brick.y + 1, Math.min(brick.y + brick.height - 1, cy));
        points.push({ x: cx, y: cy });
    }
    return points;
}

/**
 * Draw a single LEGO-style brick from the side.
 *
 * Viewed from the side:
 * - Rounded rectangle body
 * - Bevel highlight along the top edge
 * - Shadow along the bottom edge
 * - Studs protrude upward ONLY if no brick sits above (hasBrickAbove=false)
 * - Damage = spidering cracks (more cracks = more damage)
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {object} brick
 */
function drawBrick(ctx, brick) {
    const { x, y, width: w, height: h, color, hp, initialHp, hasBrickAbove, studCount, cracks } = brick;

    // --- Brick body with gradient ---
    const grad = ctx.createLinearGradient(x, y, x, y + h);
    grad.addColorStop(0, lighten(color, 0.18));
    grad.addColorStop(1, darken(color, 0.25));
    ctx.fillStyle = grad;
    ctx.fillRect(x, y, w, h);

    // --- Cylinder studs (top row only) ---
    if (!hasBrickAbove && studCount) {
        const count = studCount;
        const spacing = w / count;
        const studW = spacing * 0.50;
        const studH = h * 0.18;

        for (let i = 0; i < count; i++) {
            const sx = x + (i + 0.5) * spacing - studW / 2;
            drawStud(ctx, sx, y - studH, studW, studH, color);
        }
    }

    // --- Spidering cracks ---
    if (cracks && cracks.length > 0) {
        ctx.strokeStyle = darken(color, 0.6);
        ctx.lineWidth = 1;
        for (let i = 0; i < cracks.length; i++) {
            var crack = cracks[i];
            if (crack.length < 2) continue;
            ctx.beginPath();
            ctx.moveTo(crack[0].x, crack[0].y);
            for (let j = 1; j < crack.length; j++) {
                ctx.lineTo(crack[j].x, crack[j].y);
            }
            ctx.stroke();
        }
    }
}

/**
 * Draw a single LEGO cylinder stud protruding from the top of the brick.
 * Cylinder 3D look: darker edges, highlight stripe down the middle.
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} x - Left edge of the stud
 * @param {number} y - Top edge of the stud (sits on the brick top)
 * @param {number} w - Stud width
 * @param {number} h - Stud height
 * @param {string} baseColor - Brick color
 */
function drawStud(ctx, x, y, w, h, baseColor) {
    // Stud body — slightly lighter than the brick
    ctx.fillStyle = lighten(baseColor, 0.15);
    ctx.fillRect(x, y, w, h);

    // Left edge shadow (darker, ~20% of width)
    ctx.fillStyle = darken(baseColor, 0.15);
    ctx.fillRect(x, y, w * 0.25, h);

    // Right edge shadow (darker, ~20% of width)
    ctx.fillRect(x + w * 0.75, y, w * 0.25, h);

    // Center highlight stripe (lighter, ~30% of width)
    ctx.fillStyle = lighten(baseColor, 0.35);
    ctx.fillRect(x + w * 0.35, y, w * 0.30, h);
}

// --- Color helpers (blend hex toward white or black) ---

function lighten(hex, amount) {
    return blend(hex, "#FFFFFF", amount);
}

function darken(hex, amount) {
    return blend(hex, "#000000", amount);
}

function blend(hex1, hex2, amount) {
    const r = lerp(channel(hex1, 0), channel(hex2, 0), amount);
    const g = lerp(channel(hex1, 1), channel(hex2, 1), amount);
    const b = lerp(channel(hex1, 2), channel(hex2, 2), amount);
    return `rgb(${r},${g},${b})`;
}

function channel(hex, i) {
    return parseInt(hex.slice(1 + i * 2, 3 + i * 2), 16);
}

function lerp(a, b, t) {
    return Math.round(a + (b - a) * t);
}
