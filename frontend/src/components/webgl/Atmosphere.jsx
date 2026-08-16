import { Environment, Lightformer, Sparkles, MeshReflectorMaterial } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { scrollState } from "@/lib/scrollState";

// Procedural studio environment (no external HDR / network assets).
export default function Atmosphere({ mobile = false, reduced = false }) {
  const keyLight = useRef();
  const rimAmber = useRef();
  const rimCyan = useRef();
  const fogRef = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const p = scrollState.progress;

    // A light sweeps across the vehicle over time.
    if (keyLight.current) {
      keyLight.current.position.x = Math.sin(t * 0.35) * 6;
      keyLight.current.position.z = Math.cos(t * 0.35) * 6;
    }
    // Accent lights intensify as the story accelerates.
    if (rimAmber.current) rimAmber.current.intensity = 4 + p * 10;
    if (rimCyan.current) rimCyan.current.intensity = 3 + (1 - p) * 6;

    // Fog shifts from cold void -> warm amber toward the finale.
    if (fogRef.current) {
      const cold = new THREE.Color("#050507");
      const warm = new THREE.Color("#140803");
      fogRef.current.color.copy(cold).lerp(warm, THREE.MathUtils.smoothstep(p, 0.5, 1));
    }
  });

  return (
    <>
      <fog ref={fogRef} attach="fog" args={["#050507", 9, 30]} />

      <ambientLight intensity={0.12} />
      <spotLight
        ref={keyLight}
        position={[5, 8, 5]}
        angle={0.5}
        penumbra={1}
        intensity={40}
        color="#cfd6ff"
        castShadow={!mobile}
        shadow-mapSize={mobile ? 512 : 1024}
      />
      <pointLight ref={rimAmber} position={[-6, 1.5, -3]} color="#ff4400" intensity={6} distance={26} />
      <pointLight ref={rimCyan} position={[6, 2, 4]} color="#00f3ff" intensity={5} distance={26} />

      {/* Procedural reflections via in-scene lightformers */}
      <Environment resolution={mobile ? 128 : 256} frames={1}>
        <color attach="background" args={["#020203"]} />
        <Lightformer intensity={2} position={[0, 5, -6]} scale={[12, 6, 1]} color="#4a5680" />
        <Lightformer intensity={3} position={[-5, 2, 2]} scale={[3, 8, 1]} color="#ff5a1f" />
        <Lightformer intensity={3} position={[5, 2, 2]} scale={[3, 8, 1]} color="#00d9e6" />
        <Lightformer intensity={1.5} position={[0, -3, 3]} scale={[10, 4, 1]} color="#1a1c26" />
      </Environment>

      {!reduced && (
        <Sparkles
          count={mobile ? 45 : 130}
          scale={[18, 7, 18]}
          size={mobile ? 1.5 : 2.4}
          speed={0.25}
          opacity={0.5}
          color="#9fb4ff"
          position={[0, 2, 0]}
        />
      )}

      {/* Reflective ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
        <planeGeometry args={[60, 60]} />
        {mobile ? (
          <meshStandardMaterial color="#050506" metalness={0.6} roughness={0.6} />
        ) : (
          <MeshReflectorMaterial
            resolution={512}
            mixBlur={1}
            mixStrength={18}
            blur={[300, 100]}
            roughness={0.85}
            depthScale={1.1}
            minDepthThreshold={0.4}
            maxDepthThreshold={1.4}
            color="#050506"
            metalness={0.7}
            mirror={0.35}
          />
        )}
      </mesh>
    </>
  );
}
