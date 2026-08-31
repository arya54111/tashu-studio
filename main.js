/* ═══════════════════════════════════════════════
   TASHU STUDIO — main.js
   All interactions, animations & behaviours
═══════════════════════════════════════════════ */

'use strict';

/* ─── LOADER ─── */
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) {
      loader.classList.add('done');
      setTimeout(() => loader.remove(), 800);
    }
  }, 2800);
});

/* ─── SET MIN DATE ─── */
const dateInput = document.getElementById('f-date');
if (dateInput) {
  const today = new Date().toISOString().split('T')[0];
  dateInput.min = today;
}

/* ─── CUSTOM CURSOR (desktop only) ─── */
if (window.innerWidth > 860) {
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
    if (dot) { dot.style.left = mx + 'px'; dot.style.top = my + 'px'; }
  }, { passive: true });

  function animRing() {
    rx += (mx - rx) * 0.11;
    ry += (my - ry) * 0.11;
    if (ring) { ring.style.left = rx + 'px'; ring.style.top = ry + 'px'; }
    requestAnimationFrame(animRing);
  }
  animRing();

  const hoverTargets = document.querySelectorAll(
    'a, button, .svc-card, .g-item, .pill, .tab-btn, .crnav-btn, .ba-cat-btn'
  );
  hoverTargets.forEach(el => {
    el.addEventListener('mouseenter', () => ring && ring.classList.add('expand'));
    el.addEventListener('mouseleave', () => ring && ring.classList.remove('expand'));
  });
}

/* ─── SCROLL PROGRESS BAR ─── */
const scrollBar = document.getElementById('scroll-bar');
window.addEventListener('scroll', () => {
  const scrolled = document.documentElement.scrollTop;
  const total = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  if (scrollBar) scrollBar.style.width = (scrolled / total * 100) + '%';
}, { passive: true });

/* ─── NAVBAR SCROLL EFFECT ─── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (!navbar) return;
  if (window.scrollY > 60) navbar.classList.add('scrolled');
  else navbar.classList.remove('scrolled');
}, { passive: true });

/* ─── MOBILE NAV ─── */
const hamBtn   = document.getElementById('ham-btn');
const mobNav   = document.getElementById('mob-nav');
const mobClose = document.getElementById('mob-close');

function openMobNav() {
  if (mobNav) mobNav.classList.add('open');
  if (hamBtn) hamBtn.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeMobNav() {
  if (mobNav) mobNav.classList.remove('open');
  if (hamBtn) hamBtn.classList.remove('open');
  document.body.style.overflow = '';
}

if (hamBtn) hamBtn.addEventListener('click', openMobNav);
if (mobClose) mobClose.addEventListener('click', closeMobNav);
if (mobNav) {
  mobNav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMobNav));
}

/* ─── REVEAL ON SCROLL ─── */
const reveals = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
reveals.forEach(el => revealObs.observe(el));

/* ─── SERVICE TABS ─── */
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    tabBtns.forEach(b => b.classList.remove('active'));
    tabContents.forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    const target = document.getElementById('tab-' + btn.dataset.tab);
    if (target) target.classList.add('active');
  });
});

