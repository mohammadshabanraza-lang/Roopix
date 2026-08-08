/* ============================================================
   ROOPIX – Beauty, Redefined
   Premium Luxury Cosmetics Website JS
   ============================================================ */

'use strict';

/* ============================================================
   UTILITY
   ============================================================ */

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ============================================================
   1. LOADER
   ============================================================ */

(function initLoader() {
  const loader = $('#loader');
  if (!loader) return;

  // Minimum display time so the animation can breathe
  const MIN_TIME = 800;
  const start = Date.now();

  function hideLoader() {
    const elapsed = Date.now() - start;
    const remaining = Math.max(0, MIN_TIME - elapsed);

    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.style.overflow = '';

      // Trigger entrance animations after loader hides
      setTimeout(() => {
        $$('.reveal-up, .reveal-left, .reveal-right').forEach(el => {
          if (isInViewport(el)) el.classList.add('visible');
        });
      }, 200);
    }, remaining);
  }

  document.body.style.overflow = 'hidden';

  if (document.readyState === 'complete') {
    hideLoader();
  } else {
    window.addEventListener('load', hideLoader);
  }
})();


/* ============================================================
   2. NAVBAR – scroll effect & active link highlight
   ============================================================ */

(function initNavbar() {
  const navbar = $('#navbar');
  if (!navbar) return;

  let lastScroll = 0;
  let ticking = false;

  function updateNavbar() {
    const scrollY = window.scrollY;

    // Scrolled style
    if (scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Hide navbar on fast scroll down, show on scroll up
    if (scrollY > 300) {
      if (scrollY > lastScroll + 8) {
        navbar.style.transform = 'translateY(-100%)';
      } else if (scrollY < lastScroll - 4) {
        navbar.style.transform = 'translateY(0)';
      }
    } else {
      navbar.style.transform = 'translateY(0)';
    }

    lastScroll = scrollY;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateNavbar);
      ticking = true;
    }
  }, { passive: true });

  // Active nav link on scroll
  const sections = $$('section[id], div[id="hero"]');
  const navLinks = $$('.nav-links a');

  function updateActiveLink() {
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      if (window.scrollY >= top) current = sec.id;
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });
})();


/* ============================================================
   3. HAMBURGER MOBILE MENU
   ============================================================ */

(function initMobileMenu() {
  const hamburger = $('#hamburger');
  const mobileMenu = $('#mobileMenu');
  if (!hamburger || !mobileMenu) return;

  function openMenu() {
    hamburger.classList.add('open');
    mobileMenu.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';

    // Stagger menu items in
    $$('li, .mobile-cta', mobileMenu).forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      setTimeout(() => {
        el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, 80 + i * 60);
    });
  }

  function closeMenu() {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';

    $$('li, .mobile-cta', mobileMenu).forEach(el => {
      el.style.transition = '';
      el.style.opacity = '';
      el.style.transform = '';
    });
  }

  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.contains('open');
    isOpen ? closeMenu() : openMenu();
  });

  // Close on link click
  $$('a', mobileMenu).forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) closeMenu();
  });

  // Close on backdrop click
  mobileMenu.addEventListener('click', e => {
    if (e.target === mobileMenu) closeMenu();
  });
})();


/* ============================================================
   4. SEARCH BAR
   ============================================================ */

