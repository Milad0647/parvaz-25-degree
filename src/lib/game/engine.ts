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

export function jump(state: GameState): GameState {
  if (state.screen !== "playing") return state;

  const easeFactor = state.slowMotionTimer > 0 ? 0.85 : 1;
  return {
    ...state,
    player: {
      ...state.player,
      velocityY: JUMP_FORCE * easeFactor,
      isHappy: false,
      flapAnimStart: state.frameCount,
    },
  };
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

  let newState = { ...state, frameCount: state.frameCount + 1 };

  const groundY = dimensions.height * (1 - GROUND_HEIGHT_RATIO);

  // Update timers
  if (newState.shieldTimer > 0) {
    newState.shieldTimer -= 1;
    if (newState.shieldTimer <= 0) newState.shieldActive = false;
  }
  if (newState.slowMotionTimer > 0) {
    newState.slowMotionTimer -= 1;
  }

  // Update phase based on score
  const newPhaseIndex = Math.min(
    Math.floor(newState.score / 8),
    PHASES.length - 1,
  );
  if (newPhaseIndex !== newState.phaseIndex) {
    newState.phaseIndex = newPhaseIndex;
  }

  const phase = PHASES[newState.phaseIndex];
  const scrollSpeed = getScrollSpeed(newState);

  // Physics
  let velocityY = newState.player.velocityY + GRAVITY;
  let y = newState.player.y + velocityY;
  const rotation = Math.min(Math.max(velocityY * 3, -25), 70);

  // Ceiling / ground collision
  if (y - newState.player.radius < 0) {
    if (!newState.shieldActive) {
      return {
        ...newState,
        screen: "gameover",
        collisionType: "ceiling",
        deathMessage: DEATH_MESSAGES.default,
        bestScore: Math.max(newState.bestScore, newState.score),
      };
    }
    y = newState.player.radius;
    velocityY = 0;
  }

  if (y + newState.player.radius > groundY) {
    if (!newState.shieldActive) {
      return {
        ...newState,
        screen: "gameover",
        collisionType: "ground",
        deathMessage: DEATH_MESSAGES.default,
        bestScore: Math.max(newState.bestScore, newState.score),
      };
    }
    y = groundY - newState.player.radius;
    velocityY = 0;
  }

  newState = {
    ...newState,
    player: {
      ...newState.player,
      y,
      velocityY,
      rotation,
      isHappy: newState.player.isHappy,
    },
  };

  // Spawn obstacles
  newState.spawnTimer -= 1;
  if (newState.spawnTimer <= 0) {
    const obstacle = spawnObstacle(newState, dimensions);
    newState = {
      ...newState,
      obstacles: [...newState.obstacles, obstacle],
      nextObstacleId: newState.nextObstacleId + 1,
      spawnTimer: phase.spawnInterval,
    };
  }

  // Move obstacles
  newState.obstacles = newState.obstacles
    .map((obs) => ({ ...obs, x: obs.x - scrollSpeed }))
    .filter((obs) => obs.x + obs.width > -50);

  // Score on pass
  for (const obs of newState.obstacles) {
    if (!obs.passed && obs.x + obs.width < newState.player.x) {
      obs.passed = true;
      newState.score += 1;
      newState.combo += 1;
      if (newState.combo >= 5) {
        newState.score += 1;
        newState.combo = 0;
      }
    }
  }

  // Obstacle collision
  for (const obs of newState.obstacles) {
    const collision = checkPlayerCollision(newState.player, obs);
    if (collision.hit) {
      if (newState.shieldActive) {
        newState.shieldActive = false;
        newState.shieldTimer = 0;
        continue;
      }
      const collisionKey = collision.label
        ? LABEL_TO_COLLISION[collision.label]
        : collision.type;
      return {
        ...newState,
        screen: "gameover",
        collisionType: (collisionKey as CollisionType) ?? collision.type,
        deathMessage: resolveDeathMessage(collision.label),
        bestScore: Math.max(newState.bestScore, newState.score),
      };
    }
  }

  // Collectibles spawn & update
  newState.collectibleSpawnTimer -= 1;
  if (newState.collectibleSpawnTimer <= 0 && Math.random() < 0.6) {
    const types = ["25deg", "saatKhaloot", "masrafDorost", "kolerKond", "khamooshi"] as const;
    const type = types[Math.floor(Math.random() * types.length)];
    newState.collectibles = [
      ...newState.collectibles,
      {
        id: newState.nextCollectibleId,
        x: dimensions.width + 40,
        y: dimensions.height * (0.25 + Math.random() * 0.4),
        type,
        collected: false,
        radius: 18,
      },
    ];
    newState.nextCollectibleId += 1;
    newState.collectibleSpawnTimer = 180 + Math.random() * 120;
  }

  newState.collectibles = newState.collectibles
    .map((c) => ({ ...c, x: c.x - scrollSpeed }))
    .filter((c) => c.x > -50 && !c.collected);

  // Collectible pickup
  for (const col of newState.collectibles) {
    if (col.collected) continue;
    const dx = newState.player.x - col.x;
    const dy = newState.player.y - col.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < newState.player.radius + col.radius) {
      col.collected = true;
      newState.score += COLLECTIBLE_SCORES[col.type];
      newState.player = { ...newState.player, isHappy: true };

      if (col.type === "masrafDorost") {
        newState.shieldActive = true;
        newState.shieldTimer = 120;
      }
      if (col.type === "saatKhaloot") {
        newState.slowMotionTimer = 180;
      }
    }
  }

  return newState;
}

export function getGapHeightForDimensions(dimensions: Dimensions): number {
  return dimensions.height * GAP_HEIGHT_RATIO;
}