/* ─── 3D CARD TILT ─── */
document.querySelectorAll('[data-tilt]').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top)  / r.height - 0.5;
    card.style.transform = `perspective(1000px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateZ(10px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) translateZ(0px)';
    card.style.transition = 'transform 0.5s ease';
  });
  card.addEventListener('mouseenter', () => {
    card.style.transition = 'transform 0.1s ease, box-shadow 0.3s ease';
  });
});

/* ─── BEFORE / AFTER SLIDER ─── */
(function initBA() {
  const container = document.getElementById('baContainer');
  const afterEl   = document.getElementById('baAfter');
  const handle    = document.getElementById('baHandle');
  if (!container || !afterEl || !handle) return;

  let dragging = false;
  let pos = 50; // percent

  function setPos(pct) {
    pos = Math.max(2, Math.min(98, pct));
    afterEl.style.clipPath = `inset(0 ${100 - pos}% 0 0)`;
    handle.style.left = pos + '%';
  }

  setPos(50);

  function getXPct(e) {
    const r = container.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    return (clientX - r.left) / r.width * 100;
  }

  handle.addEventListener('mousedown',  () => { dragging = true; });
  handle.addEventListener('touchstart', () => { dragging = true; }, { passive: true });
  container.addEventListener('mousedown', () => { dragging = true; });

  document.addEventListener('mousemove', (e) => { if (dragging) setPos(getXPct(e)); }, { passive: true });
  document.addEventListener('touchmove', (e) => { if (dragging) setPos(getXPct(e)); }, { passive: true });
  document.addEventListener('mouseup',  () => { dragging = false; });
  document.addEventListener('touchend', () => { dragging = false; });

  // Category buttons
  const catBtns = document.querySelectorAll('.ba-cat-btn');
  const beforeImg = container.querySelector('.ba-before img');
  const afterImg  = container.querySelector('.ba-after img');

  catBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      catBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      if (beforeImg) beforeImg.src = btn.dataset.before;
      if (afterImg)  afterImg.src  = btn.dataset.after;
      setPos(50);
    });
  });
})();

/* ─── COUNT-UP ANIMATION ─── */
function countUp(el, target, decimals, suffix, duration) {
  let startTime = null;
  function step(ts) {
    if (!startTime) startTime = ts;
    const progress = Math.min((ts - startTime) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    const val = ease * target;
    el.textContent = decimals ? val.toFixed(decimals) : Math.floor(val);
    if (suffix) el.nextElementSibling && (el.nextElementSibling.textContent = suffix);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = decimals ? target.toFixed(decimals) : target;
  }
  requestAnimationFrame(step);
}

// Trigger count-up when stat section visible
const statsObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.querySelectorAll('[data-count]').forEach(el => {
      const val = parseInt(el.dataset.count, 10);
      countUp(el, val, 0, '', 1800);
    });
    statsObs.unobserve(entry.target);
  });
}, { threshold: 0.4 });

const aboutStats = document.querySelector('.about-stats');
if (aboutStats) statsObs.observe(aboutStats);

// Rating count-up
const ratingObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const numEl = document.getElementById('ratingNum');
    const countEl = document.getElementById('reviewCount');
    if (numEl)   countUp(numEl, 4.9, 1, '', 1600);
    if (countEl) countUp(countEl, 1300, 0, '', 2000);
    ratingObs.unobserve(entry.target);
  });
}, { threshold: 0.35 });

const ratingBlock = document.querySelector('.rating-block');
if (ratingBlock) ratingObs.observe(ratingBlock);

/* ─── REVIEWS CAROUSEL ─── */
(function initCarousel() {
  const track   = document.getElementById('reviewTrack');
  const dotsWrap = document.getElementById('carDots');
  const prevBtn = document.getElementById('revPrev');
  const nextBtn = document.getElementById('revNext');
  if (!track) return;

  const cards = track.querySelectorAll('.review-card');
  const CARD_W = 360;
  const GAP    = 24;
  let current  = 0;
  let autoTimer;

  // Build dots
  cards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'c-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Review ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    if (dotsWrap) dotsWrap.appendChild(dot);
  });

  function updateDots() {
    if (!dotsWrap) return;
    dotsWrap.querySelectorAll('.c-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  function goTo(idx) {
    current = Math.max(0, Math.min(idx, cards.length - 1));
    track.style.transform = `translateX(-${current * (CARD_W + GAP)}px)`;
    updateDots();
  }

  function nextSlide() {
    goTo(current >= cards.length - 1 ? 0 : current + 1);
  }

  if (prevBtn) prevBtn.addEventListener('click', () => { goTo(current - 1); resetAuto(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetAuto(); });

  function startAuto() { autoTimer = setInterval(nextSlide, 5000); }
  function resetAuto()  { clearInterval(autoTimer); startAuto(); }
  startAuto();

  // Touch swipe
  let startX = 0;
  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { diff > 0 ? nextSlide() : goTo(current - 1); resetAuto(); }
  });
})();

/* ─── BOOKING PILLS ─── */
document.querySelectorAll('.pill').forEach(pill => {
  pill.addEventListener('click', () => {
    pill.closest('.pill-grid').querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
  });
});

/* ─── MAGNETIC BUTTONS ─── */
if (window.innerWidth > 860) {
  document.querySelectorAll('.mag-btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const r = btn.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width  / 2) * 0.25;
      const y = (e.clientY - r.top  - r.height / 2) * 0.25;
      btn.style.transform = `translate(${x}px, ${y}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
}

