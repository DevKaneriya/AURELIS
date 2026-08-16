import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useStore } from "@/store";
import { audio } from "@/lib/audio";

gsap.registerPlugin(ScrollTrigger);

const BODY = [
  { id: "obsidian", name: "Obsidian", swatch: "#0c0d10" },
  { id: "silver", name: "Silver", swatch: "#c7cbd1" },
  { id: "pearl", name: "Pearl", swatch: "#e9e4da" },
];
const WHEELS = ["Aero", "Performance", "Sculpted"];
const INTERIOR = [
  { id: "carbon", name: "Carbon", accent: "#ff4400" },
  { id: "atelier", name: "Atelier", accent: "#c9a24b" },
  { id: "midnight", name: "Midnight", accent: "#00f3ff" },
];

function Group({ label, children }) {
  return (
    <div className="flex flex-col gap-3">
      <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-[#6e7178]">
        {label}
      </span>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

export default function Configurator() {
  const section = useRef(null);
  const finish = useStore((s) => s.finish);
  const setFinish = useStore((s) => s.setFinish);
  const accent = useStore((s) => s.accent);
  const setAccent = useStore((s) => s.setAccent);
  const setConfiguratorActive = useStore((s) => s.setConfiguratorActive);
  const soundOn = useStore((s) => s.soundOn);
  const [wheel, setWheel] = useState("Aero");
  const [interior, setInterior] = useState("carbon");

  useEffect(() => {
    const st = ScrollTrigger.create({
      trigger: section.current,
      start: "top 60%",
      end: "bottom 40%",
      onToggle: (self) => setConfiguratorActive(self.isActive),
    });
    return () => st.kill();
  }, [setConfiguratorActive]);

  const pick = (fn, val, snd = true) => {
    fn(val);
    if (soundOn && snd) audio.select();
  };

  const btn = (active) =>
    `px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] rounded-full border transition-all duration-300 ${
      active
        ? "border-[#ff4400] text-white bg-white/5"
        : "border-white/15 text-[#6e7178] hover:text-white hover:border-white/40"
    }`;

  return (
    <section
      ref={section}
      id="chapter-configurator"
      data-testid="chapter-configurator"
      className="relative h-[200vh]"
    >
      {/* transparent so the live 3D vehicle shows through */}
      <div className="sticky top-0 flex h-screen flex-col justify-between px-6 py-24 sm:px-12">
        <div className="max-w-2xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-[#ff4400]">
            Chapter 05 — Configurator
          </p>
          <h2 className="mt-5 font-display text-5xl font-bold uppercase leading-[0.9] tracking-tighter text-white sm:text-7xl lg:text-8xl">
            Make It
            <br />
            Yours.
          </h2>
        </div>

        {/* control console */}
        <div
          className="pointer-events-auto w-full self-center rounded-2xl border border-white/10 bg-black/50 p-6 backdrop-blur-2xl sm:p-8 md:max-w-3xl"
          data-testid="configurator-console"
        >
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            <Group label="Body">
              {BODY.map((b) => (
                <button
                  key={b.id}
                  onClick={() => pick(setFinish, b.id)}
                  data-cursor="hover"
                  data-testid={`config-body-${b.id}`}
                  aria-pressed={finish === b.id}
                  className="group flex items-center gap-2"
                  onMouseEnter={() => soundOn && audio.hover()}
                >
                  <span
                    className={`h-7 w-7 rounded-full border transition-all duration-300 ${
                      finish === b.id ? "border-[#ff4400] scale-110" : "border-white/20"
                    }`}
                    style={{ background: b.swatch }}
                  />
                  <span
                    className={`font-mono text-[10px] uppercase tracking-[0.15em] ${
                      finish === b.id ? "text-white" : "text-[#6e7178]"
                    }`}
                  >
                    {b.name}
                  </span>
                </button>
              ))}
            </Group>

            <Group label="Wheels">
              {WHEELS.map((w) => (
                <button
                  key={w}
                  onClick={() => pick(setWheel, w)}
                  data-cursor="hover"
                  data-testid={`config-wheel-${w.toLowerCase()}`}
                  aria-pressed={wheel === w}
                  className={btn(wheel === w)}
                  onMouseEnter={() => soundOn && audio.hover()}
                >
                  {w}
                </button>
              ))}
            </Group>

            <Group label="Interior">
              {INTERIOR.map((it) => (
                <button
                  key={it.id}
                  onClick={() => {
                    pick(setInterior, it.id, false);
                    pick(setAccent, it.accent);
                  }}
                  data-cursor="hover"
                  data-testid={`config-interior-${it.id}`}
                  aria-pressed={interior === it.id}
                  className={btn(interior === it.id)}
                  onMouseEnter={() => soundOn && audio.hover()}
                >
                  <span
                    className="mr-2 inline-block h-2 w-2 rounded-full align-middle"
                    style={{ background: it.accent }}
                  />
                  {it.name}
                </button>
              ))}
            </Group>
          </div>

          <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-5 font-mono text-[10px] uppercase tracking-[0.25em] text-[#6e7178]">
            <span>VELA / {finish} · {wheel} · {interior}</span>
            <span className="text-white">Live 3D · move mouse to orbit</span>
          </div>
        </div>
      </div>
    </section>
  );
}
