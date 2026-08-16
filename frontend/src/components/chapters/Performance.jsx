import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronDown } from "lucide-react";
import { useStore } from "@/store";

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  { num: 1.85, dec: 2, unit: "s", label: "0 — 100 KM/H", accent: "#ff4400" },
  { num: 1850, dec: 0, unit: "HP", label: "PEAK OUTPUT · QUAD MOTOR", accent: "#00f3ff" },
  { num: 400, dec: 0, unit: "+ KM/H", label: "TOP SPEED", accent: "#ff4400" },
  { num: 700, dec: 0, unit: "KM", label: "RANGE · WLTP", accent: "#c9a24b" },
];
const BANDS = STATS.length + 1;
const C = 2 * Math.PI * 46; // ring circumference

const fmt = (v, dec) => (dec > 0 ? v.toFixed(dec) : Math.round(v).toLocaleString());

export default function Performance() {
  const section = useRef(null);
  const pinRef = useRef(null);
  const numberRef = useRef(null);
  const unitRef = useRef(null);
  const labelRef = useRef(null);
  const ringRef = useRef(null);
  const flashRef = useRef(null);
  const bridge = useRef(null);
  const setSceneMode = useStore((s) => s.setSceneMode);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const st = ScrollTrigger.create({
      trigger: section.current,
      start: "top top",
      end: "bottom bottom",
      pin: pinRef.current,
      anticipatePin: 1,
      onToggle: (self) => setSceneMode(self.isActive ? "performance" : "scroll"),
      onUpdate: (self) => {
        const idx = Math.min(BANDS - 1, Math.floor(self.progress * BANDS));
        setActive((p) => (p === idx ? p : idx));
      },
    });
    const id = setTimeout(() => ScrollTrigger.refresh(), 300);
    return () => {
      clearTimeout(id);
      st.kill();
    };
  }, [setSceneMode]);

  // Creative reveal: number counts up, ring draws, accent flashes — per step.
  useEffect(() => {
    const showBridge = active >= STATS.length;
    if (showBridge) {
      gsap.to([numberRef.current, unitRef.current, labelRef.current, ringRef.current], {
        opacity: 0,
        duration: 0.4,
        ease: "power2.in",
        overwrite: "auto",
      });
      gsap.fromTo(
        bridge.current,
        { opacity: 0, yPercent: 55, filter: "blur(18px)" },
        { opacity: 1, yPercent: 0, filter: "blur(0px)", duration: 0.75, ease: "power4.out", overwrite: "auto" }
      );
      return;
    }
    gsap.to(bridge.current, { opacity: 0, yPercent: 45, duration: 0.35, overwrite: "auto" });

    const s = STATS[active];

    // accent flash
    if (flashRef.current) {
      flashRef.current.style.background = `radial-gradient(ellipse at 50% 45%, ${s.accent}22, transparent 60%)`;
      gsap.fromTo(flashRef.current, { opacity: 0.9 }, { opacity: 0, duration: 1.1, ease: "power2.out", overwrite: "auto" });
    }

    // number block entrance + count up
    gsap.fromTo(
      [numberRef.current, unitRef.current],
      { opacity: 0, yPercent: 40, scale: 0.8, filter: "blur(18px)" },
      { opacity: 1, yPercent: 0, scale: 1, filter: "blur(0px)", duration: 0.7, ease: "power3.out", overwrite: "auto" }
    );
    if (unitRef.current) {
      unitRef.current.style.color = s.accent;
      unitRef.current.textContent = s.unit;
    }
    const proxy = { v: 0 };
    gsap.to(proxy, {
      v: s.num,
      duration: 1.1,
      ease: "power2.out",
      onUpdate: () => {
        if (numberRef.current) numberRef.current.textContent = fmt(proxy.v, s.dec);
      },
    });

    // label
    gsap.fromTo(
      labelRef.current,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", delay: 0.15, overwrite: "auto" }
    );
    if (labelRef.current) labelRef.current.textContent = s.label;

    // ring draws + tints
    if (ringRef.current) {
      ringRef.current.style.stroke = s.accent;
      gsap.fromTo(
        ringRef.current,
        { opacity: 0.9, strokeDashoffset: C },
        { strokeDashoffset: 0, duration: 1.1, ease: "power2.out", overwrite: "auto" }
      );
    }
  }, [active]);

  return (
    <section ref={section} id="chapter-performance" data-testid="chapter-performance" className="relative h-[460vh]">
      <div ref={pinRef} className="flex h-screen items-center justify-center overflow-hidden">
        <div ref={flashRef} className="pointer-events-none absolute inset-0 opacity-0" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(3,3,4,0.3),rgba(3,3,4,0.82))]" />

        <p className="absolute top-24 left-6 font-mono text-[11px] uppercase tracking-[0.4em] text-[#ff4400] sm:left-12">
          Chapter 03 — Performance
        </p>

        {/* drawing progress ring + slow spinning dashed ring */}
        <svg viewBox="0 0 100 100" className="absolute h-[78vh] w-[78vh] -rotate-90" style={{ maxWidth: "92vw", maxHeight: "92vw" }}>
          <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.3" />
          <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.2" strokeDasharray="1 3" className="origin-center animate-[spin_16s_linear_infinite]" />
          <circle ref={ringRef} cx="50" cy="50" r="46" fill="none" strokeWidth="0.6" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C} style={{ filter: "drop-shadow(0 0 3px currentColor)" }} />
        </svg>

        {/* the giant counting number */}
        <div className="relative flex items-end justify-center leading-none">
          <span ref={numberRef} className="font-display text-[26vw] font-bold tracking-tighter text-white sm:text-[20vw]">0</span>
          <span ref={unitRef} className="mb-[3vw] ml-2 font-display text-[6vw] font-bold sm:text-[4vw]" style={{ color: "#ff4400" }}>s</span>
        </div>
        <span ref={labelRef} className="absolute bottom-[24vh] font-mono text-[10px] uppercase tracking-[0.5em] text-[#9a9da4] sm:text-xs">
          0 — 100 KM/H
        </span>

        {/* progress ticks */}
        <div className="absolute bottom-16 flex gap-2">
          {STATS.map((_, i) => (
            <span key={i} className="h-1 w-8 rounded-full transition-all duration-500" style={{ background: i <= active && active < STATS.length ? "#ff4400" : "rgba(255,255,255,0.15)" }} />
          ))}
        </div>

        {/* hand-off cue */}
        <div ref={bridge} className="absolute flex flex-col items-center text-center opacity-0" data-testid="performance-bridge">
          <span className="font-mono text-[11px] uppercase tracking-[0.4em] text-[#6e7178]">Next</span>
          <h3 className="mt-3 font-display text-6xl font-bold uppercase leading-[0.9] tracking-tighter text-white sm:text-8xl">The Machine</h3>
          <ChevronDown className="mt-6 animate-bounce text-[#ff4400]" size={26} />
        </div>
      </div>
    </section>
  );
}
