"use client";

export function ReadyOverlay() {
  return (
    <div className="ready-overlay">
      <img
        src="/icon/tap.webp"
        alt="برای شروع لمس کن"
        className="ready-tap-image ready-tap-bounce"
        draggable={false}
      />
    </div>
  );
}
