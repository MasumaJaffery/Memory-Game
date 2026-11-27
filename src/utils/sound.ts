const MUTE_KEY = 'mirrorbound_muted_v1';
const MUSIC_KEY = 'mirrorbound_music_enabled_v1';
export const SOUNDTRACK_URL =
  '/assets/my-studio/Ever_After_High_Original_Song__Official_Lyric_Video__Ever_After_High__1__0ea92977.mp3';

const NORMAL_MUSIC_VOLUME = 0.34;
const DUCKED_MUSIC_VOLUME = 0.16;

class SoundEngine {
  private ctx: AudioContext | null = null;
  private muted: boolean = false;
  private musicEnabled: boolean = true;
  private bgm: HTMLAudioElement | null = null;
  private ducked: boolean = false;
  private visibilityBound: boolean = false;
  private unlockBound: boolean = false;

  constructor() {
    // Always start with music and sound ON by default when the game loads
    this.muted = false;
    this.musicEnabled = true;
    try {
      localStorage.setItem(MUTE_KEY, 'false');
      localStorage.setItem(MUSIC_KEY, 'true');
    } catch {
      // Ignore storage errors
    }
    this.bindAutoUnlock();
  }

  private bindAutoUnlock(): void {
    if (typeof window === 'undefined' || this.unlockBound) return;
    this.unlockBound = true;

    const tryPlayOnGesture = () => {
      if (!this.musicEnabled || this.muted) return;
      const bgm = this.ensureBgm();
      if (!bgm) return;
      if (bgm.paused) {
        bgm.volume = this.ducked ? DUCKED_MUSIC_VOLUME : NORMAL_MUSIC_VOLUME;
        void bgm.play().catch(() => {});
      }
    };

    window.addEventListener('pointerdown', tryPlayOnGesture, { passive: true });
    window.addEventListener('click', tryPlayOnGesture, { passive: true });
    window.addEventListener('touchstart', tryPlayOnGesture, { passive: true });
    window.addEventListener('keydown', tryPlayOnGesture, { passive: true });
  }

  private ensureBgm(): HTMLAudioElement | null {
    if (typeof window === 'undefined') return null;
    if (!this.bgm) {
      const audio = new Audio(SOUNDTRACK_URL);
      audio.loop = true;
      audio.preload = 'auto';
      audio.volume = this.ducked ? DUCKED_MUSIC_VOLUME : NORMAL_MUSIC_VOLUME;
      this.bgm = audio;
    }
    if (!this.visibilityBound && typeof document !== 'undefined') {
      this.visibilityBound = true;
      document.addEventListener('visibilitychange', () => {
        if (!this.bgm) return;
        if (document.hidden) {
          this.bgm.pause();
        } else if (this.musicEnabled && !this.muted) {
          void this.bgm.play().catch(() => {});
        }
      });
    }
    return this.bgm;
  }

  public isMuted(): boolean {
    return this.muted;
  }

  public isMusicEnabled(): boolean {
    return this.musicEnabled;
  }

  public ensureMusicPlaying(): void {
    if (this.muted || !this.musicEnabled) return;
    const bgm = this.ensureBgm();
    if (!bgm) return;
    bgm.volume = this.ducked ? DUCKED_MUSIC_VOLUME : NORMAL_MUSIC_VOLUME;
    if (bgm.paused) {
      void bgm.play().catch(() => {
        // Browser blocked autoplay before user gesture; global gesture listener will start it immediately on interaction
      });
    }
  }

  public setMusicDucked(ducked: boolean): void {
    this.ducked = ducked;
    if (this.bgm) {
      this.bgm.volume = ducked ? DUCKED_MUSIC_VOLUME : NORMAL_MUSIC_VOLUME;
    }
  }

