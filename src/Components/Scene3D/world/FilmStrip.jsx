import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { stripPath } from "../rig.js";
import { filmStripTexture, FRAME_ASPECT } from "../textures.js";

// The "connecting" film strip that winds through the whole world, twisting as it goes.
export default function FilmStrip({ width = 1.1, twists = 5, segments = 700 }) {
  const { geometry, texture } = useMemo(() => {
    const frames = stripPath.computeFrenetFrames(segments, false);
    const length = stripPath.getLength();
    const frameLen = width * FRAME_ASPECT;
    const positions = [];
    const uvs = [];
    const index = [];
    const p = new THREE.Vector3();
    const side = new THREE.Vector3();

    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      stripPath.getPointAt(t, p);
      const angle = t * Math.PI * 2 * twists;
      side.copy(frames.normals[i]).multiplyScalar(Math.cos(angle)).addScaledVector(frames.binormals[i], Math.sin(angle));
      positions.push(p.x - side.x * width * 0.5, p.y - side.y * width * 0.5, p.z - side.z * width * 0.5);
      positions.push(p.x + side.x * width * 0.5, p.y + side.y * width * 0.5, p.z + side.z * width * 0.5);
      const v = (t * length) / (frameLen * 4);
      uvs.push(0, v, 1, v);
      if (i < segments) {
        const a = i * 2;
        index.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geo.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
    geo.setIndex(index);
    geo.computeVertexNormals();
    return { geometry: geo, texture: filmStripTexture() };
  }, [width, twists, segments]);

  // Film slowly runs through the projector
  const material = useRef();
  useFrame((_, dt) => {
    if (material.current?.map) material.current.map.offset.y -= dt * 0.04;
  });

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial ref={material} map={texture} side={THREE.DoubleSide} roughness={0.75} metalness={0.05} />
    </mesh>
  );
}
