import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useStore } from "@/store";
import { audio } from "@/lib/audio";

const CarSVG = () => (
  <svg width="58" height="22" viewBox="0 0 58 22" fill="none" aria-hidden>
    <path
      d="M3 15 L9 15 C11 9 17 7 23 7 L36 7 C42 7 47 10 51 13 L55 14 C56.5 14.2 56.5 15.8 55 16 L3 16 C1.8 16 1.8 15 3 15 Z"
      fill="#eef1f5"
    />
    <path d="M17 8 L33 8 C37 8 40 9.6 43 12 L18 12 C16.5 10.5 16.5 8.8 17 8 Z" fill="#0a0c12" opacity="0.9" />
    <rect x="6" y="12.5" width="46" height="1.4" fill="#ff4400" />
    <circle cx="52.5" cy="12.5" r="1.4" fill="#00f3ff" />
    <circle cx="17" cy="16" r="3.6" fill="#0a0a0b" stroke="#ff4400" strokeWidth="0.8" />
    <circle cx="41" cy="16" r="3.6" fill="#0a0a0b" stroke="#ff4400" strokeWidth="0.8" />
  </svg>
);

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
        className="absolute flex w-[72vw] max-w-3xl flex-col items-center gap-7"
      >
        <div className="font-mono text-sm tracking-[0.3em] text-[#6e7178]">
          <span data-testid="loader-counter">{String(pct).padStart(3, "0")}</span>
          <span className="text-[#ff4400]"> %</span>
        </div>

        {/* race track */}
        <div className="relative h-16 w-full">
          {/* base line */}
          <div className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-white/12" />
          {/* moving lane dashes */}
          <div
            className="absolute left-0 right-9 top-1/2 h-px -translate-y-1/2 opacity-50"
            style={{
              backgroundImage:
                "repeating-linear-gradient(90deg,#6e7178 0 10px,transparent 10px 22px)",
              backgroundSize: "22px 100%",
              animation: "dash 0.5s linear infinite",
            }}
          />
          {/* checkered finish flag */}
          <div className="absolute right-0 top-1/2 flex -translate-y-1/2 flex-col items-center">
            <div
              className="h-9 w-6 rounded-[2px]"
              style={{
                backgroundImage:
                  "repeating-conic-gradient(#ffffff 0 25%, #0a0a0b 0 50%)",
                backgroundSize: "8px 8px",
              }}
            />
          </div>

          {/* the car */}
          <div
            className="absolute top-1/2"
            style={{ left: `${3 + Math.min(pct, 100) * 0.84}%`, animation: "carbob 0.5s ease-in-out infinite", transform: "translate(-50%,-50%)" }}
          >
            {/* speed streaks */}
            <div className="absolute right-full top-1/2 mr-1 flex origin-right -translate-y-1/2 flex-col gap-1.5">
              <span className="block h-px w-12 origin-right bg-gradient-to-l from-[#ff4400] to-transparent" style={{ animation: "streak 0.35s linear infinite" }} />
              <span className="block h-px w-8 origin-right bg-gradient-to-l from-white to-transparent" style={{ animation: "streak 0.45s linear infinite" }} />
              <span className="block h-px w-10 origin-right bg-gradient-to-l from-[#00f3ff] to-transparent" style={{ animation: "streak 0.4s linear infinite" }} />
            </div>
            <CarSVG />
          </div>
        </div>

        <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#6e7178]">
          {pct < 100 ? "Launch Control" : "Ready"}
        </div>
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
