import {
  BOTTOM_LABELS,
  COLLECTIBLE_SCORES,
  DEATH_MESSAGES,
  GAP_HEIGHT_RATIO,
  GRAVITY,
  GROUND_HEIGHT_RATIO,
  JUMP_FORCE,
  LABEL_TO_COLLISION,
  OBSTACLE_WIDTH_RATIO,
  PHASES,
  PLAYER_RADIUS_RATIO,
  TOP_LABELS,
  getObstacleGapHeight,
} from "./constants";
import type {
  CollisionType,
  Dimensions,
  GameState,
  Obstacle,
  ObstacleLabel,
  Player,
} from "./types";
import {
  areThermometerSpritesLoaded,
  getThermometerWidth,
  randomBottomVariant,
  randomTopVariant,
} from "./thermometerSprites";

export function createInitialPlayer(dimensions: Dimensions): Player {
  return {
    x: dimensions.width * 0.25,
    y: dimensions.height * 0.45,
    velocityY: 0,
    radius: dimensions.height * PLAYER_RADIUS_RATIO,
    rotation: 0,
    isHappy: false,
    flapAnimStart: -1,
  };
}

export function createInitialState(
  dimensions: Dimensions,
  bestScore: number,
): GameState {
  return {
    screen: "menu",
    score: 0,
    bestScore,
    player: createInitialPlayer(dimensions),
    obstacles: [],
    collectibles: [],
    frameCount: 0,
    phaseIndex: 0,
    collisionType: null,
    shieldActive: false,
    shieldTimer: 0,
    slowMotionTimer: 0,
    combo: 0,
    nextObstacleId: 0,
    nextCollectibleId: 0,
    spawnTimer: 0,
    collectibleSpawnTimer: 80,
    deathMessage: DEATH_MESSAGES.default,
    gameStarted: false,
    isPaused: false,
  };
}

export function resetGameState(state: GameState, dimensions: Dimensions): GameState {
  return {
    ...state,
    screen: "playing",
    score: 0,
    player: createInitialPlayer(dimensions),
    obstacles: [],
    collectibles: [],
    frameCount: 0,
    phaseIndex: 0,
    collisionType: null,
    shieldActive: false,
    shieldTimer: 0,
    slowMotionTimer: 0,
    combo: 0,
    nextObstacleId: 0,
    nextCollectibleId: 0,
    spawnTimer: 60,
    collectibleSpawnTimer: 80,
    deathMessage: DEATH_MESSAGES.default,
    gameStarted: false,
    isPaused: false,
  };
}

function randomLabel(labels: ObstacleLabel[]): ObstacleLabel {
  return labels[Math.floor(Math.random() * labels.length)];
}

export function spawnObstacle(state: GameState, dimensions: Dimensions): Obstacle {
  const gapHeight = getObstacleGapHeight(dimensions.height, state.phaseIndex);
  const minGapY = gapHeight / 2 + dimensions.height * 0.18;
  const maxGapY =
    dimensions.height * (1 - GROUND_HEIGHT_RATIO) - gapHeight / 2 - 20;
  const gapY = minGapY + Math.random() * Math.max(0, maxGapY - minGapY);

  const topVariant = randomTopVariant();
  const bottomVariant = randomBottomVariant();
  const spriteWidth = areThermometerSpritesLoaded()
    ? getThermometerWidth(topVariant, bottomVariant)
    : 0;

  return {
    id: state.nextObstacleId,
    x: dimensions.width + 20,
    gapY,
    gapHeight,
    width: spriteWidth > 0 ? spriteWidth : dimensions.width * OBSTACLE_WIDTH_RATIO,
    passed: false,
    topLabel: randomLabel(TOP_LABELS),
    bottomLabel: randomLabel(BOTTOM_LABELS),
    topVariant,
    bottomVariant,
  };
}

export function togglePause(state: GameState): GameState {
  if (state.screen !== "playing" || !state.gameStarted) return state;
  state.isPaused = !state.isPaused;
  return state;
}

function updateReadyHover(
  state: GameState,
  dimensions: Dimensions,
): GameState {
  const baseY = dimensions.height * 0.45;
  state.frameCount += 1;
  state.player.y = baseY + Math.sin(state.frameCount / 18) * 10;
  state.player.velocityY = 0;
  state.player.rotation = Math.sin(state.frameCount / 25) * 4;
  return state;
}

