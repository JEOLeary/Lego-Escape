// ball.js — Ball physics, movement, and rendering
// Handles: wall bouncing, paddle collision (angled rebound), brick collision,
// motion trail, pulsing glow, and attached-to-paddle launch state.

import { checkBrickCollision } from "./collision.js";

// --- Constants ---
const BALL_RADIUS = 8;
const BALL_SPEED = 400;
const TRAIL_LENGTH = 20;
const TRAIL_MIN_RADIUS = 1.5;
const TRAIL_MAX_OPACITY = 0.5;
const MIN_VX_RATIO = 0.2;

// --- State ---
let x, y;
let prevX, prevY;
let vx, vy;
let radius;
let trail = [];
let glowTime = 0;
let attached = false; // ball sits on paddle, waiting for launch

/**
 * Set up the ball. Starts attached to the paddle by default —
 * the player must press Up or W to launch it.
 *
 * @param {HTMLCanvasElement} canvas
 */
export function init(canvas) {
    radius = BALL_RADIUS;
    // Position will be set each frame to follow the paddle while attached.
    // Fallback center position in case paddle info isn't available yet.
    x = canvas.width / 2;
    y = canvas.height * 0.75;
    prevX = x;
    prevY = y;
    vx = 0;
    vy = 0;
    trail = [];
    glowTime = 0;
    attached = true;
}

/**
 * Whether the ball is currently attached to the paddle (waiting for launch).
 * @returns {boolean}
 */
export function isAttached() {
    return attached;
}

/**
 * Launch the ball off the paddle at 45° upward.
 * Does nothing if the ball is already in flight.
 */
export function launch() {
    if (!attached) return;
    attached = false;
    const angle = Math.PI / 4;
    vx = BALL_SPEED * Math.cos(angle);
    vy = -BALL_SPEED * Math.sin(angle);
    preventVerticalBounce();
}

/**
 * Move the ball and check for all collision types.
 * When attached, follows the paddle and returns null.
 *
 * @param {number} dt
 * @param {HTMLCanvasElement} canvas
 * @param {object} [paddle]
 * @param {Array} [bricks]
 * @returns {{brickIndex: number}|{lost: true}|null}
 */
export function update(dt, canvas, paddle, bricks) {
    // --- Attached mode: follow the paddle ---
    if (attached) {
        if (paddle) {
            x = paddle.x + paddle.width / 2;
            y = paddle.y - radius;
        }
        // Reset prev to current so swept collision has valid data on launch
        prevX = x;
        prevY = y;
        trail = [];
        glowTime = 0;
        return null;
    }

    glowTime += dt;

    prevX = x;
    prevY = y;

    x += vx * dt;
    y += vy * dt;

    // --- Paddle collision ---
    if (paddle && vy > 0) {
        checkPaddleCollision(paddle);
    }

    // --- Brick collisions ---
    if (bricks && bricks.length > 0) {
        for (let i = 0; i < bricks.length; i++) {
            const hit = checkBrickCollision({ x, y, radius }, bricks[i]);
            if (hit) {
                reflectOffBrick(hit.side, bricks[i]);
                return { brickIndex: i };
            }
        }
    }

    // --- Wall collisions ---
    if (x - radius < 0) {
        x = radius;
        vx = -vx;
        preventVerticalBounce();
    }
    if (x + radius > canvas.width) {
        x = canvas.width - radius;
        vx = -vx;
        preventVerticalBounce();
    }
    if (y - radius < 0) {
        y = radius;
        vy = -vy;
        preventVerticalBounce();
    }
    if (y + radius > canvas.height) {
        return { lost: true };
    }

    trail.push({ x, y });
    if (trail.length > TRAIL_LENGTH) {
        trail.shift();
    }

    return null;
}

// --- Paddle collision (unchanged from Phase 4) ---

function checkPaddleCollision(paddle) {
    const ballLeft = x - radius;
    const ballRight = x + radius;
    const ballTop = y - radius;
    const ballBottom = y + radius;

    if (ballRight <= paddle.x || ballLeft >= paddle.x + paddle.width) return;

    const prevBallBottom = prevY + radius;
    const crossedPaddleTop = prevBallBottom <= paddle.y && ballBottom >= paddle.y;
    const currentlyOverlapping = ballBottom > paddle.y && ballTop < paddle.y + paddle.height;

    if (!crossedPaddleTop && !currentlyOverlapping) return;

    const impactX = (x - paddle.x) / paddle.width;
    const normalized = Math.max(-1, Math.min(1, (impactX - 0.5) * 2));

    const MAX_ANGLE = Math.PI / 3;
    let angle = normalized * MAX_ANGLE;

    const MIN_ANGLE = (5 * Math.PI) / 180;
    if (Math.abs(angle) < MIN_ANGLE) {
        angle = MIN_ANGLE * (angle >= 0 ? 1 : -1);
    }

    const speed = Math.sqrt(vx * vx + vy * vy);
    let newVx = speed * Math.sin(angle);
    let newVy = -speed * Math.cos(angle);

    const PADDLE_INFLUENCE = 0.3;
    newVx += paddle.vx * PADDLE_INFLUENCE;

    const newSpeed = Math.sqrt(newVx * newVx + newVy * newVy);
    if (newSpeed > 0) {
        vx = (newVx / newSpeed) * speed;
        vy = (newVy / newSpeed) * speed;
    }

    y = paddle.y - radius;
}

// --- Brick reflection (unchanged) ---

function reflectOffBrick(side, brick) {
    switch (side) {
        case "top":
            vy = -Math.abs(vy);
            y = brick.y - radius;
            break;
        case "bottom":
            vy = Math.abs(vy);
            y = brick.y + brick.height + radius;
            break;
        case "left":
            vx = -Math.abs(vx);
            x = brick.x - radius;
            break;
        case "right":
            vx = Math.abs(vx);
            x = brick.x + brick.width + radius;
            break;
    }
    preventVerticalBounce();
}

function preventVerticalBounce() {
    const minVx = BALL_SPEED * MIN_VX_RATIO;
    if (Math.abs(vx) < minVx) {
        const sign = vx >= 0 ? 1 : -1;
        vx = sign * minVx;
        const vySign = vy >= 0 ? 1 : -1;
        vy = vySign * Math.sqrt(BALL_SPEED * BALL_SPEED - vx * vx);
    }
}

// --- Render (unchanged from Phase 9) ---

export function render(ctx) {
    if (trail.length > 0) {
        for (let i = 0; i < trail.length; i++) {
            const raw = trail.length > 1 ? i / (trail.length - 1) : 1;
            const eased = raw * raw;
            const alpha = eased * TRAIL_MAX_OPACITY;
            const r = TRAIL_MIN_RADIUS + (radius * 0.8 - TRAIL_MIN_RADIUS) * eased;
            ctx.globalAlpha = alpha;
            ctx.beginPath();
            ctx.arc(trail[i].x, trail[i].y, r, 0, Math.PI * 2);
            ctx.fillStyle = "#CCDDFF";
            ctx.fill();
        }
        ctx.globalAlpha = 1.0;
    }

    ctx.save();

    const pulse = Math.sin(glowTime * 3) * 4 + 14;
    ctx.shadowColor = "#4488FF";
    ctx.shadowBlur = pulse;

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = "#FFFFFF";
    ctx.fill();

    ctx.strokeStyle = "#0000AA";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.restore();
}
