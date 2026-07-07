"use client";

import { useEffect, useState } from "react";
import {
  CHARACTER_FRAME_SOURCES,
  loadCharacterSprites,
} from "@/lib/game/characterSprites";

const FRAME_INTERVAL_MS = 120;

export function StartCharacterPreview() {
  const [frameIndex, setFrameIndex] = useState(0);

  useEffect(() => {
    void loadCharacterSprites();

    const interval = setInterval(() => {
      setFrameIndex((index) => (index + 1) % CHARACTER_FRAME_SOURCES.length);
    }, FRAME_INTERVAL_MS);

    return () => clearInterval(interval);
  }, []);

  return (
    <img
      src={CHARACTER_FRAME_SOURCES[frameIndex]}
      alt=""
      className="start-character start-character-float"
      draggable={false}
    />
  );
}
