import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { scrollState } from "@/lib/scrollState";

// Body finish presets (architected so the configurator can swap these later).
export const BODY_FINISHES = {
  obsidian: { color: "#0c0d10", metalness: 1, roughness: 0.22, clearcoat: 1 },
  silver: { color: "#c7cbd1", metalness: 1, roughness: 0.18, clearcoat: 1 },
  pearl: { color: "#e9e4da", metalness: 0.7, roughness: 0.3, clearcoat: 1 },
};

function Wheel({ position }) {
  return (
    <group position={position} rotation={[0, 0, Math.PI / 2]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.42, 0.42, 0.34, 48]} />
        <meshStandardMaterial color="#050505" metalness={0.6} roughness={0.55} />
      </mesh>
      <mesh position={[0, 0.171, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.02, 32]} />
        <meshStandardMaterial
          color="#15161a"
          metalness={1}
          roughness={0.25}
        />
      </mesh>
      {/* rim accent */}
      <mesh position={[0, 0.18, 0]}>
        <torusGeometry args={[0.3, 0.02, 12, 40]} />
        <meshStandardMaterial
          color="#ff4400"
          emissive="#ff4400"
          emissiveIntensity={1.4}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

export default function Vehicle({ finish = "obsidian" }) {
  const group = useRef();
  const bodyMat = useRef();
  const headlight = useRef();
  const taillight = useRef();

  const paint = BODY_FINISHES[finish] || BODY_FINISHES.obsidian;

  const glassMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#05070a",
        metalness: 0,
        roughness: 0.05,
        transmission: 0.6,
        transparent: true,
        opacity: 0.55,
        ior: 1.45,
        reflectivity: 1,
      }),
    []
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const p = scrollState.progress;
    if (group.current) {
      // scroll-driven rotation + gentle idle float
      group.current.rotation.y = p * Math.PI * 1.6 + Math.sin(t * 0.15) * 0.05;
      group.current.position.y = Math.sin(t * 0.6) * 0.03;
    }
    // headlight breathing, brighter as we accelerate through the story
    const glow = 2 + Math.sin(t * 2) * 0.3 + p * 3;
    if (headlight.current) headlight.current.emissiveIntensity = glow;
    if (taillight.current) taillight.current.emissiveIntensity = glow * 0.8;
  });

  return (
    <group ref={group} position={[0, 0.15, 0]} scale={1}>
      {/* Main chassis */}
      <RoundedBox
        args={[4.4, 0.62, 1.9]}
        radius={0.28}
        smoothness={6}
        position={[0, 0.45, 0]}
        castShadow
      >
        <meshPhysicalMaterial
          ref={bodyMat}
          color={paint.color}
          metalness={paint.metalness}
          roughness={paint.roughness}
          clearcoat={paint.clearcoat}
          clearcoatRoughness={0.08}
          envMapIntensity={1.4}
        />
      </RoundedBox>

      {/* Lower splitter / sculpted sill */}
      <RoundedBox
        args={[4.5, 0.18, 2.0]}
        radius={0.09}
        smoothness={4}
        position={[0, 0.16, 0]}
      >
        <meshStandardMaterial color="#08080a" metalness={0.8} roughness={0.5} />
      </RoundedBox>

      {/* Cabin canopy (glass) */}
      <RoundedBox
        args={[2.2, 0.55, 1.5]}
        radius={0.26}
        smoothness={6}
        position={[-0.2, 0.92, 0]}
      >
        <primitive object={glassMat} attach="material" />
      </RoundedBox>

      {/* Front hood taper */}
      <RoundedBox
        args={[1.5, 0.34, 1.75]}
        radius={0.16}
        smoothness={5}
        position={[1.55, 0.55, 0]}
      >
        <meshPhysicalMaterial
          color={paint.color}
          metalness={paint.metalness}
          roughness={paint.roughness}
          clearcoat={1}
          envMapIntensity={1.4}
        />
      </RoundedBox>

      {/* Rear haunch */}
      <RoundedBox
        args={[1.2, 0.5, 1.85]}
        radius={0.18}
        smoothness={5}
        position={[-1.75, 0.6, 0]}
      >
        <meshPhysicalMaterial
          color={paint.color}
          metalness={paint.metalness}
          roughness={paint.roughness}
          clearcoat={1}
          envMapIntensity={1.4}
        />
      </RoundedBox>

      {/* Front light bar (signature) */}
      <mesh position={[2.28, 0.55, 0]}>
        <boxGeometry args={[0.06, 0.1, 1.5]} />
        <meshStandardMaterial
          ref={headlight}
          color="#00f3ff"
          emissive="#00f3ff"
          emissiveIntensity={2.5}
          toneMapped={false}
        />
      </mesh>

      {/* Rear light bar */}
      <mesh position={[-2.32, 0.62, 0]}>
        <boxGeometry args={[0.06, 0.09, 1.6]} />
        <meshStandardMaterial
          ref={taillight}
          color="#ff4400"
          emissive="#ff4400"
          emissiveIntensity={2}
          toneMapped={false}
        />
      </mesh>

      {/* Underglow */}
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3.6, 1.4]} />
        <meshBasicMaterial
          color="#ff4400"
          transparent
          opacity={0.22}
          toneMapped={false}
        />
      </mesh>

      {/* Wheels */}
      <Wheel position={[1.45, 0.42, 0.92]} />
      <Wheel position={[1.45, 0.42, -0.92]} />
      <Wheel position={[-1.45, 0.42, 0.92]} />
      <Wheel position={[-1.45, 0.42, -0.92]} />
    </group>
  );
}
