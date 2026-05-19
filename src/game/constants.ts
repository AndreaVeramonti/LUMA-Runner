export enum GameState {
  LOADING = 'LOADING',
  READY = 'READY',
  RUNNING = 'RUNNING',
  POWERED = 'POWERED',
  GAME_OVER = 'GAME_OVER',
}

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type AssetMap = Record<string, HTMLImageElement>;

export type ObstacleKind = 'ground' | 'flying';
export type ObstacleType = 'grass' | 'flower' | 'tree' | 'tree-2' | 'howl';

// Canvas dimensions (game-logic coordinates, scaled to viewport)
export const CANVAS_WIDTH = 800;
export const CANVAS_HEIGHT = 300;

// Player
export const PLAYER_X = 100;
export const PLAYER_DUCK_HEIGHT = 40;
export const GRAVITY = 0.6;
export const JUMP_VELOCITY = -12;
export const GROUND_Y = CANVAS_HEIGHT - 50;

// Game speed
export const INITIAL_SPEED = 6;
export const MAX_SPEED = 18;
export const SPEED_INCREMENT = 0.001;

// Obstacles
export const MIN_OBSTACLE_INTERVAL = 80;
export const MAX_OBSTACLE_INTERVAL = 150;
export const FLYING_OBSTACLE_MIN_SCORE = 300;
export const OBSTACLE_WIDTH = 30;
export const OBSTACLE_HEIGHT = 30;
export const FLYING_OBSTACLE_Y_OFFSET = -70;

// Power-up
export const POWERUP_MIN_INTERVAL = 20;
export const POWERUP_MAX_INTERVAL = 35;
export const POWERUP_IMMUNITY_DURATION = 10;
export const POWERUP_WIDTH = 25;
export const POWERUP_HEIGHT = 25;

// Background parallax scroll speed ratios
export const TERRAIN_SCROLL_SPEED_RATIO = 1.0;
export const MOUNTAIN_1_SCROLL_RATIO = 0.3;
export const MOUNTAIN_2_SCROLL_RATIO = 0.5;

// Collision
export const HITBOX_MARGIN = 5;

// Asset keys
export const ASSET_KEYS = {
  HERO: 'hero',
  HERO_POWERED: 'hero-powered-up',
  MORTE: 'morte',
  TERRENO: 'terreno',
  BG_GRASS: 'bg-grass',
  FLOWER: 'flower',
  TREE: 'tree',
  TREE_2: 'tree-2',
  HOWL: 'howl',
  BG_MOUNTAIN_1: 'bg-mountain-1',
  BG_MOUNTAIN_2: 'bg-mountain-2',
  HEART: 'heart',
} as const;

// Per-sprite uniform scale from SVG naturalWidth/naturalHeight.
// SVG natural dimensions: hero/morte = 200x200 (width/height overrides),
// terreno = 131x95, mountains ~ 167x87-97, obstacles ~ 115-143x167, heart = 167x167.
export const ASSET_SCALES: Record<string, number> = {
  [ASSET_KEYS.HERO]: 0.3,
  [ASSET_KEYS.HERO_POWERED]: 0.3,
  [ASSET_KEYS.MORTE]: 0.3,
  [ASSET_KEYS.TERRENO]: 50 / 95,
  [ASSET_KEYS.BG_MOUNTAIN_1]: 2.3,
  [ASSET_KEYS.BG_MOUNTAIN_2]: 2.06,
  [ASSET_KEYS.BG_GRASS]: 45 / 167,
  [ASSET_KEYS.FLOWER]: 45 / 167,
  [ASSET_KEYS.TREE]: 45 / 167,
  [ASSET_KEYS.TREE_2]: 45 / 167,
  [ASSET_KEYS.HOWL]: 45 / 167,
  [ASSET_KEYS.HEART]: 30 / 167,
};

export const GROUND_OBSTACLES: ReadonlyArray<string> = [
  ASSET_KEYS.BG_GRASS,
  ASSET_KEYS.FLOWER,
  ASSET_KEYS.TREE,
  ASSET_KEYS.TREE_2,
];

// Color palette
export const COLORS = {
  CREAM: '#F7F6F0',
  DARK: '#333333',
  IMMUNITY: '#FFD700',
  GAME_OVER_BG: 'rgba(0, 0, 0, 0.6)',
};
