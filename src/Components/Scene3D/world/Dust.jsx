import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { PALETTE, seededRandom } from "../rig.js";

// Floating dust specks in the projector light along the whole path
export default function Dust({ count }) {
  const ref = useRef();
  const geometry = useMemo(() => {
    const rand = seededRandom(7);
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (rand() - 0.5) * 16;
      pos[i * 3 + 1] = (rand() - 0.5) * 10;
      pos[i * 3 + 2] = 12 - rand() * 125;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return g;
  }, [count]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    ref.current.position.y = Math.sin(t * 0.15) * 0.4;
    ref.current.position.x = Math.cos(t * 0.1) * 0.3;
  });

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial color={PALETTE.ink} size={0.05} sizeAttenuation transparent opacity={0.45} depthWrite={false} />
    </points>
  );
}
