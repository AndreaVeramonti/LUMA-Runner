import { AssetLoader } from './game/AssetLoader';
import { Game } from './game/Game';
import { InputManager } from './game/InputManager';
import { ScoreManager } from './game/ScoreManager';
import { Player } from './game/Player';
import { ObstacleManager } from './game/ObstacleManager';
import { PowerUpManager } from './game/PowerUpManager';
import { Background } from './game/Background';

import './style.css';

const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
if (!canvas) throw new Error('Canvas not found');
const ctx = canvas.getContext('2d');
if (!ctx) throw new Error('2D context not available');
const context = ctx;

async function init(): Promise<void> {
  const assets = await AssetLoader.loadAll();
  const input = new InputManager(canvas);
  const score = new ScoreManager();
  const player = new Player(assets);
  const obstacles = new ObstacleManager(assets);
  const powerUps = new PowerUpManager(assets);
  const background = new Background(assets);

  const game = new Game(canvas, context, assets, input, score, player, obstacles, powerUps, background);
  game.start();
}

init().catch(console.error);
