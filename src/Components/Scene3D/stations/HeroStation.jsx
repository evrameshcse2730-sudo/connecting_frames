import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { rig, focusOf, PALETTE } from "../rig.js";
import { loadLogoTexture } from "../textures.js";

const PERFS = 28; // perforation marks around the reel ring
const FRAMES = 9; // mini film frames orbiting the logo

// Hero: the CF logo as a big 3D medallion — film-reel ring around it,
// a little sun and film frames orbiting, tilting towards the mouse.
export default function HeroStation() {
  const root = useRef();
  const medal = useRef();
  const reel = useRef();
  const orbit = useRef();
  const sun = useRef();
  const base = useMemo(() => focusOf(0), []);
  const logo = useMemo(() => {
    const t = loadLogoTexture();
    t.anisotropy = 8;
    return t;
  }, []);
  const startAt = useRef(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (startAt.current === null) startAt.current = t;
    const wide = rig.aspect > 1;

    // Entrance: grows in and spins once
    const intro = THREE.MathUtils.smoothstep(t - startAt.current, 0, 1.6);

    root.current.position.set(base.x + (wide ? 2.6 : 0), base.y + (wide ? 0.15 : -2.95) + Math.sin(t * 0.9) * 0.08, base.z);
    root.current.scale.setScalar((wide ? 0.85 : 0.46) * (0.6 + intro * 0.4));

    medal.current.rotation.y = (1 - intro) * Math.PI * 2 + rig.mouse.x * 0.35 + Math.sin(t * 0.5) * 0.06;
    medal.current.rotation.x = -rig.mouse.y * 0.25;

    reel.current.rotation.z = -t * 0.18;
    orbit.current.rotation.y = t * 0.35;
    sun.current.position.set(Math.cos(t * 0.6) * 2.5, 1.1 + Math.sin(t * 0.6) * 0.4, Math.sin(t * 0.6) * 1.2);
  });

  return (
    <group ref={root}>
      {/* soft paper halo behind */}
      <mesh position={[0, 0, -0.35]}>
        <circleGeometry args={[2.35, 64]} />
        <meshBasicMaterial color={PALETTE.paperDark} />
      </mesh>

      {/* film-reel ring with perforations, slowly turning */}
      <group ref={reel} position={[0, 0, -0.2]}>
        <mesh>
          <ringGeometry args={[1.82, 2.12, 72]} />
          <meshStandardMaterial color={PALETTE.inkDeep} roughness={0.7} side={THREE.DoubleSide} />
        </mesh>
        {Array.from({ length: PERFS }, (_, i) => {
          const a = (i / PERFS) * Math.PI * 2;
          return (
            <mesh key={i} position={[Math.cos(a) * 1.97, Math.sin(a) * 1.97, 0.01]} rotation={[0, 0, a]}>
              <planeGeometry args={[0.1, 0.07]} />
              <meshBasicMaterial color={PALETTE.paper} />
            </mesh>
          );
        })}
      </group>

      {/* the logo medallion */}
      <group ref={medal}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[1.62, 1.62, 0.16, 72]} />
          <meshStandardMaterial attach="material-0" color={PALETTE.brown} roughness={0.4} metalness={0.4} />
          <meshStandardMaterial attach="material-1" color={PALETTE.brown} roughness={0.5} metalness={0.3} />
          <meshStandardMaterial attach="material-2" color={PALETTE.brown} roughness={0.5} metalness={0.3} />
        </mesh>
        {/* upright logo face (circle UVs keep the artwork the right way up) */}
        <mesh position={[0, 0, 0.081]}>
          <circleGeometry args={[1.6, 72]} />
          <meshBasicMaterial map={logo} toneMapped={false} />
        </mesh>
        <mesh>
          <torusGeometry args={[1.66, 0.07, 14, 72]} />
          <meshStandardMaterial color={PALETTE.brown} roughness={0.35} metalness={0.5} />
        </mesh>
      </group>

      {/* orbiting sun */}
      <mesh ref={sun}>
        <sphereGeometry args={[0.26, 24, 16]} />
        <meshStandardMaterial color={PALETTE.sun} roughness={0.8} emissive={PALETTE.sun} emissiveIntensity={0.25} />
      </mesh>

      {/* mini film frames orbiting on a tilted ring */}
      <group rotation={[0.45, 0, -0.25]}>
        <group ref={orbit}>
          {Array.from({ length: FRAMES }, (_, i) => {
            const a = (i / FRAMES) * Math.PI * 2;
            return (
              <group key={i} position={[Math.cos(a) * 2.75, 0, Math.sin(a) * 2.75]} rotation={[0, -a + Math.PI / 2, 0]}>
                <mesh>
                  <planeGeometry args={[0.42, 0.32]} />
                  <meshStandardMaterial color={PALETTE.inkDeep} roughness={0.8} side={THREE.DoubleSide} />
                </mesh>
                <mesh position={[0, 0, 0.005]}>
                  <planeGeometry args={[0.3, 0.2]} />
                  <meshBasicMaterial color={[PALETTE.sun, PALETTE.sage, PALETTE.brown][i % 3]} side={THREE.DoubleSide} />
                </mesh>
              </group>
            );
          })}
        </group>
      </group>
    </group>
  );
}
