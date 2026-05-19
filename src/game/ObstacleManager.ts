import { Obstacle } from './Obstacle';
import {
  CANVAS_WIDTH, GROUND_Y,
  MIN_OBSTACLE_INTERVAL, MAX_OBSTACLE_INTERVAL,
  FLYING_OBSTACLE_MIN_SCORE,
  FLYING_OBSTACLE_Y_OFFSET, GROUND_OBSTACLES,
  ASSET_KEYS, ASSET_SCALES, AssetMap,
} from './constants';
import { scaledSize } from './renderUtils';

const POOL_SIZE = 20;

export class ObstacleManager {
  private pool: Obstacle[] = [];
  private frameCounter = 0;
  private nextSpawnFrame = 0;
  private currentSpeed = 0;

  constructor(private assets: AssetMap) {
    this.initPool();
  }

  private initPool(): void {
    for (let i = 0; i < POOL_SIZE; i++) {
      this.pool.push({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        kind: 'ground',
        sprite: new Image(),
        active: false,
      });
    }
  }

  update(deltaTime: number, speed: number, score: number): void {
    this.currentSpeed = speed;
    this.frameCounter++;

    for (const obs of this.pool) {
      if (!obs.active) continue;
      obs.x -= speed * (deltaTime / 16.667);

      if (obs.x + obs.width < 0) {
        obs.active = false;
      }
    }

    if (this.frameCounter >= this.nextSpawnFrame && score >= 0) {
      this.spawn(score);
      const interval = MIN_OBSTACLE_INTERVAL +
        Math.floor(Math.random() * (MAX_OBSTACLE_INTERVAL - MIN_OBSTACLE_INTERVAL));
      this.nextSpawnFrame = this.frameCounter + interval;
    }
  }

  private spawn(score: number): void {
    const obs = this.pool.find(o => !o.active);
    if (!obs) return;

    const isFlying = score >= FLYING_OBSTACLE_MIN_SCORE && Math.random() < 0.3;

    if (isFlying) {
      const howlSprite = this.assets[ASSET_KEYS.HOWL];
      obs.kind = 'flying';
      obs.sprite = howlSprite || new Image();
      const { width, height } = scaledSize(obs.sprite, ASSET_SCALES[ASSET_KEYS.HOWL] || 0.27);
      obs.width = width;
      obs.height = height;
      obs.x = CANVAS_WIDTH;
      obs.y = GROUND_Y - height + FLYING_OBSTACLE_Y_OFFSET;
    } else {
      const typeKey = GROUND_OBSTACLES[Math.floor(Math.random() * GROUND_OBSTACLES.length)];
      const sprite = this.assets[typeKey];
      obs.kind = 'ground';
      obs.sprite = sprite || new Image();
      const { width, height } = scaledSize(obs.sprite, ASSET_SCALES[typeKey] || 0.27);
      obs.width = width;
      obs.height = height;
      obs.x = CANVAS_WIDTH;
      obs.y = GROUND_Y - height;
    }

    obs.active = true;
  }

  getActiveObstacles(): Obstacle[] {
    return this.pool.filter(o => o.active);
  }

  reset(): void {
    for (const obs of this.pool) {
      obs.active = false;
    }
    this.frameCounter = 0;
    this.nextSpawnFrame = 0;
  }
}
