import { useEffect, useRef } from "react";

// Flowing golden waves + drifting particles + soft orbs on one canvas.
export default function GoldBackground({ intensity = 1 }) {
  const ref = useRef(null);
  useEffect(() => {
    const cv = ref.current, ctx = cv.getContext("2d");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w, h, raf, t = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => { w = innerWidth; h = innerHeight; cv.width = w * dpr; cv.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
    resize(); addEventListener("resize", resize);
    const n = w < 640 ? 45 : 90;
    const parts = Array.from({ length: n }, () => ({ x: Math.random() * w, y: Math.random() * h, r: Math.random() * 1.6 + 0.4, v: Math.random() * 0.25 + 0.05, a: Math.random() * 0.6 + 0.2, p: Math.random() * 6 }));
    const orbs = [{ x: .2, y: .3, r: 220 }, { x: .8, y: .65, r: 280 }, { x: .5, y: .95, r: 200 }];
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      orbs.forEach((o, i) => {
        const cx = o.x * w + Math.sin(t * .0004 + i) * 40, cy = o.y * h + Math.cos(t * .0005 + i) * 30;
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, o.r);
        g.addColorStop(0, `rgba(212,168,75,${.13 * intensity})`); g.addColorStop(1, "rgba(212,168,75,0)");
        ctx.fillStyle = g; ctx.fillRect(cx - o.r, cy - o.r, o.r * 2, o.r * 2);
      });
      for (let k = 0; k < 5; k++) {
        ctx.beginPath();
        for (let x = 0; x <= w; x += 12) {
          const y = h * (.55 + k * .035) + Math.sin(x * .004 + t * .0007 + k * .7) * (50 + k * 12) + Math.sin(x * .011 - t * .0005) * 18;
          x ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
        }
        ctx.strokeStyle = `rgba(${230 - k * 10},${185 - k * 8},${90},${(.38 - k * .06) * intensity})`;
        ctx.lineWidth = 1.2; ctx.shadowColor = "rgba(243,215,138,.6)"; ctx.shadowBlur = 12; ctx.stroke();
      }
      ctx.shadowBlur = 0;
      parts.forEach((p) => {
        p.y -= p.v; p.x += Math.sin(t * .001 + p.p) * .15;
        if (p.y < -5) { p.y = h + 5; p.x = Math.random() * w; }
        ctx.fillStyle = `rgba(243,215,138,${p.a * (.6 + .4 * Math.sin(t * .003 + p.p)) * intensity})`;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283); ctx.fill();
      });
      t += 16;
      if (!reduce) raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); removeEventListener("resize", resize); };
  }, [intensity]);
  return <canvas ref={ref} className="fixed inset-0 w-full h-full z-0 pointer-events-none" aria-hidden="true" />;
}
