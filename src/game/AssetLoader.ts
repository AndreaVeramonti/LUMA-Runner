import { AssetMap, ASSET_KEYS } from './constants';

const SVG_FILES: Record<string, string> = {
  [ASSET_KEYS.HERO]: '/svg/hero.svg',
  [ASSET_KEYS.HERO_POWERED]: '/svg/hero-powered-up.svg',
  [ASSET_KEYS.MORTE]: '/svg/morte.svg',
  [ASSET_KEYS.TERRENO]: '/svg/terreno.svg',
  [ASSET_KEYS.BG_GRASS]: '/svg/bg-grass.svg',
  [ASSET_KEYS.FLOWER]: '/svg/flower.svg',
  [ASSET_KEYS.TREE]: '/svg/tree.svg',
  [ASSET_KEYS.TREE_2]: '/svg/tree-2.svg',
  [ASSET_KEYS.HOWL]: '/svg/howl.svg',
  [ASSET_KEYS.BG_MOUNTAIN_1]: '/svg/bg.mountain-1.svg',
  [ASSET_KEYS.BG_MOUNTAIN_2]: '/svg/bg-mountain-2.svg',
  [ASSET_KEYS.HEART]: '/svg/heart.svg',
};

function loadImage(key: string, src: string): Promise<[string, HTMLImageElement]> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve([key, img]);
    img.onerror = () => reject(new Error(`Failed to load asset: ${key} (${src})`));
    img.src = src;
  });
}

export class AssetLoader {
  static async loadAll(): Promise<AssetMap> {
    const entries = Object.entries(SVG_FILES);
    const promises = entries.map(([key, src]) => loadImage(key, src));

    const results = await Promise.allSettled(promises);
    const assets: AssetMap = {};
    const errors: string[] = [];

    for (const result of results) {
      if (result.status === 'fulfilled') {
        const [key, img] = result.value;
        assets[key] = img;
      } else {
        errors.push(result.reason.message);
      }
    }

    if (errors.length > 0) {
      console.warn('[AssetLoader] Some assets failed to load:', errors);
    }

    return assets;
  }
}
