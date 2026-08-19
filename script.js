(function () {
  'use strict';

  /* ── CURSOR ── */
  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  let ringX = 0, ringY = 0, dotX = 0, dotY = 0;

  window.addEventListener('mousemove', e => {
    dotX = e.clientX; dotY = e.clientY;
    if(dot) {
      dot.style.left = dotX + 'px';
      dot.style.top  = dotY + 'px';
    }
  });

  function animateRing() {
    ringX += (dotX - ringX) * 0.12;
    ringY += (dotY - ringY) * 0.12;
    if(ring) {
      ring.style.left = ringX + 'px';
      ring.style.top  = ringY + 'px';
    }
    requestAnimationFrame(animateRing);
  }
  if(ring) animateRing();

  document.querySelectorAll('a, button, .p-card, .contact-card, .skill-tag, .cred-cell, .pillar, .impact-item').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  /* ── NAVBAR SCROLL ── */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if(navbar) {
      navbar.classList.toggle('scrolled', window.scrollY > 60);
    }
  }, { passive: true });

  /* ── HAMBURGER ── */
  const ham = document.getElementById('hamburger');
  const menu = document.getElementById('mobileMenu');
  if(ham && menu) {
    ham.addEventListener('click', () => {
      ham.classList.toggle('open');
      menu.classList.toggle('open');
    });
    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      ham.classList.remove('open');
      menu.classList.remove('open');
    }));
  }

  /* ── SCROLL REVEAL ── */
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); }});
  }, { threshold: 0.12, rootMargin: '0px 0px -48px 0px' });
  document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

  /* ── ACTIVE NAV ── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  const sectionObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const id = '#' + e.target.id;
        navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === id));
      }
    });
  }, { threshold: 0.45 });
  sections.forEach(s => sectionObs.observe(s));

  /* ── HERO PARALLAX ── */
  const heroPhoto = document.getElementById('heroPhoto');
  if (heroPhoto) {
    document.addEventListener('mousemove', (e) => {
      const x = (window.innerWidth / 2 - e.clientX) / 50;
      const y = (window.innerHeight / 2 - e.clientY) / 50;
      heroPhoto.style.transform = `translate(${x}px, ${y}px) scale(1.06)`;
    }, { passive: true });
  }

  /* ── 3D CARD TILT ── */
  document.querySelectorAll('.p-card, .contact-card, .skill-group').forEach(card => {
    card.addEventListener('mouseenter', () => { card.style.transition = 'box-shadow 0.4s, border-color 0.4s, background 0.4s'; });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
      card.style.transition = 'transform 0.5s var(--ease), box-shadow 0.4s, border-color 0.4s, background 0.4s';
    });
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width - 0.5) * 14;
      const y = ((e.clientY - r.top) / r.height - 0.5) * -14;
      card.style.transform = `perspective(1000px) rotateX(${y}deg) rotateY(${x}deg) scale3d(1.02,1.02,1.02)`;
    });
  });

  /* ── MAGNETIC BUTTONS ── */
  document.querySelectorAll('.btn-gold, .btn-ghost, .nav-cta').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const r = btn.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * 0.28;
      const y = (e.clientY - r.top - r.height / 2) * 0.45;
      btn.style.transform = `translate(${x}px, ${y}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });

  /* ── COUNTER ANIMATION ── */
  function animateCounter(el, target, suffix) {
    let start = 0;
    const duration = 1600;
    const startTime = performance.now();
    function step(now) {
      const t = Math.min((now - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 4);
      const val = Math.round(ease * parseFloat(target));
      el.textContent = val + suffix;
      if (t < 1) requestAnimationFrame(step);
      else el.textContent = target + suffix;
    }
    requestAnimationFrame(step);
  }

  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const raw = el.dataset.count || el.textContent;
      const suffix = raw.includes('+') ? '+' : (raw.includes('x') ? 'x' : '');
      const num = parseFloat(raw);
      animateCounter(el, raw.replace(/[^0-9.]/g,''), suffix);
      counterObs.unobserve(el);
    });
  }, { threshold: 0.6 });
  document.querySelectorAll('[data-count], .impact-num').forEach(el => counterObs.observe(el));

  /* ── SCROLL HINT HIDE ── */
  const scrollHint = document.querySelector('.scroll-hint');
  if (scrollHint) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 80) scrollHint.style.opacity = '0';
    }, { passive: true, once: true });
  }

})();
