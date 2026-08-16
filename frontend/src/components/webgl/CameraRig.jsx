import { useMemo, useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { scrollState, pointer } from "@/lib/scrollState";
import { useStore, NAV } from "@/store";

// Cinematic scroll-driven camera path.
const PATH = [
  new THREE.Vector3(0, 1.4, 10.5),
  new THREE.Vector3(3.2, 1.05, 6.5),
  new THREE.Vector3(5.4, 1.2, 0.6),
  new THREE.Vector3(2.2, 2.7, -5.6),
  new THREE.Vector3(-4.4, 1.35, -3.4),
  new THREE.Vector3(0, 1.9, 11.5),
];

const V = (x, y, z) => new THREE.Vector3(x, y, z);

const MENU_POSES = {
  default: V(5.0, 2.1, 5.4),
  experience: V(3.4, 1.1, 6.2),
  material: V(2.4, 0.7, 4.8),
  performance: V(7.6, 0.9, 0.6),
  machine: V(1.6, 1.9, 4.4),
  configurator: V(5.2, 1.2, 6.0),
  design: V(0, 2.8, 7.4),
  contact: V(0, 1.6, 9.5),
};

const CONFIG_POSE = V(5.4, 1.15, 6.2);
const PERF_POSE = V(8.0, 0.75, 0.5);

const MACHINE_POSES = {
  energy: V(-4.8, 1.1, 4.6),
  intelligence: V(3.2, 1.35, 4.4),
  thermal: V(6.0, 0.85, 2.6),
  structure: V(0.2, 3.4, 5.6),
  aerodynamics: V(-5.6, 1.0, 3.2),
};

export default function CameraRig({ reduced = false }) {
  const { camera } = useThree();
  const curve = useMemo(() => new THREE.CatmullRomCurve3(PATH, false, "catmullrom", 0.5), []);
  const lookTarget = useRef(new THREE.Vector3(0, 0.55, 0));
  const desired = useMemo(() => new THREE.Vector3(), []);
  const tmp = useMemo(() => new THREE.Vector3(), []);

  const menuOpen = useStore((s) => s.menuOpen);
  const menuHover = useStore((s) => s.menuHover);
  const sceneMode = useStore((s) => s.sceneMode);
  const machineSystem = useStore((s) => s.machineSystem);

  useFrame(() => {
    let pose = null;
    let lookY = 0.55;

    if (menuOpen) {
      pose = MENU_POSES[menuHover] || MENU_POSES.default;
      lookY = 0.6;
    } else if (sceneMode === "configurator") {
      pose = CONFIG_POSE;
      lookY = 0.5;
    } else if (sceneMode === "performance") {
      pose = PERF_POSE;
      lookY = 0.55;
    } else if (sceneMode === "machine") {
      pose = MACHINE_POSES[machineSystem] || MACHINE_POSES.energy;
      lookY = 0.55;
    }

    if (pose) {
      desired.copy(pose);
      if (!reduced) {
        pointer.sx += (pointer.x - pointer.sx) * 0.04;
        pointer.sy += (pointer.y - pointer.sy) * 0.04;
        desired.x += pointer.sx * 0.8;
        desired.y += pointer.sy * 0.4;
      }
      camera.position.lerp(desired, 0.05);
      lookTarget.current.lerp(tmp.set(0, lookY, 0), 0.05);
      camera.lookAt(lookTarget.current);
      return;
    }

    // default scroll cinematics
    const p = THREE.MathUtils.clamp(scrollState.progress, 0, 1);
    curve.getPointAt(p, desired);

    if (!reduced) {
      pointer.sx += (pointer.x - pointer.sx) * 0.045;
      pointer.sy += (pointer.y - pointer.sy) * 0.045;
      desired.x += pointer.sx * 1.1;
      desired.y += pointer.sy * 0.6;
    }

    const vpush = THREE.MathUtils.clamp(Math.abs(scrollState.velocity) * 0.02, 0, 0.6);
    desired.multiplyScalar(1 - vpush * 0.03);

    camera.position.lerp(desired, reduced ? 0.12 : 0.07);
    lookTarget.current.lerp(tmp.set(0, 0.55 + p * 0.2, 0), 0.06);
    camera.lookAt(lookTarget.current);
  });

  return null;
}

export { NAV };
