/** Lower canvas DPR on touch devices to keep frame rate stable. */
export function getCanvasDpr(): number {
  const deviceRatio = window.devicePixelRatio || 1;

  if (isCoarsePointer()) {
    return Math.min(deviceRatio, 1);
  }

  return Math.min(deviceRatio, 2);
}

export function isCoarsePointer(): boolean {
  return window.matchMedia("(pointer: coarse)").matches;
}

/** Aggressive mobile rendering profile for smoother gameplay. */
export function isMobilePerfMode(): boolean {
  return isCoarsePointer();
}
