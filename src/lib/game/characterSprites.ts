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

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Failed to load sprite: ${src}`));
    image.src = src;
  });
}

export function loadCharacterSprites(): Promise<void> {
  if (spritesLoaded) return Promise.resolve();
  if (spritesLoading) return spritesLoading;

  spritesLoading = Promise.all(FRAME_SOURCES.map(loadImage))
    .then((images) => {
      images.forEach((image, index) => {
        FLAP_FRAMES[index] = image;
      });
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

  return Math.min(
    FRAME_SOURCES.length - 1,
    Math.floor(elapsed / FLAP_FRAME_DURATION),
  );
}

export function drawCharacterSprite(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  rotation: number,
  frameIndex: number,
  shieldActive: boolean,
): void {
  const image = FLAP_FRAMES[frameIndex] ?? FLAP_FRAMES[0];
  if (!image) return;

  const height = radius * 2.8;
  const width = (image.width / image.height) * height;

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate((rotation * Math.PI) / 180);

  const glowSize = Math.max(width, height);
  const pulse = 0.94 + Math.sin(Date.now() / 380) * 0.06;
  const glowRadius = glowSize * 0.72 * pulse;

  const outerGlow = ctx.createRadialGradient(0, 0, 0, 0, 0, glowRadius);
  outerGlow.addColorStop(0, "rgba(255, 248, 220, 0.5)");
  outerGlow.addColorStop(0.4, "rgba(255, 213, 79, 0.3)");
  outerGlow.addColorStop(0.75, "rgba(255, 193, 7, 0.08)");
  outerGlow.addColorStop(1, "rgba(255, 213, 79, 0)");
  ctx.fillStyle = outerGlow;
  ctx.beginPath();
  ctx.arc(0, 0, glowRadius, 0, Math.PI * 2);
  ctx.fill();

  const innerGlow = ctx.createRadialGradient(0, 0, 0, 0, 0, glowRadius * 0.42);
  innerGlow.addColorStop(0, "rgba(255, 249, 196, 0.85)");
  innerGlow.addColorStop(1, "rgba(255, 213, 79, 0)");
  ctx.fillStyle = innerGlow;
  ctx.beginPath();
  ctx.arc(0, 0, glowRadius * 0.42, 0, Math.PI * 2);
  ctx.fill();

  if (shieldActive) {
    ctx.strokeStyle = "rgba(100, 181, 246, 0.6)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, radius * 1.7, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.shadowColor = "rgba(255, 213, 79, 0.85)";
  ctx.shadowBlur = radius * 1.4;
  ctx.drawImage(image, -width / 2, -height / 2, width, height);
  ctx.shadowBlur = 0;
  ctx.shadowColor = "transparent";
  ctx.restore();
}