function spawnCollectibleInGap(
  state: GameState,
  dimensions: Dimensions,
): boolean {
  const gapObstacles = state.obstacles.filter(
    (obs) => obs.x > dimensions.width * 0.15 && obs.x < dimensions.width * 0.9,
  );

  if (gapObstacles.length === 0) return false;

  const obstacle =
    gapObstacles[Math.floor(Math.random() * gapObstacles.length)];
  const gapTop = obstacle.gapY - obstacle.gapHeight / 2;
  const gapBottom = obstacle.gapY + obstacle.gapHeight / 2;
  const margin = obstacle.gapHeight * 0.18;
  const safeHeight = gapBottom - gapTop - margin * 2;

  if (safeHeight < 30) return false;

  const types = ["saatKhaloot", "masrafDorost"] as const;
  const type = types[Math.floor(Math.random() * types.length)];

  state.collectibles.push({
    id: state.nextCollectibleId,
    x: obstacle.x + obstacle.width * 0.35,
    y: gapTop + margin + Math.random() * safeHeight,
    type,
    collected: false,
    radius: 20,
  });
  state.nextCollectibleId += 1;
  state.collectibleSpawnTimer = 200 + Math.random() * 140;
  return true;
}

export function jump(state: GameState): GameState {
  if (state.screen !== "playing" || state.isPaused) return state;

  if (!state.gameStarted) {
    state.gameStarted = true;
    state.player.velocityY = JUMP_FORCE;
    state.player.isHappy = false;
    state.player.flapAnimStart = state.frameCount;
    return state;
  }

  const easeFactor = state.slowMotionTimer > 0 ? 0.85 : 1;
  state.player.velocityY = JUMP_FORCE * easeFactor;
  state.player.isHappy = false;
  state.player.flapAnimStart = state.frameCount;
  return state;
}

function getScrollSpeed(state: GameState): number {
  const phase = PHASES[state.phaseIndex];
  const slowFactor = state.slowMotionTimer > 0 ? 0.65 : 1;
  return phase.speed * slowFactor;
}

function checkPlayerCollision(
  player: Player,
  obstacle: Obstacle,
): { hit: boolean; type: CollisionType | null; label?: ObstacleLabel } {
  const playerLeft = player.x - player.radius * 0.7;
  const playerRight = player.x + player.radius * 0.7;
  const playerTop = player.y - player.radius * 0.7;
  const playerBottom = player.y + player.radius * 0.7;

  const obsLeft = obstacle.x;
  const obsRight = obstacle.x + obstacle.width;

  if (playerRight < obsLeft || playerLeft > obsRight) {
    return { hit: false, type: null };
  }

  const gapTop = obstacle.gapY - obstacle.gapHeight / 2;
  const gapBottom = obstacle.gapY + obstacle.gapHeight / 2;

  if (playerTop < gapTop) {
    return { hit: true, type: "top", label: obstacle.topLabel };
  }

  if (playerBottom > gapBottom) {
    return { hit: true, type: "bottom", label: obstacle.bottomLabel };
  }

  return { hit: false, type: null };
}

function resolveDeathMessage(label?: ObstacleLabel): string {
  if (label && LABEL_TO_COLLISION[label]) {
    const key = LABEL_TO_COLLISION[label];
    return DEATH_MESSAGES[key ?? "default"] ?? DEATH_MESSAGES.default;
  }
  return DEATH_MESSAGES.default;
}

