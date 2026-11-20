import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { rig, cameraPath, SECTION_SELECTORS, STATIONS } from "../rig.js";

// Maps page scroll to a position on the camera path, so the camera arrives at
// each section's 3D scene when that section is on screen.
export default function CameraRig() {
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);
  const state = useRef({ target: 0, current: 0, mouseTarget: new THREE.Vector2() });

  useEffect(() => {
    rig.aspect = size.width / size.height;
  }, [size]);

  useEffect(() => {
    let marks = [];
    const last = STATIONS.length - 1;

    const measure = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      let prev = 0;
      marks = SECTION_SELECTORS.map((sel, i) => {
        const el = document.querySelector(sel);
        if (i === 0 || !el) return (prev = i === 0 ? 0 : prev);
        // Arrive when the section is ~30% down the screen
        const top = el.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.3;
        prev = Math.max(prev, THREE.MathUtils.clamp(top / max, 0, 1));
        return prev;
      });
      marks[last] = Math.max(marks[last], marks[last - 1]);
      onScroll();
    };

    const onScroll = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const p = THREE.MathUtils.clamp(window.scrollY / max, 0, 1);
      let s = 0;
      for (let i = 0; i < last; i++) {
        if (p >= marks[i]) {
          const span = marks[i + 1] - marks[i];
          s = span > 0 ? i + Math.min(1, (p - marks[i]) / span) : i + 1;
        }
      }
      if (p >= 0.999) s = last;
      state.current.target = s / last;
    };

    const onPointer = (e) => {
      state.current.mouseTarget.set((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1);
    };

    measure();
    // Page height changes as fonts/images/content load — re-measure a few times
    const timers = [400, 1200, 2500, 5000].map((ms) => setTimeout(measure, ms));
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    window.addEventListener("pointermove", onPointer, { passive: true });
    return () => {
      timers.forEach(clearTimeout);
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
      window.removeEventListener("pointermove", onPointer);
    };
  }, []);

  const pos = new THREE.Vector3();
  const ahead = new THREE.Vector3();
  const behind = new THREE.Vector3();
  const dir = new THREE.Vector3();
  const forward = new THREE.Vector3(0, 0, -1);
  const noHover = useRef(window.matchMedia("(hover: none)").matches);

  useFrame((frame, dt) => {
    const s = state.current;
    const step = Math.min(1, dt * 3.2);
    const before = s.current;
    s.current += (s.target - s.current) * step;
    rig.t = s.current;
    rig.velocity = (s.current - before) / Math.max(dt, 0.001);

    // Touch screens have no hover: drift gently instead
    if (noHover.current) {
      const t = frame.clock.elapsedTime;
      s.mouseTarget.set(Math.sin(t * 0.3) * 0.35, Math.cos(t * 0.23) * 0.25);
    }
    rig.mouse.lerp(s.mouseTarget, Math.min(1, dt * 2.5));

    cameraPath.getPoint(s.current, pos);
    cameraPath.getPoint(Math.min(1, s.current + 0.01), ahead);
    cameraPath.getPoint(Math.max(0, s.current - 0.01), behind);
    dir.subVectors(ahead, behind);
    if (dir.lengthSq() < 1e-6) dir.set(0, 0, -1);
    dir.normalize().lerp(forward, 0.5).normalize();

    camera.position.set(pos.x + rig.mouse.x * 0.45, pos.y + rig.mouse.y * 0.3, pos.z);
    camera.lookAt(pos.x + dir.x * 8 + rig.mouse.x * 0.25, pos.y + dir.y * 8 + rig.mouse.y * 0.15, pos.z + dir.z * 8);
  });

  return null;
}
