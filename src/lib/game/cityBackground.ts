const CITY_SOURCE = "/city/City.webp";
const SCROLL_SPEED = 0.4;

let cityImage: HTMLImageElement | null = null;
let cityLoaded = false;
let cityLoading: Promise<void> | null = null;

let cityStripCanvas: HTMLCanvasElement | null = null;
let cityStripWidth = 0;
let cityStripHeight = 0;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Failed to load city background: ${src}`));
    image.src = src;
  });
}

export function loadCityBackground(): Promise<void> {
  if (cityLoaded) return Promise.resolve();
  if (cityLoading) return cityLoading;

  cityLoading = loadImage(CITY_SOURCE)
    .then((image) => {
      cityImage = image;
      cityLoaded = true;
    })
    .catch((error) => {
      console.error("City background load failed:", error);
    })
    .finally(() => {
      cityLoading = null;
    });

  return cityLoading;
}

export function isCityBackgroundLoaded(): boolean {
  return cityLoaded && cityImage !== null;
}

/** Pre-scale city tile once per viewport height — avoids per-frame scaling. */
export function prepareCityStrip(height: number): void {
  if (!cityImage || height <= 0) return;
  if (cityStripCanvas && cityStripHeight === height) return;

  const scale = height / cityImage.height;
  const drawWidth = Math.ceil(cityImage.width * scale);
  const drawHeight = Math.ceil(height);

  const canvas = document.createElement("canvas");
  canvas.width = drawWidth;
  canvas.height = drawHeight;

  const stripCtx = canvas.getContext("2d");
  if (!stripCtx) return;

  stripCtx.drawImage(cityImage, 0, 0, drawWidth, drawHeight);

  cityStripCanvas = canvas;
  cityStripWidth = drawWidth;
  cityStripHeight = drawHeight;
}

function drawFallbackSky(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
): void {
  const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
  skyGrad.addColorStop(0, "#0b1a3a");
  skyGrad.addColorStop(0.6, "#1a3a6e");
  skyGrad.addColorStop(1, "#1b3a5c");
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, width, height);
}

export function drawCityBackground(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  frameCount: number,
): void {
  if (!cityImage) {
    drawFallbackSky(ctx, width, height);
    return;
  }

  prepareCityStrip(height);

  if (!cityStripCanvas || cityStripWidth <= 0) {
    drawFallbackSky(ctx, width, height);
    return;
  }

  const scrollOffset = (frameCount * SCROLL_SPEED) % cityStripWidth;
  let x = -scrollOffset;

  while (x < width) {
    ctx.drawImage(cityStripCanvas, x, 0, cityStripWidth, height);
    x += cityStripWidth;
  }
}
