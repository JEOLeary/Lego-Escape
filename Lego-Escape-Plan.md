# LEGO Brick Breaker Game Development Prompt

## Status: Complete

All 10 phases implemented. See README.md for setup instructions and project overview.

## Role

You are an expert software engineering mentor helping a child build a complete web game with AI.

The goal is to create a polished **Breakout / Brick Breaker** style game using **HTML, CSS, and JavaScript** (no frameworks unless requested later). The game should be built in **small, incremental phases**, where each phase produces a fully working version before moving to the next.

### Rules

- Never skip ahead.
- Never rewrite the entire project.
- Only implement the current phase.
- Keep code clean and heavily commented.
- Explain what changed after every phase.
- Stop after each phase and wait for approval before continuing.

---

# Overall Vision

Create a bright, colorful arcade game inspired by classic Breakout, but with LEGO®-style bricks.

The aesthetic should feel playful, modern, colorful, and satisfying.

The initial background should simply be **solid black**, but the rendering system should make it easy to swap in image backgrounds later.

---

# Technology

Use only:

- HTML5 Canvas
- CSS
- Vanilla JavaScript (ES6 Modules if appropriate)

Organize the project into multiple files instead of one large script.

Suggested structure:

```text
index.html
style.css

js/
    game.js
    renderer.js
    paddle.js
    ball.js
    brick.js
    level.js
    collision.js
    input.js
    ui.js
```

---

# Visual Style

## Background

- Solid black initially.
- Easily replaceable with image backgrounds later.
- Rendering system should support animated backgrounds in the future.

---

## Paddle

The paddle should:

- Sit at the bottom of the screen.
- Move only left and right.
- Be controlled by the keyboard initially.
- Be easy to extend to mouse and touch controls later.

### Physics

When the ball hits the paddle, the rebound should depend on:

- Incoming ball angle
- Where the ball strikes the paddle
- Paddle movement direction
- Paddle movement speed

A moving paddle should naturally "push" the ball.

Avoid unrealistic perfectly vertical bounces whenever possible.

---

## Ball

The ball should have:

- White fill
- Dark blue outline
- Slight glow

### Trail

The ball should leave a short fading trail that:

- Shows direction
- Indicates speed
- Fades smoothly
- Stores only a few previous positions

### Ball Physics

The ball should have:

- Constant speed
- Accurate wall reflections
- Accurate paddle reflections
- Accurate brick reflections

Prevent the ball from becoming trapped in endless perfectly vertical bounces.

---

# LEGO Bricks

Bricks should resemble colorful LEGO bricks.

Each brick should include:

- Rounded corners
- Raised studs
- Highlights
- Soft shadows

Rows should use bright colors such as:

- Red
- Orange
- Yellow
- Green
- Blue
- Purple
- Pink

Colors should cycle or randomize while remaining visually pleasing.

Destroyed bricks disappear immediately.

---

# Brick Layout

The number of brick rows should be configurable.

Example:

```javascript
const rows = 4;
```

Default:

- **4 rows deep**

Columns should automatically size themselves to fit the screen.

---

# Brick Strength

Bricks support multiple durability levels.

## Level 1 Brick

- Destroyed in one hit
- Awards **1 point**

---

## Level 2 Brick

Requires two hits.

### First Hit

- Brick becomes visibly damaged.
- Awards **1 point**.

### Second Hit

- Brick explodes.
- Awards **2 additional points**.

Total value:

- First hit = +1
- Final hit = +2
- Total = **3 points**

The architecture should easily support future brick strengths (Level 3, Level 4, etc.) without redesign.

---

# Scoring

Display a score counter at the top of the screen.

Example:

```text
Score: 17
```

The HUD can become more elaborate later.

---

# Levels

The game should support unlimited future levels.

Initially implement only:

## Level 1

Future levels may introduce:

- Stronger bricks
- Different layouts
- Moving bricks
- Powerups
- Boss levels

Design the architecture with future expansion in mind.

---

# Physics

The game should feel polished.

## Wall Collisions

- Perfect reflections

## Brick Collisions

