"use client";

import { useEffect } from "react";
import { loadCharacterSprites } from "@/lib/game/characterSprites";

const CHARACTER_FRAME = "/character/frame-02.png";

export function StartCharacterPreview() {
  useEffect(() => {
    void loadCharacterSprites();
  }, []);

  return (
    <img
      src={CHARACTER_FRAME}
      alt=""
      className="start-character start-character-float"
      draggable={false}
    />
  );
}
