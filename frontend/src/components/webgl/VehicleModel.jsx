import React, { useRef, useMemo, useLayoutEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { useStore } from "@/store";
import Vehicle, { BODY_FINISHES } from "./Vehicle";

const MODEL_URL = "/models/ferrari.glb";
useGLTF.preload(MODEL_URL, true);

// Wheels selector maps to rim finish on the real model.
const RIM_FINISH = {
  aero: { color: "#0c0c0e", metalness: 1, roughness: 0.28 },
  performance: { color: "#cfd3da", metalness: 1, roughness: 0.22 },
  sculpted: { color: "#b8863b", metalness: 1, roughness: 0.3 },
};

function VehicleModel({ finish = "obsidian", accent = "#ff4400", wheel = "performance" }) {
  const outer = useRef();
  const { scene } = useGLTF(MODEL_URL, true);
  const car = useMemo(() => scene.clone(true), [scene]);
  const sceneMode = useStore((s) => s.sceneMode);

  const bodyMats = useRef([]);
  const rimMats = useRef([]);
  const accentMats = useRef([]);

  // Re-skin the model once with configurable materials.
  useLayoutEffect(() => {
    bodyMats.current = [];
    rimMats.current = [];
    accentMats.current = [];
    car.traverse((o) => {
      if (!o.isMesh) return;
      o.castShadow = true;
      o.receiveShadow = false;
      const mn = (o.material && o.material.name) || "";
      const nn = o.name || "";
      if (mn === "Body_Color" || nn === "body" || nn === "blue" || nn === "yellow_trim") {
        const m = new THREE.MeshPhysicalMaterial({
          metalness: 1,
          roughness: 0.32,
          clearcoat: 1,
          clearcoatRoughness: 0.05,
          envMapIntensity: 1.7,
        });
        o.material = m;
        bodyMats.current.push(m);
      } else if (nn.startsWith("rim")) {
        const m = new THREE.MeshStandardMaterial({ metalness: 1, roughness: 0.25 });
        o.material = m;
        rimMats.current.push(m);
      } else if (nn === "lights_red" || nn === "leds") {
        const m = new THREE.MeshStandardMaterial({ metalness: 0.3, roughness: 0.3 });
        m.toneMapped = false;
        o.material = m;
        accentMats.current.push(m);
      } else if (nn === "glass") {
        o.material = new THREE.MeshPhysicalMaterial({
          color: "#05070a",
          metalness: 0,
          roughness: 0.05,
          transmission: 0.7,
          transparent: true,
          opacity: 0.5,
          ior: 1.5,
        });
      }
    });
    // center on X/Z and sit the wheels on the floor (y=0)
    const box = new THREE.Box3().setFromObject(car);
    car.position.x -= (box.min.x + box.max.x) / 2;
    car.position.z -= (box.min.z + box.max.z) / 2;
    car.position.y -= box.min.y;
  }, [car]);

  useLayoutEffect(() => {
    const paint = BODY_FINISHES[finish] || BODY_FINISHES.obsidian;
    bodyMats.current.forEach((m) => {
      m.color.set(paint.color);
      m.metalness = paint.metalness;
      m.roughness = paint.roughness;
      m.needsUpdate = true;
    });
  }, [finish]);

  useLayoutEffect(() => {
    const r = RIM_FINISH[wheel] || RIM_FINISH.performance;
    rimMats.current.forEach((m) => {
      m.color.set(r.color);
      m.metalness = r.metalness;
      m.roughness = r.roughness;
      m.needsUpdate = true;
    });
  }, [wheel]);

  useLayoutEffect(() => {
    accentMats.current.forEach((m) => {
      m.color.set(accent);
      m.emissive.set(accent);
      m.emissiveIntensity = 2.6;
      m.needsUpdate = true;
    });
  }, [accent]);

  useFrame((state, delta) => {
    if (!outer.current) return;
    const t = state.clock.elapsedTime;
    // Configurator = turntable. Everywhere else the car stays put (front toward
    // the opening camera) and only sways gently — the CAMERA does the moving,
    // so far->close dolly + orbit reads as one coherent motion.
    if (sceneMode === "configurator") outer.current.rotation.y += delta * 0.28;
    else outer.current.rotation.y = Math.PI + Math.sin(t * 0.2) * 0.05;
    outer.current.position.y = Math.sin(t * 0.6) * 0.01;
  });

  return (
    <group ref={outer}>
      <primitive object={car} />
      {/* underglow accent */}
      <mesh position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[2.1, 48]} />
        <meshBasicMaterial color={accent} transparent opacity={0.05} toneMapped={false} />
      </mesh>
    </group>
  );
}

// Falls back to the procedural vehicle if the GLB fails to load.
class ModelBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { err: false };
  }
  static getDerivedStateFromError() {
    return { err: true };
  }
  componentDidCatch(e) {
    console.warn("VELA GLB failed — using procedural fallback.", e);
  }
  render() {
    return this.state.err ? this.props.fallback : this.props.children;
  }
}

export default function Car(props) {
  return (
    <ModelBoundary fallback={<Vehicle {...props} />}>
      <VehicleModel {...props} />
    </ModelBoundary>
  );
}
