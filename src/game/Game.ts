import {
  CANVAS_WIDTH, CANVAS_HEIGHT, GROUND_Y,
  INITIAL_SPEED, MAX_SPEED, SPEED_INCREMENT,
  POWERUP_IMMUNITY_DURATION,
  COLORS, GameState, AssetMap,
} from './constants';
import { InputManager } from './InputManager';
import { ScoreManager } from './ScoreManager';
import { Player } from './Player';
import { ObstacleManager } from './ObstacleManager';
import { PowerUpManager } from './PowerUpManager';
import { Background } from './Background';
import { Collision } from './Collision';
import { Rect } from './constants';

export class Game {
  private state: GameState = GameState.LOADING;
  private speed = INITIAL_SPEED;
  private immunityTimer = 0;
  private lastTime = 0;
  private animationId = 0;
  private prevTime = 0;

  constructor(
    private canvas: HTMLCanvasElement,
    private ctx: CanvasRenderingContext2D,
    private assets: AssetMap,
    private input: InputManager,
    private score: ScoreManager,
    private player: Player,
    private obstacles: ObstacleManager,
    private powerUps: PowerUpManager,
    private background: Background,
  ) {
    this.resizeCanvas();
    window.addEventListener('resize', this.handleResize);
  }

  private handleResize = (): void => {
    this.resizeCanvas();
  };

  private resizeCanvas(): void {
    this.canvas.width = CANVAS_WIDTH;
    this.canvas.height = CANVAS_HEIGHT;
  }

  start(): void {
    this.state = GameState.READY;
    this.loop(performance.now());
  }

  private loop = (now: number): void => {
    const deltaTime = Math.min(now - this.prevTime, 50);
    this.prevTime = now;

    this.update(deltaTime);
    this.render();

    this.animationId = requestAnimationFrame(this.loop);
  };

  private setState(newState: GameState): void {
    this.state = newState;
  }

  private update(deltaTime: number): void {
    switch (this.state) {
      case GameState.READY:
        if (this.input.isJumpPressed()) {
          this.input.consumeJump();
          this.startRunning();
        }
        break;

      case GameState.RUNNING:
      case GameState.POWERED:
        this.updateRunning(deltaTime);
        break;

      case GameState.GAME_OVER:
        if (this.input.isRestartPressed(this.state)) {
          this.input.consumeRestart();
          this.restart();
        }
        break;
    }
  }

  private startRunning(): void {
    this.state = GameState.RUNNING;
    this.speed = INITIAL_SPEED;
    this.player.setStateSprite(GameState.RUNNING);
  }

  private updateRunning(deltaTime: number): void {
    if (this.speed < MAX_SPEED) {
      this.speed += SPEED_INCREMENT * (deltaTime / 16.667);
    }

    this.background.update(deltaTime, this.speed);
    this.player.update(deltaTime);

    if (this.input.isJumpPressed()) {
      this.player.jump();
      this.input.consumeJump();
    }
    this.player.duck(this.input.isDuckPressed());

    const scoreVal = this.score.getScore();
    this.obstacles.update(deltaTime, this.speed, scoreVal);
    this.powerUps.update(deltaTime, this.speed, scoreVal);

    this.score.update(deltaTime);

    this.checkPlayerCollisions();
    this.checkPowerUpCollisions();

    if (this.state === GameState.POWERED) {
      this.immunityTimer -= deltaTime / 1000;
      if (this.immunityTimer <= 0) {
        this.immunityTimer = 0;
        this.state = GameState.RUNNING;
        this.player.setStateSprite(GameState.RUNNING);
      }
    }
  }

  private checkPlayerCollisions(): void {
    if (this.state === GameState.POWERED) return;

    const playerHitbox = this.player.getHitbox();
    const activeObstacles = this.obstacles.getActiveObstacles();

    for (const obs of activeObstacles) {
      const obsHitbox: Rect = {
        x: obs.x,
        y: obs.y,
        width: obs.width,
        height: obs.height,
      };
      if (Collision.check(playerHitbox, obsHitbox)) {
        this.gameOver();
        return;
      }
    }
  }

