const TAP_SRC = "/music/Tap.mp3";
const MUSIC_SRC = "/music/music.mp3";

let tapAudio: HTMLAudioElement | null = null;
let musicAudio: HTMLAudioElement | null = null;

function getTapAudio(): HTMLAudioElement {
  if (!tapAudio) {
    tapAudio = new Audio(TAP_SRC);
    tapAudio.volume = 0.55;
  }
  return tapAudio;
}

function getMusicAudio(): HTMLAudioElement {
  if (!musicAudio) {
    musicAudio = new Audio(MUSIC_SRC);
    musicAudio.loop = true;
    musicAudio.volume = 0.35;
  }
  return musicAudio;
}

export function playTapSound(): void {
  try {
    const audio = getTapAudio();
    audio.currentTime = 0;
    void audio.play();
  } catch {
    // Autoplay restrictions — ignore silently
  }
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
