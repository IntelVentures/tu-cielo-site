// components/CloudBackground.js
// Scroll-driven clouds — no auto-animation.
// Scroll up OR down → clouds always drift RIGHT to LEFT.
// Physics: momentum + friction (clouds ease to stop naturally).
//
// REALISM TECHNIQUE: stacked radial-gradient ellipses + CSS blur.
// Each "puff" of a cloud is a white radial-gradient oval. Overlapping ovals
// fuse into organic shapes. filter:blur() softens every hard edge between
// them so the result looks like a photographed cumulus cloud, not clip-art.
// ─ Different gradient arrangements = different cloud silhouettes.
// ─ Three depth layers: back (large, faint, slow) → mid → front (crisp, fast).

import { useEffect, useRef } from 'react';
import styles from '../styles/CloudBackground.module.css';

// Each cloud is a unique stack of radial-gradient puffs.
// bg: the CSS background string that defines the cloud silhouette.
// width/height: bounding box in px (used for wrap-around calc).
const CLOUDS = [

  // ── Back layer (slow 0.18–0.22, heavy blur 8–10px, opacity 0.30–0.36)
  {
    id: 0, speed: 0.20, opacity: 0.34, blur: 9,
    startFrac: 0.05, top: '5%', width: 680, height: 210,
    bg: `
      radial-gradient(ellipse 95px 72px  at 12% 68%, white 0%, transparent 78%),
      radial-gradient(ellipse 145px 105px at 30% 50%, white 0%, transparent 78%),
      radial-gradient(ellipse 125px 95px  at 50% 45%, white 0%, transparent 78%),
      radial-gradient(ellipse 60px  55px  at 55% 28%, white 0%, transparent 78%),
      radial-gradient(ellipse 110px 85px  at 69% 52%, white 0%, transparent 78%),
      radial-gradient(ellipse 88px  70px  at 85% 62%, white 0%, transparent 78%),
      radial-gradient(ellipse 240px 50px  at 50% 84%, rgba(255,255,255,0.55) 0%, transparent 75%)
    `,
  },
  {
    id: 1, speed: 0.16, opacity: 0.30, blur: 10,
    startFrac: 0.58, top: '26%', width: 580, height: 195,
    bg: `
      radial-gradient(ellipse 80px  65px  at 10% 70%, white 0%, transparent 78%),
      radial-gradient(ellipse 130px 98px  at 28% 52%, white 0%, transparent 78%),
      radial-gradient(ellipse 155px 115px at 50% 44%, white 0%, transparent 78%),
      radial-gradient(ellipse 75px  65px  at 62% 30%, white 0%, transparent 78%),
      radial-gradient(ellipse 100px 80px  at 72% 55%, white 0%, transparent 78%),
      radial-gradient(ellipse 200px 44px  at 45% 86%, rgba(255,255,255,0.50) 0%, transparent 75%)
    `,
  },
  {
    id: 2, speed: 0.18, opacity: 0.32, blur: 9,
    startFrac: 1.15, top: '56%', width: 620, height: 200,
    bg: `
      radial-gradient(ellipse 105px 80px  at 8%  66%, white 0%, transparent 78%),
      radial-gradient(ellipse 90px  75px  at 22% 72%, white 0%, transparent 78%),
      radial-gradient(ellipse 140px 105px at 40% 50%, white 0%, transparent 78%),
      radial-gradient(ellipse 120px 90px  at 58% 48%, white 0%, transparent 78%),
      radial-gradient(ellipse 95px  78px  at 74% 58%, white 0%, transparent 78%),
      radial-gradient(ellipse 70px  60px  at 87% 65%, white 0%, transparent 78%),
      radial-gradient(ellipse 220px 46px  at 48% 85%, rgba(255,255,255,0.52) 0%, transparent 75%)
    `,
  },

  // ── Mid layer (speed 0.38–0.45, blur 4–6px, opacity 0.46–0.52)
  {
    id: 3, speed: 0.42, opacity: 0.50, blur: 5,
    startFrac: 0.30, top: '13%', width: 460, height: 152,
    bg: `
      radial-gradient(ellipse 70px  55px  at 10% 68%, white 0%, transparent 76%),
      radial-gradient(ellipse 110px 82px  at 28% 50%, white 0%, transparent 76%),
      radial-gradient(ellipse 95px  75px  at 48% 46%, white 0%, transparent 76%),
      radial-gradient(ellipse 50px  48px  at 54% 28%, white 0%, transparent 76%),
      radial-gradient(ellipse 88px  68px  at 68% 55%, white 0%, transparent 76%),
      radial-gradient(ellipse 68px  55px  at 84% 63%, white 0%, transparent 76%),
      radial-gradient(ellipse 180px 38px  at 48% 85%, rgba(255,255,255,0.50) 0%, transparent 74%)
    `,
  },
  {
    id: 4, speed: 0.38, opacity: 0.46, blur: 5,
    startFrac: 0.85, top: '41%', width: 400, height: 140,
    bg: `
      radial-gradient(ellipse 65px  52px  at 8%  66%, white 0%, transparent 76%),
      radial-gradient(ellipse 120px 90px  at 30% 50%, white 0%, transparent 76%),
      radial-gradient(ellipse 100px 80px  at 52% 46%, white 0%, transparent 76%),
      radial-gradient(ellipse 80px  65px  at 70% 54%, white 0%, transparent 76%),
      radial-gradient(ellipse 60px  50px  at 85% 62%, white 0%, transparent 76%),
      radial-gradient(ellipse 160px 36px  at 46% 86%, rgba(255,255,255,0.48) 0%, transparent 74%)
    `,
  },
  {
    id: 5, speed: 0.40, opacity: 0.44, blur: 6,
    startFrac: 1.55, top: '67%', width: 520, height: 168,
    bg: `
      radial-gradient(ellipse 90px  70px  at 9%  65%, white 0%, transparent 76%),
      radial-gradient(ellipse 75px  62px  at 20% 70%, white 0%, transparent 76%),
      radial-gradient(ellipse 135px 100px at 40% 50%, white 0%, transparent 76%),
      radial-gradient(ellipse 105px 82px  at 60% 48%, white 0%, transparent 76%),
      radial-gradient(ellipse 85px  68px  at 77% 57%, white 0%, transparent 76%),
      radial-gradient(ellipse 200px 42px  at 48% 84%, rgba(255,255,255,0.48) 0%, transparent 74%)
    `,
  },

  // ── Front layer (speed 0.70–0.78, blur 2–3px, opacity 0.62–0.68)
  {
    id: 6, speed: 0.75, opacity: 0.65, blur: 3,
    startFrac: 0.18, top: '9%', width: 310, height: 108,
    bg: `
      radial-gradient(ellipse 55px  44px  at 10% 66%, white 0%, transparent 74%),
      radial-gradient(ellipse 88px  66px  at 30% 50%, white 0%, transparent 74%),
      radial-gradient(ellipse 75px  60px  at 52% 46%, white 0%, transparent 74%),
      radial-gradient(ellipse 68px  54px  at 70% 55%, white 0%, transparent 74%),
      radial-gradient(ellipse 52px  44px  at 85% 63%, white 0%, transparent 74%),
      radial-gradient(ellipse 135px 32px  at 48% 86%, rgba(255,255,255,0.46) 0%, transparent 72%)
    `,
  },
  {
    id: 7, speed: 0.70, opacity: 0.60, blur: 2,
    startFrac: 0.72, top: '51%', width: 360, height: 118,
    bg: `
      radial-gradient(ellipse 60px  48px  at 8%  65%, white 0%, transparent 74%),
      radial-gradient(ellipse 95px  72px  at 27% 50%, white 0%, transparent 74%),
      radial-gradient(ellipse 80px  64px  at 48% 46%, white 0%, transparent 74%),
      radial-gradient(ellipse 45px  42px  at 54% 28%, white 0%, transparent 74%),
      radial-gradient(ellipse 72px  58px  at 68% 54%, white 0%, transparent 74%),
      radial-gradient(ellipse 55px  46px  at 82% 62%, white 0%, transparent 74%),
      radial-gradient(ellipse 155px 32px  at 46% 88%, rgba(255,255,255,0.44) 0%, transparent 72%)
    `,
  },
];

