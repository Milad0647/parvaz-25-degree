export type ThermometerTopVariant = 1 | 2 | 3;
export type ThermometerBottomVariant = 1 | 2;

const TOP_SOURCES: Record<ThermometerTopVariant, string> = {
  1: "/thermometer/thermometer-top_01.webp",
  2: "/thermometer/thermometer-top_02.webp",
  3: "/thermometer/thermometer-top_03.webp",
};

const BOTTOM_SOURCES: Record<ThermometerBottomVariant, string> = {
  1: "/thermometer/thermometer-bottom_01.webp",
  2: "/thermometer/thermometer-bottom_02.webp",
};

const TOP_IMAGES: Partial<Record<ThermometerTopVariant, HTMLImageElement>> = {};
const BOTTOM_IMAGES: Partial<Record<ThermometerBottomVariant, HTMLImageElement>> = {};

let spritesLoaded = false;
let spritesLoading: Promise<void> | null = null;

const TOP_VARIANTS: ThermometerTopVariant[] = [1, 2, 3];
const BOTTOM_VARIANTS: ThermometerBottomVariant[] = [1, 2];

/** Uniform scale — 50% of native asset size, proportions preserved */
export const THERMOMETER_SPRITE_SCALE = 0.5;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Failed to load thermometer sprite: ${src}`));
    image.src = src;
  });
}

export function loadThermometerSprites(): Promise<void> {
  if (spritesLoaded) return Promise.resolve();
  if (spritesLoading) return spritesLoading;

  spritesLoading = Promise.all([
    ...TOP_VARIANTS.map(async (variant) => {
      TOP_IMAGES[variant] = await loadImage(TOP_SOURCES[variant]);
    }),
    ...BOTTOM_VARIANTS.map(async (variant) => {
      BOTTOM_IMAGES[variant] = await loadImage(BOTTOM_SOURCES[variant]);
    }),
  ])
    .then(() => {
      spritesLoaded = true;
    })
    .catch((error) => {
      console.error("Thermometer sprite load failed:", error);
    })
    .finally(() => {
      spritesLoading = null;
    });

  return spritesLoading;
}

export function areThermometerSpritesLoaded(): boolean {
  return (
    spritesLoaded &&
    TOP_VARIANTS.every((variant) => TOP_IMAGES[variant]) &&
    BOTTOM_VARIANTS.every((variant) => BOTTOM_IMAGES[variant])
  );
}

export function randomTopVariant(): ThermometerTopVariant {
  return TOP_VARIANTS[Math.floor(Math.random() * TOP_VARIANTS.length)];
}

export function randomBottomVariant(): ThermometerBottomVariant {
  return BOTTOM_VARIANTS[Math.floor(Math.random() * BOTTOM_VARIANTS.length)];
}

export function getThermometerWidth(
  topVariant: ThermometerTopVariant,
  bottomVariant: ThermometerBottomVariant,
): number {
  const topImage = TOP_IMAGES[topVariant];
  const bottomImage = BOTTOM_IMAGES[bottomVariant];
  if (!topImage || !bottomImage) return 0;
  return Math.max(topImage.width, bottomImage.width) * THERMOMETER_SPRITE_SCALE;
}

function drawSafeGapGlow(
  ctx: CanvasRenderingContext2D,
  x: number,
  width: number,
  gapTop: number,
  gapBottom: number,
  gapY: number,
): void {
  const gapHeight = gapBottom - gapTop;
  const pad = 4;

  ctx.fillStyle = "rgba(129, 199, 132, 0.3)";
  ctx.fillRect(x + pad, gapTop, width - pad * 2, gapHeight);

  ctx.strokeStyle = "rgba(102, 187, 106, 0.55)";
  ctx.lineWidth = 2;
  ctx.strokeRect(x + pad, gapTop, width - pad * 2, gapHeight);

  ctx.fillStyle = "#ffffff";
  ctx.font = `bold ${Math.min(width * 0.28, 24)}px Vazirmatn, Tahoma, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("۲۵°", x + width / 2, gapY);
}

/**
 * Flappy Bird style placement:
 * - Top sprite: bottom edge sits at gapTop, body extends above screen
 * - Bottom sprite: top edge sits at gapBottom, body extends below screen
 * Uniform scale at 50% of native size — proportions preserved.
 */
export function drawThermometerSprites(
  ctx: CanvasRenderingContext2D,
  x: number,
  gapY: number,
  gapHeight: number,
  canvasHeight: number,
  topVariant: ThermometerTopVariant,
  bottomVariant: ThermometerBottomVariant,
): void {
  const topImage = TOP_IMAGES[topVariant];
  const bottomImage = BOTTOM_IMAGES[bottomVariant];
  if (!topImage || !bottomImage) return;

  const gapTop = gapY - gapHeight / 2;
  const gapBottom = gapY + gapHeight / 2;

  const topW = topImage.width * THERMOMETER_SPRITE_SCALE;
  const topH = topImage.height * THERMOMETER_SPRITE_SCALE;
  const bottomW = bottomImage.width * THERMOMETER_SPRITE_SCALE;
  const bottomH = bottomImage.height * THERMOMETER_SPRITE_SCALE;

  const width = Math.max(topW, bottomW);
  const topX = x + (width - topW) / 2;
  const bottomX = x + (width - bottomW) / 2;

  const topY = gapTop - topH;
  const bottomY = gapBottom;

  ctx.drawImage(topImage, topX, topY, topW, topH);
  ctx.drawImage(bottomImage, bottomX, bottomY, bottomW, bottomH);

  drawSafeGapGlow(ctx, x, width, gapTop, gapBottom, gapY);
}
