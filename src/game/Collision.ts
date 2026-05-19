import { Rect, HITBOX_MARGIN } from './constants';

export class Collision {
  static check(playerHitbox: Rect, obstacleHitbox: Rect): boolean {
    const px = playerHitbox.x + HITBOX_MARGIN;
    const py = playerHitbox.y + HITBOX_MARGIN;
    const pw = playerHitbox.width - HITBOX_MARGIN * 2;
    const ph = playerHitbox.height - HITBOX_MARGIN * 2;

    return (
      px < obstacleHitbox.x + obstacleHitbox.width &&
      px + pw > obstacleHitbox.x &&
      py < obstacleHitbox.y + obstacleHitbox.height &&
      py + ph > obstacleHitbox.y
    );
  }
}
