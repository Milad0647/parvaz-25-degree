import type { CollectibleType } from "./types";

const SHIELD_SRC = "/icon/shild.webp";
const SPEED_LOW_SRC = "/icon/speed-low.webp";

let shieldImage: HTMLImageElement | null = null;
let speedLowImage: HTMLImageElement | null = null;
let spritesLoaded = false;
let spritesLoading: Promise<void> | null = null;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Failed to load collectible sprite: ${src}`));
    image.src = src;
  });
}

export function loadCollectibleSprites(): Promise<void> {
  if (spritesLoaded) return Promise.resolve();
  if (spritesLoading) return spritesLoading;

  spritesLoading = Promise.all([
    loadImage(SHIELD_SRC).then((image) => {
      shieldImage = image;
    }),
    loadImage(SPEED_LOW_SRC).then((image) => {
      speedLowImage = image;
    }),
  ])
    .then(() => {
      spritesLoaded = true;
    })
    .catch((error) => {
      console.error("Collectible sprite load failed:", error);
    })
    .finally(() => {
      spritesLoading = null;
    });

  return spritesLoading;
}

export function areCollectibleSpritesLoaded(): boolean {
  return spritesLoaded && !!shieldImage && !!speedLowImage;
}

export function getCollectibleImage(
  type: CollectibleType,
): HTMLImageElement | null {
  if (type === "masrafDorost") return shieldImage;
  if (type === "saatKhaloot") return speedLowImage;
  return null;
}
