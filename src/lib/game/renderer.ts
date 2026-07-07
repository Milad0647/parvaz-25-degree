import { GROUND_HEIGHT_RATIO } from "./constants";
import {
  areCharacterSpritesLoaded,
  drawCharacterSprite,
  getFlapFrameIndex,
} from "./characterSprites";
import { getCollectibleImage } from "./collectibleSprites";
import { drawCityBackground } from "./cityBackground";
import {
  areThermometerSpritesLoaded,
  drawThermometerSprites,
} from "./thermometerSprites";
import type { CollectibleType, Dimensions, GameState } from "./types";

function drawThermometer(
  ctx: CanvasRenderingContext2D,
  x: number,
  gapY: number,
  gapHeight: number,
  width: number,
  height: number,
  topLabel: string,
  bottomLabel: string,
): void {
  const groundY = height * (1 - GROUND_HEIGHT_RATIO);
  const gapTop = gapY - gapHeight / 2;
  const gapBottom = gapY + gapHeight / 2;

  const topGrad = ctx.createLinearGradient(x, 0, x + width, 0);
  topGrad.addColorStop(0, "#c62828");
  topGrad.addColorStop(1, "#ef5350");
  ctx.fillStyle = topGrad;
  ctx.beginPath();
  if (typeof ctx.roundRect === "function") {
    ctx.roundRect(x, 0, width, gapTop, [12, 12, 0, 0]);
  } else {
    ctx.rect(x, 0, width, gapTop);
  }
  ctx.fill();

  const bottomGrad = ctx.createLinearGradient(x, gapBottom, x + width, gapBottom);
  bottomGrad.addColorStop(0, "#e65100");
  bottomGrad.addColorStop(1, "#ff9800");
  ctx.fillStyle = bottomGrad;
  ctx.beginPath();
  if (typeof ctx.roundRect === "function") {
    ctx.roundRect(x, gapBottom, width, groundY - gapBottom, [0, 0, 12, 12]);
  } else {
    ctx.rect(x, gapBottom, width, groundY - gapBottom);
  }
  ctx.fill();

  const safeGrad = ctx.createLinearGradient(x, gapTop, x + width, gapBottom);
  safeGrad.addColorStop(0, "#2e7d32");
  safeGrad.addColorStop(0.5, "#66bb6a");
  safeGrad.addColorStop(1, "#2e7d32");
  ctx.fillStyle = safeGrad;
  ctx.fillRect(x + 2, gapTop, width - 4, gapHeight);

  ctx.strokeStyle = "rgba(255,255,255,0.3)";
  ctx.lineWidth = 2;
  ctx.strokeRect(x, 0, width, groundY);

  ctx.fillStyle = "#ffffff";
  ctx.font = `bold ${Math.min(width * 0.35, 22)}px Vazirmatn, Tahoma, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("۲۵°", x + width / 2, gapY);

  ctx.fillStyle = "rgba(255,255,255,0.95)";
  ctx.font = `600 ${Math.min(width * 0.18, 11)}px Vazirmatn, Tahoma, sans-serif`;
  ctx.save();
  ctx.translate(x + width / 2, gapTop / 2);
  ctx.fillText(topLabel, 0, 0);
  ctx.restore();

  ctx.save();
  ctx.translate(x + width / 2, gapBottom + (groundY - gapBottom) / 2);
  ctx.fillText(bottomLabel, 0, 0);
  ctx.restore();

  const bulbR = width * 0.35;
  ctx.fillStyle = "#ef5350";
  ctx.beginPath();
  ctx.arc(x + width / 2, groundY + bulbR * 0.3, bulbR, 0, Math.PI * 2);
  ctx.fill();
}

function drawWingedLamp(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  rotation: number,
  isHappy: boolean,
  shieldActive: boolean,
): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate((rotation * Math.PI) / 180);

  if (shieldActive) {
    ctx.strokeStyle = "rgba(100, 181, 246, 0.6)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, radius * 1.6, 0, Math.PI * 2);
    ctx.stroke();
  }

  const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, radius * 2);
  glow.addColorStop(0, "rgba(255, 213, 79, 0.4)");
  glow.addColorStop(1, "rgba(255, 213, 79, 0)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(0, 0, radius * 2, 0, Math.PI * 2);
  ctx.fill();

  const wingFlap = Math.sin(Date.now() / 120) * 8;
  ctx.fillStyle = "#90caf9";
  ctx.beginPath();
  ctx.ellipse(-radius * 0.9, -wingFlap, radius * 0.7, radius * 0.35, -0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(radius * 0.9, -wingFlap, radius * 0.7, radius * 0.35, 0.3, 0, Math.PI * 2);
  ctx.fill();

  const bulbGrad = ctx.createRadialGradient(0, -radius * 0.2, 0, 0, 0, radius);
  bulbGrad.addColorStop(0, "#fff9c4");
  bulbGrad.addColorStop(0.6, "#ffd54f");
  bulbGrad.addColorStop(1, "#ffb300");
  ctx.fillStyle = bulbGrad;
  ctx.beginPath();
  ctx.ellipse(0, 0, radius * 0.75, radius * 0.9, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#9e9e9e";
  ctx.fillRect(-radius * 0.3, radius * 0.7, radius * 0.6, radius * 0.25);

  ctx.fillStyle = "#1a237e";
  const eyeY = -radius * 0.15;
  ctx.beginPath();
  ctx.arc(-radius * 0.22, eyeY, radius * 0.12, 0, Math.PI * 2);
  ctx.arc(radius * 0.22, eyeY, radius * 0.12, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "#1a237e";
  ctx.lineWidth = 2;
  ctx.beginPath();
  if (isHappy) {
    ctx.arc(0, radius * 0.1, radius * 0.2, 0.1 * Math.PI, 0.9 * Math.PI);
  } else {
    ctx.moveTo(-radius * 0.15, radius * 0.25);
    ctx.lineTo(radius * 0.15, radius * 0.25);
  }
  ctx.stroke();

  ctx.restore();
}

function drawCollectible(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  type: CollectibleType,
  frameCount: number,
): void {
  const bob = Math.sin(frameCount / 15) * 4;
  const image = getCollectibleImage(type);

  ctx.save();
  ctx.translate(x, y + bob);

  if (image) {
    const size = radius * 2.5;
    const aspect = image.width / image.height;
    const width = aspect >= 1 ? size : size * aspect;
    const height = aspect >= 1 ? size / aspect : size;
    ctx.drawImage(image, -width / 2, -height / 2, width, height);
  } else {
    const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, radius);
    grad.addColorStop(0, "#a5d6a7");
    grad.addColorStop(1, "#2e7d32");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

export function renderGame(
  ctx: CanvasRenderingContext2D,
  state: GameState,
  dimensions: Dimensions,
): void {
  const { width, height } = dimensions;

  drawCityBackground(ctx, width, height, state.frameCount);

  for (const obs of state.obstacles) {
    if (areThermometerSpritesLoaded()) {
      drawThermometerSprites(
        ctx,
        obs.x,
        obs.gapY,
        obs.gapHeight,
        height,
        obs.topVariant,
        obs.bottomVariant,
      );
    } else {
      drawThermometer(
        ctx,
        obs.x,
        obs.gapY,
        obs.gapHeight,
        obs.width,
        height,
        obs.topLabel,
        obs.bottomLabel,
      );
    }
  }

  for (const col of state.collectibles) {
    if (!col.collected) {
      drawCollectible(
        ctx,
        col.x,
        col.y,
        col.radius,
        col.type,
        state.frameCount,
      );
    }
  }

  const frameIndex = getFlapFrameIndex(
    state.frameCount,
    state.player.flapAnimStart,
  );

  if (areCharacterSpritesLoaded()) {
    drawCharacterSprite(
      ctx,
      state.player.x,
      state.player.y,
      state.player.radius,
      state.player.rotation,
      frameIndex,
      state.shieldActive,
    );
  } else {
    drawWingedLamp(
      ctx,
      state.player.x,
      state.player.y,
      state.player.radius,
      state.player.rotation,
      state.player.isHappy,
      state.shieldActive,
    );
  }
}
