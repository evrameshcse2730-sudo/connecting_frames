import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { rig, focusOf, PALETTE, STATIONS } from "../rig.js";
import { loadLogoTexture } from "../textures.js";

// Portfolio: a cinema screen playing your reel, with frames orbiting around it.
// The video only loads when the camera gets close (and never on low-end devices).
export default function CinemaStation({ videoUrl, allowVideo }) {
  const group = useRef();
  const screen = useRef();
  const orbit = useRef();
  const base = useMemo(() => focusOf(5), []);
  const logo = useMemo(() => loadLogoTexture(), []);
  const [near, setNear] = useState(false);
  const [videoTex, setVideoTex] = useState(null);
  const station = 5 / (STATIONS.length - 1);
  const window_ = 1.2 / (STATIONS.length - 1);

  useEffect(() => {
    if (!near || !allowVideo || !videoUrl || !/^https:\/\//.test(videoUrl)) return;
    const v = document.createElement("video");
    v.crossOrigin = "anonymous";
    v.src = videoUrl;
    v.muted = true;
    v.loop = true;
    v.playsInline = true;
    v.preload = "auto";
    const tex = new THREE.VideoTexture(v);
    tex.colorSpace = THREE.SRGBColorSpace;
    const onReady = () => setVideoTex(tex);
    v.addEventListener("canplay", onReady, { once: true });
    v.play().catch(() => {});
    return () => {
      v.pause();
      v.removeAttribute("src");
      v.load();
      tex.dispose();
      setVideoTex(null);
    };
  }, [near, allowVideo, videoUrl]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const wide = rig.aspect > 1;
    const isNear = Math.abs(rig.t - station) < window_;
    if (isNear !== near) setNear(isNear);

    // Upper-right, softly faded like a projection on the wall behind the heading
    group.current.position.set(base.x + (wide ? 3.2 : 0.9), base.y + (wide ? 1.4 : 3.3), base.z - 4);
    group.current.scale.setScalar(wide ? 0.75 : 0.32);
    orbit.current.visible = wide; // no orbiting frames on phones (keeps the heading clear)
    screen.current.rotation.y = rig.mouse.x * 0.15;
    screen.current.rotation.x = rig.mouse.y * -0.08;
    orbit.current.rotation.y = t * 0.25;
  });

  return (
    <group ref={group}>
      <group ref={screen}>
        <mesh position={[0, 0, -0.08]}>
          <boxGeometry args={[6.9, 4.1, 0.12]} />
          <meshStandardMaterial color={PALETTE.ink} roughness={0.7} transparent opacity={0.5} />
        </mesh>
        <mesh>
          <planeGeometry args={[6.4, 3.6]} />
          {videoTex ? (
            <meshBasicMaterial map={videoTex} toneMapped={false} transparent opacity={0.55} />
          ) : (
            <meshStandardMaterial color={PALETTE.paperDark} map={logo} roughness={1} transparent opacity={0.6} />
          )}
        </mesh>
      </group>
      <group ref={orbit}>
        {Array.from({ length: 6 }, (_, i) => {
          const a = (i / 6) * Math.PI * 2;
          return (
            <mesh key={i} position={[Math.cos(a) * 7.5, Math.sin(i * 1.7) * 2.2, Math.sin(a) * 2.5]} rotation={[0, -a, 0]}>
              <planeGeometry args={[0.9, 0.65]} />
              <meshStandardMaterial
                color={[PALETTE.brown, PALETTE.olive, PALETTE.sun][i % 3]}
                roughness={1}
                side={THREE.DoubleSide}
              />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}
