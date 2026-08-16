import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useStore } from "@/store";
import { audio } from "@/lib/audio";

gsap.registerPlugin(ScrollTrigger);

const SYSTEMS = [
  { id: "energy", index: "01", name: "Energy", accent: "#00f3ff", spec: "Solid-state 120 kWh · 700 km WLTP · 350 kW recharge" },
  { id: "intelligence", index: "02", name: "Intelligence", accent: "#9fb4ff", spec: "Predictive torque vectoring · AI chassis · L3 autonomy" },
  { id: "thermal", index: "03", name: "Thermal", accent: "#ff4400", spec: "Active cell cooling · track-endurance thermal envelope" },
  { id: "structure", index: "04", name: "Structure", accent: "#c7cbd1", spec: "Carbon monocoque · 1,150 mm low · 2,050 mm wide" },
  { id: "aerodynamics", index: "05", name: "Aerodynamics", accent: "#00e6c3", spec: "Active aero surfaces · torque-vectored downforce" },
];

export default function Machine() {
  const section = useRef(null);
  const setSceneMode = useStore((s) => s.setSceneMode);
  const machineSystem = useStore((s) => s.machineSystem);
  const setMachineSystem = useStore((s) => s.setMachineSystem);
  const setAccent = useStore((s) => s.setAccent);
  const soundOn = useStore((s) => s.soundOn);

  useEffect(() => {
    const st = ScrollTrigger.create({
      trigger: section.current,
      start: "top 55%",
      end: "bottom 45%",
      onToggle: (self) => {
        if (self.isActive) {
          setSceneMode("machine");
          const cur = SYSTEMS.find((s) => s.id === machineSystem) || SYSTEMS[0];
          setAccent(cur.accent);
        } else if (useStore.getState().sceneMode === "machine") {
          setSceneMode("scroll");
        }
      },
    });
    return () => st.kill();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pick = (s) => {
    setMachineSystem(s.id);
    setAccent(s.accent);
    if (soundOn) audio.select();
  };

  const active = SYSTEMS.find((s) => s.id === machineSystem) || SYSTEMS[0];

  return (
    <section ref={section} id="chapter-machine" data-testid="chapter-machine" className="relative h-[130vh]">
      <div className="sticky top-0 flex h-screen flex-col justify-between px-6 py-24 sm:px-12">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-[#ff4400]">Chapter 04 — The Machine</p>
          <h2 className="mt-4 font-display text-4xl font-bold uppercase leading-[0.9] tracking-tighter text-white sm:text-6xl">
            Five Systems.
            <br />
            One Organism.
          </h2>
        </div>

        <div className="grid grid-cols-1 items-end gap-8 md:grid-cols-2">
          {/* system list */}
          <ul className="pointer-events-auto flex flex-col gap-1">
            {SYSTEMS.map((s) => {
              const on = s.id === machineSystem;
              return (
                <li key={s.id}>
                  <button
                    onClick={() => pick(s)}
                    onMouseEnter={() => soundOn && audio.hover()}
                    data-cursor="accent"
                    data-cursor-label="Reveal"
                    data-testid={`machine-system-${s.id}`}
                    aria-pressed={on}
                    className="group flex w-full items-center gap-4 border-b border-white/8 py-3 text-left"
                  >
                    <span className="font-mono text-xs" style={{ color: on ? s.accent : "#6e7178" }}>
                      {s.index}
                    </span>
                    <span
                      className={`font-display text-2xl font-bold uppercase tracking-tight transition-all duration-300 sm:text-4xl ${
                        on ? "translate-x-2 text-white" : "text-[#f2f3f5]/40 group-hover:text-[#f2f3f5]/80"
                      }`}
                    >
                      {s.name}
                    </span>
                    <span
                      className="ml-auto h-2 w-2 rounded-full transition-all duration-300"
                      style={{ background: on ? s.accent : "transparent", boxShadow: on ? `0 0 12px ${s.accent}` : "none" }}
                    />
                  </button>
                </li>
              );
            })}
          </ul>

          {/* active system readout */}
          <div className="pointer-events-auto rounded-2xl border border-white/10 bg-black/50 p-6 backdrop-blur-2xl sm:p-8" data-testid="machine-readout">
            <div className="font-mono text-[10px] uppercase tracking-[0.35em]" style={{ color: active.accent }}>
              System {active.index}
            </div>
            <h3 className="mt-3 font-display text-4xl font-bold uppercase tracking-tight text-white sm:text-5xl">
              {active.name}
            </h3>
            <p className="mt-4 font-editorial text-sm leading-relaxed text-[#9a9da4] sm:text-base">{active.spec}</p>
            <div className="mt-6 h-px w-full bg-white/10" />
            <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.3em] text-[#6e7178]">
              Select a system — the car responds.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
