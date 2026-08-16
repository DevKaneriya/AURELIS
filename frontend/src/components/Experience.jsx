import { useEffect, useRef } from "react";
import Scene from "@/components/webgl/Scene";
import Loader from "@/components/Loader";
import Cursor from "@/components/Cursor";
import Hud from "@/components/Hud";
import Menu from "@/components/Menu";
import ScrollNarrative from "@/components/ScrollNarrative";
import { scrollController } from "@/lib/scrollController";
import { scrollState, pointer } from "@/lib/scrollState";
import { audio } from "@/lib/audio";
import { useStore } from "@/store";

export default function Experience() {
  const entered = useStore((s) => s.entered);
  const menuOpen = useStore((s) => s.menuOpen);
  const stageRef = useRef(null);

  // boot scroll engine + global listeners (once)
  useEffect(() => {
    scrollController.init();
    scrollController.stop(); // locked until loader completes

    const onMove = (e) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove);

    const soundTick = () => audio.setIntensity(scrollState.velocity);
    const intervalId = requestInterval(soundTick, 120);

    return () => {
      window.removeEventListener("pointermove", onMove);
      clearInterval(intervalId);
      scrollController.destroy();
    };
  }, []);

  // unlock scroll after arrival
  useEffect(() => {
    if (entered) {
      scrollController.start();
      const id = setTimeout(() => scrollController.refresh(), 250);
      return () => clearTimeout(id);
    }
  }, [entered]);

  // menu locks scroll + scales the webgl stage
  useEffect(() => {
    const stage = stageRef.current;
    if (menuOpen) {
      scrollController.stop();
      document.body.classList.add("no-scroll");
      stage && stage.classList.add("menu-active");
    } else {
      document.body.classList.remove("no-scroll");
      stage && stage.classList.remove("menu-active");
      if (entered) scrollController.start();
    }
  }, [menuOpen, entered]);

  return (
    <div className="App">
      <div ref={stageRef} className="webgl-stage">
        <Scene />
      </div>

      <ScrollNarrative />

      <Menu />
      <Hud />
      <Loader />
      <Cursor />

      <div className="vignette-overlay" />
      <div className="grain-overlay" />
    </div>
  );
}

// tiny setInterval helper kept local to avoid an extra rAF loop
function requestInterval(fn, ms) {
  return setInterval(fn, ms);
}