export default function CloudBackground() {
  const cloudRefs = useRef([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let vw = window.innerWidth;
    // Initial pixel X positions spread across the viewport
    let positions = CLOUDS.map(c => Math.round(c.startFrac * vw));

    let accumulated = 0;
    let velocity    = 0;
    let lastScrollY = window.scrollY;
    let raf;

    // Apply positions to DOM immediately (no scroll required for initial render)
    const applyPositions = () => {
      cloudRefs.current.forEach((el, i) => {
        if (!el) return;
        const c     = CLOUDS[i];
        const range = vw + c.width + 400;
        const raw   = positions[i] - accumulated * c.speed;
        const x     = ((raw % range) + range) % range - c.width;
        el.style.transform = `translateX(${x}px)`;
      });
    };

    // Set correct initial positions based on actual viewport width
    applyPositions();

    const onScroll = () => {
      // Always positive delta — scroll direction doesn't matter
      const delta = Math.abs(window.scrollY - lastScrollY);
      lastScrollY = window.scrollY;
      // Impulse capped to avoid jitter on fast wheel events
      // 0.07 multiplier + 10 cap = very gentle, barely-there drift
      velocity = Math.min(velocity + delta * 0.07, 10);
    };

    const onResize = () => {
      // Recalculate positions when viewport changes (e.g. orientation change)
      vw        = window.innerWidth;
      accumulated = 0;
      positions = CLOUDS.map(c => Math.round(c.startFrac * vw));
      applyPositions();
    };

    const tick = () => {
      if (velocity > 0.08) {
        velocity    *= 0.93; // friction — eases to a stop
        accumulated += velocity;
        applyPositions();
      }
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className={styles.cloudLayer} aria-hidden="true">
      {CLOUDS.map((c, i) => (
        <div
          key={c.id}
          ref={el => { cloudRefs.current[i] = el; }}
          style={{
            position:   'absolute',
            top:        c.top,
            width:      `${c.width}px`,
            height:     `${c.height}px`,
            opacity:    c.opacity,
            filter:     `blur(${c.blur}px)`,
            background: c.bg,
            transform:  `translateX(-${c.width}px)`,  /* off-screen left; JS sets real position instantly */
            willChange: 'transform',
            pointerEvents: 'none',
          }}
        />
      ))}
    </div>
  );
}
