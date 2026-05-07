/**
 * ============================================================
 * JUNAID · PORTFOLIO — MAIN SCRIPT
 * Author : S Mohammed Junaid
 * File   : js/script.js
 *
 * All 15 interactive modules:
 *  01. initLoader           — Loading screen progress bar
 *  02. initCursor           — Custom cursor (dot + ring)
 *  03. initScrollProgress   — Page scroll progress bar
 *  04. initNavScroll        — Sticky frosted-glass nav
 *  05. initParticleCanvas   — Hero particle network (Canvas 2D)
 *  06. initTypewriter       — Cycling role text animation
 *  07. initMarquee          — Tech-stack ticker strip
 *  08. initScrollReveal     — Intersection Observer reveal
 *  09. initSkillTilt        — 3D tilt on skill cards
 *  10. initProjectTilt      — 3D tilt on project cards
 *  11. initMiniCanvas       — Animated canvas in project cards
 *  12. initMagneticButtons  — Elastic mouse-follow on buttons
 *  13. initDragScroll       — Click-drag horizontal scroll
 *  14. initActiveNav        — Active nav link on scroll
 *  15. initCountUp          — Animated number counter
 * ============================================================
 */

'use strict';


/* ============================================================
   01. PAGE LOADER
============================================================ */
function initLoader() {
  const bar    = document.getElementById('lbar');
  const pct    = document.getElementById('lpct');
  const loader = document.getElementById('loader');
  if (!loader) return;

  let progress = 0;

  const interval = setInterval(() => {
    progress += Math.random() * 18;

    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      setTimeout(() => loader.classList.add('gone'), 400);
    }

    bar.style.width   = progress + '%';
    pct.textContent   = Math.floor(progress) + '%';
  }, 80);
}


/* ============================================================
   02. CUSTOM CURSOR
============================================================ */
function initCursor() {
  const dot  = document.getElementById('c-dot');
  const ring = document.getElementById('c-ring');
  if (!dot || !ring) return;

  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.left = (mx - 4) + 'px';
    dot.style.top  = (my - 4) + 'px';
  });

  (function animateRing() {
    rx += (mx - rx - 18) * 0.1;
    ry += (my - ry - 18) * 0.1;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animateRing);
  })();
}


/* ============================================================
   03. SCROLL PROGRESS BAR
============================================================ */
function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const scrolled = document.documentElement.scrollTop;
    const total    = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = 'scaleX(' + (scrolled / total) + ')';
  }, { passive: true });
}


/* ============================================================
   04. NAV — SCROLL STATE
============================================================ */
function initNavScroll() {
  const nav = document.getElementById('main-nav');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });
}


/* ============================================================
   05. HERO PARTICLE CANVAS
============================================================ */
function initParticleCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, particles = [];
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();

  window.addEventListener('resize', () => { resize(); spawnParticles(); });
  document.addEventListener('mousemove', (e) => { mouseX = e.clientX; mouseY = e.clientY; });

  const COLORS = [
    'rgba(0,212,255,',
    'rgba(139,92,246,',
    'rgba(16,185,129,',
  ];

  function Particle() {
    this.reset = function () {
      this.x     = Math.random() * W;
      this.y     = Math.random() * H;
      this.vx    = (Math.random() - 0.5) * 0.4;
      this.vy    = (Math.random() - 0.5) * 0.4;
      this.r     = Math.random() * 1.5 + 0.3;
      this.alpha = Math.random() * 0.5 + 0.1;
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.life  = Math.random() * 300 + 200;
      this.age   = 0;
    };
    this.reset();
    this.age = Math.random() * this.life;
  }

  function spawnParticles() {
    particles = [];
    const count = Math.min(180, Math.floor(W * H / 6000));
    for (let i = 0; i < count; i++) particles.push(new Particle());
  }
  spawnParticles();

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Radial glow at mouse
    const glow = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 400);
    glow.addColorStop(0, 'rgba(0,212,255,0.04)');
    glow.addColorStop(1, 'transparent');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, W, H);

    particles.forEach((p) => {
      p.age++;
      if (p.age > p.life) { p.reset(); return; }

      const t     = p.age / p.life;
      const alpha = p.alpha * (t < 0.1 ? t / 0.1 : t > 0.9 ? (1 - t) / 0.1 : 1);

      // Mouse attraction
      const dx   = mouseX - p.x;
      const dy   = mouseY - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 200) {
        p.vx += (dx / dist) * 0.008;
        p.vy += (dy / dist) * 0.008;
      }

      p.x  += p.vx;
      p.y  += p.vy;
      p.vx *= 0.99;
      p.vy *= 0.99;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color + alpha + ')';
      ctx.fill();
    });

    // Connect nearby particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < 100) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = 'rgba(0,212,255,' + (0.04 * (1 - d / 100)) + ')';
          ctx.lineWidth   = 0.5;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }
  draw();
}


