import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useStore } from "@/store";
import { audio } from "@/lib/audio";

gsap.registerPlugin(ScrollTrigger);

const BODY = [
  { id: "obsidian", name: "Obsidian", swatch: "#0b0c0f" },
  { id: "silver", name: "Silver", swatch: "#9aa0a8" },
  { id: "pearl", name: "Pearl", swatch: "#e7e2d8" },
];
const WHEELS = [
  { id: "aero", name: "Aero" },
  { id: "performance", name: "Performance" },
  { id: "sculpted", name: "Sculpted" },
];
const INTERIOR = [
  { id: "carbon", name: "Carbon", accent: "#ff4400", seat: "#0e0f13" },
  { id: "atelier", name: "Atelier", accent: "#c9a24b", seat: "#6b4a2a" },
  { id: "midnight", name: "Midnight", accent: "#00f3ff", seat: "#12233b" },
];

const nameOf = (arr, id) => (arr.find((x) => x.id === id) || {}).name || id;

function Group({ label, children }) {
  return (
    <div className="flex flex-col gap-3">
      <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-[#6e7178]">{label}</span>
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
  const wheel = useStore((s) => s.wheel);
  const setWheel = useStore((s) => s.setWheel);
  const setSceneMode = useStore((s) => s.setSceneMode);
  const setConfigSpin = useStore((s) => s.setConfigSpin);
  const setInterior = useStore((s) => s.setInterior);
  const soundOn = useStore((s) => s.soundOn);

  const interior = INTERIOR.find((i) => i.accent === accent)?.id || "carbon";

  useEffect(() => {
    const st = ScrollTrigger.create({
      trigger: section.current,
      start: "top 55%",
      end: "bottom 45%",
      onToggle: (self) => {
        if (self.isActive) setSceneMode("configurator");
        else if (useStore.getState().sceneMode === "configurator") setSceneMode("scroll");
      },
      onUpdate: (self) => setConfigSpin(self.progress),
    });
    return () => st.kill();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setSceneMode]);

  const tap = (fn, v, snd = true) => {
    fn(v);
    if (soundOn && snd) audio.select();
  };

  const chip = (active) =>
    `px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] rounded-full border transition-all duration-300 ${
      active ? "border-[#ff4400] text-white bg-white/5" : "border-white/15 text-[#6e7178] hover:text-white hover:border-white/40"
    }`;

  return (
    <section ref={section} id="chapter-configurator" data-testid="chapter-configurator" className="relative h-[240vh]">
      {/* transparent -> live 3D VELA shows through */}
      <div className="sticky top-0 flex h-screen flex-col justify-between px-6 py-24 sm:px-12">
        <div className="max-w-2xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-[#ff4400]">Chapter 05 — Configurator</p>
          <h2 className="mt-5 font-display text-5xl font-bold uppercase leading-[0.9] tracking-tighter text-white sm:text-7xl lg:text-8xl">
            Make It
            <br />
            Yours.
          </h2>
          <p className="mt-5 max-w-sm font-editorial text-sm text-[#9a9da4] sm:text-base">
            A live turntable. Every choice reshapes the car in real time.
          </p>
        </div>

        <div className="flex w-full flex-col items-stretch gap-4 md:flex-row md:items-end md:justify-between">
          {/* control console */}
          <div
            className="pointer-events-auto w-full rounded-2xl border border-white/10 bg-black/55 p-6 backdrop-blur-2xl sm:p-8 md:max-w-2xl"
            data-testid="configurator-console"
          >
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
              <Group label="Body">
                {BODY.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => tap(setFinish, b.id)}
                    data-cursor="hover"
                    data-testid={`config-body-${b.id}`}
                    aria-pressed={finish === b.id}
                    onMouseEnter={() => soundOn && audio.hover()}
                    className="group flex items-center gap-2"
                  >
                    <span
                      className={`h-7 w-7 rounded-full border transition-all duration-300 ${
                        finish === b.id ? "scale-110 border-[#ff4400]" : "border-white/20"
                      }`}
                      style={{ background: b.swatch }}
                    />
                    <span className={`font-mono text-[10px] uppercase tracking-[0.15em] ${finish === b.id ? "text-white" : "text-[#6e7178]"}`}>
                      {b.name}
                    </span>
                  </button>
                ))}
              </Group>

              <Group label="Wheels">
                {WHEELS.map((w) => (
                  <button
                    key={w.id}
                    onClick={() => tap(setWheel, w.id)}
                    data-cursor="hover"
                    data-testid={`config-wheel-${w.id}`}
                    aria-pressed={wheel === w.id}
                    onMouseEnter={() => soundOn && audio.hover()}
                    className={chip(wheel === w.id)}
                  >
                    {w.name}
                  </button>
                ))}
              </Group>

              <Group label="Interior">
                {INTERIOR.map((it) => (
                  <button
                    key={it.id}
                    onClick={() => {
                      tap(setAccent, it.accent);
                      setInterior(it.seat);
                    }}
                    data-cursor="hover"
                    data-testid={`config-interior-${it.id}`}
                    aria-pressed={interior === it.id}
                    onMouseEnter={() => soundOn && audio.hover()}
                    className={chip(interior === it.id)}
                  >
                    <span className="mr-2 inline-block h-2 w-2 rounded-full align-middle" style={{ background: it.accent }} />
                    {it.name}
                  </button>
                ))}
              </Group>
            </div>
          </div>

          {/* live spec summary — reflects the exact configuration */}
          <div
            className="pointer-events-auto w-full rounded-2xl border border-white/10 bg-black/55 p-6 backdrop-blur-2xl md:max-w-xs"
            data-testid="configurator-summary"
          >
            <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.3em] text-[#6e7178]">
              <span>Your VELA</span>
              <span className="h-2 w-2 rounded-full" style={{ background: accent, boxShadow: `0 0 12px ${accent}` }} />
            </div>
            <dl className="mt-5 space-y-3 font-mono text-[11px] uppercase tracking-[0.12em]">
              {[
                ["Body", nameOf(BODY, finish)],
                ["Wheels", nameOf(WHEELS, wheel)],
                ["Interior", nameOf(INTERIOR, interior)],
              ].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between border-b border-white/8 pb-2">
                  <dt className="text-[#6e7178]">{k}</dt>
                  <dd className="text-white" data-testid={`summary-${k.toLowerCase()}`}>{v}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-5 font-mono text-[10px] uppercase tracking-[0.2em] text-[#6e7178]">
              Quad Motor AWD · 1,850 hp
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
