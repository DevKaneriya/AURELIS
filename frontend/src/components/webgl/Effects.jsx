import {
  EffectComposer,
  Bloom,
  Vignette,
  ChromaticAberration,
  Noise,
  SMAA,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";

export default function Effects({ mobile = false }) {
  if (mobile) {
    return (
      <EffectComposer disableNormalPass>
        <Bloom intensity={0.5} luminanceThreshold={0.35} luminanceSmoothing={0.9} mipmapBlur />
        <Vignette eskil={false} offset={0.25} darkness={0.9} />
      </EffectComposer>
    );
  }
  return (
    <EffectComposer disableNormalPass multisampling={0}>
      <Bloom
        intensity={0.85}
        luminanceThreshold={0.22}
        luminanceSmoothing={0.9}
        mipmapBlur
        radius={0.7}
      />
      <ChromaticAberration
        blendFunction={BlendFunction.NORMAL}
        offset={new THREE.Vector2(0.0007, 0.0009)}
      />
      <Vignette eskil={false} offset={0.2} darkness={1.0} />
      <Noise premultiply blendFunction={BlendFunction.OVERLAY} opacity={0.35} />
      <SMAA />
    </EffectComposer>
  );
}