(function initSearch() {
  const searchToggle = $('#searchToggle');
  const searchBar = $('#searchBar');
  const searchClose = $('#searchClose');
  const searchInput = searchBar ? $('input', searchBar) : null;
  if (!searchToggle || !searchBar) return;

  function openSearch() {
    searchBar.classList.add('open');
    searchToggle.setAttribute('aria-expanded', 'true');
    setTimeout(() => searchInput && searchInput.focus(), 300);
  }

  function closeSearch() {
    searchBar.classList.remove('open');
    searchToggle.setAttribute('aria-expanded', 'false');
    if (searchInput) searchInput.value = '';
  }

  searchToggle.addEventListener('click', openSearch);
  searchClose && searchClose.addEventListener('click', closeSearch);

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && searchBar.classList.contains('open')) closeSearch();
  });

  // Dismiss on outside click
  document.addEventListener('click', e => {
    if (
      searchBar.classList.contains('open') &&
      !searchBar.contains(e.target) &&
      e.target !== searchToggle
    ) closeSearch();
  });

  // Search hint – shows WhatsApp fallback when user types
  if (searchInput) {
    const hint = document.createElement('div');
    hint.style.cssText = `
      font-size: 0.78rem;
      color: rgba(255,255,255,0.4);
      text-align: center;
      padding: 0.5rem 0;
      letter-spacing: 0.05em;
      cursor: pointer;
      display: none;
      max-width: 700px;
      margin: 0 auto;
      font-family: 'Jost', sans-serif;
      transition: color 0.3s ease;
    `;
    hint.textContent = 'Browse our store or order on WhatsApp for product search.';
    hint.addEventListener('mouseenter', () => hint.style.color = 'rgba(233,30,99,0.8)');
    hint.addEventListener('mouseleave', () => hint.style.color = 'rgba(255,255,255,0.4)');
    hint.addEventListener('click', () => {
      window.open('https://wa.me/919639160626?text=Hi%20ROOPIX%2C%20I%27m%20looking%20for%20a%20product!', '_blank');
    });
    searchBar.appendChild(hint);

    searchInput.addEventListener('keyup', () => {
      hint.style.display = searchInput.value.length >= 2 ? 'block' : 'none';
    });

    // Hide hint when search closes — patch existing closeSearch, no redeclaration
    const _origClose = closeSearch;
    searchClose && searchClose.removeEventListener('click', closeSearch);
    document.removeEventListener('keydown', closeSearch);

    function closeSearchWithHint() {
      _origClose();
      hint.style.display = 'none';
    }

    searchClose && searchClose.addEventListener('click', closeSearchWithHint);
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && searchBar.classList.contains('open')) closeSearchWithHint();
    });
    document.addEventListener('click', e => {
      if (
        searchBar.classList.contains('open') &&
        !searchBar.contains(e.target) &&
        e.target !== searchToggle
      ) closeSearchWithHint();
    });
  }
})();


/* ============================================================
   5. SCROLL REVEAL ANIMATIONS
   ============================================================ */

function isInViewport(el, threshold = 0.15) {
  const rect = el.getBoundingClientRect();
  return rect.top < window.innerHeight * (1 - threshold) + window.innerHeight * threshold
    && rect.bottom > 0;
}

(function initReveal() {
  if (prefersReducedMotion) {
    $$('.reveal-up, .reveal-left, .reveal-right').forEach(el => {
      el.classList.add('visible');
    });
    return;
  }

  const revealEls = $$('.reveal-up, .reveal-left, .reveal-right');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealEls.forEach(el => observer.observe(el));
})();


/* ============================================================
   6. BACK TO TOP BUTTON
   ============================================================ */