/* ============================================================
   06. TYPEWRITER
============================================================ */
function initTypewriter() {
  const el = document.getElementById('typed-text');
  if (!el) return;

  const phrases = [
    'Full Stack Developer',
    'Backend Engineer',
    'React + Node.js',
    'Problem Solver',
    'ECE Student → SWE',
  ];

  let phraseIndex  = 0;
  let charIndex    = 0;
  let isDeleting   = false;

  // Insert blinking cursor element
  const cursor = document.createElement('span');
  cursor.className = 'typed-cursor';
  el.appendChild(cursor);

  function tick() {
    const current = phrases[phraseIndex];

    if (!isDeleting) {
      charIndex++;
      el.firstChild
        ? (el.firstChild.nodeType === Node.TEXT_NODE
            ? el.firstChild.textContent = current.slice(0, charIndex)
            : el.insertBefore(document.createTextNode(current.slice(0, charIndex)), cursor))
        : el.insertBefore(document.createTextNode(current.slice(0, charIndex)), cursor);

      // Fix: use a simpler approach
      el.childNodes.forEach(node => { if (node.nodeType === Node.TEXT_NODE) node.remove(); });
      el.insertBefore(document.createTextNode(current.slice(0, charIndex)), cursor);

      if (charIndex === current.length) {
        isDeleting = true;
        setTimeout(tick, 1800);
        return;
      }
    } else {
      charIndex--;
      el.childNodes.forEach(node => { if (node.nodeType === Node.TEXT_NODE) node.remove(); });
      el.insertBefore(document.createTextNode(current.slice(0, charIndex)), cursor);

      if (charIndex === 0) {
        isDeleting  = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
      }
    }

    setTimeout(tick, isDeleting ? 50 : 90);
  }

  setTimeout(tick, 1600);
}


/* ============================================================
   07. MARQUEE TICKER
============================================================ */
function initMarquee() {
  const track = document.getElementById('mtrack');
  if (!track) return;

  const items = [
    'React.js','Node.js','Express.js','MongoDB','PostgreSQL',
    'REST APIs','Git','Full Stack Dev','JavaScript','HTML5',
    'CSS3','DSA','OOPs','Cloud','Fintech',
  ];

  // Double the list for seamless loop
  [...items, ...items].forEach((item) => {
    const div = document.createElement('div');
    div.className = 'marquee-item';
    div.innerHTML = '<div class="marquee-dot"></div>' + item;
    track.appendChild(div);
  });
}


/* ============================================================
   08. SCROLL REVEAL
============================================================ */
function initScrollReveal() {
  const targets = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (!targets.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('up');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  targets.forEach((el) => observer.observe(el));
}


/* ============================================================
   09. 3D TILT — SKILL CARDS
============================================================ */
function initSkillTilt() {
  document.querySelectorAll('.skill-card').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x    = (e.clientX - rect.left) / rect.width  - 0.5;
      const y    = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `perspective(600px) rotateX(${-y*14}deg) rotateY(${x*14}deg) scale(1.03)`;
      card.style.boxShadow = `${-x*20}px ${-y*20}px 60px rgba(0,0,0,0.3), 0 0 30px rgba(0,212,255,0.1)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(600px) rotateX(0) rotateY(0) scale(1)';
      card.style.boxShadow = '';
    });
  });
}


/* ============================================================
   10. 3D TILT — PROJECT CARDS
============================================================ */
function initProjectTilt() {
  document.querySelectorAll('.proj-card').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x    = (e.clientX - rect.left) / rect.width  - 0.5;
      const y    = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `perspective(800px) rotateX(${-y*8}deg) rotateY(${x*8}deg) translateY(-8px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)';
    });
  });
}


