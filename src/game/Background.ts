import {
  CANVAS_WIDTH, CANVAS_HEIGHT, GROUND_Y,
  TERRAIN_SCROLL_SPEED_RATIO, MOUNTAIN_1_SCROLL_RATIO, MOUNTAIN_2_SCROLL_RATIO,
  COLORS, ASSET_KEYS, ASSET_SCALES, AssetMap,
} from './constants';
import { drawTiled } from './renderUtils';

interface ParallaxTileLayer {
  img: HTMLImageElement;
  x: number;
  scrollRatio: number;
  scale: number;
  drawY: number;
}

export class Background {
  private layers: ParallaxTileLayer[] = [];
  private canvasWidth: number;

  constructor(private assets: AssetMap) {
    this.canvasWidth = CANVAS_WIDTH;
    this.init();
  }

  private init(): void {
    const mount1 = this.assets[ASSET_KEYS.BG_MOUNTAIN_1];
    const mount2 = this.assets[ASSET_KEYS.BG_MOUNTAIN_2];
    const terrainImg = this.assets[ASSET_KEYS.TERRENO];

    if (mount1) {
      const s = ASSET_SCALES[ASSET_KEYS.BG_MOUNTAIN_1];
      this.layers.push({
        img: mount1,
        x: 0,
        scrollRatio: MOUNTAIN_1_SCROLL_RATIO,
        scale: s,
        drawY: GROUND_Y - mount1.naturalHeight * s,
      });
    }

    if (mount2) {
      const s = ASSET_SCALES[ASSET_KEYS.BG_MOUNTAIN_2];
      this.layers.push({
        img: mount2,
        x: 0,
        scrollRatio: MOUNTAIN_2_SCROLL_RATIO,
        scale: s,
        drawY: GROUND_Y - mount2.naturalHeight * s,
      });
    }

    if (terrainImg) {
      this.layers.push({
        img: terrainImg,
        x: 0,
        scrollRatio: TERRAIN_SCROLL_SPEED_RATIO,
        scale: ASSET_SCALES[ASSET_KEYS.TERRENO],
        drawY: GROUND_Y,
      });
    }
  }

  update(deltaTime: number, speed: number): void {
    const dt = deltaTime / 16.667;
    for (const layer of this.layers) {
      layer.x -= speed * layer.scrollRatio * dt;
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = COLORS.CREAM;
    ctx.fillRect(0, 0, this.canvasWidth, CANVAS_HEIGHT);

    for (const layer of this.layers) {
      if (layer.img) {
        drawTiled(ctx, layer.img, layer.x, layer.drawY, layer.scale, this.canvasWidth);
      }
    }
  }

  reset(): void {
    for (const layer of this.layers) {
      layer.x = 0;
    }
  }
}