(function initBackToTop() {
  const btn = $('#backToTop');
  if (!btn) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        btn.classList.toggle('visible', window.scrollY > 500);
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();


/* ============================================================
   7. TESTIMONIAL CAROUSEL
   ============================================================ */

(function initTestimonials() {
  const track = $('#testimonialsTrack');
  const prevBtn = $('#testiPrev');
  const nextBtn = $('#testiNext');
  const dotsContainer = $('#testiDots');
  if (!track || !prevBtn || !nextBtn || !dotsContainer) return;

  const cards = $$('.testi-card', track);
  const total = cards.length;
  let current = 0;
  let autoTimer = null;
  let isDragging = false;
  let dragStartX = 0;
  let dragDeltaX = 0;

  // Build dots
  cards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'testi-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  });

  function getVisibleCount() {
    const w = window.innerWidth;
    if (w < 600) return 1;
    if (w < 1024) return 2;
    return 3;
  }

  function getCardWidth() {
    const card = cards[0];
    if (!card) return 0;
    const style = getComputedStyle(track);
    const gap = parseFloat(style.gap) || 24;
    return card.offsetWidth + gap;
  }

  function goTo(index) {
    const visible = getVisibleCount();
    const maxIndex = Math.max(0, total - visible);
    current = Math.min(Math.max(index, 0), maxIndex);

    const offset = -(current * getCardWidth());
    track.style.transform = `translateX(${offset}px)`;

    // Update dots
    $$('.testi-dot', dotsContainer).forEach((dot, i) => {
      dot.classList.toggle('active', i === current);
    });

    // Update button states
    prevBtn.style.opacity = current === 0 ? '0.35' : '1';
    nextBtn.style.opacity = current >= maxIndex ? '0.35' : '1';
  }

  function next() {
    const visible = getVisibleCount();
    const maxIndex = Math.max(0, total - visible);
    goTo(current < maxIndex ? current + 1 : 0);
  }

  function prev() {
    const visible = getVisibleCount();
    const maxIndex = Math.max(0, total - visible);
    goTo(current > 0 ? current - 1 : maxIndex);
  }

  prevBtn.addEventListener('click', () => { prev(); resetAuto(); });
  nextBtn.addEventListener('click', () => { next(); resetAuto(); });

  // Auto-play
  function startAuto() {
    if (prefersReducedMotion) return;
    autoTimer = setInterval(next, 4500);
  }
  function stopAuto() { clearInterval(autoTimer); }
  function resetAuto() { stopAuto(); startAuto(); }

  startAuto();

  // Pause on hover
  track.addEventListener('mouseenter', stopAuto);
  track.addEventListener('mouseleave', startAuto);

  // Touch / drag support
  track.addEventListener('mousedown', e => {
    isDragging = true;
    dragStartX = e.clientX;
    track.style.transition = 'none';
    stopAuto();
  });

  document.addEventListener('mousemove', e => {
    if (!isDragging) return;
    dragDeltaX = e.clientX - dragStartX;
  });

  document.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    track.style.transition = '';
    if (dragDeltaX < -60) next();
    else if (dragDeltaX > 60) prev();
    else goTo(current);
    dragDeltaX = 0;
    startAuto();
  });

  // Touch events
  track.addEventListener('touchstart', e => {
    dragStartX = e.touches[0].clientX;
    stopAuto();
  }, { passive: true });

  track.addEventListener('touchend', e => {
    const delta = e.changedTouches[0].clientX - dragStartX;
    if (delta < -60) next();
    else if (delta > 60) prev();
    startAuto();
  }, { passive: true });

  // Recalculate on resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => goTo(0), 200);
  });

  // FIX 18: Keyboard arrow key navigation
  document.addEventListener('keydown', e => {
    const wrap = $('.testimonials-track-wrap');
    if (!wrap) return;
    const rect = wrap.getBoundingClientRect();
    const inView = rect.top < window.innerHeight && rect.bottom > 0;
    if (!inView) return;
    if (e.key === 'ArrowLeft') { prev(); resetAuto(); }
    if (e.key === 'ArrowRight') { next(); resetAuto(); }
  });

  goTo(0);
})();


/* ============================================================
   8. HERO PARTICLE CANVAS
   ============================================================ */

