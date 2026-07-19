// input.js — Keyboard input tracking
// Polls key state each frame so the game loop can check which keys are
// held down. Arrow keys + A/D for paddle, Up/W for ball launch, R for restart.

// All currently pressed keys. When you press a key, it becomes `true`.
// When you release it, it becomes `false`.
const keys = {};

function handleKeyDown(e) {
    keys[e.key] = true;

    // Arrow keys normally scroll the browser page — stop that!
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        e.preventDefault();
    }
}

function handleKeyUp(e) {
    keys[e.key] = false;
}

// Listen for key presses anywhere on the page.
// These listeners stay active for the entire game.
window.addEventListener("keydown", handleKeyDown);
window.addEventListener("keyup", handleKeyUp);

/**
 * Is the player pressing left? (ArrowLeft or A key)
 * Checks both the arrow key and the letter key so either works.
 */
export function isLeft() {
    return keys["ArrowLeft"] || keys["a"] || keys["A"];
}

/**
 * Is the player pressing right? (ArrowRight or D key)
 */
export function isRight() {
    return keys["ArrowRight"] || keys["d"] || keys["D"];
}

/**
 * Is a specific key currently pressed?
 * Used for restart prompts and future menu navigation.
 *
 * @param {string} key - The key name (e.g. "r", "R", " ")
 * @returns {boolean}
 */
export function isPressed(key) {
    return !!keys[key];
}
