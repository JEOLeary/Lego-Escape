// game.js — Main game file
// Coordinates all modules: sets up the canvas, runs the game loop,
// handles game state (playing/won/lost), processes collisions, and
// wires up scoring, lives, and restart.

import { renderBackground } from "./renderer.js";
import { init as initPaddle, update as updatePaddle, render as renderPaddle, getBounds as getPaddleBounds, getSpeed as getPaddleSpeed } from "./paddle.js";
import { init as initBall, update as updateBall, render as renderBall, isAttached, launch as launchBall } from "./ball.js";
import { init as initLevel, render as renderLevel, getBricks, removeBrick } from "./level.js";
import { addScore, addScorePopup, updatePopups, render as renderUI, renderPopups, resetScore, renderOverlay } from "./ui.js";
import { generateCrack } from "./brick.js";
import { isPressed } from "./input.js";

// --- Canvas ---
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// --- Time tracking ---
let lastTime = 0;

// --- Game state ---
const STARTING_LIVES = 2;
let lives = STARTING_LIVES;
let gameState = "playing"; // "playing", "won", "lost", or "paused"

// --- Help modal ---
const helpModal = document.getElementById("help-modal");
const helpText = document.getElementById("help-text");
const helpIcon = document.getElementById("help-icon");
const modalClose = document.querySelector(".modal-close");
let helpKeyWasDown = false;

function openHelp() {
    if (gameState === "playing" || gameState === "paused") {
        gameState = "paused";
        helpModal.classList.remove("hidden");
    }
}

function closeHelp() {
    if (gameState === "paused") {
        gameState = "playing";
        helpModal.classList.add("hidden");
        lastTime = 0;
    }
}

helpText.addEventListener("click", openHelp);
helpIcon.addEventListener("click", openHelp);
modalClose.addEventListener("click", closeHelp);
helpModal.addEventListener("click", (e) => {
    if (e.target === helpModal) closeHelp();
});

// --- Resize ---
// Canvas fills 80% of the viewport. On resize, restart the game
// so all objects recalculate their positions for the new dimensions.
function handleResize() {
    canvas.width = window.innerWidth * 0.8;
    canvas.height = window.innerHeight * 0.8;
    restart();
}
window.addEventListener("resize", handleResize);
handleResize();

// --- The Game Loop ---
// Each frame: calculate deltaTime, update game state, draw everything.
// requestAnimationFrame syncs to the monitor's refresh rate (usually 60fps).
function gameLoop(timestamp) {
    if (lastTime === 0) {
        lastTime = timestamp;
        requestAnimationFrame(gameLoop);
        return;
    }

    const deltaTime = (timestamp - lastTime) / 1000;
    lastTime = timestamp;
    const dt = Math.min(deltaTime, 0.05); // cap at 50ms to prevent teleporting

    update(dt);
    render();
    requestAnimationFrame(gameLoop);
}

// --- Update game state ---
function update(dt) {
    // Check for help toggle (ESC or H) — edge-triggered to prevent rapid toggling
    const helpKeyDown = isPressed("Escape") || isPressed("h") || isPressed("H");
    if (helpKeyDown && !helpKeyWasDown) {
        if (gameState === "paused") {
            closeHelp();
        } else if (gameState === "playing") {
            openHelp();
        }
    }
    helpKeyWasDown = helpKeyDown;

    // On end screens, only check for restart input
    if (gameState === "won" || gameState === "lost") {
        if (isPressed("r") || isPressed("R")) {
            restart();
        }
        return;
    }

    // Paused — skip game updates
    if (gameState === "paused") {
        return;
    }

    // Ball is attached to the paddle — wait for launch
    if (isAttached()) {
        updatePaddle(dt, canvas);
        updateBall(dt, canvas, {
            x: getPaddleBounds().x,
            y: getPaddleBounds().y,
            width: getPaddleBounds().width,
            height: getPaddleBounds().height,
            vx: getPaddleSpeed(),
        }, getBricks());
        updatePopups(dt);
        if (isPressed("ArrowUp") || isPressed("w") || isPressed("W")) {
            launchBall();
        }
        return;
    }

    // Normal gameplay
    updatePaddle(dt, canvas);
    updatePopups(dt);

    const paddle = {
        x: getPaddleBounds().x,
        y: getPaddleBounds().y,
        width: getPaddleBounds().width,
        height: getPaddleBounds().height,
        vx: getPaddleSpeed(),
    };
    const bricks = getBricks();
    const result = updateBall(dt, canvas, paddle, bricks);

    if (!result) return;

    // Ball fell off the bottom — lose a life
    if (result.lost) {
        lives--;
        if (lives <= 0) {
            gameState = "lost";
        } else {
            initBall(canvas); // ball re-attaches to paddle
        }
        return;
    }

    // Ball hit a brick
    if (result.brickIndex !== undefined) {
        const brick = bricks[result.brickIndex];
        const cx = brick.x + brick.width / 2;
        const cy = brick.y + brick.height / 2;

        brick.hp--;

        // Add spidering cracks as damage increases
        const damage = 1 - brick.hp / brick.initialHp;
        const targetCracks = Math.floor(damage * 6); // up to 6 cracks
        while (brick.cracks.length < targetCracks) {
            brick.cracks.push(generateCrack(brick));
        }

        if (brick.hp > 0) {
            // Brick damaged but still alive
            addScore(1);
            addScorePopup(cx, cy, "+1");
        } else {
            // Brick destroyed — bonus points for multi-hit bricks
            const points = brick.initialHp > 1 ? 2 : 1;
            addScore(points);
            addScorePopup(cx, cy, "+" + points);
            removeBrick(result.brickIndex);

            // Win condition: all bricks cleared
            if (getBricks().length === 0) {
                gameState = "won";
            }
        }
    }
}

// --- Draw everything ---
// Order determines what appears on top of what.
function render() {
    renderBackground(ctx, canvas.width, canvas.height);
    renderLevel(ctx);
    renderPaddle(ctx);
    renderBall(ctx);
    renderPopups(ctx);
    renderUI(ctx, canvas, lives);

    if (gameState === "paused") {
        renderOverlay(ctx, canvas, "Paused", "Press H or ESC to resume");
    } else if (gameState === "won") {
        renderOverlay(ctx, canvas, "You Win!", "Press R to restart");
    } else if (gameState === "lost") {
        renderOverlay(ctx, canvas, "Game Over", "Press R to restart");
    }
}

// --- Restart ---
// Resets all state for a new game without reloading the page.
function restart() {
    lives = STARTING_LIVES;
    gameState = "playing";
    resetScore();
    initPaddle(canvas);
    initBall(canvas);
    initLevel(canvas);
}

// --- Start the game! ---
requestAnimationFrame(gameLoop);
