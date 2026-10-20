/* ROOPIX motion layer — native IntersectionObserver + rAF, no dependencies.
   Complements base.js (which owns .reveal). Runs once per page load. */
(function () {
  'use strict';
  var root = document.documentElement;
  if (window.__roopixMotion || !root.classList.contains('motion-on')) return; // reduced motion or already run
  window.__roopixMotion = true;
  var $$ = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };
  var hasIO = 'IntersectionObserver' in window;
  root.classList.add('mx-ready');

  /* Stagger sibling .reveal blocks; the delay is dropped after the first transition
     so later hover transitions are not delayed. */
  $$('.reveal').forEach(function (el) {
    var i = Array.prototype.filter.call(el.parentElement.children, function (c) { return c.classList.contains('reveal'); }).indexOf(el);
    if (i > 0) {
      el.style.setProperty('--rd', Math.min(i, 4) * 90 + 'ms');
      el.addEventListener('transitionend', function () { el.style.removeProperty('--rd'); }, { once: true });
    }
  });

  /* One observer adds .is-in to clipped portraits and catalogue cards as they enter view. */
  var seen = hasIO && new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('is-in'); seen.unobserve(e.target); }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });
  function watch(el) { if (seen) seen.observe(el); else el.classList.add('is-in'); }

  /* Clipped portraits: a fully clipped element reports no intersection, so observe its
     (unclipped) parent and reveal the portrait when the parent comes into view. */
  var clipIO = hasIO && new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.__mxClip.classList.add('is-in'); clipIO.unobserve(e.target); }
    });
  }, { threshold: 0, rootMargin: '0px 0px -12% 0px' });
  $$('.founder-portrait, .about-media').forEach(function (el) {
    el.classList.add('mx-clip');
    var host = el.parentElement;
    if (clipIO && host) { host.__mxClip = el; clipIO.observe(host); } else el.classList.add('is-in');
  });

  /* Catalogue cards are rendered by exports/script.js; pick up current and future ones. */
  var grid = document.getElementById('catalogueGrid');
  if (grid) {
    var scan = function () { $$('#catalogueGrid .product-card').forEach(function (c) { if (!c.__mx) { c.__mx = 1; watch(c); } }); };
    scan();
    new MutationObserver(scan).observe(grid, { childList: true });
  }

  /* Gentle parallax on large images: desktop with a fine pointer only. */
  var par = $$('.division-card, .b-hero-media, .x-hero-media, .founder-portrait, .about-media');
  var mq = window.matchMedia('(min-width:901px) and (hover:hover) and (pointer:fine)');
  var visible = [], ticking = false;
  par.forEach(function (el) { el.classList.add('mx-par'); });
  function update() {
    ticking = false;
    var vh = window.innerHeight;
    visible.forEach(function (el) {
      var r = el.getBoundingClientRect();
      var p = Math.max(-1, Math.min(1, (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2)));
      el.style.setProperty('--py', (p * r.height * -0.045).toFixed(1) + 'px'); // stays inside the 1.1x image overscan
    });
  }
  function onScroll() { if (mq.matches && !ticking) { ticking = true; requestAnimationFrame(update); } }
  if (hasIO) {
    var pio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var i = visible.indexOf(e.target);
        if (e.isIntersecting && i < 0) visible.push(e.target);
        else if (!e.isIntersecting && i > -1) visible.splice(i, 1);
      });
      onScroll();
    }, { rootMargin: '10% 0px' });
    par.forEach(function (el) { pio.observe(el); });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    mq.addEventListener('change', function () {
      if (mq.matches) onScroll();
      else par.forEach(function (el) { el.style.removeProperty('--py'); });
    });
  }
})();
