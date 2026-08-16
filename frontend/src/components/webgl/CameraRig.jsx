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

// Menu preview camera poses per nav id.
const MENU_POSES = {
  default: new THREE.Vector3(4.8, 2.1, 5.2),
  experience: new THREE.Vector3(3.4, 1.1, 6.2),
  motion: new THREE.Vector3(6.2, 0.9, 1.2),
  machine: new THREE.Vector3(1.6, 1.9, 4.2),
  configurator: new THREE.Vector3(4.2, 1.1, 4.4),
  lab: new THREE.Vector3(0.2, 3.4, 6.8),
  contact: new THREE.Vector3(0, 1.6, 9.5),
};

export default function CameraRig({ reduced = false }) {
  const { camera } = useThree();
  const curve = useMemo(() => new THREE.CatmullRomCurve3(PATH, false, "catmullrom", 0.5), []);
  const lookTarget = useRef(new THREE.Vector3(0, 0.55, 0));
  const desired = useMemo(() => new THREE.Vector3(), []);
  const tmp = useMemo(() => new THREE.Vector3(), []);

  const menuOpen = useStore((s) => s.menuOpen);
  const menuHover = useStore((s) => s.menuHover);

  useFrame(() => {
    if (menuOpen) {
      const id = menuHover || "default";
      const pose = MENU_POSES[id] || MENU_POSES.default;
      desired.copy(pose);
      camera.position.lerp(desired, 0.045);
      lookTarget.current.lerp(tmp.set(0, 0.6, 0), 0.05);
      camera.lookAt(lookTarget.current);
      return;
    }

    const p = THREE.MathUtils.clamp(scrollState.progress, 0, 1);
    curve.getPointAt(p, desired);

    // pointer parallax (skip if reduced motion)
    if (!reduced) {
      pointer.sx += (pointer.x - pointer.sx) * 0.045;
      pointer.sy += (pointer.y - pointer.sy) * 0.045;
      desired.x += pointer.sx * 1.1;
      desired.y += pointer.sy * 0.6;
    }

    // velocity adds a subtle push-in on fast scroll
    const vpush = THREE.MathUtils.clamp(Math.abs(scrollState.velocity) * 0.02, 0, 0.6);
    desired.multiplyScalar(1 - vpush * 0.03);

    camera.position.lerp(desired, reduced ? 0.12 : 0.07);
    lookTarget.current.lerp(tmp.set(0, 0.55 + p * 0.2, 0), 0.06);
    camera.lookAt(lookTarget.current);
  });

  return null;
}

export { NAV };
