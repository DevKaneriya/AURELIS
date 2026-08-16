import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Volume2, VolumeX } from "lucide-react";
import { useStore, NAV } from "@/store";
import { scrollState } from "@/lib/scrollState";
import { audio } from "@/lib/audio";

export default function Hud() {
  const entered = useStore((s) => s.entered);
  const menuOpen = useStore((s) => s.menuOpen);
  const setMenuOpen = useStore((s) => s.setMenuOpen);
  const soundOn = useStore((s) => s.soundOn);
  const setSoundOn = useStore((s) => s.setSoundOn);
  const setChapter = useStore((s) => s.setChapter);

  const barRef = useRef(null);
  const chapterRef = useRef(null);
  const rootRef = useRef(null);
  const lastChapter = useRef(-1);

  useEffect(() => {
    if (!entered) return;
    gsap.fromTo(
      rootRef.current,
      { opacity: 0, y: -12 },
      { opacity: 1, y: 0, duration: 1, ease: "power2.out", delay: 0.2 }
    );
  }, [entered]);

  // Drive progress bar + chapter label without React re-renders per frame.
  useEffect(() => {
    const tick = () => {
      const el = document.scrollingElement || document.documentElement;
      const total = (el.scrollHeight - window.innerHeight) || 1;
      const p = Math.min(1, Math.max(0, (window.scrollY || 0) / total));
      if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
      const idx = Math.min(NAV.length - 1, Math.floor(p * NAV.length + 0.0001));
      if (idx !== lastChapter.current) {
        lastChapter.current = idx;
        setChapter(idx);
        if (chapterRef.current) {
          chapterRef.current.textContent = `${NAV[idx].index} — ${NAV[idx].label}`;
        }
      }
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, [setChapter]);

  const toggleSound = async () => {
    if (soundOn) {
      audio.disable();
      setSoundOn(false);
    } else {
      await audio.enable();
      setSoundOn(true);
    }
  };

  return (
    <div ref={rootRef} className="pointer-events-none fixed inset-0 z-[9980] opacity-0">
      {/* Top bar */}
      <header className="pointer-events-none absolute left-0 right-0 top-0 flex items-center justify-between px-6 py-5 sm:px-10 sm:py-7">
        <button
          className="pointer-events-auto font-display text-lg font-bold tracking-[0.18em] text-white transition-opacity hover:opacity-70 sm:text-xl"
          data-cursor="accent"
          data-testid="logo-home"
          onClick={() => window.scrollTo({ top: 0 })}
        >
          AURELIS
        </button>

        <div className="hidden items-center gap-3 md:flex">
          <span className="h-px w-8 bg-white/20" />
          <span
            ref={chapterRef}
            className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#6e7178]"
            data-testid="chapter-indicator"
          >
            01 — EXPERIENCE
          </span>
        </div>

        <div className="pointer-events-auto flex items-center gap-4 sm:gap-6">
          <button
            onClick={toggleSound}
            data-cursor="hover"
            data-testid="sound-toggle"
            aria-label="Toggle sound"
            className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-[#6e7178] transition-colors hover:text-white"
          >
            {soundOn ? <Volume2 size={14} /> : <VolumeX size={14} />}
            <span className="hidden sm:inline">{soundOn ? "Sound On" : "Sound Off"}</span>
          </button>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            data-cursor="accent"
            data-cursor-label={menuOpen ? "Close" : "Open"}
            data-testid="menu-button"
            aria-label="Toggle menu"
            className="group flex items-center gap-3"
          >
            <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-white">
              {menuOpen ? "Close" : "Menu"}
            </span>
            <span className="relative flex h-3 w-6 flex-col justify-between">
              <span
                className={`h-px w-full bg-white transition-transform duration-500 ${
                  menuOpen ? "translate-y-[5px] rotate-45" : ""
                }`}
              />
              <span
                className={`h-px w-full bg-white transition-transform duration-500 ${
                  menuOpen ? "-translate-y-[6px] -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </div>
      </header>

      {/* Scroll progress line */}
      <div className="absolute bottom-0 left-0 h-[2px] w-full bg-white/5">
        <div
          ref={barRef}
          className="h-full w-full origin-left bg-gradient-to-r from-[#ff4400] to-[#00f3ff]"
          style={{ transform: "scaleX(0)" }}
          data-testid="scroll-progress"
        />
      </div>
    </div>
  );
}
