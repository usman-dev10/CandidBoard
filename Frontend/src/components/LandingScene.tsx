"use client";

import { useEffect, useRef } from "react";

type P = { x: number; y: number; z: number };

function sphere(n: number): P[] {
  const pts: P[] = [];
  const g = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const t = g * i;
    pts.push({ x: Math.cos(t) * r, y, z: Math.sin(t) * r });
  }
  return pts;
}

function rotate(p: P, ax: number, ay: number): P {
  const cx = Math.cos(ax);
  const sx = Math.sin(ax);
  const cy = Math.cos(ay);
  const sy = Math.sin(ay);
  const y = p.y * cx - p.z * sx;
  const z1 = p.y * sx + p.z * cx;
  const x = p.x * cy - z1 * sy;
  const z = p.x * sy + z1 * cy;
  return { x, y, z };
}

export function LandingScene() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const mobile = window.innerWidth < 640;
    const pts = sphere(mobile ? 64 : 140);
    let W = 0;
    let H = 0;
    let frame = 0;
    let t = 0;
    let visible = document.visibilityState === "visible";

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1 : 1.25);
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);
    const vis = () => {
      visible = document.visibilityState === "visible";
    };
    document.addEventListener("visibilitychange", vis);

    const draw = () => {
      frame = requestAnimationFrame(draw);
      if (!visible) return;
      t += reduced ? 0 : 0.008;
      ctx.clearRect(0, 0, W, H);
      const g = ctx.createRadialGradient(W * 0.5, H * 0.7, 40, W * 0.5, H * 0.55, Math.max(W, H) * 0.7);
      g.addColorStop(0, "rgba(88, 70, 210, 0.22)");
      g.addColorStop(0.45, "rgba(30, 27, 75, 0.12)");
      g.addColorStop(1, "rgba(8, 8, 16, 0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);

      const fl = 520;
      const scale = Math.min(W, H) * 0.28;
      const cx = W / 2;
      const cy = H * 0.48;
      const ax = 0.45 + Math.sin(t * 0.35) * 0.12;
      const ay = t;

      ctx.strokeStyle = "rgba(129, 140, 248, 0.12)";
      ctx.lineWidth = 1;
      for (let gz = 8; gz >= -2; gz--) {
        ctx.beginPath();
        for (let gx = -10; gx <= 10; gx++) {
          const p = rotate({ x: gx * 0.22, y: 1.15, z: gz * 0.22 }, 0.9, ay * 0.15);
          const s = fl / (fl + p.z * scale * 0.9);
          const x = cx + p.x * scale * s * 1.6;
          const y = cy + p.y * scale * s + 90;
          if (gx === -10) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      const mapped = pts.map((p) => {
        const r = rotate(p, ax, ay);
        const s = fl / (fl + r.z * scale);
        return { x: cx + r.x * scale * s, y: cy + r.y * scale * s, z: r.z, s };
      });
      mapped.sort((a, b) => a.z - b.z);
      for (const p of mapped) {
        const depth = (p.z + 1) / 2;
        const r = 1.2 + depth * 2.4;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${140 + depth * 80}, ${130 + depth * 70}, 255, ${0.2 + depth * 0.65})`;
        ctx.fill();
      }

      const rings = 3;
      ctx.strokeStyle = "rgba(167, 139, 250, 0.28)";
      for (let i = 0; i < rings; i++) {
        const rr = 70 + i * 38 + Math.sin(t + i) * 6;
        ctx.beginPath();
        ctx.ellipse(cx, cy, rr * 1.15, rr * 0.42, ay * 0.4, 0, Math.PI * 2);
        ctx.stroke();
      }
    };
    draw();
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", vis);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className="pointer-events-none fixed inset-0 h-full w-full"
      style={{ zIndex: 0 }}
      aria-hidden
    />
  );
}
