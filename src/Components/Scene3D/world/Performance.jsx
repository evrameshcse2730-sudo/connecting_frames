import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";

// Drives rendering at a capped frame rate (30fps on low-end devices saves battery
// and keeps scrolling smooth), and stops when the tab is hidden.
export function FrameDriver({ fps }) {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    let id;
    let last = 0;
    const minGap = 1000 / fps - 2;
    const loop = (t) => {
      id = requestAnimationFrame(loop);
      if (document.hidden) return;
      if (t - last >= minGap) {
        last = t;
        invalidate();
      }
    };
    id = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(id);
  }, [fps, invalidate]);
  return null;
}

// Watches real frame rate. If the device struggles: first lower the resolution,
// and if it still can't keep up, switch the 3D world off (plain site stays).
export function FpsGuard({ fps, onTooSlow }) {
  const setDpr = useThree((s) => s.setDpr);
  const s = useRef({ start: 0, last: 0, frames: 0, sum: 0, downgraded: false, strikes: 0 });

  useFrame(() => {
    const now = performance.now();
    const st = s.current;
    if (!st.start) st.start = now;
    // Only judge while the visitor is actually looking at the page
    if (document.hidden || !document.hasFocus() || now - st.start < 1500) {
      st.last = now;
      return; // warm-up (shader compile, textures) or not visible
    }
    const gap = now - st.last;
    // Ignore pauses (tab switched, window covered) — they aren't slowness
    if (st.last && gap < 250) {
      st.sum += gap;
      st.frames += 1;
    }
    st.last = now;
    if (st.frames < 60) return;

    const measured = 1000 / (st.sum / st.frames);
    st.frames = 0;
    st.sum = 0;
    if (measured >= fps * 0.75) {
      st.strikes = 0;
      return;
    }

    if (!st.downgraded) {
      st.downgraded = true;
      setDpr(1);
      st.start = now; // re-measure after the change
    } else if (measured < Math.min(22, fps * 0.6)) {
      // Three slow checks in a row (≈6s) before giving up on 3D
      st.strikes += 1;
      if (st.strikes >= 3) onTooSlow();
    } else {
      st.strikes = 0;
    }
  });
  return null;
}