(function initParticles() {
  const canvas = $('#particleCanvas');
  if (!canvas || prefersReducedMotion) return;

  // Defer particle init by 2s — lets critical content paint first, especially on mobile
  setTimeout(function () {
  const ctx = canvas.getContext('2d');
  let particles = [];
  let animFrame;
  let W, H;

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  class Particle {
    constructor() { this.reset(); }

    reset() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.size = Math.random() * 1.4 + 0.3;
      this.speedX = (Math.random() - 0.5) * 0.25;
      this.speedY = (Math.random() - 0.5) * 0.18 - 0.08;
      this.opacity = Math.random() * 0.45 + 0.08;
      this.pulse = Math.random() * Math.PI * 2;
      // Mix of pink and rose-gold dots
      this.color = Math.random() > 0.6
        ? `rgba(233,30,99,${this.opacity})`
        : `rgba(201,149,108,${this.opacity * 0.7})`;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.pulse += 0.015;
      this.opacity = (Math.sin(this.pulse) * 0.18 + 0.22);

      if (this.y < -10 || this.x < -10 || this.x > W + 10) this.reset();
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.restore();
    }
  }

  function initParticleSet() {
    particles = [];
    const count = Math.min(Math.floor((W * H) / 9000), 90);
    for (let i = 0; i < count; i++) particles.push(new Particle());
  }

  function drawConnections() {
    const maxDist = 130;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.07;
          ctx.save();
          ctx.globalAlpha = alpha;
          ctx.strokeStyle = 'rgba(233,30,99,1)';
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
          ctx.restore();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    drawConnections();
    particles.forEach(p => { p.update(); p.draw(); });
    animFrame = requestAnimationFrame(animate);
  }

  // Pause particles when tab hidden
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(animFrame);
    else animate();
  });

  window.addEventListener('resize', () => {
    resize();
    initParticleSet();
  });

  resize();
  initParticleSet();
  animate();

  // Mouse interaction – particles shy away from cursor
  let mouse = { x: -9999, y: -9999 };
  canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  }, { passive: true });
  canvas.addEventListener('mouseleave', () => {
    mouse.x = -9999;
    mouse.y = -9999;
  });

  // Override update to add mouse repulsion
  const origUpdate = Particle.prototype.update;
  Particle.prototype.update = function () {
    origUpdate.call(this);
    const dx = this.x - mouse.x;
    const dy = this.y - mouse.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const repelRadius = 80;
    if (dist < repelRadius && dist > 0) {
      const force = (repelRadius - dist) / repelRadius;
      this.x += (dx / dist) * force * 1.5;
      this.y += (dy / dist) * force * 1.5;
    }
  };
  }, 2000); // end deferred init
})();


/* ============================================================
   9. HERO PARALLAX ON SCROLL
   ============================================================ */

(function initParallax() {
  const heroImg = $('.hero-img');
  if (!heroImg || prefersReducedMotion) return;

  let ticking = false;
  const factor = window.innerWidth < 1024 ? 0.1 : 0.22;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const heroH = document.getElementById('hero')?.offsetHeight || window.innerHeight;
        if (scrollY < heroH) {
          const offset = scrollY * factor;
          heroImg.style.transform = `translateY(${offset}px) scale(1.04)`;
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
})();


/* ============================================================
   9b. ABOUT IMAGE SCROLL PARALLAX (subtle, premium editorial feel)
   ============================================================ */

(function initAboutParallax() {
  const wrap = $('.about-img-wrap');
  const img = wrap ? $('img', wrap) : null;
  if (!wrap || !img || prefersReducedMotion) return;

  let ticking = false;

  function update() {
    const rect = wrap.getBoundingClientRect();
    const vh = window.innerHeight;
    // Only animate while the element is within/near the viewport
    if (rect.bottom > 0 && rect.top < vh) {
      const progress = (vh - rect.top) / (vh + rect.height); // 0 → 1 as it travels through
      const offset = (progress - 0.5) * 40; // ±20px drift
      img.style.transform = `translateY(${offset}px) scale(1.06)`;
    }
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });

  update();
})();


/* ============================================================
   10. SMOOTH ANCHOR SCROLL (accounts for fixed navbar)
   ============================================================ */

