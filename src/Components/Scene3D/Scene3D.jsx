import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { PALETTE, STATIONS } from "./rig.js";
import CameraRig from "./world/CameraRig.jsx";
import FilmStrip from "./world/FilmStrip.jsx";
import Dust from "./world/Dust.jsx";
import { FrameDriver, FpsGuard } from "./world/Performance.jsx";
import HeroStation from "./stations/HeroStation.jsx";
import ApertureStation from "./stations/ApertureStation.jsx";
import LeavesStation from "./stations/LeavesStation.jsx";
import ReelsStation from "./stations/ReelsStation.jsx";
import ServicesStation from "./stations/ServicesStation.jsx";
import CinemaStation from "./stations/CinemaStation.jsx";
import PlaneStation from "./stations/PlaneStation.jsx";
import SunsetStation from "./stations/SunsetStation.jsx";
import "./Scene3D.css";

// The 3D world behind the page. The normal HTML sections stay on top
// (readable, searchable, admin-editable); this only adds the scenery.
export default function Scene3D({ quality, content, onTooSlow }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!ready) return;
    document.body.classList.add("has-3d", `has-3d-${quality.tier}`);
    return () => document.body.classList.remove("has-3d", `has-3d-${quality.tier}`);
  }, [ready, quality.tier]);

  const reel = content.work.items.find((i) => i.type === "video");

  return (
    <div className={`scene3d ${ready ? "is-ready" : ""}`} aria-hidden="true">
      <Canvas
        dpr={quality.dpr}
        frameloop="demand"
        gl={{ antialias: quality.antialias, powerPreference: "high-performance", alpha: false }}
        camera={{ fov: 50, near: 0.1, far: 60, position: STATIONS[0].toArray() }}
        onCreated={({ gl }) => {
          gl.setClearColor(PALETTE.paper);
          // Show the world after its first frames are drawn
          requestAnimationFrame(() => requestAnimationFrame(() => setReady(true)));
        }}
      >
        <color attach="background" args={[PALETTE.paper]} />
        <fog attach="fog" args={[PALETTE.paper, 7, 20]} />
        <hemisphereLight args={["#fffaf0", PALETTE.olive, 1.5]} />
        <directionalLight position={[4, 6, 5]} intensity={1.4} />

        <FrameDriver fps={quality.fps} />
        <FpsGuard fps={quality.fps} onTooSlow={onTooSlow} />
        <CameraRig />

        <FilmStrip segments={quality.tier === "low" ? 360 : 700} />
        <Dust count={quality.dust} />

        <HeroStation />
        <ApertureStation />
        <LeavesStation count={quality.leaves} />
        <ReelsStation />
        <ServicesStation />
        <CinemaStation videoUrl={reel?.url} allowVideo={quality.video} />
        <PlaneStation />
        <SunsetStation />
      </Canvas>
    </div>
  );
}
