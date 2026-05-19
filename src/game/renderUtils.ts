import { ASSET_SCALES, AssetMap } from './constants';

export function drawScaled(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  scale: number,
): void {
  const w = img.naturalWidth * scale;
  const h = img.naturalHeight * scale;
  ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, x, y, w, h);
}

export function drawBottomAligned(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  groundY: number,
  scale: number,
  yOffset: number = 0,
): void {
  const w = img.naturalWidth * scale;
  const h = img.naturalHeight * scale;
  ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, x, groundY - h + yOffset, w, h);
}

export function scaledSize(
  img: HTMLImageElement,
  scale: number,
): { width: number; height: number } {
  return {
    width: img.naturalWidth * scale,
    height: img.naturalHeight * scale,
  };
}

export function drawTiled(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  offsetX: number,
  drawY: number,
  scale: number,
  canvasWidth: number,
): void {
  const tw = img.naturalWidth * scale;
  const th = img.naturalHeight * scale;
  let dx = -(offsetX % tw);
  if (dx > 0) dx -= tw;
  while (dx < canvasWidth) {
    ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, dx, drawY, tw, th);
    dx += tw;
  }
}