export function updateGameState(
  state: GameState,
  dimensions: Dimensions,
): GameState {
  if (state.screen !== "playing") return state;
  if (state.isPaused) return state;

  if (!state.gameStarted) {
    return updateReadyHover(state, dimensions);
  }

  state.frameCount += 1;

  const groundY = dimensions.height * (1 - GROUND_HEIGHT_RATIO);
  const player = state.player;

  if (state.shieldTimer > 0) {
    state.shieldTimer -= 1;
    if (state.shieldTimer <= 0) state.shieldActive = false;
  }
  if (state.slowMotionTimer > 0) {
    state.slowMotionTimer -= 1;
  }

  const newPhaseIndex = Math.min(
    Math.floor(state.score / 8),
    PHASES.length - 1,
  );
  if (newPhaseIndex !== state.phaseIndex) {
    state.phaseIndex = newPhaseIndex;
  }

  const phase = PHASES[state.phaseIndex];
  const scrollSpeed = getScrollSpeed(state);

  let velocityY = player.velocityY + GRAVITY;
  let y = player.y + velocityY;
  const rotation = Math.min(Math.max(velocityY * 3, -25), 70);

  if (y - player.radius < 0) {
    if (!state.shieldActive) {
      state.screen = "gameover";
      state.collisionType = "ceiling";
      state.deathMessage = DEATH_MESSAGES.default;
      state.bestScore = Math.max(state.bestScore, state.score);
      return state;
    }
    y = player.radius;
    velocityY = 0;
  }

  if (y + player.radius > groundY) {
    if (!state.shieldActive) {
      state.screen = "gameover";
      state.collisionType = "ground";
      state.deathMessage = DEATH_MESSAGES.default;
      state.bestScore = Math.max(state.bestScore, state.score);
      return state;
    }
    y = groundY - player.radius;
    velocityY = 0;
  }

  player.y = y;
  player.velocityY = velocityY;
  player.rotation = rotation;

  state.spawnTimer -= 1;
  if (state.spawnTimer <= 0) {
    state.obstacles.push(spawnObstacle(state, dimensions));
    state.nextObstacleId += 1;
    state.spawnTimer = phase.spawnInterval;
  }

  for (let i = state.obstacles.length - 1; i >= 0; i -= 1) {
    const obstacle = state.obstacles[i];
    obstacle.x -= scrollSpeed;
    if (obstacle.x + obstacle.width <= -50) {
      state.obstacles.splice(i, 1);
    }
  }

  for (const obstacle of state.obstacles) {
    if (!obstacle.passed && obstacle.x + obstacle.width < player.x) {
      obstacle.passed = true;
      state.score += 1;
      state.combo += 1;
      if (state.combo >= 5) {
        state.score += 1;
        state.combo = 0;
      }
    }
  }

  for (const obstacle of state.obstacles) {
    const collision = checkPlayerCollision(player, obstacle);
    if (!collision.hit) continue;

    if (state.shieldActive) {
      state.shieldActive = false;
      state.shieldTimer = 0;
      continue;
    }

    const collisionKey = collision.label
      ? LABEL_TO_COLLISION[collision.label]
      : collision.type;
    state.screen = "gameover";
    state.collisionType = (collisionKey as CollisionType) ?? collision.type;
    state.deathMessage = resolveDeathMessage(collision.label);
    state.bestScore = Math.max(state.bestScore, state.score);
    return state;
  }

  state.collectibleSpawnTimer -= 1;
  if (state.collectibleSpawnTimer <= 0) {
    if (!spawnCollectibleInGap(state, dimensions)) {
      state.collectibleSpawnTimer = 60;
    }
  }

  for (let i = state.collectibles.length - 1; i >= 0; i -= 1) {
    const collectible = state.collectibles[i];
    collectible.x -= scrollSpeed;
    if (collectible.x <= -50 || collectible.collected) {
      state.collectibles.splice(i, 1);
    }
  }

  const pickupRadius = player.radius;
  for (const collectible of state.collectibles) {
    if (collectible.collected) continue;

    const dx = player.x - collectible.x;
    const dy = player.y - collectible.y;
    const hitRadius = pickupRadius + collectible.radius;
    if (dx * dx + dy * dy >= hitRadius * hitRadius) continue;

    collectible.collected = true;
    state.score += COLLECTIBLE_SCORES[collectible.type];
    player.isHappy = true;

    if (collectible.type === "masrafDorost") {
      state.shieldActive = true;
      state.shieldTimer = 120;
    }
    if (collectible.type === "saatKhaloot") {
      state.slowMotionTimer = 180;
    }
  }

  return state;
}

export function getGapHeightForDimensions(dimensions: Dimensions): number {
  return dimensions.height * GAP_HEIGHT_RATIO;
}
