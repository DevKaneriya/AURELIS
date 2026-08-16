# AURELIS — VELA / Immersive Digital Experience

## Original Problem Statement
Build an exceptionally high-end, experimental, interactive WebGL website — an immersive digital
experience (NOT a normal website) for a fictional luxury EV brand **AURELIS**, vehicle **VELA**,
tagline **BEYOND MOTION.** Reference bar: Immersive Garden, Active Theory, Synchronized Studio.
The animation IS the interface: 3D + camera + scroll + environment + sound + cursor + transitions.
Frontend-only. No backend/auth/db.

## User Choices
- Scope: build the "Critical First Milestone" vertical slice first, polished high.
- Vehicle: stylized PROCEDURAL Three.js vehicle (architected so a real GLB can drop in later).
- Sound: generated via Web Audio API, OFF by default with a toggle.
- Stack: CRA React + React Three Fiber + Three.js + GSAP + ScrollTrigger + Lenis.

## Architecture
- **Layer 0 (WebGL):** fixed persistent `<Canvas>` (`components/webgl/Scene.jsx`) — Atmosphere
  (procedural lightformer environment, fog shift, sparkles, reflective floor), procedural Vehicle,
  scroll-driven CameraRig (CatmullRom camera path), postprocessing Effects (bloom/CA/vignette/noise/SMAA).
- **Layer 1 (DOM narrative):** `ScrollNarrative.jsx` — 720vh scroll spacer + fixed cinematic text beats
  driven by ONE scrubbed GSAP ScrollTrigger master timeline.
- **Layer 2 (UI):** `Hud.jsx` (logo, chapter indicator, sound toggle, menu button, scroll progress),
  `Menu.jsx` (immersive fullscreen menu), `Cursor.jsx` (inertial custom cursor), `Loader.jsx`.
- **Scroll engine:** single `lib/scrollController.js` owning Lenis + gsap.ticker + ScrollTrigger
  (official integration, `lagSmoothing(0)`). `lib/scrollState.js` shares progress/velocity/pointer
  to the WebGL layer without per-frame React renders. `store.js` = zustand + NAV model.
- **Sound:** `lib/audio.js` Web Audio engine (ambient drone + UI blips), scroll-velocity → brightness.

## Implemented (2026-06 build 3)
- Replaced the vehicle with a sleeker hyper-GT matching the user's blueprint: teardrop glass canopy,
  pointed nose, signature LED front blades, full-width rear light bar, aero diffuser + rear lip, and
  3 selectable wheel styles (Aero solid disc / Performance 10-spoke / Sculpted 5-spoke).
- CONFIGURATOR is now fully functional: Body / Wheels / Interior all mutate the live 3D car in real
  time on a slow turntable, with a live spec summary panel reflecting the exact configuration.
- NEW Chapter 03 PERFORMANCE: pinned, scrubbed giant morphing numbers (1.85s / 1,850 hp / 400+ / 700 km).
- NEW Chapter 04 MACHINE: interactive 5-system selector (Energy/Intelligence/Thermal/Structure/Aero)
  that recolors the car accent and repositions the camera per system.
- NEW Chapter 06 DESIGN: editorial "Purpose Driven Beauty" section using the provided blueprint board
  + two generated hero renders + full spec sheet, with clip/reveal animations.
- Camera driven by a unified sceneMode (scroll/configurator/performance/machine) + per-system poses.
  Menu expanded to 7 chapters. Verified by testing agent iteration 3: 100% pass, 0 JS errors.

## Implemented (2026-06 build 2)
- Chapter 04 MATERIAL: pinned horizontal-scroll gallery of 4 original generated material textures
  (anodized alloy / carbon / liquid glass / atelier hide) with GSAP containerAnimation clip-wipe reveals; mobile vertical fallback.
- Chapter 05 CONFIGURATOR: live 3D — Body (Obsidian/Silver/Pearl) swaps real vehicle paint, Interior
  (Carbon/Atelier/Midnight) drives the accent (rear light bar / rims / underglow), Wheels selector; camera reposes when active.
- FINALE: velocity-reactive kinetic marquee (scroll speed warps/skews the type), masked "THE FUTURE
  DOESN'T WAIT." line reveal, parallax generated backdrop, contact CTA + footer.
- Decoupled camera progress (hero-only ScrollTrigger) from total page scroll; menu now navigates to
  real sections via scrollToHero/scrollToEl; hero overlay auto-hides past the hero.
- Verified by testing agent iteration 2: 100% frontend pass, 0 JS errors. Added aria-pressed to configurator controls.

## Implemented (2026-06 build 1)
- Chapter 00 Arrival loader: mono counter → spatial AURELIS wordmark reveal → BEYOND MOTION → dissolve.
- Chapter 01 Hero: cinematic WebGL scene, procedural VELA vehicle, moving lights, pointer parallax.
- Scroll-driven camera choreography (approach → orbit → environment warm-shift → pull back).
- Cinematic scroll beats: BEYOND MOTION / THE REVEAL / KINETIC ENERGY / 2.1s / THE FUTURE DOESN'T WAIT / ending + contact CTA.
- Immersive fullscreen menu: choreographed GSAP open/close, enormous spatial typography, per-item
  hover flare + camera preview poses, deterministic select→smooth-scroll to chapter.
- Custom inertial cursor (desktop), sound toggle (off by default), scroll progress + chapter HUD.
- Mobile/reduced-motion degradations (dpr cap, no reflector/shadows on mobile, effects skipped for reduced motion).
- Verified by testing agent: 95% frontend pass, 0 console errors. Fixed menu→scroll race (GSAP
  onComplete + fresh Lenis limit).

## Backlog (remaining chapters — P1/P2)
- P1: Chapter 07 Configurator (body/wheels/interior finishes swap live 3D materials — BODY_FINISHES already scaffolded).
- P1: Chapter 06 The Machine (interactive systems: energy/intelligence/thermal/structure).
- P2: Chapter 02 Motion (light-streak speed environment), 03 Aerodynamics (wireframe/airflow),
  04 Material (procedural tactile shaders), 05 Performance (giant morphing numbers), 08 Lab (abstract WebGL).
- P2: richer generated sound design per chapter; drop-in real GLB vehicle.

## Next Tasks
- Build the Configurator chapter wired to the live 3D vehicle materials.
- Add the interactive "Machine" systems selector that reposes the camera + lighting.
