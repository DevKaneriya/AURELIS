// Procedural sound engine using the Web Audio API. No external assets.
class AudioEngine {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.ambientGain = null;
    this.enabled = false;
    this.nodes = [];
  }

  _ensure() {
    if (this.ctx) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    this.ctx = new AC();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0.0001;
    this.master.connect(this.ctx.destination);
  }

  async enable() {
    this._ensure();
    if (!this.ctx) return;
    if (this.ctx.state === "suspended") await this.ctx.resume();
    this.enabled = true;
    this._startAmbient();
    this._ramp(this.master.gain, 0.9, 1.2);
  }

  disable() {
    if (!this.ctx) return;
    this._ramp(this.master.gain, 0.0001, 0.6);
    this.enabled = false;
  }

  _ramp(param, value, time) {
    const t = this.ctx.currentTime;
    param.cancelScheduledValues(t);
    param.setValueAtTime(Math.max(param.value, 0.0001), t);
    param.exponentialRampToValueAtTime(Math.max(value, 0.0001), t + time);
  }

  _startAmbient() {
    if (this.ambientGain) return;
    const ctx = this.ctx;
    const ambient = ctx.createGain();
    ambient.gain.value = 0.18;
    ambient.connect(this.master);
    this.ambientGain = ambient;

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 420;
    filter.Q.value = 4;
    filter.connect(ambient);

    // Two detuned low drones for a warm cinematic bed.
    [55, 55.4, 82.5].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = i === 2 ? "triangle" : "sawtooth";
      osc.frequency.value = freq;
      const g = ctx.createGain();
      g.gain.value = i === 2 ? 0.25 : 0.5;
      osc.connect(g);
      g.connect(filter);
      osc.start();
      this.nodes.push(osc);
    });

    // Slow filter LFO for movement.
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.06;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 180;
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start();
    this.nodes.push(lfo);

    this.ambientFilter = filter;
  }

  // scroll velocity -> subtle brightness of the ambient bed
  setIntensity(v) {
    if (!this.enabled || !this.ambientFilter) return;
    const target = 400 + Math.min(Math.abs(v) * 40, 1400);
    this.ambientFilter.frequency.setTargetAtTime(
      target,
      this.ctx.currentTime,
      0.3
    );
  }

  _blip({ freq = 440, type = "sine", dur = 0.12, gain = 0.2, sweep = 0 }) {
    if (!this.enabled || !this.ctx) return;
    const ctx = this.ctx;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    if (sweep)
      osc.frequency.exponentialRampToValueAtTime(
        Math.max(freq + sweep, 20),
        ctx.currentTime + dur
      );
    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(gain, ctx.currentTime + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
    osc.connect(g);
    g.connect(this.master);
    osc.start();
    osc.stop(ctx.currentTime + dur + 0.02);
  }

  hover() {
    this._blip({ freq: 900, type: "sine", dur: 0.06, gain: 0.05 });
  }
  menuOpen() {
    this._blip({ freq: 180, type: "sawtooth", dur: 0.5, gain: 0.14, sweep: 700 });
  }
  menuClose() {
    this._blip({ freq: 700, type: "sawtooth", dur: 0.45, gain: 0.12, sweep: -560 });
  }
  select() {
    this._blip({ freq: 320, type: "triangle", dur: 0.35, gain: 0.16, sweep: 480 });
  }
}

export const audio = new AudioEngine();
