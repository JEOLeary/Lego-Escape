// level.js — Brick layout and level configuration
// Builds a grid of 4 rows with mixed-width bricks (1x2, 1x4, 1x8).
// Higher rows have more HP. Exposes brick array for collision and rendering.

import { renderBricks } from "./brick.js";

const ROWS = 4;
const TARGET_BRICK_WIDTH = 75;
const TARGET_BRICK_HEIGHT = 50;
const MAX_COLUMNS = 14;
const MIN_COLUMNS = 4;
const TOP_MARGIN_RATIO = 0.08;

export const COLORS = [
    "#E53935",
    "#FB8C00",
    "#FDD835",
    "#43A047",
    "#1E88E5",
];

let bricks = [];

export function init(canvas) {
    bricks = [];

    const columns = Math.max(
        MIN_COLUMNS,
        Math.min(MAX_COLUMNS, Math.round(canvas.width / TARGET_BRICK_WIDTH))
    );
    const baseWidth = canvas.width / columns;
    const brickHeight = TARGET_BRICK_HEIGHT;
    const topMargin = canvas.height * TOP_MARGIN_RATIO;

    // Size options: { studs, widthMultiplier }
    const SIZE_OPTIONS = [
        { studs: 1, mult: 0.5 },
        { studs: 2, mult: 1 },
        { studs: 4, mult: 2 },
    ];

    for (let row = 0; row < ROWS; row++) {
        const hp = ROWS - row;
        let xPos = 0;

        while (xPos < canvas.width - 1) {
            const remaining = canvas.width - xPos;

            // Which sizes fit in the remaining space?
            const fitting = SIZE_OPTIONS.filter(function (o) {
                return o.mult * baseWidth <= remaining + 1;
            });

            // Should never be empty — at least 1x2 always fits (baseWidth <= canvas.width)
            const choice = fitting[Math.floor(Math.random() * fitting.length)];
            const bw = choice.mult * baseWidth > remaining ? remaining : choice.mult * baseWidth;

            bricks.push({
                x: xPos,
                y: topMargin + row * brickHeight,
                width: bw,
                height: brickHeight,
                color: COLORS[Math.floor(Math.random() * COLORS.length)],
                hp: hp,
                initialHp: hp,
                hasBrickAbove: false, // computed dynamically in render()
                studCount: choice.studs,
                cracks: [],
            });

            xPos += bw;
        }
    }
}

export function getBricks() {
    return bricks;
}

export function removeBrick(index) {
    bricks.splice(index, 1);
    recomputeStuds();
}

export function render(ctx) {
    renderBricks(ctx, bricks);
}

/**
 * Recompute hasBrickAbove for every brick by checking x-range overlap
 * with bricks in the row directly above. Called once at init and again
 * whenever a brick is destroyed.
 */
function recomputeStuds() {
    for (let i = 0; i < bricks.length; i++) {
        const brick = bricks[i];
        const aboveY = brick.y - brick.height;
        brick.hasBrickAbove = false;
        for (let j = 0; j < bricks.length; j++) {
            const other = bricks[j];
            if (other === brick) continue;
            if (Math.abs(other.y - aboveY) < 1 &&
                other.x < brick.x + brick.width &&
                other.x + other.width > brick.x) {
                brick.hasBrickAbove = true;
                break;
        }
    }
    recomputeStuds();
}
}
