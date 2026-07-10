/**
 * Procedural Audio Engine for the 3D Grand Park using the Web Audio API.
 * Synthesizes organic soundscapes (birds, crickets, wind, rain, fountain, sitting drone,
 * shop bustle, and footsteps) directly in the browser.
 * Fully self-contained with no external assets!
 */

import * as THREE from 'three';

export class AudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = true;

  // Sound nodes
  private masterGain: GainNode | null = null;
  private rainGain: GainNode | null = null;
  private windGain: GainNode | null = null;
  private fountainGain: GainNode | null = null;
  private cricketsGain: GainNode | null = null;
  private sittingGain: GainNode | null = null;
  private shopHumGain: GainNode | null = null;
  private musicGain: GainNode | null = null;

  // Continuous synthesizers sources for wind, rain, fountain, crickets, sitting, and shop
  private windSource: AudioBufferSourceNode | null = null;
  private rainSource: AudioBufferSourceNode | null = null;
  private fountainSource: AudioBufferSourceNode | null = null;
  private cricketsSource: AudioBufferSourceNode | null = null;
  private sittingSource: { oscs: OscillatorNode[]; bq: BiquadFilterNode } | null = null;
  private shopSource: { oscs: OscillatorNode[]; bq: BiquadFilterNode; noise: AudioBufferSourceNode } | null = null;

  // Timers and states
  private birdTimer: number | null = null;
  private musicIntervalId: any = null;
  private lastFootstepTime: number = 0;

  constructor() {
    // Context is created lazily on first user interaction
  }

  public async start(): Promise<void> {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') {
        await this.ctx.resume();
      }
      this.isMuted = false;
      this.masterGain?.gain.setTargetAtTime(1.0, this.ctx.currentTime, 0.1);
      return;
    }

    try {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtxClass();
      
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // Create noise buffers
      const noiseBuffer = this.createNoiseBuffer();

      // Start continuous synthesizers
      this.setupWind(noiseBuffer);
      this.setupRain(noiseBuffer);
      this.setupFountain(noiseBuffer);
      this.setupCrickets();
      this.setupSittingDrone();
      this.setupShopHum(noiseBuffer);
      this.startBirdsLoop();
      this.setupAmbientMusic();

      this.isMuted = false;
      // Fade in master volume
      this.masterGain.gain.setTargetAtTime(1.0, this.ctx.currentTime, 0.5);
    } catch (e) {
      console.error('Failed to initialize Web Audio API:', e);
    }
  }

  public stop(): void {
    if (this.musicIntervalId) {
      clearInterval(this.musicIntervalId);
      this.musicIntervalId = null;
    }
    if (this.ctx) {
      this.isMuted = true;
      this.masterGain?.gain.setTargetAtTime(0, this.ctx.currentTime, 0.15);
      setTimeout(() => {
        if (this.isMuted) {
          this.ctx?.suspend();
        }
      }, 200);
    }
  }

  public setMute(muted: boolean): void {
    if (muted) {
      this.stop();
    } else {
      this.start();
    }
  }

  public isEngineActive(): boolean {
    return !this.isMuted && this.ctx !== null;
  }

  /**
   * Generates a common noise buffer for procedural generators.
   */
  private createNoiseBuffer(): AudioBuffer {
    const rate = this.ctx!.sampleRate;
    const size = 3 * rate; // 3 seconds of unique noise
    const buffer = this.ctx!.createBuffer(1, size, rate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < size; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }

  /**
   * Wind Synthesis: Bandpass-filtered white noise swept slowly by an LFO.
   */
  private setupWind(noiseBuffer: AudioBuffer): void {
    if (!this.ctx || !this.masterGain) return;

    this.windGain = this.ctx.createGain();
    this.windGain.gain.setValueAtTime(0.04, this.ctx.currentTime); // Gentle start
    this.windGain.connect(this.masterGain);

    this.windSource = this.ctx.createBufferSource();
    this.windSource.buffer = noiseBuffer;
    this.windSource.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.setValueAtTime(1.8, this.ctx.currentTime);
    filter.frequency.setValueAtTime(320, this.ctx.currentTime);

    // LFO modulator for wind howling sweeps
    const lfo = this.ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(0.08, this.ctx.currentTime); // Very slow sweep (12 seconds)

    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(140, this.ctx.currentTime); // sweep frequency range +/- 140Hz

    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    
    this.windSource.connect(filter);
    filter.connect(this.windGain);

    lfo.start();
    this.windSource.start();
  }

  /**
   * Rain Synthesis: Bandpass-filtered high white noise + occasional tiny drop crackles.
   */
  private setupRain(noiseBuffer: AudioBuffer): void {
    if (!this.ctx || !this.masterGain) return;

    this.rainGain = this.ctx.createGain();
    this.rainGain.gain.setValueAtTime(0.0, this.ctx.currentTime); // Off initially
    this.rainGain.connect(this.masterGain);

    this.rainSource = this.ctx.createBufferSource();
    this.rainSource.buffer = noiseBuffer;
    this.rainSource.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.setValueAtTime(2.2, this.ctx.currentTime);
    filter.frequency.setValueAtTime(1100, this.ctx.currentTime);

    this.rainSource.connect(filter);
    filter.connect(this.rainGain);
    this.rainSource.start();
  }

  /**
   * Fountain Synthesis: Lowpass-filtered continuous water splash rushing white noise.
   */
  private setupFountain(noiseBuffer: AudioBuffer): void {
    if (!this.ctx || !this.masterGain) return;

    this.fountainGain = this.ctx.createGain();
    this.fountainGain.gain.setValueAtTime(0.08, this.ctx.currentTime); // Medium-low volume
    this.fountainGain.connect(this.masterGain);

    this.fountainSource = this.ctx.createBufferSource();
    this.fountainSource.buffer = noiseBuffer;
    this.fountainSource.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(650, this.ctx.currentTime);

    this.fountainSource.connect(filter);
    filter.connect(this.fountainGain);
    this.fountainSource.start();
  }

  /**
   * Crickets Synthesis: High frequency triangle oscillator chirped by a fast pulse LFO.
   */
  private setupCrickets(): void {
    if (!this.ctx || !this.masterGain) return;

    this.cricketsGain = this.ctx.createGain();
    this.cricketsGain.gain.setValueAtTime(0.0, this.ctx.currentTime); // Off by default (night only)
    this.cricketsGain.connect(this.masterGain);

    this.cricketsSource = this.ctx.createBufferSource(); // Dummy to keep handle
    
    // Create cricket oscillator chirp chain
    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(3950, this.ctx.currentTime);

    const chirpLfo = this.ctx.createOscillator();
    chirpLfo.type = 'triangle';
    chirpLfo.frequency.setValueAtTime(36, this.ctx.currentTime); // 36Hz pulse chirp rate

    const chirpGain = this.ctx.createGain();
    chirpGain.gain.setValueAtTime(0.5, this.ctx.currentTime);

    // Filter to sweeten crickets
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.setValueAtTime(12, this.ctx.currentTime);
    filter.frequency.setValueAtTime(3950, this.ctx.currentTime);

    chirpLfo.connect(chirpGain);
    
    // Connect to a modulated gain node to create rhythmic "sh-sh-sh" chirping
    const modGain = this.ctx.createGain();
    modGain.gain.setValueAtTime(0.06, this.ctx.currentTime);
    
    // Fast gating
    chirpGain.connect(modGain.gain);

    osc.connect(filter);
    filter.connect(modGain);
    modGain.connect(this.cricketsGain);

    osc.start();
    chirpLfo.start();
  }

  /**
   * Sitting Serenity Pad: Deep, warm chord progression representing relaxation.
   */
  private setupSittingDrone(): void {
    if (!this.ctx || !this.masterGain) return;

    this.sittingGain = this.ctx.createGain();
    this.sittingGain.gain.setValueAtTime(0.0, this.ctx.currentTime); // Active only when sitting
    this.sittingGain.connect(this.masterGain);

    const oscs: OscillatorNode[] = [];
    const bq = this.ctx.createBiquadFilter();
    bq.type = 'lowpass';
    bq.frequency.setValueAtTime(180, this.ctx.currentTime); // Soft low-pass filter
    bq.connect(this.sittingGain);

    // Warm G-Major / C-Major pentatonic base frequencies (110Hz G2, 137.5Hz C#3/C3 approx, 165Hz E3, 220Hz A3)
    const freqs = [110.0, 146.83, 164.81, 220.0];
    freqs.forEach(f => {
      const osc = this.ctx!.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, this.ctx!.currentTime);
      osc.connect(bq);
      osc.start();
      oscs.push(osc);
    });

    this.sittingSource = { oscs, bq };
  }

  /**
   * Shop Hum Synthesis: Low murmuring chatter (bandpass white noise + cozy jazz arpeggios).
   */
  private setupShopHum(noiseBuffer: AudioBuffer): void {
    if (!this.ctx || !this.masterGain) return;

    this.shopHumGain = this.ctx.createGain();
    this.shopHumGain.gain.setValueAtTime(0.0, this.ctx.currentTime); // Active near buildings
    this.shopHumGain.connect(this.masterGain);

    // 1. White noise filtered for general bustle room tone
    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(280, this.ctx.currentTime);
    noiseFilter.Q.setValueAtTime(1.0, this.ctx.currentTime);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.12, this.ctx.currentTime);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.shopHumGain);
    noise.start();

    // 2. Continuous cozy minor/major 7th arpeggio generator for indoor vibe
    const oscs: OscillatorNode[] = [];
    const bq = this.ctx.createBiquadFilter();
    bq.type = 'lowpass';
    bq.frequency.setValueAtTime(320, this.ctx.currentTime);
    bq.connect(this.shopHumGain);

    const chord = [261.63, 311.13, 392.00, 466.16]; // Cm7 (C4, Eb4, G4, Bb4) for cozy, warm cafe/shop feel
    chord.forEach(f => {
      const osc = this.ctx!.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, this.ctx!.currentTime);
      
      // Connect to its own slow volume modulator
      const vGain = this.ctx!.createGain();
      vGain.gain.setValueAtTime(0.015, this.ctx!.currentTime);
      
      osc.connect(vGain);
      vGain.connect(bq);
      osc.start();
      oscs.push(osc);
    });

    this.shopSource = { oscs, bq, noise };
  }

  /**
   * Periodic procedural bird chirping whistle generator.
   */
  private startBirdsLoop(): void {
    const triggerBirdChirp = (isReply = false) => {
      if (this.isMuted || !this.ctx || !this.masterGain) {
        if (!isReply) {
          this.birdTimer = window.setTimeout(() => triggerBirdChirp(false), 5000);
        }
        return;
      }

      // Check states: birds do not chirp at night or during heavy rain
      const isRaining = this.rainGain ? this.rainGain.gain.value > 0.05 : false;
      const isNight = this.cricketsGain ? this.cricketsGain.gain.value > 0.1 : false;

      if (isRaining || isNight) {
        if (!isReply) {
          this.birdTimer = window.setTimeout(() => triggerBirdChirp(false), 8000 + Math.random() * 5000);
        }
        return;
      }

      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      osc.type = 'sine';
      
      // Multi-species natural pitch variation (varying from 1900Hz to 4100Hz)
      const pSweep = (isReply ? 2800 : 2000) + Math.random() * 1800;
      osc.frequency.setValueAtTime(pSweep, t);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0, t);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start();

      const pattern = Math.floor(Math.random() * 3);
      if (pattern === 0) {
        // Quick sweet tweet-tweet-tweet!
        for (let i = 0; i < 3; i++) {
          const start = t + i * 0.12;
          osc.frequency.setValueAtTime(pSweep, start);
          osc.frequency.exponentialRampToValueAtTime(pSweep + 500, start + 0.06);
          gain.gain.setValueAtTime(0, start);
          gain.gain.linearRampToValueAtTime(0.04, start + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.10);
        }
        osc.stop(t + 0.5);
      } else if (pattern === 1) {
        // Upward/Downward slide
        osc.frequency.setValueAtTime(pSweep, t);
        osc.frequency.exponentialRampToValueAtTime(pSweep + 600, t + 0.12);
        osc.frequency.exponentialRampToValueAtTime(pSweep - 300, t + 0.25);
        gain.gain.linearRampToValueAtTime(0.045, t + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.25);
        osc.stop(t + 0.27);
      } else {
        // Fast sweet trill
        for (let i = 0; i < 5; i++) {
          const start = t + i * 0.045;
          osc.frequency.setValueAtTime(pSweep + (i % 2 === 0 ? 300 : 0), start);
          gain.gain.setValueAtTime(0, start);
          gain.gain.linearRampToValueAtTime(0.03, start + 0.012);
          gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.035);
        }
        osc.stop(t + 0.25);
      }

      // If this is the main bird, sometimes trigger a realistic reply from another bird in the background
      if (!isReply && Math.random() > 0.45) {
        window.setTimeout(() => {
          triggerBirdChirp(true);
        }, 250 + Math.random() * 350);
      }

      if (!isReply) {
        // More active, responsive nature loop intervals (every 1.5 to 3.5 seconds)
        this.birdTimer = window.setTimeout(() => triggerBirdChirp(false), 1500 + Math.random() * 2000);
      }
    };

    triggerBirdChirp();
  }

  /**
   * Synthesizes a high-fidelity walking footstep sound based on the material the player is standing on.
   */
  public triggerFootstep(material: 'asphalt' | 'grass' | 'concrete' | 'stone' = 'grass'): void {
    return; // Footsteps disabled per user request
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    
    // Rate-limit footsteps to maximum 1 every 200ms
    if (now - this.lastFootstepTime < 0.22) return;
    this.lastFootstepTime = now;

    // We synthesize two components: a low-frequency thud and a high-frequency material-specific friction crunch
    const tOsc = this.ctx.createOscillator();
    const tGain = this.ctx.createGain();
    tOsc.type = 'triangle';

    const noiseNode = this.ctx.createBufferSource();
    const sampleRate = this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(1, sampleRate * 0.18, sampleRate);
    const channelData = noiseBuffer.getChannelData(0);
    for (let i = 0; i < channelData.length; i++) {
      channelData[i] = Math.random() * 2 - 1;
    }
    noiseNode.buffer = noiseBuffer;

    const noiseGain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    if (material === 'asphalt') {
      // Asphalt (coarse friction, medium-heavy thud)
      tOsc.frequency.setValueAtTime(95, now);
      tOsc.frequency.exponentialRampToValueAtTime(40, now + 0.08);
      
      tGain.gain.setValueAtTime(0.0, now);
      tGain.gain.linearRampToValueAtTime(0.20, now + 0.01);
      tGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.10);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1500, now);
      filter.Q.setValueAtTime(2.0, now);

      noiseGain.gain.setValueAtTime(0.0, now);
      noiseGain.gain.linearRampToValueAtTime(0.09, now + 0.01);
      noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

    } else if (material === 'concrete' || material === 'stone') {
      // Concrete/Stone (hard impact, crisp clack)
      tOsc.frequency.setValueAtTime(120, now);
      tOsc.frequency.exponentialRampToValueAtTime(55, now + 0.06);

      tGain.gain.setValueAtTime(0.0, now);
      tGain.gain.linearRampToValueAtTime(0.26, now + 0.01);
      tGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

      filter.type = 'highpass';
      filter.frequency.setValueAtTime(2800, now);

      noiseGain.gain.setValueAtTime(0.0, now);
      noiseGain.gain.linearRampToValueAtTime(0.12, now + 0.01);
      noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

    } else {
      // Grass (soft leaf rustle, deeper thud)
      tOsc.frequency.setValueAtTime(75, now);
      tOsc.frequency.exponentialRampToValueAtTime(30, now + 0.10);

      tGain.gain.setValueAtTime(0.0, now);
      tGain.gain.linearRampToValueAtTime(0.18, now + 0.01);
      tGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(3200, now);
      filter.Q.setValueAtTime(1.5, now);

      noiseGain.gain.setValueAtTime(0.0, now);
      noiseGain.gain.linearRampToValueAtTime(0.07, now + 0.01);
      noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.11);
    }

    // Connect and play thud
    tOsc.connect(tGain);
    tGain.connect(this.masterGain!);
    tOsc.start(now);
    tOsc.stop(now + 0.14);

    // Connect and play friction crunch
    noiseNode.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.masterGain!);
    noiseNode.start(now);
    noiseNode.stop(now + 0.14);
  }

  /**
   * Dynamic state manager that blends all active sound components seamlessly!
   */
  public updateAudioState(isSitting: boolean, playerPos: THREE.Vector3, time: string, weather: string): void {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;

    // 1. Sitting drone volume blending
    if (isSitting) {
      this.sittingGain?.gain.setTargetAtTime(0.35, t, 0.4);
    } else {
      this.sittingGain?.gain.setTargetAtTime(0.0, t, 0.2);
    }

    // 2. Shop visiting hum volume blending
    // Player is near buildings if they go onto the outer concrete plazas: Left (X < -21.0), Back (Z < -21.0), Right (X > 21.0)
    const isNearShops = Math.abs(playerPos.x) > 21.0 || playerPos.z < -21.0;
    if (isNearShops) {
      this.shopHumGain?.gain.setTargetAtTime(0.28, t, 0.5);
    } else {
      this.shopHumGain?.gain.setTargetAtTime(0.0, t, 0.3);
    }

    // 3. Weather-dependent rain and wind volumes
    if (weather === 'rainy') {
      this.rainGain?.gain.setTargetAtTime(0.35, t, 0.6);
      this.windGain?.gain.setTargetAtTime(0.12, t, 0.6); // howling rain wind
    } else if (weather === 'foggy') {
      this.rainGain?.gain.setTargetAtTime(0.0, t, 0.4);
      this.windGain?.gain.setTargetAtTime(0.06, t, 0.4); // soft foggy breeze
    } else {
      // Sunny
      this.rainGain?.gain.setTargetAtTime(0.0, t, 0.4);
      this.windGain?.gain.setTargetAtTime(0.03, t, 0.4); // very calm sunny drift
    }

    // 4. Crickets for nighttime ambiance
    if (time === 'night') {
      this.cricketsGain?.gain.setTargetAtTime(0.18, t, 0.8);
    } else if (time === 'sunset') {
      this.cricketsGain?.gain.setTargetAtTime(0.06, t, 0.8); // crickets start tuning in
    } else {
      this.cricketsGain?.gain.setTargetAtTime(0.0, t, 0.4);
    }

    // 5. Fountain spatial roll-off based on proximity to center (0,0)
    const distanceToFountain = playerPos.length();
    const maxDistance = 28.0;
    const fountainVol = Math.max(0.0, 1.0 - (distanceToFountain / maxDistance));
    
    // Fountain doesn't play as loudly inside closed shops or when sitting far away
    const multiplier = isNearShops ? 0.2 : 1.0;
    this.fountainGain?.gain.setTargetAtTime(0.24 * fountainVol * multiplier, t, 0.25);
  }

  /**
   * Compatibility wrapper for simpler environment updates
   */
  public updateEnvironment(time: 'day' | 'sunset' | 'night', weather: 'sunny' | 'foggy' | 'rainy'): void {
    this.updateAudioState(false, new THREE.Vector3(0, 1.6, 12.0), time, weather);
  }

  /**
   * Proximity roll-off compatibility wrapper
   */
  public updateFountainDistance(distance: number): void {
    // Spatial updates are now handled globally in updateAudioState
  }

  /**
   * Sets the volume of the sound engine's master gain.
   */
  public setSoundVolume(volume: number): void {
    if (!this.ctx || !this.masterGain) return;
    this.masterGain.gain.setTargetAtTime(volume, this.ctx.currentTime, 0.1);
  }

  /**
   * Sets the volume of the ambient background music.
   */
  public setMusicVolume(volume: number): void {
    if (!this.ctx || !this.musicGain) return;
    this.musicGain.gain.setTargetAtTime(0.15 * volume, this.ctx.currentTime, 0.1);
  }

  /**
   * Synthesizes a high-fidelity golden chime sound when collecting a key.
   */
  public triggerKeyChime(): void {
    if (!this.ctx || this.isMuted) return;
    const t = this.ctx.currentTime;

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gainNode1 = this.ctx.createGain();
    const gainNode2 = this.ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(1200, t);
    osc1.frequency.exponentialRampToValueAtTime(1600, t + 0.1);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(2400, t);
    osc2.frequency.exponentialRampToValueAtTime(2800, t + 0.08);

    gainNode1.gain.setValueAtTime(0, t);
    gainNode1.gain.linearRampToValueAtTime(0.12, t + 0.015);
    gainNode1.gain.exponentialRampToValueAtTime(0.0001, t + 0.55);

    gainNode2.gain.setValueAtTime(0, t);
    gainNode2.gain.linearRampToValueAtTime(0.06, t + 0.02);
    gainNode2.gain.exponentialRampToValueAtTime(0.0001, t + 0.28);

    osc1.connect(gainNode1);
    osc2.connect(gainNode2);

    gainNode1.connect(this.masterGain!);
    gainNode2.connect(this.masterGain!);

    osc1.start(t);
    osc2.start(t);
    osc1.stop(t + 0.6);
    osc2.stop(t + 0.3);
  }

  /**
   * Synthesizes a sweet, ascending major-scale arpeggio when finding a hidden book collectible.
   */
  public triggerCollectibleSound(): void {
    if (!this.ctx || this.isMuted) return;
    const t = this.ctx.currentTime;
    
    // Play an ascending sweet arpeggio (C Major 9)
    const freqs = [329.63, 392.00, 523.25, 659.25, 783.99, 1046.50]; // E4, G4, C5, E5, G5, C6
    freqs.forEach((freq, idx) => {
      const noteTime = t + idx * 0.07;
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, noteTime);
      
      gain.gain.setValueAtTime(0, noteTime);
      gain.gain.linearRampToValueAtTime(0.14, noteTime + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 0.65);
      
      osc.connect(gain);
      gain.connect(this.masterGain!);
      
      osc.start(noteTime);
      osc.stop(noteTime + 0.7);
    });
  }

  /**
   * Generates a warm, deeply relaxing musical arpeggio when sitting down.
   */
  public triggerSitMusicTone(): void {
    if (!this.ctx || this.isMuted) return;
    const t = this.ctx.currentTime;

    const notes = [261.63, 329.63, 392.00, 523.25, 659.25]; // C4, E4, G4, C5, E5
    notes.forEach((freq, index) => {
      const noteTime = t + index * 0.12;

      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0, noteTime);
      gain.gain.linearRampToValueAtTime(0.08, noteTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 1.2);

      osc.connect(gain);
      gain.connect(this.masterGain!);

      osc.start(noteTime);
      osc.stop(noteTime + 1.3);
    });
  }

  /**
   * Synthesizes a celebratory major-scale synthesizer arpeggio when unlocking.
   */
  public triggerUnlockFanfare(): void {
    if (!this.ctx || this.isMuted) return;
    const t = this.ctx.currentTime;

    const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, index) => {
      const noteTime = t + index * 0.08;
      
      const osc = this.ctx!.createOscillator();
      const subOsc = this.ctx!.createOscillator();
      const filter = this.ctx!.createBiquadFilter();
      const gain = this.ctx!.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, noteTime);

      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(freq / 2, noteTime);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1000, noteTime);
      filter.frequency.exponentialRampToValueAtTime(150, noteTime + 0.4);

      gain.gain.setValueAtTime(0, noteTime);
      gain.gain.linearRampToValueAtTime(0.12, noteTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 0.5);

      osc.connect(filter);
      subOsc.connect(filter);
      filter.connect(gain);
      
      gain.connect(this.masterGain!);

      osc.start(noteTime);
      subOsc.start(noteTime);
      osc.stop(noteTime + 0.6);
      subOsc.stop(noteTime + 0.6);
    });
  }

  /**
   * Generates incredibly gentle, slow ambient music chord progression.
   */
  private setupAmbientMusic(): void {
    if (!this.ctx || !this.masterGain) return;

    this.musicGain = this.ctx.createGain();
    this.musicGain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    this.musicGain.connect(this.masterGain);

    const chords = [
      [146.83, 196.00, 246.94, 293.66, 392.00], // Gmaj9 (Warm pastel summer morning vibe)
      [164.81, 220.00, 261.63, 329.63, 440.00], // Am9 (Cozy cosmic dreaminess)
      [130.81, 164.81, 196.00, 261.63, 329.63], // Cmaj7 (Deep emotional warmth)
      [146.83, 174.61, 220.00, 293.66, 349.23]  // Dm9 (Whimsical nostalgia)
    ];

    let chordIdx = 0;
    const oscPool: { osc: OscillatorNode; gain: GainNode; bq: BiquadFilterNode }[] = [];
    for (let i = 0; i < 5; i++) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const bq = this.ctx.createBiquadFilter();

      osc.type = 'sine';
      gain.gain.setValueAtTime(0, this.ctx.currentTime);
      bq.type = 'lowpass';
      bq.frequency.setValueAtTime(500, this.ctx.currentTime);

      osc.connect(bq);
      bq.connect(gain);
      gain.connect(this.musicGain);
      osc.start();

      oscPool.push({ osc, gain, bq });
    }

    const playNextChord = () => {
      if (this.isMuted || !this.ctx) return;

      const t = this.ctx.currentTime;
      const currentChord = chords[chordIdx];
      chordIdx = (chordIdx + 1) % chords.length;

      oscPool.forEach((voice, index) => {
        const freq = currentChord[index] || currentChord[0];
        
        voice.gain.gain.setValueAtTime(voice.gain.gain.value, t);
        voice.gain.gain.linearRampToValueAtTime(0, t + 1.8 + index * 0.1);

        setTimeout(() => {
          if (this.isMuted || !this.ctx) return;
          voice.osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
          voice.gain.gain.setValueAtTime(0, this.ctx.currentTime);
          voice.gain.gain.linearRampToValueAtTime(0.04, this.ctx.currentTime + 3.5 + index * 0.2);
        }, 2000);
      });
    };

    const t = this.ctx.currentTime;
    const initialChord = chords[0];
    oscPool.forEach((voice, index) => {
      const freq = initialChord[index];
      voice.osc.frequency.setValueAtTime(freq, t);
      voice.gain.gain.setValueAtTime(0, t);
      voice.gain.gain.linearRampToValueAtTime(0.04, t + 3.0 + index * 0.2);
    });

    this.musicIntervalId = setInterval(playNextChord, 10000);
  }
}
