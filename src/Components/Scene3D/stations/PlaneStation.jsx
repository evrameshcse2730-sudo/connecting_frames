import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { rig, PALETTE, STATIONS } from "../rig.js";

// Contact: a paper plane loops in front of the camera — "send me a message".
// It flies along with the camera through the last sections so it's always in view.
export default function PlaneStation() {
  const plane = useRef();
  const geo = useMemo(() => {
    // nose at +x, two wings and a keel
    const v = [
      0.9, 0, 0, -0.6, 0, 0.55, -0.45, 0.06, 0, // left wing
      0.9, 0, 0, -0.45, 0.06, 0, -0.6, 0, -0.55, // right wing
      0.9, 0, 0, -0.45, 0.06, 0, -0.5, -0.22, 0, // keel
    ];
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(v, 3));
    g.computeVertexNormals();
    return g;
  }, []);
  const p = useMemo(() => new THREE.Vector3(), []);
  const next = useMemo(() => new THREE.Vector3(), []);
  const from = 5.5 / (STATIONS.length - 1);

  const at = (t, wide, out) => {
    const rx = wide ? 3.6 : 1.3;
    return out.set(Math.sin(t) * rx, Math.sin(t * 2) * 0.9 + (wide ? 0.4 : 2.2), Math.cos(t) * 1.6 - 7);
  };

  useFrame((state) => {
    const show = rig.t > from;
    plane.current.visible = show;
    if (!show) return;
    const t = state.clock.elapsedTime * 0.5;
    const wide = rig.aspect > 1;
    const cam = state.camera.position;
    at(t, wide, p).add(cam);
    at(t + 0.05, wide, next).add(cam);
    plane.current.position.copy(p);
    plane.current.lookAt(next);
    plane.current.rotateY(-Math.PI / 2);
    plane.current.rotateX(Math.sin(t * 2) * 0.4);
    plane.current.scale.setScalar(wide ? 0.9 : 0.6);
  });

  return (
    <mesh ref={plane} geometry={geo}>
      <meshStandardMaterial color={PALETTE.sun} roughness={0.9} side={THREE.DoubleSide} flatShading />
    </mesh>
  );
}
