import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useStore } from "@/store";
import { scrollController } from "@/lib/scrollController";
import { scrollState } from "@/lib/scrollState";
import { audio } from "@/lib/audio";

// Fixed cinematic text beats driven by ONE scrubbed master timeline.
export default function ScrollNarrative() {
  const spacerRef = useRef(null);
  const overlayRef = useRef(null);
  const beyond = useRef(null);
  const reveal = useRef(null);
  const kinetic = useRef(null);
  const perf = useRef(null);
  const future = useRef(null);
  const ending = useRef(null);
  const entered = useStore((s) => s.entered);
  const soundOn = useStore((s) => s.soundOn);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: spacerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          onUpdate: (self) => {
            scrollState.progress = self.progress;
          },
          onToggle: (self) => {
            if (overlayRef.current)
              gsap.to(overlayRef.current, {
                autoAlpha: self.isActive ? 1 : 0,
                duration: 0.5,
                ease: "power2.out",
              });
          },
        },
      });
      tl.to({}, { duration: 1 }, 0); // establish normalized length

      const beat = (el, inAt, outAt, opts = {}) => {
        tl.fromTo(
          el,
          { opacity: 0, y: opts.y ?? 70, filter: "blur(12px)" },
          { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.045, ease: "power2.out" },
          inAt
        );
        tl.to(
          el,
          { opacity: 0, y: -(opts.y ?? 60), filter: "blur(12px)", duration: 0.05, ease: "power2.in" },
          outAt
        );
      };

      // "Beyond Motion." is present the instant you arrive (fills the first view)
      tl.set(beyond.current, { opacity: 1, y: 0, filter: "blur(0px)" }, 0);
      tl.to(beyond.current, { opacity: 0, y: -60, filter: "blur(12px)", duration: 0.05, ease: "power2.in" }, 0.12);
      beat(reveal.current, 0.17, 0.29);
      beat(kinetic.current, 0.35, 0.5);
      beat(perf.current, 0.55, 0.66);
      beat(future.current, 0.72, 0.87);
      // ending stays visible to the finish
      tl.fromTo(
        ending.current,
        { opacity: 0, y: 60, filter: "blur(12px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.05, ease: "power2.out" },
        0.9
      );
    });

    const id = setTimeout(() => scrollController.refresh(), 300);
    return () => {
      clearTimeout(id);
      ctx.revert();
    };
  }, []);

  useEffect(() => {
    if (entered) {
      const id = setTimeout(() => ScrollTrigger.refresh(), 200);
      return () => clearTimeout(id);
    }
  }, [entered]);

  return (
    <>
      {/* fixed narrative overlay (above webgl, below hud) */}
      <div ref={overlayRef} className="pointer-events-none fixed inset-0 z-[10] flex items-center justify-center px-6 text-center">
        <div ref={beyond} className="absolute opacity-0" data-testid="beat-beyond">
          <h2 className="font-display text-[13vw] font-bold uppercase leading-[0.85] tracking-tighter text-white sm:text-[11vw]">
            Beyond
            <br />
            Motion.
          </h2>
        </div>

        <div ref={reveal} className="absolute max-w-xl opacity-0">
          <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-[#ff4400]">
            Chapter 01 — The Reveal
          </p>
          <h3 className="mt-6 font-editorial text-3xl font-semibold leading-tight text-white sm:text-5xl">
            A machine sculpted<br />by silence and light.
          </h3>
        </div>

        <div ref={kinetic} className="absolute opacity-0">
          <h3 className="font-display text-[9vw] font-bold uppercase leading-[0.9] tracking-tight text-white">
            Pure
            <br />
            <span className="text-[#ff4400]">Kinetic</span> Energy
          </h3>
        </div>

        <div ref={perf} className="absolute opacity-0">
          <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-[#00f3ff]">
            0 — 100 KM/H
          </p>
          <h3 className="mt-4 font-display text-[18vw] font-bold leading-none tracking-tighter text-white">
            2.1<span className="text-[#ff4400]">s</span>
          </h3>
        </div>

        <div ref={future} className="absolute opacity-0">
          <h2 className="font-display text-[11vw] font-bold uppercase leading-[0.85] tracking-tighter text-white">
            The Future
            <br />
            Doesn't Wait.
          </h2>
        </div>

        <div ref={ending} className="absolute flex flex-col items-center opacity-0">
          <h1 className="font-display text-6xl font-bold uppercase tracking-[0.12em] text-white sm:text-8xl">
            AURELIS
          </h1>
          <p className="mt-3 font-mono text-xs uppercase tracking-[0.5em] text-[#6e7178]">
            Beyond Motion.
          </p>
          <button
            className="pointer-events-auto mt-12 overflow-hidden rounded-full border border-white/20 px-8 py-4 font-mono text-[11px] uppercase tracking-[0.3em] text-white transition-colors hover:border-[#ff4400] hover:text-[#ff4400]"
            data-cursor="accent"
            data-cursor-label="Begin"
            data-testid="contact-cta"
            onMouseEnter={() => soundOn && audio.hover()}
          >
            Start a Conversation
          </button>
        </div>
      </div>

      {/* scroll length driver */}
      <div ref={spacerRef} style={{ height: "720vh" }} data-testid="scroll-spacer" />
    </>
  );
}