/* ============================================================
   11. MINI CANVAS — PROJECT CARD HEADERS
============================================================ */
function initMiniCanvas() {
  document.querySelectorAll('.proj-mini-canvas').forEach((cv) => {
    const [r, g, b] = cv.dataset.color.split(',');
    const ctx = cv.getContext('2d');

    cv.width  = cv.parentElement.offsetWidth  || 380;
    cv.height = cv.parentElement.offsetHeight || 220;

    const points = Array.from({ length: 20 }, () => ({
      x:  Math.random() * cv.width,
      y:  Math.random() * cv.height,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
    }));

    function frame() {
      ctx.clearRect(0, 0, cv.width, cv.height);

      points.forEach((p) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > cv.width)  p.vx *= -1;
        if (p.y < 0 || p.y > cv.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},0.4)`;
        ctx.fill();
      });

      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const dx = points[i].x - points[j].x;
          const dy = points[i].y - points[j].y;
          const d  = Math.sqrt(dx * dx + dy * dy);
          if (d < 80) {
            ctx.beginPath();
            ctx.moveTo(points[i].x, points[i].y);
            ctx.lineTo(points[j].x, points[j].y);
            ctx.strokeStyle = `rgba(${r},${g},${b},${0.15 * (1 - d / 80)})`;
            ctx.lineWidth   = 0.8;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(frame);
    }
    frame();
  });
}


/* ============================================================
   12. MAGNETIC BUTTONS
============================================================ */
function initMagneticButtons() {
  document.querySelectorAll('.mag-btn').forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x    = e.clientX - rect.left - rect.width  / 2;
      const y    = e.clientY - rect.top  - rect.height / 2;
      btn.style.transform = `translate(${x * 0.3}px, ${y * 0.5}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0, 0)';
    });
  });
}


/* ============================================================
   13. DRAG-TO-SCROLL — PROJECTS
============================================================ */
function initDragScroll() {
  const track = document.getElementById('proj-track');
  if (!track) return;

  let isDown = false, startX = 0, scrollLeft = 0;

  track.addEventListener('mousedown',  (e) => { isDown = true; startX = e.pageX - track.offsetLeft; scrollLeft = track.scrollLeft; });
  track.addEventListener('mouseleave', ()  => { isDown = false; });
  track.addEventListener('mouseup',    ()  => { isDown = false; });
  track.addEventListener('mousemove',  (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - track.offsetLeft;
    track.scrollLeft = scrollLeft - (x - startX) * 1.5;
  });
}


/* ============================================================
   14. ACTIVE NAV LINK
============================================================ */
function initActiveNav() {
  const links    = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach((s) => { if (window.scrollY >= s.offsetTop - 140) current = s.id; });
    links.forEach((a) => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  }, { passive: true });
}


/* ============================================================
   15. COUNT-UP ANIMATION
============================================================ */
function initCountUp() {
  document.querySelectorAll('[data-count]').forEach((el) => {
    const target = parseInt(el.dataset.count, 10);
    let current  = 0;

    const observer = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) return;
      observer.disconnect();
      const iv = setInterval(() => {
        current++;
        el.textContent = current + '+';
        if (current >= target) { el.textContent = target + '+'; clearInterval(iv); }
      }, 200);
    });

    observer.observe(el);
  });
}


/* ============================================================
   BOOT — Run all modules after DOM is ready
============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initCursor();
  initScrollProgress();
  initNavScroll();
  initParticleCanvas();
  initTypewriter();
  initMarquee();
  initScrollReveal();
  initSkillTilt();
  initProjectTilt();
  initMiniCanvas();
  initMagneticButtons();
  initDragScroll();
  initActiveNav();
  initCountUp();
});
