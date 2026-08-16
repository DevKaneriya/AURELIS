import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scrollState } from "./scrollState";

gsap.registerPlugin(ScrollTrigger);

// Single owner of Lenis + GSAP ticker + ScrollTrigger integration.
class ScrollController {
  constructor() {
    this.lenis = null;
    this.tick = null;
  }

  init() {
    if (this.lenis) return this.lenis;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
    });
    this.lenis = lenis;

    lenis.on("scroll", (e) => {
      ScrollTrigger.update();
      const limit = lenis.limit || 1;
      scrollState.raw = lenis.scroll;
      scrollState.progress = limit > 0 ? lenis.scroll / limit : 0;
      scrollState.velocity = e.velocity || 0;
    });

    // Single RAF ownership via gsap ticker.
    this.tick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(this.tick);
    gsap.ticker.lagSmoothing(0);

    // Keep ScrollTrigger and Lenis in sync on resize/refresh.
    ScrollTrigger.addEventListener("refresh", () => lenis.resize());

    return lenis;
  }

  start() {
    this.lenis && this.lenis.start();
  }

  stop() {
    this.lenis && this.lenis.stop();
  }

  scrollTo(target, opts = {}) {
    this.lenis && this.lenis.scrollTo(target, opts);
  }

  // Scroll to a normalized 0..1 position with a freshly-measured limit.
  scrollToProgress(fraction, opts = {}) {
    if (!this.lenis) return;
    this.lenis.resize();
    const limit = this.lenis.limit || 0;
    this.lenis.scrollTo(limit * fraction, { duration: 1.6, ...opts });
  }

  refresh() {
    ScrollTrigger.refresh();
  }

  destroy() {
    if (this.tick) gsap.ticker.remove(this.tick);
    ScrollTrigger.getAll().forEach((t) => t.kill());
    this.lenis && this.lenis.destroy();
    this.lenis = null;
    this.tick = null;
  }
}

export const scrollController = new ScrollController();
