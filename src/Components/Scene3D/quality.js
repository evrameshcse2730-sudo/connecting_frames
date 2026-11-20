// Decides whether this device gets the 3D world, and at what quality.
// Returns null for devices that should keep the plain (non-3D) design.

export function detectQuality() {
  try {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return null;
    const net = navigator.connection;
    if (net && (net.saveData || /(^|-)2g|3g/.test(net.effectiveType || ""))) return null;

    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
    if (!gl) return null;

    const cores = navigator.hardwareConcurrency || 4;
    const memory = navigator.deviceMemory || 4; // GB (Chrome/Android only)
    const smallScreen = Math.min(window.innerWidth, window.innerHeight) < 600;

    // Very weak devices keep the normal site
    if (cores <= 2 || memory <= 1) return null;

    if (smallScreen || cores <= 4 || memory <= 2) {
      return { tier: "low", dpr: [1, 1.25], fps: 30, dust: 90, leaves: 8, antialias: false, video: false };
    }
    return { tier: "high", dpr: [1, 1.75], fps: 60, dust: 260, leaves: 16, antialias: true, video: true };
  } catch {
    return null;
  }
}
