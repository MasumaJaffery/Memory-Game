import React, { useEffect, useRef } from 'react';
import type { PlayerAlignment } from '../types/game';

interface VictoryParticlesProps {
  alignment: PlayerAlignment;
}

type ParticleShape = 'star' | 'diamond' | 'ribbon' | 'sparkle';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  rotation: number;
  vRot: number;
  tumblePhase: number;
  tumbleSpeed: number;
  gravity: number;
  drag: number;
  life: number;
  maxLife: number;
  shape: ParticleShape;
}

const ROYAL_PALETTE = [
  '#f7d881',
  '#f0b938',
  '#fff4c7',
  '#d61f52',
  '#ff6b95',
  '#e3a83b',
];

const REBEL_PALETTE = [
  '#d896ff',
  '#f7d881',
  '#b55fe6',
  '#ff69b4',
  '#7ee8fa',
  '#fff0f7',
];

function drawStar(ctx: CanvasRenderingContext2D, r: number): void {
  ctx.beginPath();
  for (let i = 0; i < 8; i++) {
    const rad = i % 2 === 0 ? r : r * 0.36;
    const angle = (i * Math.PI) / 4;
    const px = Math.cos(angle) * rad;
    const py = Math.sin(angle) * rad;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
}

export const VictoryParticles: React.FC<VictoryParticlesProps> = ({ alignment }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const palette = alignment === 'Rebel' ? REBEL_PALETTE : ROYAL_PALETTE;
    const shapes: ParticleShape[] = ['star', 'diamond', 'ribbon', 'sparkle'];
    const particles: Particle[] = [];

    const spawnBurst = (originX: number, originY: number, count: number, powerScale = 1) => {
      for (let i = 0; i < count; i++) {
        const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.35;
        const speed = (180 + Math.random() * 440) * powerScale;
        const maxLife = 1.9 + Math.random() * 1.7;
        particles.push({
          x: originX + (Math.random() - 0.5) * 36,
          y: originY + (Math.random() - 0.5) * 24,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 70 * powerScale,
          size: 5 + Math.random() * 6.5,
          color: palette[Math.floor(Math.random() * palette.length)],
          alpha: 1,
          rotation: Math.random() * Math.PI * 2,
          vRot: (Math.random() - 0.5) * 7,
          tumblePhase: Math.random() * Math.PI * 2,
          tumbleSpeed: 4 + Math.random() * 6,
          gravity: 250 + Math.random() * 110,
          drag: 0.975,
          life: 0,
          maxLife,
          shape: shapes[Math.floor(Math.random() * shapes.length)],
        });
      }
    };

    // Wave 1: Center mirror explosion
    spawnBurst(width * 0.5, height * 0.48, 75, 1.05);

    // Wave 2: Left & Right mirror bow flourishes
    const wave2Timer = window.setTimeout(() => {
      spawnBurst(width * 0.28, height * 0.62, 48, 0.95);
      spawnBurst(width * 0.72, height * 0.62, 48, 0.95);
    }, 220);

    // Wave 3: High royal crown shower
    const wave3Timer = window.setTimeout(() => {
      spawnBurst(width * 0.5, height * 0.34, 55, 0.9);
    }, 520);

    let lastTime = performance.now();
    let ambientAccumulator = 0;
    let elapsedTotal = 0;
    let rafId = 0;

    const tick = (now: number) => {
      const rawDt = (now - lastTime) / 1000;
      const dt = Math.min(rawDt, 0.05);
      lastTime = now;
      elapsedTotal += dt;

      ctx.clearRect(0, 0, width, height);

      // Gentle ongoing shimmer motes for first 5 seconds of victory
      if (elapsedTotal < 5.5) {
        ambientAccumulator += dt;
        if (ambientAccumulator > 0.09 && particles.length < 180) {
          ambientAccumulator = 0;
          particles.push({
            x: width * (0.2 + Math.random() * 0.6),
            y: -12,
            vx: (Math.random() - 0.5) * 45,
            vy: 55 + Math.random() * 75,
            size: 4.5 + Math.random() * 4.5,
            color: palette[Math.floor(Math.random() * palette.length)],
            alpha: 1,
            rotation: Math.random() * Math.PI * 2,
            vRot: (Math.random() - 0.5) * 3,
            tumblePhase: Math.random() * Math.PI * 2,
            tumbleSpeed: 3 + Math.random() * 4,
            gravity: 22,
            drag: 0.995,
            life: 0,
            maxLife: 2.6 + Math.random() * 1.2,
            shape: Math.random() > 0.45 ? 'star' : 'diamond',
          });
        }
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life += dt;
        if (p.life >= p.maxLife || p.y > height + 40) {
          particles.splice(i, 1);
          continue;
        }

        const dragFactor = Math.pow(p.drag, dt * 60);
        p.vx *= dragFactor;
        p.vy = p.vy * dragFactor + p.gravity * dt;
        p.x += p.vx * dt + Math.sin(p.tumblePhase) * 18 * dt;
        p.y += p.vy * dt;
        p.rotation += p.vRot * dt;
        p.tumblePhase += p.tumbleSpeed * dt;

        const progress = p.life / p.maxLife;
        p.alpha = progress > 0.7 ? Math.max(0, 1 - (progress - 0.7) / 0.3) : 1;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;

        const scaleY = 0.35 + 0.65 * Math.abs(Math.cos(p.tumblePhase));

        if (p.shape === 'star') {
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 8;
          drawStar(ctx, p.size * 1.15);
        } else if (p.shape === 'diamond') {
          ctx.scale(1, scaleY);
          ctx.beginPath();
          ctx.moveTo(0, -p.size);
          ctx.lineTo(p.size * 0.7, 0);
          ctx.lineTo(0, p.size);
          ctx.lineTo(-p.size * 0.7, 0);
          ctx.closePath();
          ctx.fill();
        } else if (p.shape === 'ribbon') {
          ctx.scale(1, scaleY);
          ctx.fillRect(-p.size * 0.9, -p.size * 0.42, p.size * 1.8, p.size * 0.84);
        } else {
          ctx.shadowColor = '#fff9d6';
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.48, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      if (particles.length > 0 || elapsedTotal < 5.5) {
        rafId = window.requestAnimationFrame(tick);
      }
    };

    rafId = window.requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('resize', resize);
      window.clearTimeout(wave2Timer);
      window.clearTimeout(wave3Timer);
      window.cancelAnimationFrame(rafId);
    };
  }, [alignment]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-50 h-full w-full"
    />
  );
};
