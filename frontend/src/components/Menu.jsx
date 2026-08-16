import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useStore, NAV } from "@/store";
import { scrollController } from "@/lib/scrollController";
import { audio } from "@/lib/audio";

// Per-item background flare gradients (previewed on hover).
const FLARES = {
  experience: "radial-gradient(60% 80% at 70% 40%, rgba(0,243,255,0.18), transparent 70%)",
  motion: "radial-gradient(70% 90% at 30% 60%, rgba(255,68,0,0.22), transparent 70%)",
  machine: "radial-gradient(55% 75% at 60% 50%, rgba(159,180,255,0.16), transparent 70%)",
  configurator: "radial-gradient(60% 80% at 40% 40%, rgba(233,228,218,0.14), transparent 70%)",
  lab: "radial-gradient(80% 100% at 50% 50%, rgba(0,217,230,0.2), transparent 70%)",
  contact: "radial-gradient(60% 80% at 50% 70%, rgba(255,68,0,0.18), transparent 70%)",
};

export default function Menu() {
  const menuOpen = useStore((s) => s.menuOpen);
  const setMenuOpen = useStore((s) => s.setMenuOpen);
  const setMenuHover = useStore((s) => s.setMenuHover);
  const menuHover = useStore((s) => s.menuHover);
  const soundOn = useStore((s) => s.soundOn);

  const rootRef = useRef(null);
  const bgRef = useRef(null);
  const itemsRef = useRef([]);
  const metaRef = useRef(null);
  const tlRef = useRef(null);
  const pendingTarget = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    if (tlRef.current) tlRef.current.kill();
    const tl = gsap.timeline();
    tlRef.current = tl;

    if (menuOpen) {
      if (soundOn) audio.menuOpen();
      root.style.pointerEvents = "auto";
      gsap.set(root, { display: "flex" });
      // 1. background wash
      tl.fromTo(
        bgRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.5, ease: "power2.out" }
      );
      tl.fromTo(
        root,
        { clipPath: "inset(0% 0% 100% 0%)" },
        { clipPath: "inset(0% 0% 0% 0%)", duration: 0.7, ease: "power4.inOut" },
        0
      );
      // 2. nav items cascade
      tl.fromTo(
        itemsRef.current,
        { yPercent: 120, opacity: 0, rotateX: -40 },
        {
          yPercent: 0,
          opacity: 1,
          rotateX: 0,
          duration: 0.9,
          ease: "power4.out",
          stagger: 0.07,
        },
        0.35
      );
      // 3. meta / footer
      tl.fromTo(
        metaRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
        0.7
      );
    } else {
      if (soundOn && root.style.display === "flex") audio.menuClose();
      tl.to(itemsRef.current, {
        yPercent: -120,
        opacity: 0,
        duration: 0.5,
        ease: "power3.in",
        stagger: 0.04,
      });
      tl.to(metaRef.current, { opacity: 0, duration: 0.3 }, 0);
      tl.to(
        root,
        { clipPath: "inset(0% 0% 100% 0%)", duration: 0.6, ease: "power4.inOut" },
        0.2
      );
      tl.to(bgRef.current, { opacity: 0, duration: 0.5 }, 0.2);
      tl.set(root, {
        display: "none",
        clipPath: "inset(0% 0% 100% 0%)",
        onComplete: () => {
          root.style.pointerEvents = "none";
          setMenuHover(null);
          // deterministic: run the navigation scroll only after close completes
          if (pendingTarget.current != null) {
            scrollController.scrollToProgress(pendingTarget.current, { duration: 1.6 });
            pendingTarget.current = null;
          }
        },
      });
    }
    return () => tl.kill();
  }, [menuOpen, soundOn, setMenuHover]);

  const handleSelect = (item) => {
    if (!menuOpen) return; // guard against firing mid-close
    if (soundOn) audio.select();
    pendingTarget.current = item.target; // scroll fires on close onComplete
    setMenuOpen(false);
  };

  return (
    <nav
      ref={rootRef}
      className="fixed inset-0 z-[9985] hidden flex-col justify-center overflow-hidden"
      style={{ clipPath: "inset(0% 0% 100% 0%)", pointerEvents: "none" }}
      data-testid="immersive-menu"
    >
      {/* glass + flare background */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-2xl" />
      <div
        ref={bgRef}
        className="absolute inset-0 opacity-0 transition-[background] duration-700"
        style={{ background: menuHover ? FLARES[menuHover] : FLARES.experience }}
      />
      <div className="pointer-events-none absolute inset-0 border border-white/5" />

      {/* section label */}
      <div className="absolute left-6 top-24 font-mono text-[10px] uppercase tracking-[0.4em] text-[#6e7178] sm:left-10">
        Navigation / Chapters
      </div>

      {/* nav items */}
      <ul className="relative z-10 flex flex-col gap-1 px-6 sm:gap-2 sm:px-10 md:px-16">
        {NAV.map((item, i) => (
          <li key={item.id} style={{ perspective: 800 }}>
            <button
              ref={(el) => (itemsRef.current[i] = el)}
              onMouseEnter={() => {
                setMenuHover(item.id);
                if (soundOn) audio.hover();
              }}
              onClick={() => handleSelect(item)}
              data-cursor="accent"
              data-cursor-label="Enter"
              data-testid={`menu-item-${item.id}`}
              className="group flex w-full items-baseline gap-4 text-left sm:gap-8"
            >
              <span className="font-mono text-xs text-[#6e7178] transition-colors group-hover:text-[#ff4400] sm:text-sm">
                {item.index}
              </span>
              <span
                className="font-display text-4xl font-bold uppercase leading-[0.95] tracking-tight text-[#f2f3f5]/50 transition-all duration-500 group-hover:text-[#f2f3f5] group-hover:translate-x-3 sm:text-6xl md:text-7xl lg:text-8xl"
                style={{ willChange: "transform" }}
              >
                {item.label}
              </span>
              <span className="ml-auto hidden font-editorial text-sm text-[#6e7178] opacity-0 transition-opacity duration-500 group-hover:opacity-100 md:block">
                {item.tag}
              </span>
            </button>
          </li>
        ))}
      </ul>

      {/* meta footer */}
      <div
        ref={metaRef}
        className="absolute bottom-8 left-6 right-6 flex flex-col justify-between gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-[#6e7178] sm:left-10 sm:right-10 sm:flex-row"
      >
        <span>AURELIS — VELA / Concept 001</span>
        <span className="text-[#f2f3f5]">Beyond Motion.</span>
      </div>
    </nav>
  );
}