(function initSmoothScroll() {
  $$('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      const navH = $('#navbar')?.offsetHeight || 70;
      const top = target.getBoundingClientRect().top + window.scrollY - navH;

      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();


/* ============================================================
   11. HERO CONTENT STAGGER ON LOAD
   ============================================================ */

(function initHeroEntrance() {
  if (prefersReducedMotion) return;

  const heroEls = [
    '.hero-eyebrow',
    '.hero-title',
    '.hero-sub',
    '.hero-trust',
    '.hero-actions',
    '.hero-badge',
    '.hero-scroll-hint',
  ];

  heroEls.forEach((sel, i) => {
    const el = $(sel);
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(28px)';
    el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';

    // Wait for loader to clear (~0.9s), then stagger
    setTimeout(() => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 1000 + i * 130);
  });
})();


/* ============================================================
   12. MARQUEE – pause on hover
   ============================================================ */

(function initMarquee() {
  const track = $('.marquee-track');
  if (!track || prefersReducedMotion) return;

  track.addEventListener('mouseenter', () => {
    track.style.animationPlayState = 'paused';
  });
  track.addEventListener('mouseleave', () => {
    track.style.animationPlayState = 'running';
  });

  // FIX 21: Pause marquee CSS animation when not in viewport — saves CPU on mobile
  const marqueeBar = track.closest('.marquee-bar') || track.parentElement;
  if (marqueeBar) {
    const obs = new IntersectionObserver(entries => {
      track.style.animationPlayState = entries[0].isIntersecting ? 'running' : 'paused';
    }, { threshold: 0 });
    obs.observe(marqueeBar);
  }
})();


/* ============================================================
   TOAST NOTIFICATION SYSTEM
   ============================================================ */

(function initToast() {
  window.roopixToast = function(msg, duration = 2200) {
    let existing = document.getElementById('roopix-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'roopix-toast';
    toast.textContent = msg;
    toast.style.cssText = `
      position: fixed;
      bottom: 6rem;
      left: 50%;
      transform: translateX(-50%) translateY(20px);
      background: rgba(18,18,18,.96);
      border: 1px solid rgba(233,30,99,.3);
      color: #fff;
      font-family: 'Jost', sans-serif;
      font-size: .78rem;
      letter-spacing: .1em;
      padding: .75rem 1.75rem;
      z-index: 9995;
      opacity: 0;
      transition: opacity .35s ease, transform .35s ease;
      pointer-events: none;
      white-space: nowrap;
      backdrop-filter: blur(12px);
    `;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateX(-50%) translateY(0)';
    });

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(10px)';
      setTimeout(() => toast.remove(), 400);
    }, duration);
  };
})();

