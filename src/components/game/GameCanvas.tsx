"use client";

import { useEffect, useRef } from "react";
import { loadCharacterSprites } from "@/lib/game/characterSprites";
// import { loadCollectibleSprites } from "@/lib/game/collectibleSprites";
import { loadCityBackground, prepareCityStrip } from "@/lib/game/cityBackground";
import { updateGameState } from "@/lib/game/engine";
import { preloadAudio } from "@/lib/game/audio";
import { getCanvasDpr, isCoarsePointer } from "@/lib/game/performance";
import { renderGame } from "@/lib/game/renderer";
import { loadThermometerSprites } from "@/lib/game/thermometerSprites";
import type { Dimensions, GameState } from "@/lib/game/types";

interface GameCanvasProps {
  stateRef: React.RefObject<GameState | null>;
  getDimensions: () => Dimensions;
  onStateChange: (state: GameState, prev: GameState) => void;
}

const IDLE_FRAME_MS = 33;

type ReactSyncSnapshot = Pick<
  GameState,
  "score" | "screen" | "phaseIndex" | "gameStarted" | "isPaused"
>;

function captureSyncSnapshot(state: GameState): ReactSyncSnapshot {
  return {
    score: state.score,
    screen: state.screen,
    phaseIndex: state.phaseIndex,
    gameStarted: state.gameStarted,
    isPaused: state.isPaused,
  };
}

function shouldSyncReact(state: GameState, prev: ReactSyncSnapshot): boolean {
  return (
    state.score !== prev.score ||
    state.screen !== prev.screen ||
    state.phaseIndex !== prev.phaseIndex ||
    state.gameStarted !== prev.gameStarted ||
    state.isPaused !== prev.isPaused
  );
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
  const lastRenderAtRef = useRef(0);

  onStateChangeRef.current = onStateChange;

  useEffect(() => {
    preloadAudio();
    void Promise.all([
      loadCharacterSprites(),
      // loadCollectibleSprites(),
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

    const loop = (now: number) => {
      const state = stateRef.current;
      if (!state) {
        rafRef.current = requestAnimationFrame(loop);
        return;
      }

      const isActivePlay =
        state.screen === "playing" && state.gameStarted && !state.isPaused;
      const frameBudget = isActivePlay ? 0 : IDLE_FRAME_MS;

      if (frameBudget > 0 && now - lastRenderAtRef.current < frameBudget) {
        rafRef.current = requestAnimationFrame(loop);
        return;
      }
      lastRenderAtRef.current = now;

      const dims = dimensionsRef.current;

      if (state.screen === "playing") {
        const prevSnapshot = captureSyncSnapshot(state);
        updateGameState(state, dims);

        if (shouldSyncReact(state, prevSnapshot)) {
          onStateChangeRef.current(state, {
            ...state,
            ...prevSnapshot,
          });
        }
      } else {
        state.frameCount += 1;
      }

      renderGame(ctx, state, dims);
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
