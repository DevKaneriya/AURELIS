import { Suspense, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { useProgress } from "@react-three/drei";
import Car from "./VehicleModel";
import Atmosphere from "./Atmosphere";
import CameraRig from "./CameraRig";
import Effects from "./Effects";
import { useStore } from "@/store";
import { isMobile as isMobileFn, prefersReducedMotion } from "@/lib/device";

function ReadySignal() {
  const { active } = useProgress();
  const setLoaded = useStore((s) => s.setLoaded);
  useEffect(() => {
    if (!active) {
      const id = setTimeout(() => setLoaded(true), 400);
      return () => clearTimeout(id);
    }
  }, [active, setLoaded]);
  return null;
}

export default function Scene() {
  const mobile = isMobileFn();
  const reduced = prefersReducedMotion();
  const finish = useStore((s) => s.finish) || "obsidian";
  const accent = useStore((s) => s.accent) || "#ff4400";
  const wheel = useStore((s) => s.wheel) || "performance";

  return (
    <Canvas
      dpr={[1, mobile ? 1.5 : 2]}
      shadows={!mobile}
      gl={{
        antialias: true,
        powerPreference: "high-performance",
        alpha: false,
      }}
      camera={{ position: [0, 2.4, 14], fov: 40, near: 0.1, far: 100 }}
    >
      <color attach="background" args={["#030304"]} />
      <Suspense fallback={null}>
        <Atmosphere mobile={mobile} reduced={reduced} />
        <Car finish={finish} accent={accent} wheel={wheel} />
        <CameraRig reduced={reduced} />
        {!reduced && <Effects mobile={mobile} />}
        <ReadySignal />
      </Suspense>
    </Canvas>
  );
}
