"use client";

import { useEffect, useState } from "react";
import { loadCharacterSprites } from "@/lib/game/characterSprites";

const CHARACTER_FRAMES = [
  "/character/frame-01.png",
  "/character/frame-02.png",
  "/character/frame-03.png",
  "/character/frame-04.png",
] as const;

const FRAME_INTERVAL_MS = 120;

export function StartCharacterPreview() {
  const [frameIndex, setFrameIndex] = useState(0);

  useEffect(() => {
    void loadCharacterSprites();

    const interval = setInterval(() => {
      setFrameIndex((index) => (index + 1) % CHARACTER_FRAMES.length);
    }, FRAME_INTERVAL_MS);

    return () => clearInterval(interval);
  }, []);

  return (
    <img
      src={CHARACTER_FRAMES[frameIndex]}
      alt=""
      className="start-character start-character-float"
      draggable={false}
    />
  );
}
