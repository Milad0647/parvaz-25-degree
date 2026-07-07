const MUSIC_SRC = "/music/music.mp3";

// Temporarily disabled — testing tap input performance.
/*
const TAP_SRC = "/music/Tap.mp3";
const TAP_POOL_SIZE = 4;

let tapPool: HTMLAudioElement[] = [];
let tapPoolIndex = 0;

function ensureTapPool(): void {
  if (tapPool.length > 0) return;

  tapPool = Array.from({ length: TAP_POOL_SIZE }, () => {
    const audio = new Audio(TAP_SRC);
    audio.volume = 0.5;
    audio.preload = "auto";
    return audio;
  });
}
*/

let musicAudio: HTMLAudioElement | null = null;
function getMusicAudio(): HTMLAudioElement {
  if (!musicAudio) {
    musicAudio = new Audio(MUSIC_SRC);
    musicAudio.loop = true;
    musicAudio.volume = 0.175;
    musicAudio.preload = "auto";
  }
  return musicAudio;
}

export function preloadAudio(): void {
  // ensureTapPool();
  void getMusicAudio().load();
}

/** Play tap SFX on next frame so input stays responsive. */
export function playTapSound(): void {
  // Temporarily disabled — testing tap input performance.
  /*
  requestAnimationFrame(() => {
    try {
      ensureTapPool();
      const audio = tapPool[tapPoolIndex % TAP_POOL_SIZE];
      tapPoolIndex += 1;
      audio.currentTime = 0;
      void audio.play();
    } catch {
      // Autoplay restrictions — ignore silently
    }
  });
  */
}

/** Start or resume looped background music without resetting playback. */
export function startBackgroundMusic(): void {
  try {
    const audio = getMusicAudio();
    if (audio.paused) {
      void audio.play();
    }
  } catch {
    // Autoplay restrictions — ignore silently
  }
}

export function stopBackgroundMusic(): void {
  if (!musicAudio) return;
  musicAudio.pause();
  musicAudio.currentTime = 0;
}
