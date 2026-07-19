// level.js — Brick layout and level configuration
// Builds a grid of 4 rows with mixed-width bricks (1x1, 1x2, 1x4).
// Higher rows have more HP. Bricks render bottom-to-top so upper
// bricks naturally cover the studs of bricks below them.

import { renderBricks } from "./brick.js";

const ROWS = 4;
const TARGET_BRICK_WIDTH = 75;
const TARGET_BRICK_HEIGHT = 50;
const MAX_COLUMNS = 14;
const MIN_COLUMNS = 4;
const TOP_MARGIN_RATIO = 0.08;

export const COLORS = [
    "#E53935", // Red
    "#FB8C00", // Orange
    "#FDD835", // Yellow
    "#43A047", // Green
    "#1E88E5", // Blue
    "#8E24AA", // Purple
    "#EC407A", // Pink
    "#00ACC1", // Cyan
    "#7CB342", // Lime
    "#FF7043", // Coral
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

    const SIZE_OPTIONS = [
        { studs: 1, mult: 0.5 },
        { studs: 2, mult: 1 },
        { studs: 4, mult: 2 },
    ];

    for (let row = 0; row < ROWS; row++) {
        const hp = ROWS - row;
        let xPos = 0;
        let prevColor = ""; // avoid consecutive same color in this row

        while (xPos < canvas.width - 1) {
            const remaining = canvas.width - xPos;

            const fitting = SIZE_OPTIONS.filter(function (o) {
                return o.mult * baseWidth <= remaining + 1;
            });

            const choice = fitting[Math.floor(Math.random() * fitting.length)];
            const bw = choice.mult * baseWidth > remaining ? remaining : choice.mult * baseWidth;

            // Pick a random color different from the previous brick
            let color;
            do {
                color = COLORS[Math.floor(Math.random() * COLORS.length)];
            } while (color === prevColor);
            prevColor = color;

            bricks.push({
                x: xPos,
                y: topMargin + row * brickHeight,
                width: bw,
                height: brickHeight,
                color: color,
                hp: hp,
                initialHp: hp,
                hasBrickAbove: false, // studs hidden by layering, not by flag
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
}

/**
 * Render bricks bottom-to-top. Upper bricks draw after lower ones,
 * so their bodies cover the studs protruding from bricks below.
 * Only the topmost bricks in each column show their studs.
 */
export function render(ctx) {
    for (let i = bricks.length - 1; i >= 0; i--) {
        renderBricks(ctx, [bricks[i]]);
    }
}