(function initCategoryRipple() {
  const categoryLinks = {
    'Lips':        'https://wa.me/919639160626?text=Hi%20ROOPIX%2C%20I%27d%20like%20to%20browse%20your%20Lips%20collection!',
    'Face Makeup': 'https://wa.me/919639160626?text=Hi%20ROOPIX%2C%20I%27d%20like%20to%20browse%20your%20Face%20Makeup%20collection!',
    'Eye Makeup':  'https://wa.me/919639160626?text=Hi%20ROOPIX%2C%20I%27d%20like%20to%20browse%20your%20Eye%20Makeup%20collection!',
    'Skincare':    'https://wa.me/919639160626?text=Hi%20ROOPIX%2C%20I%27d%20like%20to%20browse%20your%20Skincare%20collection!',
    'Accessories': 'https://wa.me/919639160626?text=Hi%20ROOPIX%2C%20I%27d%20like%20to%20browse%20your%20Accessories%20collection!',
  };

  $$('.cat-card').forEach(card => {
    card.addEventListener('click', function (e) {
      // Ripple animation
      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position:absolute;
        border-radius:50%;
        background:rgba(233,30,99,0.25);
        width:10px; height:10px;
        top:${e.offsetY - 5}px;
        left:${e.offsetX - 5}px;
        transform:scale(0);
        animation:rippleAnim 0.55s ease-out forwards;
        pointer-events:none;
        z-index:10;
      `;
      this.style.position = 'relative';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);

      // WhatsApp navigation after ripple starts
      const h3 = this.querySelector('h3');
      const categoryName = h3 ? h3.textContent.trim() : '';
      const url = categoryLinks[categoryName] || 'https://api1.vyaparapp.in/store/roopix';
      if (window.roopixToast) window.roopixToast('Opening WhatsApp for ' + (categoryName || 'Store') + '…');
      setTimeout(() => window.open(url, '_blank'), 120);
    });
  });

  // Inject keyframe once
  if (!document.getElementById('ripple-style')) {
    const style = document.createElement('style');
    style.id = 'ripple-style';
    style.textContent = `
      @keyframes rippleAnim {
        to { transform: scale(30); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }
})();


/* ============================================================
   13b. JOURNAL CARDS – click through to WhatsApp with topic
   ============================================================ */

(function initJournalCards() {
  const topics = {
    'The Rise of Hyaluronic Acid': "Hi ROOPIX, I'd love to know more about hyaluronic acid skincare recommendations!",
    'Five Steps to a Flawless Base': "Hi ROOPIX, could you guide me on achieving a flawless makeup base?",
    "This Season's Boldest Lip Trend": "Hi ROOPIX, I'm interested in this season's trending lip colors!",
  };

  $$('.journal-card').forEach(card => {
    card.addEventListener('click', function () {
      const h3 = this.querySelector('h3');
      const title = h3 ? h3.textContent.trim() : '';
      const msg = topics[title] || "Hi ROOPIX, I'd like to know more about your beauty tips!";
      if (window.roopixToast) window.roopixToast('Opening WhatsApp…');
      window.open(`https://wa.me/919639160626?text=${encodeURIComponent(msg)}`, '_blank');
    });
  });
})();


/* ============================================================
   14. WHY-US CARDS – animated counter on scroll
   ============================================================ */

(function initCounters() {
  function animateCount(el, end, suffix = '') {
    if (prefersReducedMotion) { el.textContent = end + suffix; return; }
    const duration = 1600;
    const start = performance.now();
    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(ease * end) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function setupCounter(el, suffixOverride) {
    const raw = el.textContent.trim();
    const num = parseInt(raw.replace(/\D/g, ''), 10);
    if (isNaN(num)) return;

    // Detect suffix: passed override, or trailing non-numeric chars in text
    const detectedSuffix = suffixOverride || raw.replace(/^[\d,]+/, '').trim() || '';
    let counted = false;

    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !counted) {
        counted = true;
        animateCount(el, num, detectedSuffix);
        obs.disconnect();
      }
    }, { threshold: 0.5 });

    obs.observe(el);
  }

  // Hero badge counter
  const badge = $('.badge-number');
  if (badge && !badge.hasAttribute('data-no-count')) setupCounter(badge, '+');

  // Stats strip counters — skip elements marked data-no-count (e.g. 5★, 2026)
  $$('.stat-number').forEach(el => {
    if (!el.hasAttribute('data-no-count')) setupCounter(el);
  });
})();


/* ============================================================
   15. CURSOR GLOW (desktop only – subtle luxury touch)
   ============================================================ */

(function initCursorGlow() {
  // Only on non-touch desktop
  if ('ontouchstart' in window || window.innerWidth < 1024 || prefersReducedMotion) return;

  const glow = document.createElement('div');
  glow.id = 'cursor-glow';
  glow.style.cssText = `
    position: fixed;
    width: 320px;
    height: 320px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(233,30,99,0.07) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
    transform: translate(-50%, -50%);
    transition: opacity 0.4s ease;
    opacity: 0;
  `;
  document.body.appendChild(glow);

  let mouseX = 0, mouseY = 0;
  let glowX = 0, glowY = 0;
  let visible = false;
  let rafId;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!visible) {
      visible = true;
      glow.style.opacity = '1';
    }
  }, { passive: true });

  document.addEventListener('mouseleave', () => {
    visible = false;
    glow.style.opacity = '0';
  });

  function lerp(a, b, t) { return a + (b - a) * t; }

  function updateGlow() {
    glowX = lerp(glowX, mouseX, 0.07);
    glowY = lerp(glowY, mouseY, 0.07);
    glow.style.left = glowX + 'px';
    glow.style.top = glowY + 'px';
    rafId = requestAnimationFrame(updateGlow);
  }

  updateGlow();

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(rafId);
    else updateGlow();
  });
})();


