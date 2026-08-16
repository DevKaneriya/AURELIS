import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useStore } from "@/store";
import { audio } from "@/lib/audio";

export default function Loader() {
  const [pct, setPct] = useState(0);
  const rootRef = useRef(null);
  const wordRef = useRef(null);
  const taglineRef = useRef(null);
  const counterRef = useRef(null);
  const hintRef = useRef(null);
  const loaded = useStore((s) => s.loaded);
  const setEntered = useStore((s) => s.setEntered);
  const done = useRef(false);

  // count to 92 while assets prepare
  useEffect(() => {
    const proxy = { v: 0 };
    const tween = gsap.to(proxy, {
      v: 92,
      duration: 1.8,
      ease: "power1.inOut",
      onUpdate: () => setPct(Math.round(proxy.v)),
    });
    return () => tween.kill();
  }, []);

  // finish + reveal once webgl reports ready
  useEffect(() => {
    if (!loaded || done.current) return;
    done.current = true;
    const proxy = { v: pct };
    const tl = gsap.timeline();
    tl.to(proxy, {
      v: 100,
      duration: 0.7,
      ease: "power2.out",
      onUpdate: () => setPct(Math.round(proxy.v)),
    });
    tl.to(counterRef.current, { opacity: 0, y: -20, duration: 0.5, ease: "power2.in" }, "+=0.1");
    tl.fromTo(
      wordRef.current,
      { opacity: 0, scale: 1.5, filter: "blur(24px)", letterSpacing: "0.4em" },
      { opacity: 1, scale: 1, filter: "blur(0px)", letterSpacing: "0.12em", duration: 1.3, ease: "power3.out" },
      "-=0.2"
    );
    tl.fromTo(
      taglineRef.current,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
      "-=0.6"
    );
    tl.fromTo(
      hintRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.6 },
      "-=0.2"
    );
    tl.to({}, { duration: 0.9 });
    tl.to(
      [wordRef.current, taglineRef.current, hintRef.current],
      { opacity: 0, y: -30, duration: 0.7, ease: "power2.inOut", stagger: 0.05 }
    );
    tl.to(
      rootRef.current,
      {
        opacity: 0,
        duration: 0.9,
        ease: "power2.inOut",
        onComplete: () => {
          setEntered(true);
          if (rootRef.current) rootRef.current.style.display = "none";
        },
      },
      "-=0.3"
    );
    // subtle arrival tone if sound already enabled
    audio.select && audio.select();
  }, [loaded, pct, setEntered]);

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[9990] flex flex-col items-center justify-center bg-[#030303]"
      data-testid="loader-screen"
    >
      <div
        ref={counterRef}
        className="absolute font-mono text-sm tracking-[0.3em] text-[#6e7178]"
        data-testid="loader-counter"
      >
        {String(pct).padStart(3, "0")}
        <span className="text-[#ff4400]"> %</span>
      </div>

      <h1
        ref={wordRef}
        className="font-display text-5xl font-bold uppercase tracking-[0.12em] text-[#f2f3f5] opacity-0 sm:text-7xl md:text-8xl"
        style={{ willChange: "transform, filter, opacity" }}
      >
        AURELIS
      </h1>
      <p
        ref={taglineRef}
        className="mt-4 font-mono text-xs uppercase tracking-[0.5em] text-[#6e7178] opacity-0 sm:text-sm"
      >
        Beyond Motion.
      </p>
      <div
        ref={hintRef}
        className="absolute bottom-10 font-mono text-[10px] uppercase tracking-[0.3em] text-[#6e7178] opacity-0"
      >
        Scroll to begin
      </div>
    </div>
  );
}
