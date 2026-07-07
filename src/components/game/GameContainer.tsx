"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { GameCanvas } from "./GameCanvas";
import { StartScreen } from "./StartScreen";
import { TutorialScreen } from "./TutorialScreen";
import { GameOverScreen } from "./GameOverScreen";
import { HUD } from "./HUD";
import { TipBanner } from "./TipBanner";
import { EncouragementToast } from "./EncouragementToast";
import {
  createInitialState,
  jump,
  resetGameState,
} from "@/lib/game/engine";
import { ENCOURAGEMENT_MESSAGES, PHASES } from "@/lib/game/constants";
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
  const [phaseName, setPhaseName] = useState(PHASES[0].name);
  const [deathMessage, setDeathMessage] = useState("");
  const [showTutorial, setShowTutorial] = useState(false);
  const [encouragement, setEncouragement] = useState<string | null>(null);

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
    };
  }, []);

  const handleStateChange = useCallback(
    (next: GameState, prev: GameState) => {
      if (next.score > prev.score) {
        setScore(next.score);
        showEncouragement();
      }

      if (next.phaseIndex !== prev.phaseIndex) {
        setPhaseName(PHASES[next.phaseIndex].name);
      }

      if (next.screen !== prev.screen) {
        setScreen(next.screen);

        if (next.screen === "gameover") {
          setEncouragement(null);
          setDeathMessage(next.deathMessage);
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
    const dims = getDimensions();
    const current = stateRef.current ?? createInitialState(dims, bestScore);
    const next = resetGameState({ ...current, bestScore }, dims);
    stateRef.current = next;
    setScore(0);
    setPhaseName(PHASES[0].name);
    setEncouragement(null);
    setScreen("playing");
  }, [bestScore, getDimensions]);

  const startGame = useCallback(() => {
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

    stateRef.current = jump(state);

    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { scale: 1 },
        { scale: 1.005, duration: 0.08, yoyo: true, repeat: 1 },
      );
    }
  }, [showTutorial, startGame]);

  const handleRestart = useCallback(() => {
    launchGame();
  }, [launchGame]);

  const handleBackToMenu = useCallback(() => {
    const dims = getDimensions();
    stateRef.current = createInitialState(dims, bestScore);
    setScreen("menu");
    setScore(0);
    setPhaseName(PHASES[0].name);
    setEncouragement(null);
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
          <HUD score={score} bestScore={bestScore} phaseName={phaseName} />
          <TipBanner />
          <EncouragementToast message={encouragement} />
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