/* ============================================================
   15b. CUSTOM CURSOR RING (desktop only – premium touch)
   ============================================================ */

(function initCustomCursor() {
  // Only on non-touch desktop
  if ('ontouchstart' in window || window.innerWidth < 1024 || prefersReducedMotion) return;

  const ring = document.createElement('div');
  ring.id = 'cursor-ring';
  document.body.appendChild(ring);
  document.body.classList.add('custom-cursor-active');

  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;
  let rafId;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    ring.classList.add('active');
  }, { passive: true });

  document.addEventListener('mouseleave', () => {
    ring.classList.remove('active');
  });

  function lerp(a, b, t) { return a + (b - a) * t; }

  function updateRing() {
    ringX = lerp(ringX, mouseX, 0.18);
    ringY = lerp(ringY, mouseY, 0.18);
    ring.style.left = ringX + 'px';
    ring.style.top = ringY + 'px';
    rafId = requestAnimationFrame(updateRing);
  }
  updateRing();

  const hoverSelector = 'a, button, input, .cat-card, .brand-card, .why-card, .testi-card, .journal-card, .testi-dot';

  document.addEventListener('mouseover', e => {
    if (e.target.closest(hoverSelector)) ring.classList.add('hover');
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(hoverSelector)) ring.classList.remove('hover');
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(rafId);
    else updateRing();
  });
})();


/* ============================================================
   16. BUTTON MAGNETIC HOVER (premium micro-interaction)
   ============================================================ */

(function initMagneticButtons() {
  if ('ontouchstart' in window || prefersReducedMotion) return;

  $$('.btn-primary, .btn-ghost, .btn-wa, .nav-cta').forEach(btn => {
    btn.addEventListener('mousemove', function (e) {
      const rect = this.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) * 0.22;
      const dy = (e.clientY - cy) * 0.22;
      this.style.transform = `translate(${dx}px, ${dy}px)`;
    });

    btn.addEventListener('mouseleave', function () {
      this.style.transform = '';
    });
  });
})();


/* ============================================================
   17. BRAND CARD TILT (subtle 3-D effect on hover)
   ============================================================ */

(function initCardTilt() {
  if ('ontouchstart' in window || prefersReducedMotion) return;

  $$('.why-card, .brand-card, .testi-card').forEach(card => {
    card.addEventListener('mousemove', function (e) {
      const rect = this.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      const rotX = y * -6;
      const rotY = x * 6;
      this.style.transform = `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(4px)`;
      this.style.transition = 'transform 0.1s ease';
    });

    card.addEventListener('mouseleave', function () {
      this.style.transform = '';
      this.style.transition = 'transform 0.5s ease';
    });
  });
})();


/* ============================================================
   18. WHATSAPP FLOAT – smart hide on footer overlap
   ============================================================ */

(function initWhatsappFloat() {
  const wa = $('.whatsapp-float');
  const footer = $('footer');
  if (!wa || !footer) return;

  function checkOverlap() {
    const waRect = wa.getBoundingClientRect();
    const footerRect = footer.getBoundingClientRect();
    const overlaps = waRect.bottom > footerRect.top;
    wa.style.opacity = overlaps ? '0' : '1';
    wa.style.pointerEvents = overlaps ? 'none' : '';
  }

  window.addEventListener('scroll', checkOverlap, { passive: true });
  checkOverlap();

  // Pre-fill WhatsApp message on float button
  const waFloat = $('.whatsapp-float');
  if (waFloat) {
    waFloat.href = 'https://wa.me/919639160626?text=Hi%20ROOPIX%2C%20I%27d%20like%20to%20know%20more%20about%20your%20products!';
  }
})();


