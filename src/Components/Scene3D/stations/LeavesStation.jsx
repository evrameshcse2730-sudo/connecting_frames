import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { rig, focusOf, PALETTE, seededRandom } from "../rig.js";

// About: paper leaves drifting in the air around the text.
export default function LeavesStation({ count }) {
  const group = useRef();
  const leaves = useRef([]);
  const base = useMemo(() => focusOf(2), []);
  const geo = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, -0.4);
    s.quadraticCurveTo(0.32, 0, 0, 0.42);
    s.quadraticCurveTo(-0.32, 0, 0, -0.4);
    return new THREE.ShapeGeometry(s, 6);
  }, []);
  const seeds = useMemo(() => {
    const rand = seededRandom(11);
    return Array.from({ length: count }, (_, i) => ({
        x: (i % 2 ? 1 : -1) * (2.4 + rand() * 2.2),
        y: (rand() - 0.5) * 4,
        z: (rand() - 0.5) * 4,
        speed: 0.3 + rand() * 0.5,
        phase: rand() * Math.PI * 2,
        scale: 0.6 + rand() * 0.8,
        color: [PALETTE.olive, PALETTE.oliveLight, PALETTE.sage, "#7d8a5c"][i % 4],
      }));
  }, [count]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const wide = rig.aspect > 1;
    group.current.position.set(base.x, base.y, base.z);
    leaves.current.forEach((l, i) => {
      if (!l) return;
      const s = seeds[i];
      // On phones keep leaves to the edges so text stays readable
      const x = wide ? s.x : Math.sign(s.x) * (1.6 + Math.abs(s.x) * 0.25);
      l.position.set(x + Math.sin(t * s.speed + s.phase) * 0.3, s.y + Math.sin(t * s.speed * 0.7 + s.phase) * 0.5, s.z);
      l.rotation.set(Math.sin(t * s.speed + s.phase) * 0.8, t * s.speed * 0.6 + s.phase, Math.cos(t * s.speed) * 0.6);
    });
  });

  return (
    <group ref={group}>
      {seeds.map((s, i) => (
        <mesh key={i} ref={(el) => (leaves.current[i] = el)} geometry={geo} scale={s.scale}>
          <meshStandardMaterial color={s.color} roughness={1} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
}
