import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { rig, focusOf, PALETTE, STATIONS } from "../rig.js";

// Footer: the sun sets behind the hills as you reach the end.
export default function SunsetStation() {
  const sun = useRef();
  const base = useMemo(() => focusOf(7, 10), []);
  const hills = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-14, -6);
    for (let i = 0; i <= 14; i++) s.lineTo(-14 + i * 2, -1.6 + Math.sin(i * 1.3) * 0.5);
    s.lineTo(14, -6);
    s.lineTo(-14, -6);
    return new THREE.ShapeGeometry(s);
  }, []);
  const start = 6 / (STATIONS.length - 1);

  useFrame(() => {
    const k = THREE.MathUtils.clamp((rig.t - start) / (1 - start), 0, 1);
    sun.current.position.y = 1.6 - k * 2.6;
  });

  return (
    <group position={base}>
      <mesh ref={sun} position={[0, 1.6, -1]}>
        <circleGeometry args={[1.5, 48]} />
        <meshBasicMaterial color={PALETTE.sun} />
      </mesh>
      <mesh geometry={hills}>
        <meshStandardMaterial color={PALETTE.olive} roughness={1} />
      </mesh>
    </group>
  );
}
