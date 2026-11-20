import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { rig, focusOf, PALETTE } from "../rig.js";

function Reel({ innerRef, color }) {
  return (
    <group ref={innerRef}>
      <mesh>
        <torusGeometry args={[1, 0.09, 10, 48]} />
        <meshStandardMaterial color={color} roughness={0.5} metalness={0.3} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.22, 0.22, 0.2, 24]} />
        <meshStandardMaterial color={PALETTE.ink} roughness={0.6} />
      </mesh>
      {Array.from({ length: 5 }, (_, i) => (
        <mesh key={i} rotation={[0, 0, (i / 5) * Math.PI * 2]} position={[0, 0, 0]}>
          <boxGeometry args={[0.07, 1.9, 0.06]} />
          <meshStandardMaterial color={color} roughness={0.5} metalness={0.3} />
        </mesh>
      ))}
      {/* film wound on the reel */}
      <mesh>
        <torusGeometry args={[0.6, 0.28, 8, 40]} />
        <meshStandardMaterial color={PALETTE.inkDeep} roughness={0.9} />
      </mesh>
    </group>
  );
}

// Stats: film reels that spin faster when you scroll.
export default function ReelsStation() {
  const group = useRef();
  const reels = useRef([]);
  const base = useMemo(() => focusOf(3), []);
  const spin = useRef(0);

  useFrame((_, dt) => {
    const wide = rig.aspect > 1;
    group.current.position.set(base.x, base.y, base.z);
    spin.current += dt * (0.4 + Math.min(Math.abs(rig.velocity) * 60, 6));
    const layout = wide
      ? [[-4, 1.4, 0, 1], [4.1, -1.2, -1, 1.3], [3.2, 2.2, -2.5, 0.7]]
      : [[-2.0, 0.4, -1, 0.6], [2.0, -1.9, -1, 0.7], [2.2, 1.5, -2.5, 0.45]]; // phones: peeking in from the edges
    reels.current.forEach((r, i) => {
      if (!r) return;
      const [x, y, z, s] = layout[i];
      r.position.set(x, y, z);
      r.scale.setScalar(s);
      r.rotation.z = spin.current * (i % 2 ? -1 : 1) * (1 + i * 0.3);
      r.rotation.y = rig.mouse.x * 0.4;
    });
  });

  return (
    <group ref={group}>
      {[PALETTE.brown, PALETTE.olive, PALETTE.ink].map((c, i) => (
        <Reel key={i} color={c} innerRef={(el) => (reels.current[i] = el)} />
      ))}
    </group>
  );
}