/* ============================================================
   19. SECTION PROGRESS INDICATOR (thin pink bar at top)
   ============================================================ */

(function initReadProgress() {
  const bar = document.createElement('div');
  bar.style.cssText = `
    position: fixed;
    top: 0; left: 0;
    height: 2px;
    width: 0%;
    background: linear-gradient(90deg, #C9956C, #E91E63);
    z-index: 9999;
    transition: width 0.1s linear;
    pointer-events: none;
  `;
  document.body.appendChild(bar);

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docH > 0 ? (scrollTop / docH) * 100 : 0;
    bar.style.width = pct + '%';
  }, { passive: true });
})();


/* ============================================================
   20. LAZY IMAGE FADE-IN (graceful image loads)
   ============================================================ */

(function initLazyImages() {
  const images = $$('img[loading="lazy"]');

  images.forEach(img => {
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.6s ease';

    if (img.complete) {
      img.style.opacity = '1';
    } else {
      img.addEventListener('load', () => {
        img.style.opacity = '1';
      });
    }
  });
})();


/* ============================================================
   21. CONTACT CARDS – hover sparkle
   ============================================================ */

(function initContactSparkle() {
  if (prefersReducedMotion) return;

  $$('.contact-card').forEach(card => {
    card.addEventListener('mouseenter', function () {
      for (let i = 0; i < 5; i++) {
        const spark = document.createElement('span');
        const size = Math.random() * 5 + 3;
        spark.style.cssText = `
          position: absolute;
          width: ${size}px;
          height: ${size}px;
          border-radius: 50%;
          background: #E91E63;
          top: ${Math.random() * 100}%;
          left: ${Math.random() * 100}%;
          opacity: 1;
          pointer-events: none;
          z-index: 5;
          animation: sparkle 0.7s ease forwards;
        `;
        this.appendChild(spark);
        setTimeout(() => spark.remove(), 750);
      }
    });
  });

  if (!document.getElementById('sparkle-style')) {
    const style = document.createElement('style');
    style.id = 'sparkle-style';
    style.textContent = `
      @keyframes sparkle {
        0%   { transform: scale(1) translateY(0); opacity: 0.8; }
        100% { transform: scale(0) translateY(-25px); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }
})();


/* ============================================================
   22. KEYBOARD ACCESSIBILITY – skip to content
   ============================================================ */

(function initSkipLink() {
  const skip = document.createElement('a');
  skip.href = '#about';
  skip.textContent = 'Skip to content';
  skip.style.cssText = `
    position: fixed;
    top: -100px;
    left: 1rem;
    background: #E91E63;
    color: #fff;
    padding: 0.75rem 1.5rem;
    font-size: 0.85rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    z-index: 99999;
    transition: top 0.3s ease;
    font-family: 'Jost', sans-serif;
  `;
  skip.addEventListener('focus', () => skip.style.top = '1rem');
  skip.addEventListener('blur', () => skip.style.top = '-100px');
  document.body.prepend(skip);
})();


/* ============================================================
   23. SHIPPING & RETURNS MODAL
   ============================================================ */

(function initShippingModal() {
  const trigger = $('#shippingModalTrigger');
  const modal = $('#shippingModal');
  const closeBtn = $('#shippingModalClose');
  if (!trigger || !modal) return;

  function openModal(e) {
    e.preventDefault();
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    setTimeout(() => modal.querySelector('div').focus && modal.querySelector('div').focus(), 100);
  }

  function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }

  trigger.addEventListener('click', openModal);
  closeBtn && closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', e => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.style.display === 'flex') closeModal();
  });
})();


/* ============================================================
   INIT COMPLETE
   ============================================================ */
console.log('%c✦ ROOPIX – Beauty, Redefined ✦', 'color:#E91E63;font-family:serif;font-size:14px;letter-spacing:0.2em;');
