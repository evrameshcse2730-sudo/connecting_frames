import * as THREE from "three";

// Shared, mutable state for the 3D world (kept outside React so scrolling
// and mouse moves never cause re-renders).
export const rig = {
  t: 0, // camera position along the path, 0..1
  velocity: 0, // how fast the camera is moving (for spinning reels etc.)
  mouse: new THREE.Vector2(0, 0), // -1..1, smoothed
  aspect: 1, // canvas width / height
};

// Camera stops — one per page section, in page order:
// hero, story, about, stats, services, work, contact, footer
export const STATIONS = [
  [0, 0, 8],
  [1.2, -0.4, -8],
  [-1, 0.5, -24],
  [1, -0.3, -40],
  [-0.8, 0.3, -56],
  [0.4, 0, -72],
  [-1, 0.4, -88],
  [0, 1, -102],
].map((p) => new THREE.Vector3(...p));

export const SECTION_SELECTORS = [".hero", ".story-line", ".about", ".stats", ".services", ".work", ".contact", "footer"];

export const cameraPath = new THREE.CatmullRomCurve3(STATIONS, false, "centripetal");

// Point the camera looks at while parked at station i
export const focusOf = (i, ahead = 7) => STATIONS[i].clone().add(new THREE.Vector3(0, 0, -ahead));

// Position on the camera path at a fractional station (e.g. 1.5 = halfway between 1 and 2)
export const pathAtStation = (s) => cameraPath.getPoint(THREE.MathUtils.clamp(s / (STATIONS.length - 1), 0, 1));

// The film strip runs along the lower-right edge of the whole journey, gently
// waving and twisting — it frames the page but never crosses the text.
export const stripPath = (() => {
  const pts = [];
  const steps = 48;
  for (let i = -1; i <= steps + 1; i++) {
    const t = THREE.MathUtils.clamp(i / steps, 0, 1);
    const p = cameraPath.getPoint(t);
    pts.push(
      new THREE.Vector3(
        p.x + 5.4 + Math.sin(i * 0.9) * 0.6,
        p.y - 2.3 + Math.sin(i * 0.55) * 0.7,
        p.z - 4 + (i < 0 ? 8 : 0) - (i > steps ? 12 : 0)
      )
    );
  }
  return new THREE.CatmullRomCurve3(pts, false, "centripetal");
})();

// Deterministic random (same scene on every render/visit)
export function seededRandom(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const PALETTE = {
  paper: "#f4eee2",
  paperDark: "#e8dfd0",
  ink: "#393630",
  inkDeep: "#2b2723",
  olive: "#6b715d",
  oliveLight: "#8a8f78",
  sage: "#a9ad97",
  brown: "#b0834e",
  sun: "#d98a4a",
};
