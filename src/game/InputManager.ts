import { GameState } from './constants';

export class InputManager {
  private jumpPressed = false;
  private duckPressed = false;
  private restartPressed = false;
  private jumpConsumed = false;
  private restartConsumed = false;

  constructor(canvas: HTMLCanvasElement) {
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
    canvas.addEventListener('mousedown', this.onPointerDown);
    canvas.addEventListener('touchstart', this.onTouchStart, { passive: false });
  }

  private onKeyDown = (e: KeyboardEvent) => {
    if (e.code === 'Space' || e.code === 'ArrowUp') {
      e.preventDefault();
      this.jumpPressed = true;
      this.restartPressed = true;
    }
    if (e.code === 'ArrowDown' || e.code === 'KeyS') {
      e.preventDefault();
      this.duckPressed = true;
    }
  };

  private onKeyUp = (e: KeyboardEvent) => {
    if (e.code === 'Space' || e.code === 'ArrowUp') {
      this.jumpPressed = false;
      this.jumpConsumed = false;
    }
    if (e.code === 'ArrowDown' || e.code === 'KeyS') {
      this.duckPressed = false;
    }
  };

  private onPointerDown = () => {
    this.jumpPressed = true;
    this.restartPressed = true;
  };

  private onTouchStart = (e: TouchEvent) => {
    e.preventDefault();
    this.jumpPressed = true;
    this.restartPressed = true;
  };

  isJumpPressed(): boolean {
    if (this.jumpPressed && !this.jumpConsumed) {
      this.jumpConsumed = true;
      return true;
    }
    return false;
  }

  consumeJump(): void {
  }

  isDuckPressed(): boolean {
    return this.duckPressed;
  }

  isRestartPressed(state: GameState): boolean {
    return state === GameState.GAME_OVER && this.restartPressed && !this.restartConsumed;
  }

  consumeRestart(): void {
    this.restartConsumed = true;
  }

  reset(): void {
    this.jumpPressed = false;
    this.duckPressed = false;
    this.restartPressed = false;
    this.jumpConsumed = false;
    this.restartConsumed = false;
  }
}
