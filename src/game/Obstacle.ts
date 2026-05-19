import { ObstacleKind } from './constants';

export interface Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
  kind: ObstacleKind;
  sprite: HTMLImageElement;
  active: boolean;
}
