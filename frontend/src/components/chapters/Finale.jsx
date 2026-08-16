import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { KINETIC_BG } from "@/lib/assets";
import { scrollState } from "@/lib/scrollState";
import { audio } from "@/lib/audio";
import { useStore } from "@/store";

gsap.registerPlugin(ScrollTrigger);

export default function Finale() {
  const section = useRef(null);
  const row1 = useRef(null);
  const row2 = useRef(null);
  const heading = useRef(null);
  const bg = useRef(null);
  const soundOn = useStore((s) => s.soundOn);

  // velocity-reactive marquee — the surprise: scroll speed warps the type
  useEffect(() => {
    let x1 = 0;
    let x2 = -400;
    let w1 = 1000;
    let w2 = 1000;
    const measure = () => {
      if (row1.current) w1 = row1.current.scrollWidth / 2 || 1000;
      if (row2.current) w2 = row2.current.scrollWidth / 2 || 1000;
    };
    measure();
    window.addEventListener("resize", measure);

    const tick = () => {
      const v = scrollState.velocity || 0;
      const boost = Math.min(Math.abs(v) * 0.25, 30);
      const skew = Math.max(-14, Math.min(14, v * 0.5));
      x1 -= 1.1 + boost;
      x2 += 1.1 + boost;
      if (x1 <= -w1) x1 += w1;
      if (x2 >= 0) x2 -= w2;
      if (row1.current) row1.current.style.transform = `translateX(${x1}px) skewX(${skew}deg)`;
      if (row2.current) row2.current.style.transform = `translateX(${x2}px) skewX(${-skew}deg)`;
    };
    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener("resize", measure);
    };
  }, []);

  // masked line reveal + parallax bg
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        heading.current.querySelectorAll(".line span"),
        { yPercent: 120 },
        {
          yPercent: 0,
          duration: 1.1,
          ease: "power4.out",
          stagger: 0.1,
          scrollTrigger: { trigger: heading.current, start: "top 78%" },
        }
      );
      gsap.fromTo(
        bg.current,
        { yPercent: -12, scale: 1.15 },
        {
          yPercent: 12,
          scale: 1.15,
          ease: "none",
          scrollTrigger: { trigger: section.current, start: "top bottom", end: "bottom top", scrub: true },
        }
      );
    }, section);
    return () => ctx.revert();
  }, []);

  const phrase = "BEYOND MOTION — VELA — AURELIS — ";

  return (
    <section
      ref={section}
      id="chapter-finale"
      data-testid="chapter-finale"
      className="relative flex min-h-screen flex-col justify-between overflow-hidden bg-[#020203] py-20"
    >
      <img
        ref={bg}
        src={KINETIC_BG}
        alt=""
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-40"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#020203] via-[#020203]/40 to-[#020203]" />

      {/* top marquee */}
      <div className="relative overflow-hidden py-4">
        <div ref={row1} className="flex whitespace-nowrap will-change-transform">
          {Array.from({ length: 8 }).map((_, i) => (
            <span
              key={i}
              className="font-display text-[7vw] font-bold uppercase tracking-tight text-white/10"
            >
              {phrase}
            </span>
          ))}
        </div>
      </div>

      {/* center statement */}
      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        <h2 ref={heading} className="font-display text-[13vw] font-bold uppercase leading-[0.82] tracking-tighter text-white sm:text-[11vw]">
          <span className="line block overflow-hidden">
            <span className="block">The Future</span>
          </span>
          <span className="line block overflow-hidden">
            <span className="block text-[#ff4400]">Doesn't Wait.</span>
          </span>
        </h2>

        <button
          className="pointer-events-auto group mt-12 flex items-center gap-4 overflow-hidden rounded-full border border-white/20 px-9 py-4 transition-colors hover:border-[#ff4400]"
          data-cursor="accent"
          data-cursor-label="Begin"
          data-testid="contact-cta"
          onMouseEnter={() => soundOn && audio.hover()}
          onClick={() => soundOn && audio.select()}
        >
          <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-white transition-colors group-hover:text-[#ff4400]">
            Start a Conversation
          </span>
          <span className="h-2 w-2 rounded-full bg-[#ff4400] transition-transform duration-500 group-hover:scale-150" />
        </button>
      </div>

      {/* bottom marquee + footer */}
      <div className="relative">
        <div className="overflow-hidden py-4">
          <div ref={row2} className="flex whitespace-nowrap will-change-transform">
            {Array.from({ length: 8 }).map((_, i) => (
              <span
                key={i}
                className="font-display text-[7vw] font-bold uppercase tracking-tight text-white/10"
              >
                {phrase}
              </span>
            ))}
          </div>
        </div>
        <div className="relative z-10 mt-10 flex flex-col items-center justify-between gap-4 px-6 font-mono text-[10px] uppercase tracking-[0.3em] text-[#6e7178] sm:flex-row sm:px-12">
          <span className="font-display text-xl font-bold tracking-[0.15em] text-white">AURELIS</span>
          <span>Concept 001 — Beyond Motion.</span>
          <span>© 2026 · Fictional Showcase</span>
        </div>
      </div>
    </section>
  );
}
