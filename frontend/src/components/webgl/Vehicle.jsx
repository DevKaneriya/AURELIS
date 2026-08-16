import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { scrollState } from "@/lib/scrollState";
import { useStore } from "@/store";

// Paint finishes — a real GLB can later replace these procedural meshes.
export const BODY_FINISHES = {
  obsidian: { color: "#0b0c0f", metalness: 1, roughness: 0.24, clearcoat: 1 },
  silver: { color: "#9aa0a8", metalness: 1, roughness: 0.2, clearcoat: 1 },
  pearl: { color: "#e7e2d8", metalness: 0.75, roughness: 0.3, clearcoat: 1 },
};

function RimFace({ variant, accent }) {
  const n = variant === "aero" ? 0 : variant === "sculpted" ? 5 : 10;
  const width = variant === "sculpted" ? 0.11 : 0.05;
  return (
    <group position={[0, 0.17, 0]}>
      {/* hub */}
      <mesh>
        <cylinderGeometry args={[0.1, 0.1, 0.07, 20]} />
        <meshStandardMaterial color="#17191f" metalness={1} roughness={0.3} />
      </mesh>
      {/* center cap accent */}
      <mesh position={[0, 0.04, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.02, 16]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.8} toneMapped={false} />
      </mesh>
      {variant === "aero" ? (
        <mesh position={[0, -0.01, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 0.02, 44]} />
          <meshStandardMaterial color="#212430" metalness={1} roughness={0.32} />
        </mesh>
      ) : (
        Array.from({ length: n }).map((_, i) => (
          <group key={i} rotation={[0, (i * Math.PI * 2) / n, 0]}>
            <mesh position={[0.17, 0, 0]}>
              <boxGeometry args={[0.3, 0.045, width]} />
              <meshStandardMaterial color="#1b1e26" metalness={1} roughness={0.28} />
            </mesh>
          </group>
        ))
      )}
    </group>
  );
}

function Wheel({ position, variant, accent }) {
  return (
    <group position={position} rotation={[0, 0, Math.PI / 2]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.46, 0.46, 0.3, 48]} />
        <meshStandardMaterial color="#0a0a0b" metalness={0.3} roughness={0.75} />
      </mesh>
      <mesh position={[0, 0.152, 0]}>
        <cylinderGeometry args={[0.34, 0.34, 0.03, 44]} />
        <meshStandardMaterial color="#101116" metalness={1} roughness={0.26} />
      </mesh>
      <RimFace variant={variant} accent={accent} />
      <mesh position={[0, 0.14, 0]}>
        <torusGeometry args={[0.44, 0.022, 12, 48]} />
        <meshStandardMaterial color="#26282f" metalness={1} roughness={0.3} />
      </mesh>
      {/* subtle brake caliper accent */}
      <mesh position={[0, 0.08, 0.24]}>
        <boxGeometry args={[0.14, 0.05, 0.05]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.5} toneMapped={false} />
      </mesh>
    </group>
  );
}

