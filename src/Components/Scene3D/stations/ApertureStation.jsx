import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { pathAtStation, PALETTE } from "../rig.js";

const BLADES = 8;

// Story → About: a camera-lens iris that opens as you scroll, and you fly through it.
export default function ApertureStation() {
  const root = useRef();
  const blades = useRef([]);
  const ring = useRef();
  const center = useMemo(() => pathAtStation(1.45), []);
  const bladeGeo = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 0);
    s.lineTo(2.6, -0.35);
    s.quadraticCurveTo(2.9, 0.6, 2.4, 1.4);
    s.lineTo(0, 0);
    return new THREE.ShapeGeometry(s, 8);
  }, []);
  const plateGeo = useMemo(() => new THREE.RingGeometry(2.45, 7, 64), []);

  useFrame((state) => {
    // 0 = closed, 1 = fully open, based on how close the camera is
    const dz = state.camera.position.z - center.z;
    // Hidden while far away; grows into view as the camera approaches
    const appear = THREE.MathUtils.smoothstep(16 - dz, 0, 5);
    root.current.visible = appear > 0.01 && dz > -3;
    root.current.scale.setScalar(0.6 + appear * 0.4);
    const open = THREE.MathUtils.smoothstep(1 - (dz - 1.5) / 8, 0, 1);
    blades.current.forEach((b, i) => {
      if (!b) return;
      const a = (i / BLADES) * Math.PI * 2 + open * 0.9;
      b.rotation.z = a;
      const r = open * 2.3;
      b.position.set(Math.cos(a + 0.4) * r, Math.sin(a + 0.4) * r, i * 0.004);
    });
    ring.current.rotation.z = open * 1.2 + state.clock.elapsedTime * 0.05;
  });

  return (
    <group ref={root} position={center}>
      <mesh geometry={plateGeo}>
        <meshStandardMaterial color={PALETTE.paper} roughness={1} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={ring}>
        <torusGeometry args={[2.45, 0.12, 12, 64]} />
        <meshStandardMaterial color={PALETTE.ink} roughness={0.6} metalness={0.2} />
      </mesh>
      {Array.from({ length: BLADES }, (_, i) => (
        <mesh key={i} ref={(el) => (blades.current[i] = el)} geometry={bladeGeo}>
          <meshStandardMaterial color={i % 2 ? PALETTE.inkDeep : PALETTE.ink} roughness={0.7} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
}
