/* ROOPIX — shared behaviour: mobile menu, scroll reveal, back-to-top,
   floating-button hiding, dialogs. No dependencies. */
(function () {
  'use strict';
  window.__roopixBase = true; // lets the inline head failsafe know shared scripts loaded
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* Mobile menu */
  var toggle = $('#menuToggle');
  var menu = $('#mobileMenu');
  if (toggle && menu) {
    var setMenu = function (open) {
      menu.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      document.body.classList.toggle('no-scroll', open);
    };
    toggle.addEventListener('click', function () { setMenu(!menu.classList.contains('open')); });
    $$('a', menu).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('open')) { setMenu(false); toggle.focus(); }
    });
    window.matchMedia('(min-width: 961px)').addEventListener('change', function (e) { if (e.matches) setMenu(false); });
  }

  /* Scroll reveal (content stays visible if JS or IntersectionObserver is unavailable) */
  var reveals = $$('.reveal');
  if (reveals.length) {
    if (!('IntersectionObserver' in window)) {
      reveals.forEach(function (el) { el.classList.add('is-visible'); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
      reveals.forEach(function (el) { io.observe(el); });
    }
  }

  /* Back to top */
  var toTop = $('#toTop');
  if (toTop) {
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        toTop.classList.toggle('visible', window.scrollY > 600);
        ticking = false;
      });
    }, { passive: true });
    toTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
  }

  /* Hide floating buttons while the footer is on screen */
  var footer = $('.footer');
  var floats = $$('.float-wa, .to-top');
  if (footer && floats.length && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      floats.forEach(function (f) { f.classList.toggle('is-hidden', entries[0].isIntersecting); });
    }).observe(footer);
  }

  /* Dialogs (native <dialog>) */
  $$('[data-dialog-open]').forEach(function (t) {
    t.addEventListener('click', function () {
      var d = document.getElementById(t.getAttribute('data-dialog-open'));
      if (d && typeof d.showModal === 'function') d.showModal();
    });
  });
  $$('dialog').forEach(function (d) {
    d.addEventListener('click', function (e) { if (e.target === d) d.close(); });
    $$('[data-dialog-close]', d).forEach(function (b) { b.addEventListener('click', function () { d.close(); }); });
  });

  /* Footer year */
  $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