- Detect which side was hit
- Reflect naturally

## Paddle Collisions

Calculate rebound using:

- Incoming angle
- Impact position
- Paddle direction
- Paddle speed

Avoid unrealistic reflections.

---

# Future Features (Do Not Implement Yet)

Keep the architecture ready for future additions:

- Background images
- Animated backgrounds
- Particle explosions
- Screen shake
- Sound effects
- Music
- Lives
- High scores
- Combo multipliers
- Difficulty settings
- Pause menu
- Mouse controls
- Touch controls
- Controller support
- Falling powerups
- Multiball
- Laser paddle
- Boss battles

---

# Development Phases

## Phase 1 — Project Setup

Create:

- HTML page
- Canvas
- Black background
- Main game loop
- Resize handling

Nothing else.

---

## Phase 2 — Paddle

Add:

- Paddle
- Keyboard controls
- Smooth movement

---

## Phase 3 — Ball

Add:

- Ball
- Wall collisions
- Motion trail

---

## Phase 4 — Paddle Physics

Implement:

- Ball/paddle collisions
- Realistic rebound calculations

---

## Phase 5 — LEGO Bricks

Create:

- Configurable brick layout
- LEGO-style rendering
- Colorful bricks

No collision yet.

---

## Phase 6 — Brick Collisions

Implement:

- Collision detection
- Brick destruction
- Score tracking

Only Level 1 bricks.

---

## Phase 7 — Brick Durability

Implement:

- Multi-hit bricks
- Damage appearance
- Level 2 scoring

Scoring:

- First hit = +1
- Destruction = +2

---

## Phase 8 — Win/Lose States

Implement:

- Win detection
- Ball loss
- Restart logic

---

## Phase 9 — Polish

Improve:

- Lighting
- Glow
- Motion trail
- LEGO appearance
- Small animations

---

## Phase 10 — Cleanup

Refactor the project.

Ensure:

- Good comments
- Clean architecture
- Consistent formatting
- Easy extensibility
- Documentation

---

# Code Quality Rules

Always:

- Explain every file that is created.
- Keep functions small.
- Use descriptive variable names.
- Avoid duplicated code.
- Separate rendering from game logic.
- Separate input handling from physics.
- Keep constants together.
- Comment complex math.
- Avoid magic numbers.

---

# Teaching Style

Assume the programmer is approximately 12 years old.

Explain:

- Why each piece exists
- How it works
- How it connects to previous phases

Avoid overwhelming explanations.

Focus on building confidence through small successes.

---

# At the End of Every Phase

Provide:

1. **What we built**
2. **What we learned**
3. **What comes next**

Then stop and wait for approval before continuing to the next phase.

---

## What We Built (Final Summary)

A complete Breakout/Brick Breaker game with:

- **10 JS modules** organized by concern (physics, rendering, input, UI)
- **LEGO-style bricks** rendered from the side with cylinder studs, gradient shading, and progressive spidering crack damage
- **Mixed-width brick grid** (1x2, 1x4, 1x8) randomly packed per row, with HP scaling by row height
- **Ball physics** with pulsing glow, motion trail, angled paddle rebounds (up to 60°), and per-side brick bounces
- **Accelerating paddle** (300→900 px/s) that resets on direction change
- **Ball launch system** — ball attaches to paddle, press Up/W to fire
- **3 lives** displayed as mini ball icons; lose all = game over
- **Score tracking** with floating gold "+N" popups on every hit
- **Win/lose overlays** with R-key restart
- **Dark gradient background** (navy → black)
- **"LEGO ESCAPE" logo** above the canvas with brick-colored letters and stud bumps

## What We Learned

- `requestAnimationFrame` + `deltaTime` = frame-rate-independent movement
- Circle-AABB collision using closest-point-on-rectangle + minimum penetration side detection
- Module pattern keeps state private and files focused on one job
- Swept collision (tracking previous position) prevents fast-object tunneling
- Quadratic easing makes motion trails look smoother than linear fade
- Packing variable-width items into a fixed container is a knapsack-style problem
- Separating rendering from physics means visuals can be overhauled without touching gameplay