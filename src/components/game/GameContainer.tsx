"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { GameCanvas } from "./GameCanvas";
import { StartScreen } from "./StartScreen";
import { TutorialScreen } from "./TutorialScreen";
import { GameOverScreen } from "./GameOverScreen";
import { HUD } from "./HUD";
import { EncouragementToast } from "./EncouragementToast";
import { ReadyOverlay } from "./ReadyOverlay";
import { PauseOverlay } from "./PauseOverlay";
import {
  createInitialState,
  jump,
  resetGameState,
  togglePause,
} from "@/lib/game/engine";
import { ENCOURAGEMENT_MESSAGES } from "@/lib/game/constants";
import {
  playTapSound,
  startBackgroundMusic,
  stopBackgroundMusic,
} from "@/lib/game/audio";
import {
  getBestScore,
  hasSeenTutorial,
  markTutorialSeen,
  saveBestScore,
} from "@/lib/game/storage";
import type { Dimensions, GameScreen, GameState } from "@/lib/game/types";

export function GameContainer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<GameState | null>(null);
  const dimensionsRef = useRef<Dimensions>({ width: 390, height: 844 });
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [screen, setScreen] = useState<GameScreen>("menu");
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [deathMessage, setDeathMessage] = useState("");
  const [showTutorial, setShowTutorial] = useState(false);
  const [encouragement, setEncouragement] = useState<string | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const showEncouragement = useCallback(() => {
    const message =
      ENCOURAGEMENT_MESSAGES[
        Math.floor(Math.random() * ENCOURAGEMENT_MESSAGES.length)
      ];
    setEncouragement(message);

    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }

    toastTimerRef.current = setTimeout(() => {
      setEncouragement(null);
    }, 1200);
  }, []);

  const getDimensions = useCallback((): Dimensions => {
    const el = containerRef.current;
    if (!el) return dimensionsRef.current;
    const rect = el.getBoundingClientRect();
    dimensionsRef.current = {
      width: rect.width,
      height: rect.height,
    };
    return dimensionsRef.current;
  }, []);

  useEffect(() => {
    const best = getBestScore();
    setBestScore(best);
    stateRef.current = createInitialState(getDimensions(), best);
  }, [getDimensions]);

  useEffect(() => {
    const handleResize = () => getDimensions();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [getDimensions]);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
      stopBackgroundMusic();
    };
  }, []);

  const handleStateChange = useCallback(
    (next: GameState, prev: GameState) => {
      if (next.gameStarted !== prev.gameStarted) {
        setGameStarted(next.gameStarted);
      }

      if (next.isPaused !== prev.isPaused) {
        setIsPaused(next.isPaused);
      }

      if (next.score > prev.score) {
        setScore(next.score);
        showEncouragement();
      }

      if (next.screen !== prev.screen) {
        setScreen(next.screen);

        if (next.screen === "gameover") {
          setEncouragement(null);
          setDeathMessage(next.deathMessage);
          setGameStarted(false);
          setIsPaused(false);

          const newBest = Math.max(next.bestScore, next.score);
          if (next.score > next.bestScore) {
            saveBestScore(next.score);
            setBestScore(next.score);
          } else {
            setBestScore(newBest);
          }
          stateRef.current = { ...next, bestScore: newBest };
        }
      }
    },
    [showEncouragement],
  );

  const launchGame = useCallback(() => {
    startBackgroundMusic();
    const dims = getDimensions();
    const current = stateRef.current ?? createInitialState(dims, bestScore);
    const next = resetGameState({ ...current, bestScore }, dims);
    stateRef.current = next;
    setScore(0);
    setEncouragement(null);
    setGameStarted(false);
    setIsPaused(false);
    setScreen("playing");
  }, [bestScore, getDimensions]);

  const startGame = useCallback(() => {
    startBackgroundMusic();
    if (!hasSeenTutorial()) {
      setShowTutorial(true);
      return;
    }
    launchGame();
  }, [launchGame]);

  const handleTutorialComplete = useCallback(() => {
    markTutorialSeen();
    setShowTutorial(false);
    launchGame();
  }, [launchGame]);

  const handleJump = useCallback(() => {
    const state = stateRef.current;
    if (!state) return;

    if (state.screen === "menu" && !showTutorial) {
      startGame();
      return;
    }

    if (state.screen !== "playing") return;

    if (state.isPaused) {
      const resumed = togglePause(state);
      stateRef.current = resumed;
      setIsPaused(false);
      return;
    }

    const wasReady = !state.gameStarted;
    const next = jump(state);
    stateRef.current = next;

    playTapSound();
    startBackgroundMusic();

    if (wasReady) {
      setGameStarted(true);
    }
  }, [showTutorial, startGame]);

  const handlePause = useCallback(() => {
    const state = stateRef.current;
    if (!state || state.screen !== "playing" || !state.gameStarted) return;

    const next = togglePause(state);
    stateRef.current = next;
    setIsPaused(next.isPaused);
  }, []);

  const handleRestart = useCallback(() => {
    launchGame();
  }, [launchGame]);

  const handleBackToMenu = useCallback(() => {
    const dims = getDimensions();
    stateRef.current = createInitialState(dims, bestScore);
    setScreen("menu");
    setScore(0);
    setEncouragement(null);
    setGameStarted(false);
    setIsPaused(false);
  }, [bestScore, getDimensions]);

  const handlePointer = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      handleJump();
    },
    [handleJump],
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault();
        handleJump();
      }
    },
    [handleJump],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div
      ref={containerRef}
      className="game-container"
      onPointerDown={handlePointer}
      role="application"
      aria-label="پرواز ۲۵ درجه"
    >
      <GameCanvas
        stateRef={stateRef}
        getDimensions={getDimensions}
        onStateChange={handleStateChange}
      />

      {screen === "playing" && (
        <>
          <HUD score={score} isPaused={isPaused} onPause={handlePause} />
          {!gameStarted && <ReadyOverlay />}
          {isPaused && <PauseOverlay />}
          {gameStarted && <EncouragementToast message={encouragement} />}
        </>
      )}

      <AnimatePresence mode="wait">
        {screen === "menu" && !showTutorial && (
          <StartScreen key="menu" bestScore={bestScore} onStart={startGame} />
        )}

        {showTutorial && (
          <TutorialScreen key="tutorial" onComplete={handleTutorialComplete} />
        )}

        {screen === "gameover" && (
          <GameOverScreen
            key="gameover"
            score={score}
            bestScore={bestScore}
            deathMessage={deathMessage}
            onRestart={handleRestart}
            onMenu={handleBackToMenu}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
