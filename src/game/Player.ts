import {
  PLAYER_X, PLAYER_DUCK_HEIGHT,
  GRAVITY, JUMP_VELOCITY, GROUND_Y, Rect, GameState, ASSET_KEYS,
  ASSET_SCALES, AssetMap,
} from './constants';

export class Player {
  x = PLAYER_X;
  y = GROUND_Y - this.heightForSprite();
  velY = 0;
  isOnGround = true;
  isDucking = false;
  private currentSpriteKey: string = ASSET_KEYS.HERO;

  constructor(private assets: AssetMap) {}

  jump(): void {
    if (!this.isOnGround || this.isDucking) return;
    this.velY = JUMP_VELOCITY;
    this.isOnGround = false;
  }

  duck(active: boolean): void {
    this.isDucking = active;
  }

  update(deltaTime: number): void {
    const dt = deltaTime / 16.667;

    if (!this.isOnGround) {
      this.velY += GRAVITY * dt;
      this.y += this.velY * dt;

      const h = this.getHeight();
      if (this.y >= GROUND_Y - h) {
        this.y = GROUND_Y - h;
        this.velY = 0;
        this.isOnGround = true;
      }
    }
  }

  private heightForSprite(): number {
    const sprite = this.getSprite();
    if (!sprite) return 60;
    return sprite.naturalHeight * ASSET_SCALES[this.currentSpriteKey];
  }

  getHeight(): number {
    if (this.isDucking) return PLAYER_DUCK_HEIGHT;
    return this.heightForSprite();
  }

  getWidth(): number {
    const sprite = this.getSprite();
    if (!sprite) return 60;
    return sprite.naturalWidth * ASSET_SCALES[this.currentSpriteKey];
  }

  getHitbox(): Rect {
    return { x: this.x, y: this.y, width: this.getWidth(), height: this.getHeight() };
  }

  setSpriteForKey(key: string): void {
    this.currentSpriteKey = key;
  }

  getSprite(): HTMLImageElement | undefined {
    return this.assets[this.currentSpriteKey];
  }

  setStateSprite(state: GameState): void {
    if (state === GameState.GAME_OVER) {
      this.currentSpriteKey = ASSET_KEYS.MORTE;
    } else if (state === GameState.POWERED) {
      this.currentSpriteKey = ASSET_KEYS.HERO_POWERED;
    } else {
      this.currentSpriteKey = ASSET_KEYS.HERO;
    }
  }

  reset(): void {
    this.velY = 0;
    this.isOnGround = true;
    this.isDucking = false;
    this.currentSpriteKey = ASSET_KEYS.HERO;
    this.y = GROUND_Y - this.getHeight();
  }
}
