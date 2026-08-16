import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MATERIALS } from "@/lib/assets";
import { isMobile } from "@/lib/device";
import { audio } from "@/lib/audio";
import { useStore } from "@/store";

gsap.registerPlugin(ScrollTrigger);

export default function Material() {
  const section = useRef(null);
  const track = useRef(null);
  const soundOn = useStore((s) => s.soundOn);

  useEffect(() => {
    if (isMobile()) return; // vertical stack fallback on mobile
    const ctx = gsap.context(() => {
      const t = track.current;
      const dist = () => Math.max(0, t.scrollWidth - window.innerWidth);

      const scrollTween = gsap.to(t, {
        x: () => -dist(),
        ease: "none",
        scrollTrigger: {
          trigger: section.current,
          start: "top top",
          end: () => "+=" + dist(),
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });

      // horizontal wipe reveal per image, linked to the horizontal scroll
      gsap.utils.toArray(".mat-img").forEach((img) => {
        gsap.fromTo(
          img,
          { clipPath: "inset(0% 0% 0% 100%)", scale: 1.25 },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            scale: 1.08,
            ease: "power2.out",
            scrollTrigger: {
              trigger: img.parentElement,
              containerAnimation: scrollTween,
              start: "left 85%",
              end: "left 25%",
              scrub: true,
            },
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
      id="chapter-material"
      data-testid="chapter-material"
      className="relative bg-[#030304]"
    >
      <div
        ref={track}
        className="flex w-full flex-col md:h-screen md:w-max md:flex-row md:flex-nowrap"
      >
        {/* intro panel */}
        <div className="flex h-screen w-screen shrink-0 flex-col justify-center px-8 sm:px-16">
          <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-[#ff4400]">
            Chapter 04 — Material
          </p>
          <h2 className="mt-6 max-w-3xl font-display text-5xl font-bold uppercase leading-[0.9] tracking-tighter text-white sm:text-7xl lg:text-8xl">
            Material
            <br />
            <span className="text-[#6e7178]">Is Memory.</span>
          </h2>
          <p className="mt-8 max-w-md font-editorial text-base leading-relaxed text-[#9a9da4] sm:text-lg">
            Every surface of VELA is chosen to be felt before it is seen. Scroll
            sideways through the substances that define it.
          </p>
          <div className="mt-10 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-[#6e7178]">
            <span className="h-px w-10 bg-[#ff4400]" /> Drag / Scroll →
          </div>
        </div>

        {/* material image panels */}
        {MATERIALS.map((m) => (
          <div
            key={m.key}
            className="group relative flex h-screen w-screen shrink-0 items-center justify-center overflow-hidden md:w-[70vw]"
            onMouseEnter={() => soundOn && audio.hover()}
            data-cursor="hover"
            data-cursor-label="View"
          >
            <div className="relative h-[72vh] w-[86vw] overflow-hidden md:w-[58vw]">
              <img
                src={m.url}
                alt={m.title}
                className="mat-img absolute inset-0 h-full w-full object-cover"
                style={{ willChange: "clip-path, transform" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />
              <div className="absolute left-6 top-6 font-mono text-[10px] uppercase tracking-[0.35em] text-white/70">
                {m.sub}
              </div>
              <div className="absolute bottom-6 left-6 right-6">
                <h3 className="font-display text-3xl font-bold uppercase tracking-tight text-white sm:text-5xl">
                  {m.title}
                </h3>
                <p className="mt-2 font-editorial text-sm text-white/60 sm:text-base">
                  {m.line}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
