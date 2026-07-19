// collision.js — Circle-vs-AABB collision detection
// Used by the ball to check hits against bricks. Determines which side
// of the brick was hit (top/bottom/left/right) for accurate rebounds.

/**
 * Check if a circle (the ball) has collided with an AABB (a brick).
 *
 * Uses the closest-point-on-rectangle technique:
 * 1. Find the point on the brick rectangle closest to the ball's center.
 * 2. If that point is within the ball's radius, there's a collision.
 * 3. Figure out which SIDE was hit by measuring how far the ball's edges
 *    have penetrated each face — the shortest penetration is the entry side.
 *
 * @param {{x: number, y: number, radius: number}} ball - Ball position and size
 * @param {{x: number, y: number, width: number, height: number}} brick - Brick bounds
 * @returns {{side: string}|null} - Which side was hit ("top","bottom","left","right"), or null
 */
export function checkBrickCollision(ball, brick) {
    // Closest point on the brick rectangle to the ball's center.
    // Clamp the ball's center to the brick's bounds — this gives us the
    // nearest point on (or inside) the rectangle.
    const closestX = Math.max(brick.x, Math.min(ball.x, brick.x + brick.width));
    const closestY = Math.max(brick.y, Math.min(ball.y, brick.y + brick.height));

    // Distance from ball center to that nearest point
    const dx = ball.x - closestX;
    const dy = ball.y - closestY;
    const distSq = dx * dx + dy * dy;

    // No collision if the distance is greater than the ball's radius
    if (distSq >= ball.radius * ball.radius) {
        return null;
    }

    // --- Collision confirmed! Which side did the ball enter from? ---
    // Measure how far the ball has pushed past each face of the brick.
    // The smallest positive overlap is the side the ball entered through.
    const overlapLeft = (ball.x + ball.radius) - brick.x;
    const overlapRight = (brick.x + brick.width) - (ball.x - ball.radius);
    const overlapTop = (ball.y + ball.radius) - brick.y;
    const overlapBottom = (brick.y + brick.height) - (ball.y - ball.radius);

    let side = "top";
    let minOverlap = overlapTop;

    if (overlapBottom < minOverlap) {
        side = "bottom";
        minOverlap = overlapBottom;
    }
    if (overlapLeft < minOverlap) {
        side = "left";
        minOverlap = overlapLeft;
    }
    if (overlapRight < minOverlap) {
        side = "right";
        minOverlap = overlapRight;
    }

    return { side };
}
