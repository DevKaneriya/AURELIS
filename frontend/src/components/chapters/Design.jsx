import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { VELA_SIDE, VELA_FRONT, VELA_REAR, SPECS } from "@/lib/assets";

gsap.registerPlugin(ScrollTrigger);

const FEATURES = [
  ["Signature Lighting", "Sculpted LED daytime running blades."],
  ["Aerodynamic Rear", "Active aero elements, seamlessly integrated."],
  ["Aerodynamic Wheels", "Optimized airflow, forged for downforce."],
  ["Luxury Interior", "Minimalist cockpit with an advanced HMI."],
];

export default function Design() {
  const section = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray(".reveal-up").forEach((el) => {
        gsap.fromTo(
          el,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 85%" },
          }
        );
      });
      gsap.utils.toArray(".reveal-clip").forEach((el) => {
        gsap.fromTo(
          el,
          { clipPath: "inset(0% 0% 100% 0%)", scale: 1.1 },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            scale: 1,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 82%" },
          }
        );
      });
    }, section);
    const id = setTimeout(() => ScrollTrigger.refresh(), 300);
    return () => {
      clearTimeout(id);
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={section}
      id="chapter-design"
      data-testid="chapter-design"
      className="relative bg-[#050506] px-6 py-28 sm:px-12 sm:py-40"
    >
      <div className="mx-auto max-w-7xl">
        {/* header */}
        <div className="reveal-up flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-[#ff4400]">Chapter 06 — Design</p>
            <h2 className="mt-5 font-display text-5xl font-bold uppercase leading-[0.88] tracking-tighter text-white sm:text-7xl lg:text-8xl">
              Purpose
              <br />
              Driven Beauty.
            </h2>
          </div>
          <p className="max-w-sm font-editorial text-sm leading-relaxed text-[#9a9da4] sm:text-base">
            An electric hyper-GT concept. Every surface earns its place — nothing
            decorative, everything intentional.
          </p>
        </div>

        {/* hero renders */}
        <div className="mt-16 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="reveal-clip relative aspect-[3/2] overflow-hidden rounded-xl">
            <img src={VELA_FRONT} alt="VELA front three-quarter" className="h-full w-full object-cover" />
            <span className="absolute bottom-4 left-4 font-mono text-[10px] uppercase tracking-[0.3em] text-white/70">
              Front / Signature Blades
            </span>
          </div>
          <div className="reveal-clip relative aspect-[3/2] overflow-hidden rounded-xl">
            <img src={VELA_REAR} alt="VELA rear three-quarter" className="h-full w-full object-cover" />
            <span className="absolute bottom-4 left-4 font-mono text-[10px] uppercase tracking-[0.3em] text-white/70">
              Rear / Full-Width Light Bar
            </span>
          </div>
        </div>

        {/* blueprint board + spec sheet */}
        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="reveal-clip relative overflow-hidden rounded-xl lg:col-span-2">
            <img src={VELA_SIDE} alt="AURELIS VELA side profile" className="h-full w-full object-cover" />
            <span className="absolute bottom-4 left-4 font-mono text-[10px] uppercase tracking-[0.3em] text-white/70">
              Silhouette / Open Roadster
            </span>
          </div>

          <div className="reveal-up rounded-xl border border-white/10 bg-black/40 p-7 backdrop-blur-xl">
            <h3 className="font-display text-xl font-bold uppercase tracking-[0.1em] text-white">AURELIS VELA</h3>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.3em] text-[#6e7178]">Electric Hyper-GT Concept</p>
            <dl className="mt-6 space-y-2.5 font-mono text-[11px] uppercase tracking-[0.08em]">
              {SPECS.map(([k, v]) => (
                <div key={k} className="flex items-center justify-between border-b border-white/8 pb-2">
                  <dt className="text-[#6e7178]">{k}</dt>
                  <dd className="text-white">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* feature captions */}
        <div className="reveal-up mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(([t, d], i) => (
            <div key={t} className="border-t border-white/10 pt-5">
              <span className="font-mono text-[10px] tracking-[0.3em] text-[#ff4400]">0{i + 1}</span>
              <h4 className="mt-3 font-display text-base font-bold uppercase tracking-tight text-white">{t}</h4>
              <p className="mt-2 font-editorial text-sm leading-relaxed text-[#9a9da4]">{d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