export default function Vehicle({ finish = "obsidian", accent = "#ff4400", wheel = "performance" }) {
  const group = useRef();
  const headlightL = useRef();
  const headlightR = useRef();
  const taillight = useRef();
  const sceneMode = useStore((s) => s.sceneMode);

  const paint = BODY_FINISHES[finish] || BODY_FINISHES.obsidian;

  const paintProps = {
    color: paint.color,
    metalness: paint.metalness,
    roughness: paint.roughness,
    clearcoat: paint.clearcoat,
    clearcoatRoughness: 0.07,
    envMapIntensity: 1.6,
  };

  const glassMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#04060a",
        metalness: 0,
        roughness: 0.04,
        transmission: 0.55,
        transparent: true,
        opacity: 0.6,
        ior: 1.5,
        reflectivity: 1,
      }),
    []
  );

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (group.current) {
      if (sceneMode === "configurator") {
        group.current.rotation.y += delta * 0.28; // turntable
      } else {
        group.current.rotation.y = scrollState.progress * Math.PI * 1.4 + Math.sin(t * 0.15) * 0.05;
      }
      group.current.position.y = 0.02 + Math.sin(t * 0.6) * 0.02;
    }
    const glow = 2.4 + Math.sin(t * 2) * 0.3 + scrollState.progress * 2.4;
    if (headlightL.current) headlightL.current.emissiveIntensity = glow;
    if (headlightR.current) headlightR.current.emissiveIntensity = glow;
    if (taillight.current) taillight.current.emissiveIntensity = glow * 0.85;
  });

  return (
    <group ref={group} position={[0, 0.02, 0]} scale={1}>
      {/* ---- LOWER BODY / FLOOR ---- */}
      <RoundedBox args={[4.7, 0.12, 1.86]} radius={0.06} smoothness={4} position={[0, 0.16, 0]}>
        <meshStandardMaterial color="#070708" metalness={0.7} roughness={0.5} />
      </RoundedBox>

      {/* ---- MAIN BODY MASS (low + wide) ---- */}
      <RoundedBox args={[4.3, 0.44, 1.66]} radius={0.22} smoothness={6} position={[0, 0.42, 0]} castShadow>
        <meshPhysicalMaterial {...paintProps} />
      </RoundedBox>

      {/* rear haunches (wider) */}
      <RoundedBox args={[1.7, 0.5, 1.94]} radius={0.24} smoothness={6} position={[-1.15, 0.46, 0]} castShadow>
        <meshPhysicalMaterial {...paintProps} />
      </RoundedBox>

      {/* front fenders */}
      <RoundedBox args={[1.5, 0.42, 1.86]} radius={0.22} smoothness={6} position={[1.35, 0.42, 0]} castShadow>
        <meshPhysicalMaterial {...paintProps} />
      </RoundedBox>

      {/* pointed nose taper */}
      <RoundedBox args={[0.9, 0.3, 1.2]} radius={0.14} smoothness={5} position={[2.15, 0.34, 0]}>
        <meshPhysicalMaterial {...paintProps} />
      </RoundedBox>
      <mesh position={[2.62, 0.32, 0]} rotation={[0, 0, 0]}>
        <coneGeometry args={[0.42, 0.5, 4, 1]} />
        <meshPhysicalMaterial {...paintProps} />
      </mesh>

      {/* ---- TEARDROP GLASS CANOPY ---- */}
      <mesh position={[-0.12, 0.74, 0]} scale={[1.65, 0.5, 0.82]} castShadow>
        <sphereGeometry args={[1, 40, 28]} />
        <primitive object={glassMat} attach="material" />
      </mesh>
      {/* fastback deck behind cabin */}
      <RoundedBox args={[1.5, 0.28, 1.5]} radius={0.14} smoothness={5} position={[-1.4, 0.62, 0]} rotation={[0, 0, -0.1]}>
        <meshPhysicalMaterial {...paintProps} />
      </RoundedBox>
      {/* hood centre crease */}
      <RoundedBox args={[1.4, 0.05, 0.5]} radius={0.02} smoothness={3} position={[1.6, 0.63, 0]}>
        <meshPhysicalMaterial {...paintProps} color="#050506" />
      </RoundedBox>

      {/* ---- SIDE INTAKES ---- */}
      {[0.86, -0.86].map((z) => (
        <mesh key={z} position={[-0.35, 0.44, z]} rotation={[0, 0, 0.15]}>
          <boxGeometry args={[0.9, 0.24, 0.14]} />
          <meshStandardMaterial color="#050506" metalness={0.6} roughness={0.6} />
        </mesh>
      ))}

      {/* ---- SIGNATURE FRONT LED BLADES ---- */}
      {[[0.72, headlightR], [-0.72, headlightL]].map(([z, ref], i) => (
        <mesh key={i} position={[2.16, 0.44, z]} rotation={[0, 0, -0.35]}>
          <boxGeometry args={[0.06, 0.3, 0.05]} />
          <meshStandardMaterial ref={ref} color="#dff6ff" emissive="#bfe9ff" emissiveIntensity={3} toneMapped={false} />
        </mesh>
      ))}
      {/* thin front light line */}
      <mesh position={[2.28, 0.36, 0]}>
        <boxGeometry args={[0.04, 0.035, 1.15]} />
        <meshStandardMaterial color="#bfe9ff" emissive="#bfe9ff" emissiveIntensity={2.4} toneMapped={false} />
      </mesh>

      {/* ---- FULL-WIDTH REAR LIGHT BAR (configurable accent) ---- */}
      <mesh position={[-2.18, 0.6, 0]}>
        <boxGeometry args={[0.05, 0.07, 1.78]} />
        <meshStandardMaterial ref={taillight} color={accent} emissive={accent} emissiveIntensity={2.2} toneMapped={false} />
      </mesh>
      {/* active-aero rear wing lip */}
      <RoundedBox args={[0.5, 0.05, 1.9]} radius={0.02} smoothness={3} position={[-2.0, 0.78, 0]}>
        <meshStandardMaterial color="#070708" metalness={0.8} roughness={0.4} />
      </RoundedBox>
      {/* rear diffuser fins */}
      {[-0.6, -0.3, 0, 0.3, 0.6].map((z) => (
        <mesh key={z} position={[-2.25, 0.22, z]}>
          <boxGeometry args={[0.35, 0.16, 0.03]} />
          <meshStandardMaterial color="#050506" metalness={0.7} roughness={0.5} />
        </mesh>
      ))}

      {/* underglow accent */}
      <mesh position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3.8, 1.4]} />
        <meshBasicMaterial color={accent} transparent opacity={0.22} toneMapped={false} />
      </mesh>

      {/* ---- WHEELS ---- */}
      <Wheel position={[1.5, 0.44, 0.94]} variant={wheel} accent={accent} />
      <Wheel position={[1.5, 0.44, -0.94]} variant={wheel} accent={accent} />
      <Wheel position={[-1.55, 0.44, 0.94]} variant={wheel} accent={accent} />
      <Wheel position={[-1.55, 0.44, -0.94]} variant={wheel} accent={accent} />
    </group>
  );
}
