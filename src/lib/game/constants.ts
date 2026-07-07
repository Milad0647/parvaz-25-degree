import type { CollectibleType, GamePhase, ObstacleLabel } from "./types";

export const STORAGE_KEYS = {
  bestScore: "parvaz25_best_score",
  tutorialSeen: "parvaz25_tutorial_seen",
} as const;

export const GRAVITY = 0.45;
export const JUMP_FORCE = -7.5;
export const PLAYER_RADIUS_RATIO = 0.035;
export const OBSTACLE_WIDTH_RATIO = 0.18;
export const GAP_HEIGHT_RATIO = 0.22;
export const MIN_GAP_HEIGHT_RATIO = 0.16;
export const GROUND_HEIGHT_RATIO = 0.08;
export const SCROLL_SPEED_BASE = 2.8;

export const PHASES: GamePhase[] = [
  { name: "شروع سبک", speed: 2.8, gapHeight: 0.22, spawnInterval: 140 },
  { name: "اوج مصرف", speed: 3.2, gapHeight: 0.2, spawnInterval: 125 },
  { name: "مصرف هم‌زمان", speed: 3.6, gapHeight: 0.19, spawnInterval: 115 },
  { name: "شبکه شلوغ", speed: 4.0, gapHeight: 0.17, spawnInterval: 105 },
  { name: "پرواز حرفه‌ای", speed: 4.5, gapHeight: 0.16, spawnInterval: 95 },
];

export const TOP_LABELS: ObstacleLabel[] = [
  "اوج مصرف",
  "مصرف سنگین",
  "فشار به شبکه",
  "تنظیم خیلی سرد",
];

export const BOTTOM_LABELS: ObstacleLabel[] = [
  "کولر ۱۸",
  "مصرف هم‌زمان",
  "وسایل پرمصرف",
  "مصرف سنگین",
];

export const COLLECTIBLE_LABELS: Record<CollectibleType, string> = {
  "25deg": "۲۵°",
  saatKhaloot: "ساعت خلوت‌تر",
  masrafDorost: "مصرف درست",
  kolerKond: "کولر کند",
  khamooshi: "خاموشی اضافی",
};

export const COLLECTIBLE_SCORES: Record<CollectibleType, number> = {
  "25deg": 2,
  saatKhaloot: 3,
  masrafDorost: 2,
  kolerKond: 1,
  khamooshi: 2,
};

export const ROTATING_TIPS = [
  "۲۵ درجه، انتخاب درست",
  "ساعت خلوت‌تر، مصرف سبک‌تر",
  "مصرف هم‌زمان کمتر = فشار کمتر به شبکه",
  "روشنایی با همدلی ادامه دارد",
  "با تنظیم درست مصرف، روشنایی برای همه ادامه پیدا می‌کند",
];

export const DEATH_MESSAGES: Record<string, string> = {
  koler18:
    "کولر روی ۱۸ درجه، برق بیشتری مصرف می‌کند. برای مصرف درست، ۲۵ درجه را انتخاب کن.",
  ojMasraf:
    "در ساعت‌های اوج مصرف، شبکه برق تحت فشار است. کارهای سنگین را به ساعت خلوت‌تر منتقل کن.",
  masrafHamzaman:
    "روشن بودن چند وسیله پرمصرف با هم، فشار زیادی به شبکه وارد می‌کند.",
  vasayelPormasraf:
    "استفاده از وسایل پرمصرف را بهتر است به زمان مناسب منتقل کنی.",
  fesharBeShabake: "فشار زیاد به شبکه، روشنایی همه را تحت تأثیر قرار می‌دهد.",
  masrafSangin: "مصرف سنگین در زمان نامناسب، شبکه را تحت فشار می‌گذارد.",
  default: "کولر روی ۲۵ درجه، مصرف برق را متعادل‌تر می‌کند.",
};

export const LABEL_TO_COLLISION: Partial<Record<ObstacleLabel, string>> = {
  "کولر ۱۸": "koler18",
  "اوج مصرف": "ojMasraf",
  "مصرف هم‌زمان": "masrafHamzaman",
  "وسایل پرمصرف": "vasayelPormasraf",
  "فشار به شبکه": "fesharBeShabake",
  "مصرف سنگین": "masrafSangin",
  "تنظیم خیلی سرد": "koler18",
};

export const ENCOURAGEMENT_MESSAGES = [
  "عالیه!",
  "انتخاب درست!",
  "روشنایی ادامه دارد",
  "مصرف درست، مسیر درست",
];
