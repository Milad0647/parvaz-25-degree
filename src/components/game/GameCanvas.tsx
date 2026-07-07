"use client";

import { useEffect, useRef } from "react";
import { loadCharacterSprites } from "@/lib/game/characterSprites";
import { loadCityBackground } from "@/lib/game/cityBackground";
import { loadThermometerSprites } from "@/lib/game/thermometerSprites";
import { updateGameState } from "@/lib/game/engine";
import { renderGame } from "@/lib/game/renderer";
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

  useEffect(() => {
    void Promise.all([
      loadCharacterSprites(),
      loadCityBackground(),
      loadThermometerSprites(),
    ]);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dims = getDimensions();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = dims.width * dpr;
      canvas.height = dims.height * dpr;
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

      const dims = getDimensions();
      let current = state;

      if (state.screen === "playing") {
        const next = updateGameState(state, dims);
        stateRef.current = next;
        current = next;

        if (
          next.score !== state.score ||
          next.screen !== state.screen ||
          next.phaseIndex !== state.phaseIndex
        ) {
          onStateChange(next, state);
        }
      } else {
        const next = { ...state, frameCount: state.frameCount + 1 };
        stateRef.current = next;
        current = next;
      }

      renderGame(ctx, current, dims);
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(rafRef.current);
    };
  }, [getDimensions, onStateChange, stateRef]);

  return <canvas ref={canvasRef} className="game-canvas" />;
}
