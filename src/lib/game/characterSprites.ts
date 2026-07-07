import { isMobilePerfMode } from "./performance";

const FRAME_SOURCES = [
  "/character/frame-01.png",
  "/character/frame-02.png",
  "/character/frame-03.png",
  "/character/frame-04.png",
] as const;

const FLAP_FRAMES: HTMLImageElement[] = [];
const FLAP_FRAME_DURATION = 4;
const FLAP_ANIMATION_LENGTH = FRAME_SOURCES.length * FLAP_FRAME_DURATION;

let spritesLoaded = false;
let spritesLoading: Promise<void> | null = null;
let glowCanvas: HTMLCanvasElement | null = null;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Failed to load sprite: ${src}`));
    image.src = src;
  });
}

function buildGlowCanvas(): void {
  if (glowCanvas) return;

  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const center = size / 2;
  const gradient = ctx.createRadialGradient(center, center, 8, center, center, center);
  gradient.addColorStop(0, "rgba(255, 249, 196, 0.75)");
  gradient.addColorStop(0.55, "rgba(255, 213, 79, 0.24)");
  gradient.addColorStop(1, "rgba(255, 213, 79, 0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  glowCanvas = canvas;
}

export function loadCharacterSprites(): Promise<void> {
  if (spritesLoaded) return Promise.resolve();
  if (spritesLoading) return spritesLoading;

  spritesLoading = Promise.all(FRAME_SOURCES.map(loadImage))
    .then((images) => {
      images.forEach((image, index) => {
        FLAP_FRAMES[index] = image;
      });
      buildGlowCanvas();
      spritesLoaded = true;
    })
    .catch((error) => {
      console.error("Character sprite load failed:", error);
    })
    .finally(() => {
      spritesLoading = null;
    });

  return spritesLoading;
}

export function areCharacterSpritesLoaded(): boolean {
  return spritesLoaded && FLAP_FRAMES.every(Boolean);
}

export function getFlapFrameIndex(
  frameCount: number,
  flapAnimStart: number | undefined,
): number {
  if (flapAnimStart === undefined || flapAnimStart < 0) return 0;

  const elapsed = frameCount - flapAnimStart;
  if (elapsed >= FLAP_ANIMATION_LENGTH) return 0;

  const frame = Math.floor(elapsed / FLAP_FRAME_DURATION);
  return Math.min(FRAME_SOURCES.length - 1, frame);
}

export function drawCharacterSprite(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  rotation: number,
  frameIndex: number,
  frameCount: number,
  shieldActive: boolean,
): void {
  const image = FLAP_FRAMES[frameIndex] ?? FLAP_FRAMES[0];
  if (!image) return;

  const height = radius * 2.8;
  const width = (image.width / image.height) * height;
  const mobileLite = isMobilePerfMode();

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate((rotation * Math.PI) / 180);

  if (!mobileLite && glowCanvas) {
    const glowSize = Math.max(width, height);
    const pulse = 0.94 + Math.sin(frameCount / 12) * 0.06;
    const glowRadius = glowSize * 0.68 * pulse;
    const glowDiameter = glowRadius * 2;
    ctx.drawImage(glowCanvas, -glowRadius, -glowRadius, glowDiameter, glowDiameter);
  }

  if (shieldActive) {
    ctx.strokeStyle = "rgba(100, 181, 246, 0.6)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, radius * 1.7, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.drawImage(image, -width / 2, -height / 2, width, height);
  ctx.restore();
}
