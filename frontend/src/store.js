import { create } from "zustand";

export const useStore = create((set) => ({
  loaded: false,
  entered: false,
  menuOpen: false,
  menuHover: null,
  soundOn: false,
  chapter: 0,

  setLoaded: (v) => set({ loaded: v }),
  setEntered: (v) => set({ entered: v }),
  setMenuOpen: (v) => set({ menuOpen: v }),
  setMenuHover: (v) => set({ menuHover: v }),
  setSoundOn: (v) => set({ soundOn: v }),
  setChapter: (v) => set({ chapter: v }),
}));

// Navigation model shared by Menu + CameraRig previews.
export const NAV = [
  { id: "experience", index: "01", label: "EXPERIENCE", target: 0.04, tag: "The Reveal" },
  { id: "motion", index: "02", label: "MOTION", target: 0.32, tag: "Kinetic Energy" },
  { id: "machine", index: "03", label: "MACHINE", target: 0.55, tag: "Core Systems" },
  { id: "configurator", index: "04", label: "CONFIGURATOR", target: 0.7, tag: "Make It Yours" },
  { id: "lab", index: "05", label: "LAB", target: 0.86, tag: "The Experiment" },
  { id: "contact", index: "06", label: "CONTACT", target: 0.99, tag: "Begin" },
];
