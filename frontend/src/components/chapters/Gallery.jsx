import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { VELA_SIDE, VELA_FRONT, VELA_DETAIL } from "@/lib/assets";

gsap.registerPlugin(ScrollTrigger);

export default function Gallery() {
  const section = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray(".g-clip").forEach((el) => {
        gsap.fromTo(
          el,
          { clipPath: "inset(0% 0% 100% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 1.2, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 85%" } }
        );
      });
      // parallax the inner images
      gsap.utils.toArray(".g-par").forEach((el) => {
        gsap.fromTo(
          el,
          { yPercent: -8, scale: 1.12 },
          { yPercent: 8, scale: 1.12, ease: "none", scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true } }
        );
      });
      gsap.utils.toArray(".g-up").forEach((el) => {
        gsap.fromTo(el, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 88%" } });
      });
    }, section);
    const id = setTimeout(() => ScrollTrigger.refresh(), 300);
    return () => {
      clearTimeout(id);
      ctx.revert();
    };
  }, []);

  return (
    <section ref={section} data-testid="chapter-gallery" className="relative overflow-hidden bg-[#040405] px-6 py-28 sm:px-12 sm:py-40">
      <div className="mx-auto max-w-7xl">
        <div className="g-up mb-14 flex items-end justify-between">
          <h2 className="font-display text-5xl font-bold uppercase leading-[0.85] tracking-tighter text-white sm:text-7xl lg:text-8xl">
            Seen
            <br />
            In Light.
          </h2>
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.35em] text-[#6e7178] md:block">
            Gallery / 04 Frames
          </span>
        </div>

        {/* full-bleed side profile with spotlight */}
        <div className="g-clip relative aspect-[16/8] overflow-hidden rounded-xl">
          <img src={VELA_SIDE} alt="VELA side profile" className="g-par absolute inset-0 h-full w-full object-cover" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,transparent_35%,rgba(0,0,0,0.7)_100%)]" />
          <div className="absolute bottom-6 left-6 font-mono text-[10px] uppercase tracking-[0.3em] text-white/70">
            Profile · 5,210 mm · Cd 0.19
          </div>
        </div>

        {/* two-up */}
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-5">
          <div className="g-clip relative aspect-[4/3] overflow-hidden rounded-xl md:col-span-3">
            <img src={VELA_FRONT} alt="VELA front" className="g-par absolute inset-0 h-full w-full object-cover" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-6 left-6 font-mono text-[10px] uppercase tracking-[0.3em] text-white/70">Stance</div>
          </div>
          <div className="g-clip relative aspect-[4/3] overflow-hidden rounded-xl md:col-span-2">
            <img src={VELA_DETAIL} alt="VELA lighting detail" className="g-par absolute inset-0 h-full w-full object-cover" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-6 left-6 font-mono text-[10px] uppercase tracking-[0.3em] text-white/70">Signature</div>
          </div>
        </div>
      </div>
    </section>
  );
}
