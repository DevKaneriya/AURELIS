import { create } from "zustand";

export const useStore = create((set) => ({
  loaded: false,
  entered: false,
  menuOpen: false,
  menuHover: null,
  soundOn: false,
  chapter: 0,

  finish: "obsidian",
  accent: "#ff4400",
  wheel: "performance",
  sceneMode: "scroll", // scroll | configurator | performance | machine
  machineSystem: "energy",

  setLoaded: (v) => set({ loaded: v }),
  setEntered: (v) => set({ entered: v }),
  setMenuOpen: (v) => set({ menuOpen: v }),
  setMenuHover: (v) => set({ menuHover: v }),
  setSoundOn: (v) => set({ soundOn: v }),
  setChapter: (v) => set({ chapter: v }),
  setFinish: (v) => set({ finish: v }),
  setAccent: (v) => set({ accent: v }),
  setWheel: (v) => set({ wheel: v }),
  setSceneMode: (v) => set({ sceneMode: v }),
  setMachineSystem: (v) => set({ machineSystem: v }),
}));

// Navigation model shared by Menu + CameraRig previews.
export const NAV = [
  { id: "experience", index: "01", label: "EXPERIENCE", tag: "The Reveal", kind: "hero", value: 0.0 },
  { id: "material", index: "02", label: "MATERIAL", tag: "Is Memory", kind: "el", value: "#chapter-material" },
  { id: "performance", index: "03", label: "PERFORMANCE", tag: "The Numbers", kind: "el", value: "#chapter-performance" },
  { id: "machine", index: "04", label: "MACHINE", tag: "Core Systems", kind: "el", value: "#chapter-machine" },
  { id: "configurator", index: "05", label: "CONFIGURATOR", tag: "Make It Yours", kind: "el", value: "#chapter-configurator" },
  { id: "design", index: "06", label: "DESIGN", tag: "Purpose Driven", kind: "el", value: "#chapter-design" },
  { id: "contact", index: "07", label: "CONTACT", tag: "Begin", kind: "el", value: "#chapter-finale" },
];
