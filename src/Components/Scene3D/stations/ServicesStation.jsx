import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { rig, focusOf, PALETTE } from "../rig.js";

const extrude = (shape, depth = 0.25) =>
  new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: true, bevelThickness: 0.04, bevelSize: 0.04, bevelSegments: 2 }).center();

// Services: three floating symbols — play (video), browser (web), star (stories).
export default function ServicesStation() {
  const group = useRef();
  const items = useRef([]);
  const base = useMemo(() => focusOf(4), []);
  const geos = useMemo(() => {
    const play = new THREE.Shape();
    play.moveTo(-0.45, -0.55);
    play.lineTo(0.6, 0);
    play.lineTo(-0.45, 0.55);
    play.lineTo(-0.45, -0.55);

    const star = new THREE.Shape();
    for (let i = 0; i < 8; i++) {
      const r = i % 2 ? 0.2 : 0.7;
      const a = (i / 8) * Math.PI * 2 + Math.PI / 2;
      if (i === 0) star.moveTo(Math.cos(a) * r, Math.sin(a) * r);
      else star.lineTo(Math.cos(a) * r, Math.sin(a) * r);
    }
    return { play: extrude(play), star: extrude(star) };
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const wide = rig.aspect > 1;
    group.current.position.set(base.x, base.y, base.z);
    const layout = wide
      ? [[2.3, 1.75, 0], [3.7, 1.3, -0.6], [5.1, 1.85, -1.2]]
      : [[0.6, 2.9, -1], [1.5, 2.55, -1.6], [2.4, 2.95, -2.2]];
    items.current.forEach((m, i) => {
      if (!m) return;
      const [x, y, z] = layout[i];
      m.position.set(x, y + Math.sin(t * 1.1 + i) * 0.15, z);
      m.rotation.y = Math.sin(t * 0.6 + i) * 0.5 + rig.mouse.x * 0.6;
      m.rotation.x = rig.mouse.y * -0.4;
      m.scale.setScalar(wide ? 0.62 : 0.45);
    });
  });

  return (
    <group ref={group}>
      <mesh ref={(el) => (items.current[0] = el)} geometry={geos.play}>
        <meshStandardMaterial color={PALETTE.brown} roughness={0.5} metalness={0.1} />
      </mesh>

      <group ref={(el) => (items.current[1] = el)}>
        <mesh>
          <boxGeometry args={[1.5, 1.05, 0.12]} />
          <meshStandardMaterial color={PALETTE.paper} roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.42, 0.07]}>
          <boxGeometry args={[1.5, 0.2, 0.04]} />
          <meshStandardMaterial color={PALETTE.ink} roughness={0.8} />
        </mesh>
        {[-0.6, -0.48, -0.36].map((x) => (
          <mesh key={x} position={[x, 0.42, 0.1]}>
            <circleGeometry args={[0.035, 12]} />
            <meshBasicMaterial color={PALETTE.paper} />
          </mesh>
        ))}
        {[0.12, -0.08, -0.28].map((y, i) => (
          <mesh key={y} position={[-0.15 + i * 0.05, y, 0.07]}>
            <boxGeometry args={[1 - i * 0.2, 0.07, 0.02]} />
            <meshStandardMaterial color={PALETTE.sage} roughness={1} />
          </mesh>
        ))}
      </group>

      <mesh ref={(el) => (items.current[2] = el)} geometry={geos.star}>
        <meshStandardMaterial color={PALETTE.olive} roughness={0.5} metalness={0.1} />
      </mesh>
    </group>
  );
}
