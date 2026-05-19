const STORAGE_KEY = 'dino-runner-highscore';

export class ScoreManager {
  private score = 0;
  private highScore: number;

  constructor() {
    this.highScore = this.loadHighScore();
  }

  private loadHighScore(): number {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? parseInt(stored, 10) || 0 : 0;
    } catch {
      return 0;
    }
  }

  update(deltaTime: number): void {
    this.score += Math.floor(deltaTime * 0.1);
  }

  getScore(): number {
    return this.score;
  }

  getHighScore(): number {
    return this.highScore;
  }

  saveHighScore(): void {
    if (this.score > this.highScore) {
      this.highScore = this.score;
      try {
        localStorage.setItem(STORAGE_KEY, String(this.highScore));
      } catch {
        // localStorage might be unavailable
      }
    }
  }

  reset(): void {
    this.score = 0;
  }
}
