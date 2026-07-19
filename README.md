# LEGO Brick Breaker

A Breakout-style arcade game with LEGO-themed bricks, built with vanilla HTML, CSS, and JavaScript.

## How to Play

**Start a local server** (ES6 modules need HTTP, not `file://`):

```bash
python -m http.server 8000
# or
npx serve .
```

Open `http://localhost:8000` in your browser.

## Controls

| Key | Action |
|-----|--------|
| Arrow Left / A | Move paddle left |
| Arrow Right / D | Move paddle right |
| Arrow Up / W | Launch ball (from paddle) |
| R | Restart (on win/lose screen) |

The paddle accelerates the longer you hold a direction — let go or switch sides to reset.

## Scoring

- Each hit on a brick: **+1 point**
- Destroying a multi-hit brick: **+2 points** (on the final hit)
- Bricks get stronger as you go up: bottom row = 1 HP, top row = 4 HP

## Project Structure

```
index.html        — HTML page with logo and canvas
style.css         — Dark theme, LEGO logo, canvas layout

js/
  game.js         — Main loop, game state, scoring, restart
  renderer.js     — Background gradient
  paddle.js       — Paddle movement (acceleration) and rendering
  ball.js         — Ball physics, collision, trail, glow
  brick.js        — LEGO brick rendering, crack generation
  level.js        — Brick grid layout (random 1x2/1x4/1x8 bricks)
  collision.js    — Circle-vs-rectangle collision with side detection
  input.js        — Keyboard state polling
  ui.js           — Score HUD, lives icons, popups, win/lose overlays
```

## Architecture

- **Game loop** (`game.js`): runs at ~60fps via `requestAnimationFrame`, calls update then render each frame
- **Separation of concerns**: rendering (how things look) is separate from physics (how things move)
- **Module pattern**: each file exports `init()`, `update()`, `render()` functions; state is private to the module
- **Extensible**: new brick types, powerups, levels, or control schemes can be added in their own modules without touching existing code

## Key Features

- Mixed-width LEGO bricks (1x1, 1x2, 1x4, 1x8) packed randomly per row
- Cylinder studs on all bricks, hidden by layering — upper bricks draw over lower studs
- Spidering crack damage on multi-hit bricks
- Paddle acceleration that resets on direction change
- Ball attaches to paddle — launch with Up/W
- Pulsing ball glow and blue-tinted motion trail
- Floating score popups on brick hits
- 3 lives with ball-icon display
- Dark gradient background