  private checkPowerUpCollisions(): void {
    const powerUp = this.powerUps.getActive();
    if (!powerUp || powerUp.collected) return;

    const playerHitbox = this.player.getHitbox();
    const puHitbox: Rect = {
      x: powerUp.x,
      y: powerUp.y,
      width: powerUp.width,
      height: powerUp.height,
    };

    if (Collision.check(playerHitbox, puHitbox)) {
      powerUp.collected = true;
      powerUp.active = false;
      this.state = GameState.POWERED;
      this.immunityTimer = POWERUP_IMMUNITY_DURATION;
      this.player.setStateSprite(GameState.POWERED);
    }
  }

  private gameOver(): void {
    this.state = GameState.GAME_OVER;
    this.score.saveHighScore();
    this.player.setStateSprite(GameState.GAME_OVER);
  }

  restart(): void {
    this.speed = INITIAL_SPEED;
    this.immunityTimer = 0;
    this.player.reset();
    this.obstacles.reset();
    this.powerUps.reset();
    this.score.reset();
    this.background.reset();
    this.input.reset();
    this.state = GameState.READY;
  }

  private render(): void {
    const ctx = this.ctx;

    switch (this.state) {
      case GameState.LOADING:
        this.renderLoading(ctx);
        break;
      case GameState.READY:
        this.renderReady(ctx);
        break;
      case GameState.RUNNING:
      case GameState.POWERED:
        this.renderRunning(ctx);
        break;
      case GameState.GAME_OVER:
        this.renderGameOver(ctx);
        break;
    }
  }

  private renderLoading(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = COLORS.CREAM;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.fillStyle = COLORS.DARK;
    ctx.font = '20px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('Loading...', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
  }

  private renderReady(ctx: CanvasRenderingContext2D): void {
    this.background.render(ctx);

    this.drawPlayer(ctx);

    ctx.fillStyle = COLORS.DARK;
    ctx.font = '24px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('DINO RUNNER', CANVAS_WIDTH / 2, 60);

    ctx.font = '14px monospace';
    ctx.fillText('Premi SPACE o Tocca per iniziare', CANVAS_WIDTH / 2, CANVAS_HEIGHT - 20);
  }

  private renderRunning(ctx: CanvasRenderingContext2D): void {
    this.background.render(ctx);
    this.obstacles.getActiveObstacles().forEach(obs => {
      if (obs.sprite) {
        ctx.drawImage(obs.sprite, 0, 0, obs.sprite.naturalWidth, obs.sprite.naturalHeight, obs.x, obs.y, obs.width, obs.height);
      }
    });

    this.powerUps.render(ctx);

    this.drawPlayer(ctx);

    ctx.fillStyle = COLORS.DARK;
    ctx.font = '16px monospace';
    ctx.textAlign = 'right';
    ctx.fillText(`SCORE: ${this.score.getScore()}`, CANVAS_WIDTH - 20, 30);

    ctx.font = '12px monospace';
    ctx.fillText(`BEST: ${this.score.getHighScore()}`, CANVAS_WIDTH - 20, 48);

    if (this.state === GameState.POWERED) {
      const immuneSec = Math.ceil(this.immunityTimer);
      ctx.fillStyle = COLORS.IMMUNITY;
      ctx.font = 'bold 14px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`IMMUNE: ${immuneSec}s`, 20, 30);
    }
  }

  private renderGameOver(ctx: CanvasRenderingContext2D): void {
    this.renderRunning(ctx);

    ctx.fillStyle = COLORS.GAME_OVER_BG;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 36px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 40);

    ctx.font = '18px monospace';
    ctx.fillText(`SCORE: ${this.score.getScore()}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 10);
    ctx.fillText(`BEST: ${this.score.getHighScore()}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 40);

    ctx.font = '14px monospace';
    ctx.fillText('Premi SPACE o Tocca per riprovare', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 80);
  }

  private drawPlayer(ctx: CanvasRenderingContext2D): void {
    const sprite = this.player.getSprite();
    if (sprite) {
      const w = this.player.getWidth();
      const h = this.player.getHeight();
      ctx.drawImage(sprite, 0, 0, sprite.naturalWidth, sprite.naturalHeight, this.player.x, this.player.y, w, h);
    }
  }

  getState(): GameState {
    return this.state;
  }
}