/* ─── HERO PARALLAX ─── */
if (window.innerWidth > 860) {
  const heroContent = document.querySelector('.hero-content');
  document.addEventListener('mousemove', (e) => {
    const xP = (e.clientX / window.innerWidth - 0.5);
    const yP = (e.clientY / window.innerHeight - 0.5);
    if (heroContent) heroContent.style.transform = `translate(${xP * -8}px, ${yP * -5}px)`;
  }, { passive: true });
}

/* ─── 3D CANVAS SPHERE ─── */
(function initSphere() {
  const canvas = document.getElementById('sphere-canvas');
  if (!canvas || window.innerWidth <= 860) return;
  const ctx = canvas.getContext('2d');

  let W, H, mx = 0, my = 0, t = 0;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
  }, { passive: true });

  function draw() {
    ctx.clearRect(0, 0, W, H);
    t += 0.012;

    const cx = W * 0.42 + Math.sin(t * 0.35) * 14 + (mx / window.innerWidth - 0.5) * 20;
    const cy = H * 0.46 + Math.cos(t * 0.28) *  9 + (my / window.innerHeight - 0.5) * 15;
    const r  = Math.min(W, H) * 0.21;

    // Outer ambient glow
    const glow = ctx.createRadialGradient(cx, cy, r * 0.2, cx, cy, r * 2);
    glow.addColorStop(0, 'rgba(142,90,131,0.07)');
    glow.addColorStop(1, 'rgba(142,90,131,0)');
    ctx.fillStyle = glow;
    ctx.beginPath(); ctx.arc(cx, cy, r * 2, 0, Math.PI * 2); ctx.fill();

    // Main chrome sphere
    const sg = ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.35, r * 0.04, cx, cy, r);
    sg.addColorStop(0,   'rgba(245,240,235,0.22)');
    sg.addColorStop(0.2, 'rgba(216,167,177,0.14)');
    sg.addColorStop(0.55,'rgba(24,13,31,0.35)');
    sg.addColorStop(1,   'rgba(9,9,11,0.55)');
    ctx.fillStyle = sg;
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();

    // Specular highlight 1
    const hl1 = ctx.createRadialGradient(cx - r*0.38, cy - r*0.40, 0, cx - r*0.38, cy - r*0.40, r * 0.48);
    hl1.addColorStop(0, 'rgba(255,255,255,0.28)');
    hl1.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.clip();
    ctx.fillStyle = hl1; ctx.fillRect(cx - r, cy - r, r * 2, r * 2); ctx.restore();

    // Specular highlight 2 (small, sharp)
    const hl2 = ctx.createRadialGradient(cx - r*0.18, cy - r*0.22, 0, cx - r*0.18, cy - r*0.22, r * 0.12);
    hl2.addColorStop(0, 'rgba(255,255,255,0.45)');
    hl2.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.clip();
    ctx.fillStyle = hl2; ctx.fillRect(cx - r, cy - r, r * 2, r * 2); ctx.restore();

    // Orbiting ring 1
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(t * 0.18 + Math.sin(t * 0.1) * 0.25);
    ctx.scale(1, 0.25);
    ctx.strokeStyle = 'rgba(216,167,177,0.14)';
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(0, 0, r * 1.18, 0, Math.PI * 2); ctx.stroke();
    ctx.restore();

    // Orbiting ring 2
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(-t * 0.12 + 1.2);
    ctx.scale(0.22, 1);
    ctx.strokeStyle = 'rgba(142,90,131,0.10)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(0, 0, r * 1.28, 0, Math.PI * 2); ctx.stroke();
    ctx.restore();

    // Orbiting dot
    const angle = t * 0.55;
    const ox = cx + Math.cos(angle) * r * 1.05;
    const oy = cy + Math.sin(angle) * r * 0.26;
    const dg = ctx.createRadialGradient(ox, oy, 0, ox, oy, 5);
    dg.addColorStop(0, 'rgba(216,167,177,0.75)');
    dg.addColorStop(1, 'rgba(216,167,177,0)');
    ctx.fillStyle = dg;
    ctx.beginPath(); ctx.arc(ox, oy, 5, 0, Math.PI * 2); ctx.fill();

    // Second orbiting dot (opposite)
    const angle2 = t * 0.4 + Math.PI;
    const ox2 = cx + Math.cos(angle2) * r * 1.22;
    const oy2 = cy + Math.sin(angle2) * r * 0.30;
    const dg2 = ctx.createRadialGradient(ox2, oy2, 0, ox2, oy2, 3.5);
    dg2.addColorStop(0, 'rgba(142,90,131,0.6)');
    dg2.addColorStop(1, 'rgba(142,90,131,0)');
    ctx.fillStyle = dg2;
    ctx.beginPath(); ctx.arc(ox2, oy2, 3.5, 0, Math.PI * 2); ctx.fill();

    requestAnimationFrame(draw);
  }
  draw();
})();

