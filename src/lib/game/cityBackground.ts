const CITY_SOURCE = "/city/City.png";
const SCROLL_SPEED = 0.4;

let cityImage: HTMLImageElement | null = null;
let cityLoaded = false;
let cityLoading: Promise<void> | null = null;

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

  const scale = height / cityImage.height;
  const drawWidth = cityImage.width * scale;
  const drawHeight = height;

  const scrollOffset = (frameCount * SCROLL_SPEED) % drawWidth;

  let x = -scrollOffset;
  while (x < width) {
    ctx.drawImage(cityImage, x, 0, drawWidth, drawHeight);
    x += drawWidth;
  }
}
