import {
  CANVAS_WIDTH, GROUND_Y,
  POWERUP_MIN_INTERVAL, POWERUP_MAX_INTERVAL,
  ASSET_KEYS, ASSET_SCALES, AssetMap,
} from './constants';
import { scaledSize } from './renderUtils';

export interface PowerUpItem {
  x: number;
  y: number;
  width: number;
  height: number;
  active: boolean;
  collected: boolean;
}

export class PowerUpManager {
  private item: PowerUpItem = {
    x: 0, y: 0,
    width: 0, height: 0,
    active: false, collected: false,
  };
  private timer = POWERUP_MIN_INTERVAL;
  private elapsed = 0;

  constructor(private assets: AssetMap) {}

  update(deltaTime: number, speed: number, score: number): void {
    if (this.item.active) {
      this.item.x -= speed * (deltaTime / 16.667);
      if (this.item.x + this.item.width < 0) {
        this.item.active = false;
        this.resetTimer();
      }
      return;
    }

    if (score < 100) return;

    this.elapsed += deltaTime / 1000;
    if (this.elapsed >= this.timer) {
      this.spawn();
    }
  }

  private spawn(): void {
    const heart = this.assets[ASSET_KEYS.HEART];
    if (!heart) return;

    const { width, height } = scaledSize(heart, ASSET_SCALES[ASSET_KEYS.HEART]);
    this.item.x = CANVAS_WIDTH;
    this.item.y = GROUND_Y - height - 10;
    this.item.width = width;
    this.item.height = height;
    this.item.active = true;
    this.item.collected = false;
  }

  private resetTimer(): void {
    this.elapsed = 0;
    const range = POWERUP_MAX_INTERVAL - POWERUP_MIN_INTERVAL;
    this.timer = POWERUP_MIN_INTERVAL + Math.floor(Math.random() * range);
  }

  getActive(): PowerUpItem | null {
    return this.item.active ? this.item : null;
  }

  render(ctx: CanvasRenderingContext2D): void {
    if (!this.item.active) return;
    const heart = this.assets[ASSET_KEYS.HEART];
    if (heart) {
      const scale = ASSET_SCALES[ASSET_KEYS.HEART];
      ctx.drawImage(
        heart,
        0, 0, heart.naturalWidth, heart.naturalHeight,
        this.item.x, this.item.y, this.item.width, this.item.height,
      );
    }
  }

  reset(): void {
    this.item.active = false;
    this.item.collected = false;
    this.elapsed = 0;
    this.timer = POWERUP_MIN_INTERVAL;
  }
}
