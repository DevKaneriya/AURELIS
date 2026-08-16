import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useStore } from "@/store";

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  { value: "1.85", unit: "s", label: "0 — 100 KM/H", accent: "#ff4400" },
  { value: "1,850", unit: "HP", label: "PEAK OUTPUT · QUAD MOTOR", accent: "#00f3ff" },
  { value: "400", unit: "+ KM/H", label: "TOP SPEED", accent: "#ff4400" },
  { value: "700", unit: "KM", label: "RANGE · WLTP", accent: "#c9a24b" },
];

export default function Performance() {
  const section = useRef(null);
  const stats = useRef([]);
  const setSceneMode = useStore((s) => s.setSceneMode);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
        },
      });
      tl.to({}, { duration: 1 }, 0);

      const seg = 1 / STATS.length;
      stats.current.forEach((el, i) => {
        const at = i * seg;
        tl.fromTo(
          el,
          { opacity: 0, scale: 0.6, filter: "blur(24px)", yPercent: 20 },
          { opacity: 1, scale: 1, filter: "blur(0px)", yPercent: 0, duration: seg * 0.42, ease: "power3.out" },
          at + seg * 0.06
        );
        if (i < STATS.length - 1) {
          tl.to(
            el,
            { opacity: 0, scale: 1.5, filter: "blur(24px)", yPercent: -20, duration: seg * 0.4, ease: "power3.in" },
            at + seg * 0.6
          );
        }
      });
    }, section);

    const st = ScrollTrigger.create({
      trigger: section.current,
      start: "top 60%",
      end: "bottom 40%",
      onToggle: (self) => setSceneMode(self.isActive ? "performance" : "scroll"),
    });

    const id = setTimeout(() => ScrollTrigger.refresh(), 300);
    return () => {
      clearTimeout(id);
      st.kill();
      ctx.revert();
    };
  }, [setSceneMode]);

  return (
    <section ref={section} id="chapter-performance" data-testid="chapter-performance" className="relative h-[320vh]">
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
        {/* readable scrim over the live car */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(3,3,4,0.35),rgba(3,3,4,0.85))]" />

        <p className="absolute top-24 left-6 font-mono text-[11px] uppercase tracking-[0.4em] text-[#ff4400] sm:left-12">
          Chapter 03 — Performance
        </p>

        {STATS.map((s, i) => (
          <div
            key={i}
            ref={(el) => (stats.current[i] = el)}
            className="absolute flex flex-col items-center text-center opacity-0"
            style={{ willChange: "transform, opacity, filter" }}
          >
            <div className="flex items-end justify-center leading-none">
              <span className="font-display text-[26vw] font-bold tracking-tighter text-white sm:text-[22vw]">
                {s.value}
              </span>
              <span className="mb-[3vw] ml-2 font-display text-[6vw] font-bold sm:text-[4vw]" style={{ color: s.accent }}>
                {s.unit}
              </span>
            </div>
            <span className="mt-2 font-mono text-[10px] uppercase tracking-[0.4em] text-[#9a9da4] sm:text-xs">
              {s.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
