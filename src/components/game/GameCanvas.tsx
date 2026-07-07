"use client";

import { useEffect, useRef } from "react";
import { loadCharacterSprites } from "@/lib/game/characterSprites";
import { loadCollectibleSprites } from "@/lib/game/collectibleSprites";
import { loadCityBackground, prepareCityStrip } from "@/lib/game/cityBackground";
import { updateGameState } from "@/lib/game/engine";
import { getCanvasDpr, isCoarsePointer } from "@/lib/game/performance";
import { renderGame } from "@/lib/game/renderer";
import { loadThermometerSprites } from "@/lib/game/thermometerSprites";
import type { Dimensions, GameState } from "@/lib/game/types";

interface GameCanvasProps {
  stateRef: React.RefObject<GameState | null>;
  getDimensions: () => Dimensions;
  onStateChange: (state: GameState, prev: GameState) => void;
}

export function GameCanvas({
  stateRef,
  getDimensions,
  onStateChange,
}: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const dimensionsRef = useRef<Dimensions>({ width: 390, height: 844 });
  const onStateChangeRef = useRef(onStateChange);

  onStateChangeRef.current = onStateChange;

  useEffect(() => {
    void Promise.all([
      loadCharacterSprites(),
      loadCollectibleSprites(),
      loadCityBackground(),
      loadThermometerSprites(),
    ]).then(() => {
      prepareCityStrip(dimensionsRef.current.height);
    });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", {
      alpha: false,
      desynchronized: true,
    });
    if (!ctx) return;

    if (isCoarsePointer()) {
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "low";
    }

    const resize = () => {
      const dims = getDimensions();
      dimensionsRef.current = dims;
      prepareCityStrip(dims.height);

      const dpr = getCanvasDpr();
      canvas.width = Math.round(dims.width * dpr);
      canvas.height = Math.round(dims.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    const loop = () => {
      const state = stateRef.current;
      if (!state) {
        rafRef.current = requestAnimationFrame(loop);
        return;
      }

      const dims = dimensionsRef.current;
      let current = state;

      if (state.screen === "playing") {
        const next = updateGameState(state, dims);
        stateRef.current = next;
        current = next;

        if (
          next.score !== state.score ||
          next.screen !== state.screen ||
          next.phaseIndex !== state.phaseIndex ||
          next.gameStarted !== state.gameStarted ||
          next.isPaused !== state.isPaused
        ) {
          onStateChangeRef.current(next, state);
        }
      } else {
        state.frameCount += 1;
        current = state;
      }

      renderGame(ctx, current, dims);
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(rafRef.current);
    };
  }, [getDimensions, stateRef]);

  return <canvas ref={canvasRef} className="game-canvas" />;
}