/* ─── AMBIENT PARTICLES ─── */
(function initParticles() {
  const canvas = document.createElement('canvas');
  canvas.id = 'particle-canvas';
  canvas.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:0;';
  document.body.insertBefore(canvas, document.body.firstChild);
  const ctx = canvas.getContext('2d');
  let W, H;

  function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  const count = window.innerWidth <= 860 ? 20 : 45;
  const pts = Array.from({ length: count }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    r: Math.random() * 1.4 + 0.3,
    vx: (Math.random() - 0.5) * 0.14,
    vy: (Math.random() - 0.5) * 0.14,
    a: Math.random() * Math.PI * 2,
    spd: 0.003 + Math.random() * 0.004
  }));

  function draw() {
    ctx.clearRect(0, 0, W, H);
    pts.forEach(p => {
      p.a += p.spd;
      const alpha = (Math.sin(p.a) * 0.5 + 0.5) * 0.28 + 0.04;
      ctx.fillStyle = `rgba(142,90,131,${alpha})`;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
    });
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ─── IMAGE ERROR FALLBACK ─── */
document.querySelectorAll('img').forEach(img => {
  img.addEventListener('error', () => {
    // Replace broken images with an elegant placeholder div
    const placeholder = document.createElement('div');
    placeholder.style.cssText = `
      width: 100%; height: 100%;
      background: linear-gradient(135deg, #180D1F 0%, #241126 50%, #180D1F 100%);
      display: flex; align-items: center; justify-content: center;
      position: absolute; inset: 0;
    `;
    const label = document.createElement('span');
    label.textContent = img.alt || 'Tashu Studio';
    label.style.cssText = `
      font-family: 'Cormorant Garamond', serif;
      font-size: 14px; letter-spacing: 0.2em; text-transform: uppercase;
      color: rgba(216,167,177,0.3); text-align: center; padding: 16px;
    `;
    placeholder.appendChild(label);
    if (img.parentElement) img.parentElement.appendChild(placeholder);
    img.style.opacity = '0';
  });
});

/* ─── SMOOTH SECTION TRANSITIONS ─── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth' });
  });
});

console.log('✨ Tashu Studio — Crafted with luxury and care.');
