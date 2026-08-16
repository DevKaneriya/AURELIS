import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { isTouch } from "@/lib/device";

// Single custom cursor with inertia. No DOM-per-frame spam.
export default function Cursor() {
  const dot = useRef(null);
  const ring = useRef(null);
  const label = useRef(null);

  useEffect(() => {
    if (isTouch()) return;
    document.documentElement.classList.add("custom-cursor");

    const xTo = gsap.quickTo(ring.current, "x", { duration: 0.5, ease: "power3" });
    const yTo = gsap.quickTo(ring.current, "y", { duration: 0.5, ease: "power3" });
    const dxTo = gsap.quickTo(dot.current, "x", { duration: 0.12, ease: "power2" });
    const dyTo = gsap.quickTo(dot.current, "y", { duration: 0.12, ease: "power2" });

    const move = (e) => {
      xTo(e.clientX);
      yTo(e.clientY);
      dxTo(e.clientX);
      dyTo(e.clientY);
    };

    const over = (e) => {
      const el = e.target.closest("[data-cursor]");
      if (el) {
        const kind = el.getAttribute("data-cursor");
        const text = el.getAttribute("data-cursor-label") || "";
        gsap.to(ring.current, {
          scale: text ? 3.4 : 2.4,
          borderColor: kind === "accent" ? "#ff4400" : "rgba(255,255,255,0.9)",
          backgroundColor: kind === "accent" ? "rgba(255,68,0,0.12)" : "rgba(255,255,255,0.04)",
          duration: 0.4,
          ease: "power3",
        });
        if (label.current) {
          label.current.textContent = text;
          gsap.to(label.current, { opacity: 1, duration: 0.3 });
        }
        gsap.to(dot.current, { scale: 0, duration: 0.3 });
      }
    };

    const out = (e) => {
      const el = e.target.closest("[data-cursor]");
      if (el) {
        gsap.to(ring.current, {
          scale: 1,
          borderColor: "rgba(255,255,255,0.5)",
          backgroundColor: "rgba(255,255,255,0)",
          duration: 0.4,
          ease: "power3",
        });
        if (label.current) gsap.to(label.current, { opacity: 0, duration: 0.2 });
        gsap.to(dot.current, { scale: 1, duration: 0.3 });
      }
    };

    window.addEventListener("mousemove", move);
    document.addEventListener("mouseover", over);
    document.addEventListener("mouseout", out);
    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseover", over);
      document.removeEventListener("mouseout", out);
      document.documentElement.classList.remove("custom-cursor");
    };
  }, []);

  if (isTouch()) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999]" aria-hidden>
      <div
        ref={dot}
        className="fixed left-0 top-0 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
        style={{ willChange: "transform" }}
      />
      <div
        ref={ring}
        className="fixed left-0 top-0 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/50"
        style={{ willChange: "transform", backgroundColor: "rgba(255,255,255,0)" }}
      >
        <span
          ref={label}
          className="font-mono text-[7px] uppercase tracking-[0.2em] text-white opacity-0"
        />
      </div>
    </div>
  );
}
