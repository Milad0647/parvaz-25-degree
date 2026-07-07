export type GameScreen = "menu" | "tutorial" | "playing" | "gameover";

export type CollisionType =
  | "top"
  | "bottom"
  | "ground"
  | "ceiling"
  | "koler18"
  | "ojMasraf"
  | "masrafHamzaman"
  | "vasayelPormasraf"
  | "fesharBeShabake"
  | "masrafSangin";

export type ObstacleLabel =
  | "کولر ۱۸"
  | "اوج مصرف"
  | "مصرف هم‌زمان"
  | "وسایل پرمصرف"
  | "فشار به شبکه"
  | "مصرف سنگین"
  | "تنظیم خیلی سرد";

export type CollectibleType =
  | "25deg"
  | "saatKhaloot"
  | "masrafDorost"
  | "kolerKond"
  | "khamooshi";

export interface Player {
  x: number;
  y: number;
  velocityY: number;
  radius: number;
  rotation: number;
  isHappy: boolean;
}

export interface Obstacle {
  id: number;
  x: number;
  gapY: number;
  gapHeight: number;
  width: number;
  passed: boolean;
  topLabel: ObstacleLabel;
  bottomLabel: ObstacleLabel;
}

export interface Collectible {
  id: number;
  x: number;
  y: number;
  type: CollectibleType;
  collected: boolean;
  radius: number;
}

export interface GamePhase {
  name: string;
  speed: number;
  gapHeight: number;
  spawnInterval: number;
}

export interface GameState {
  screen: GameScreen;
  score: number;
  bestScore: number;
  player: Player;
  obstacles: Obstacle[];
  collectibles: Collectible[];
  frameCount: number;
  phaseIndex: number;
  collisionType: CollisionType | null;
  shieldActive: boolean;
  shieldTimer: number;
  slowMotionTimer: number;
  combo: number;
  nextObstacleId: number;
  nextCollectibleId: number;
  spawnTimer: number;
  collectibleSpawnTimer: number;
  deathMessage: string;
}

export interface Dimensions {
  width: number;
  height: number;
}
