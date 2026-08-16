// Procedural PREMIUM automotive sound (Web Audio API, no external assets):
// a deep EV sub + a turbine-like whine bed, with airy "exhaust" whooshes for UI.
class AudioEngine {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.enabled = false;
    this.nodes = [];
    this.noiseBuf = null;
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
    this._startBed();
    this._ramp(this.master.gain, 0.85, 1.4);
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

  _noise() {
    if (this.noiseBuf) return this.noiseBuf;
    const len = this.ctx.sampleRate * 2;
    const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    this.noiseBuf = buf;
    return buf;
  }

  _startBed() {
    if (this.bed) return;
    const ctx = this.ctx;
    const bed = ctx.createGain();
    bed.gain.value = 0.22;
    bed.connect(this.master);
    this.bed = bed;

    // deep body sub
    const sub = ctx.createOscillator();
    sub.type = "sine";
    sub.frequency.value = 41;
    const subG = ctx.createGain();
    subG.gain.value = 0.6;
    sub.connect(subG);
    subG.connect(bed);
    sub.start();
    this.nodes.push(sub);

    // turbine / EV whine — two detuned triangles through a resonant bandpass
    const whineFilter = ctx.createBiquadFilter();
    whineFilter.type = "bandpass";
    whineFilter.frequency.value = 420;
    whineFilter.Q.value = 6;
    whineFilter.connect(bed);
    this.whineFilter = whineFilter;

    [173, 174.5, 262].forEach((f, i) => {
      const o = ctx.createOscillator();
      o.type = i === 2 ? "sine" : "triangle";
      o.frequency.value = f;
      const g = ctx.createGain();
      g.gain.value = i === 2 ? 0.12 : 0.3;
      o.connect(g);
      g.connect(whineFilter);
      o.start();
      this.nodes.push(o);
    });

    // slow movement on the whine
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.08;
    const lfoG = ctx.createGain();
    lfoG.gain.value = 120;
    lfo.connect(lfoG);
    lfoG.connect(whineFilter.frequency);
    lfo.start();
    this.nodes.push(lfo);
  }

  // scroll velocity -> the whine opens up like gentle acceleration
  setIntensity(v) {
    if (!this.enabled || !this.whineFilter) return;
    const target = 380 + Math.min(Math.abs(v) * 55, 1600);
    this.whineFilter.frequency.setTargetAtTime(target, this.ctx.currentTime, 0.25);
  }

  // airy exhaust/intake sweep
  _whoosh({ from = 300, to = 1800, dur = 0.6, gain = 0.12 }) {
    if (!this.enabled || !this.ctx) return;
    const ctx = this.ctx;
    const src = ctx.createBufferSource();
    src.buffer = this._noise();
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.Q.value = 1.2;
    bp.frequency.setValueAtTime(from, ctx.currentTime);
    bp.frequency.exponentialRampToValueAtTime(Math.max(to, 40), ctx.currentTime + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(gain, ctx.currentTime + dur * 0.3);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
    src.connect(bp);
    bp.connect(g);
    g.connect(this.master);
    src.start();
    src.stop(ctx.currentTime + dur + 0.05);
  }

  _tone({ freq = 520, type = "sine", dur = 0.18, gain = 0.08, sweep = 0 }) {
    if (!this.enabled || !this.ctx) return;
    const ctx = this.ctx;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, ctx.currentTime);
    if (sweep) o.frequency.exponentialRampToValueAtTime(Math.max(freq + sweep, 30), ctx.currentTime + dur);
    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(gain, ctx.currentTime + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
    o.connect(g);
    g.connect(this.master);
    o.start();
    o.stop(ctx.currentTime + dur + 0.02);
  }

  hover() {
    this._tone({ freq: 1250, type: "sine", dur: 0.05, gain: 0.03 });
  }
  menuOpen() {
    this._whoosh({ from: 260, to: 2200, dur: 0.7, gain: 0.13 });
    this._tone({ freq: 120, type: "sawtooth", dur: 0.5, gain: 0.06, sweep: 500 });
  }
  menuClose() {
    this._whoosh({ from: 2200, to: 240, dur: 0.6, gain: 0.11 });
  }
  select() {
    this._whoosh({ from: 420, to: 1500, dur: 0.35, gain: 0.1 });
    this._tone({ freq: 660, type: "sine", dur: 0.22, gain: 0.06, sweep: 220 });
  }
}

export const audio = new AudioEngine();
