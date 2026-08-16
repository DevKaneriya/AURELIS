// Non-React shared state read every frame by the WebGL layer.
// Updated only by ScrollController (scroll) and Experience (pointer).
export const scrollState = {
  progress: 0, // 0..1 across whole document
  velocity: 0, // signed px/frame-ish from lenis
  raw: 0, // absolute scroll px
};

export const pointer = {
  x: 0, // -1..1 normalized target
  y: 0,
  sx: 0, // smoothed
  sy: 0,
};