  public setMusicEnabled(next: boolean): void {
    this.musicEnabled = next;
    try {
      localStorage.setItem(MUSIC_KEY, String(next));
    } catch {
      // Ignore storage errors
    }
    const bgm = this.ensureBgm();
    if (!bgm) return;
    if (next && !this.muted) {
      bgm.volume = this.ducked ? DUCKED_MUSIC_VOLUME : NORMAL_MUSIC_VOLUME;
      void bgm.play().catch(() => {});
    } else {
      bgm.pause();
    }
  }

  public toggleMusic(): boolean {
    const next = !this.musicEnabled;
    if (next && this.muted) {
      this.setMuted(false);
    }
    this.setMusicEnabled(next);
    return this.musicEnabled;
  }

  public setMuted(next: boolean): void {
    this.muted = next;
    try {
      localStorage.setItem(MUTE_KEY, String(next));
    } catch {
      // Ignore storage errors
    }
    if (this.bgm) {
      if (next) {
        this.bgm.pause();
      } else if (this.musicEnabled) {
        this.bgm.volume = this.ducked ? DUCKED_MUSIC_VOLUME : NORMAL_MUSIC_VOLUME;
        void this.bgm.play().catch(() => {});
      }
    }
  }

  public toggleMute(): boolean {
    this.setMuted(!this.muted);
    return this.muted;
  }

  private getContext(): AudioContext | null {
    if (this.muted || typeof window === 'undefined') return null;
    try {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!AudioCtx) return null;
        this.ctx = new AudioCtx();
      }
      if (this.ctx.state === 'suspended') {
        void this.ctx.resume();
      }
      return this.ctx;
    } catch {
      return null;
    }
  }

  private tone(
    freq: number,
    duration: number,
    type: OscillatorType = 'sine',
    gainPeak: number = 0.08,
    delay: number = 0,
    endFreq?: number
  ): void {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    if (endFreq !== undefined) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(40, endFreq), now + duration);
    }

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(gainPeak, now + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + duration + 0.02);
  }

  public playClick(): void {
    this.ensureMusicPlaying();
    this.tone(540, 0.06, 'triangle', 0.045, 0, 620);
  }

  public playFlip(): void {
    this.ensureMusicPlaying();
    this.tone(360, 0.085, 'sine', 0.055, 0, 580);
    this.tone(720, 0.06, 'triangle', 0.025, 0.02, 840);
  }

  public playMatch(streak: number): void {
    const scaleBoost = Math.min(streak - 1, 6);
    const root = 523.25 * Math.pow(1.05946, scaleBoost * 2);
    this.tone(root, 0.22, 'triangle', 0.08, 0);
    this.tone(root * 1.25, 0.24, 'sine', 0.075, 0.065);
    this.tone(root * 1.5, 0.32, 'sine', 0.07, 0.13);
  }

  public playMismatch(): void {
    this.tone(250, 0.12, 'triangle', 0.06, 0, 210);
    this.tone(205, 0.14, 'triangle', 0.055, 0.08, 175);
  }

  public playHint(): void {
    this.tone(659.25, 0.18, 'sine', 0.06, 0);
    this.tone(880, 0.24, 'sine', 0.055, 0.07);
    this.tone(1174.66, 0.3, 'sine', 0.045, 0.14);
  }

  public playTickWarning(): void {
    this.tone(920, 0.045, 'square', 0.025, 0, 740);
  }

  public playVictory(): void {
    const notes = [523.25, 659.25, 783.99, 987.77, 1046.5];
    notes.forEach((n, idx) => {
      this.tone(n, 0.38, 'triangle', 0.08, idx * 0.085);
      this.tone(n * 2, 0.28, 'sine', 0.03, idx * 0.085 + 0.02);
    });
  }

  public playTimeUp(): void {
    const notes = [440, 392, 349.23, 293.66];
    notes.forEach((n, idx) => {
      this.tone(n, 0.26, 'triangle', 0.065, idx * 0.11);
    });
  }
}

export const soundEngine = new SoundEngine();
