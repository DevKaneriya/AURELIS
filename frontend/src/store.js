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
  configuratorActive: false,

  setLoaded: (v) => set({ loaded: v }),
  setEntered: (v) => set({ entered: v }),
  setMenuOpen: (v) => set({ menuOpen: v }),
  setMenuHover: (v) => set({ menuHover: v }),
  setSoundOn: (v) => set({ soundOn: v }),
  setChapter: (v) => set({ chapter: v }),
  setFinish: (v) => set({ finish: v }),
  setAccent: (v) => set({ accent: v }),
  setConfiguratorActive: (v) => set({ configuratorActive: v }),
}));

// Navigation model shared by Menu + CameraRig previews.
// kind 'hero' -> fraction of the hero scroll; kind 'el' -> scroll to element selector.
export const NAV = [
  { id: "experience", index: "01", label: "EXPERIENCE", tag: "The Reveal", kind: "hero", value: 0.0 },
  { id: "motion", index: "02", label: "MOTION", tag: "Kinetic Energy", kind: "hero", value: 0.45 },
  { id: "machine", index: "03", label: "MACHINE", tag: "Core Systems", kind: "hero", value: 0.78 },
  { id: "material", index: "04", label: "MATERIAL", tag: "Is Memory", kind: "el", value: "#chapter-material" },
  { id: "configurator", index: "05", label: "CONFIGURATOR", tag: "Make It Yours", kind: "el", value: "#chapter-configurator" },
  { id: "contact", index: "06", label: "CONTACT", tag: "Begin", kind: "el", value: "#chapter-finale" },
];
