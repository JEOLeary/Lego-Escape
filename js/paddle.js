// paddle.js — Paddle movement and rendering
// Keyboard-controlled (arrows + A/D) with acceleration: holding a direction
// builds speed (300→900 px/s). Direction change resets to base speed.
// Rounded rectangle with blue glow and top highlight.

import { isLeft, isRight } from "./input.js";

// --- Constants ---
const PADDLE_HEIGHT = 15;
const PADDLE_WIDTH_RATIO = 0.1;
const PADDLE_BASE_SPEED = 300;      // starting speed (px/s) — feels weighty
const PADDLE_MAX_SPEED = 900;       // top speed after accelerating
const PADDLE_ACCELERATION = 600;    // speed gained per second of holding a direction
const PADDLE_MARGIN_BOTTOM = 30;

// --- State ---
let x, y, width, height;
let paddleVx = 0;           // actual horizontal speed, computed each frame
let currentSpeed = PADDLE_BASE_SPEED;
let moveDir = 0;             // -1, 0, or 1 — the direction being held

/**
 * Set up the paddle to match the current canvas size.
 *
 * @param {HTMLCanvasElement} canvas
 */
export function init(canvas) {
    width = canvas.width * PADDLE_WIDTH_RATIO;
    height = PADDLE_HEIGHT;
    x = (canvas.width - width) / 2;
    y = canvas.height - PADDLE_MARGIN_BOTTOM - height;

    // Reset acceleration state
    currentSpeed = PADDLE_BASE_SPEED;
    moveDir = 0;
    paddleVx = 0;
}

/**
 * Move the paddle with acceleration.
 *
 * Holding a direction makes the paddle speed up gradually until it hits
 * its maximum. Letting go or switching directions resets back to base speed.
 *
 * @param {number} dt - Seconds since last frame
 * @param {HTMLCanvasElement} canvas
 */
export function update(dt, canvas) {
    const prevX = x;

    // What direction does the player want to go?
    // Holding both left AND right cancels out (intendedDir = 0).
    let intendedDir = 0;
    if (isLeft()) intendedDir -= 1;
    if (isRight()) intendedDir += 1;

    if (intendedDir !== 0) {
        if (intendedDir === moveDir) {
            // Same direction — keep accelerating
            currentSpeed += PADDLE_ACCELERATION * dt;
            if (currentSpeed > PADDLE_MAX_SPEED) {
                currentSpeed = PADDLE_MAX_SPEED;
            }
        } else {
            // Changed direction (or just started moving) — reset to base
            currentSpeed = PADDLE_BASE_SPEED;
        }
        moveDir = intendedDir;
        x += intendedDir * currentSpeed * dt;
    } else {
        // Not pressing anything — reset for next time
        moveDir = 0;
        currentSpeed = PADDLE_BASE_SPEED;
    }

    // Clamp to canvas edges
    if (x < 0) x = 0;
    if (x + width > canvas.width) x = canvas.width - width;

    // Actual speed (accounts for wall clamping)
    paddleVx = dt > 0 ? (x - prevX) / dt : 0;
}

/**
 * Returns the paddle's position and size.
 * @returns {{x: number, y: number, width: number, height: number}}
 */
export function getBounds() {
    return { x, y, width, height };
}

/**
 * Returns the paddle's actual horizontal speed.
 * @returns {number}
 */
export function getSpeed() {
    return paddleVx;
}

/**
 * Draw the paddle with glow and rounded corners.
 * @param {CanvasRenderingContext2D} ctx
 */
export function render(ctx) {
    const cornerRadius = 5;

    ctx.save();

    // Outer glow
    ctx.shadowColor = "#3366CC";
    ctx.shadowBlur = 10;

    ctx.beginPath();
    ctx.roundRect(x, y, width, height, cornerRadius);
    ctx.fillStyle = "#FFFFFF";
    ctx.fill();

    // Top highlight strip
    ctx.shadowBlur = 0;
    ctx.beginPath();
    ctx.roundRect(x + 2, y + 2, width - 4, height * 0.35, Math.min(cornerRadius, 3));
    ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
    ctx.fill();

    ctx.restore();
}
