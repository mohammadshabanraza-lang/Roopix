/* ==========================================================
   ROOPIX shared effects
   - Native CSS scroll reveals are stylesheet-only.
   - Parallax and image clip effects reuse the site's GSAP and
     ScrollTrigger CDN instances; no Lenis instance is created.
   - No 360-degree viewer or product rotation is implemented.
   ========================================================== */
(function () {
  'use strict';

  var gsap = window.gsap;
  var ScrollTrigger = window.ScrollTrigger;
  if (!gsap || !ScrollTrigger) return; // Keep every image and section visible if CDN is unavailable.

  gsap.registerPlugin(ScrollTrigger);

  var contexts = [];
  var isDestroyed = false;

  var CLOSED_CLIPS = {
    up: 'polygon(0% 100%, 42% 100%, 50% 94%, 58% 100%, 100% 100%, 0% 100%)',
    down: 'polygon(0% 0%, 42% 0%, 50% 6%, 58% 0%, 100% 0%, 0% 0%)',
    left: 'polygon(100% 0%, 100% 42%, 94% 50%, 100% 58%, 100% 100%, 100% 0%)',
    right: 'polygon(0% 0%, 0% 42%, 6% 50%, 0% 58%, 0% 100%, 0% 0%)'
  };
  var OPEN_CLIP = 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 100%, 0% 0%)';

  function numberOr(value, fallback) {
    var parsed = parseFloat(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  function addClipReveals() {
    var wrappers = Array.prototype.slice.call(document.querySelectorAll('[data-clip-reveal]'));
    if (!wrappers.length) return;

    var mmRef = null;
    var ctx = gsap.context(function () {
      var mm = gsap.matchMedia();
      mmRef = mm;
      mm.add({
        motion: '(prefers-reduced-motion: no-preference)',
        reduced: '(prefers-reduced-motion: reduce)'
      }, function (media) {
        var timelines = [];
        var triggers = [];

        wrappers.forEach(function (wrapper) {
          var image = wrapper.querySelector('img');
          if (!image) return;

          if (media.conditions.reduced) {
            gsap.set(wrapper, { clearProps: 'clipPath' });
            gsap.set(image, { clearProps: 'transform' });
            return;
          }

          var direction = wrapper.dataset.revealDirection || 'up';
          var closed = CLOSED_CLIPS[direction] || CLOSED_CLIPS.up;
          var duration = numberOr(wrapper.dataset.revealDuration, 1.08);
          var delay = numberOr(wrapper.dataset.revealDelay, 0);
          var once = wrapper.dataset.revealOnce !== 'false';
          var figure = wrapper.closest('figure');
          var caption = figure && figure.querySelector('[data-reveal-caption]');
          var rule = caption && caption.querySelector('[data-reveal-rule]');
          var copies = caption ? Array.prototype.slice.call(caption.querySelectorAll('[data-reveal-copy]')) : [];

          gsap.set(wrapper, { clipPath: closed });
          gsap.set(image, { scale: 1.12, transformOrigin: 'center center' });

          var timeline = gsap.timeline({
            scrollTrigger: {
              trigger: wrapper,
              start: 'top 88%',
              once: once,
              toggleActions: once ? undefined : 'restart none none reset'
            }
          });
          timeline.to(wrapper, {
            clipPath: OPEN_CLIP,
            duration: duration,
            delay: delay,
            ease: 'expo.inOut'
          }, 0);
          timeline.to(image, {
            scale: 1,
            duration: duration + .18,
            delay: delay,
            ease: 'power3.out'
          }, 0);
          if (rule) {
            timeline.fromTo(rule, { scaleX: 0, transformOrigin: 'left center' }, {
              scaleX: 1, duration: .62, ease: 'expo.out'
            }, duration * .72 + delay);
          }
          if (copies.length) {
            timeline.fromTo(copies, { yPercent: 115, opacity: 0 }, {
              yPercent: 0, opacity: 1, duration: .68, stagger: .07, ease: 'expo.out'
            }, duration * .76 + delay);
          }
          timelines.push(timeline);
          if (timeline.scrollTrigger) triggers.push(timeline.scrollTrigger);
        });

        return function cleanupClipMotion() {
          triggers.forEach(function (trigger) { trigger.kill(); });
          timelines.forEach(function (timeline) { timeline.kill(); });
        };
      });
    });
    contexts.push({
      revert: function () {
        if (mmRef) mmRef.revert();
        ctx.revert();
      }
    });
  }

  function addParallaxScenes() {
    var scenes = Array.prototype.slice.call(document.querySelectorAll('[data-parallax]'));
    if (!scenes.length) return;

    var mmRef = null;
    var ctx = gsap.context(function () {
      var mm = gsap.matchMedia();
      mmRef = mm;
      mm.add({
        desktop: '(min-width: 769px) and (prefers-reduced-motion: no-preference)',
        mobile: '(max-width: 768px) and (prefers-reduced-motion: no-preference)',
        pointer: '(hover: hover) and (pointer: fine)',
        reduced: '(prefers-reduced-motion: reduce)'
      }, function (media) {
        var timelines = [];
        var pointerCleanups = [];

        if (media.conditions.reduced) {
          scenes.forEach(function (scene) {
            gsap.set(scene.querySelectorAll('[data-parallax-speed]'), {
              clearProps: 'transform,filter,opacity,visibility'
            });
          });
          return;
        }

        var mobile = !!media.conditions.mobile;
        scenes.forEach(function (scene) {
          var layers = Array.prototype.slice.call(scene.querySelectorAll('[data-parallax-speed]'));
          if (!layers.length) return;

          var distance = numberOr(mobile ? scene.dataset.parallaxMobileDistance : scene.dataset.parallaxDistance, mobile ? 90 : 148);
          var runway = numberOr(mobile ? scene.dataset.parallaxMobileRunway : scene.dataset.parallaxRunway, mobile ? 220 : 430);
          var progressFill = scene.querySelector('[data-parallax-fill]');
          var state = { progress: 0 };
          var timeline = gsap.timeline({
            defaults: { duration: 1, ease: 'none', force3D: true },
            scrollTrigger: {
              trigger: scene,
              start: 'top top',
              end: function () { return '+=' + runway; },
              pin: true,
              scrub: mobile ? .35 : .5,
              anticipatePin: 1,
              invalidateOnRefresh: true
            }
          });

          layers.forEach(function (layer) {
            var speed = numberOr(layer.dataset.parallaxSpeed, 1);
            var target = { y: (1 - speed) * distance };
            var x = parseFloat(layer.dataset.parallaxX);
            var rotation = parseFloat(layer.dataset.parallaxRotate);
            var scale = parseFloat(layer.dataset.parallaxScale);
            var blur = parseFloat(layer.dataset.parallaxBlur);
            var opacity = parseFloat(layer.dataset.parallaxOpacity);
            if (Number.isFinite(x)) target.x = mobile ? x * .58 : x;
            if (Number.isFinite(rotation)) target.rotation = mobile ? rotation * .62 : rotation;
            if (Number.isFinite(scale)) target.scale = scale;
            if (Number.isFinite(blur)) target.filter = 'blur(' + blur + 'px)';
            if (Number.isFinite(opacity)) target.autoAlpha = opacity;
            timeline.to(layer, target, 0);
          });

          if (progressFill) timeline.to(progressFill, { scaleX: 1, transformOrigin: 'left center' }, 0);
          var progressReadout = scene.querySelector('[data-parallax-progress]');
          if (progressReadout) {
            timeline.to(state, {
              progress: 100,
              onUpdate: function () {
                if (progressReadout.isConnected) progressReadout.textContent = String(Math.round(state.progress)).padStart(3, '0');
              }
            }, 0);
          }
          timelines.push(timeline);

          var pointerStrength = numberOr(scene.dataset.parallaxPointer, 0);
          if (!media.conditions.pointer || !(pointerStrength > 0)) return;

          var setters = layers.map(function (layer) {
            var depth = numberOr(layer.dataset.parallaxSpeed, 1) - 1;
            return {
              x: gsap.quickTo(layer, 'xPercent', { duration: 1.05, ease: 'power3' }),
              y: gsap.quickTo(layer, 'yPercent', { duration: 1.05, ease: 'power3' }),
              depth: depth
            };
          });
          function pointerMove(event) {
            var rect = scene.getBoundingClientRect();
            if (!rect.width || !rect.height) return;
            var nx = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            var ny = ((event.clientY - rect.top) / rect.height) * 2 - 1;
            setters.forEach(function (setter) {
              setter.x(-nx * setter.depth * pointerStrength);
              setter.y(-ny * setter.depth * pointerStrength * .6);
            });
          }
          function pointerLeave() {
            setters.forEach(function (setter) { setter.x(0); setter.y(0); });
          }
          scene.addEventListener('pointermove', pointerMove, { passive: true });
          scene.addEventListener('pointerleave', pointerLeave, { passive: true });
          pointerCleanups.push(function () {
            scene.removeEventListener('pointermove', pointerMove);
            scene.removeEventListener('pointerleave', pointerLeave);
          });
        });

        return function cleanupParallaxMotion() {
          timelines.forEach(function (timeline) {
            if (timeline.scrollTrigger) timeline.scrollTrigger.kill();
            timeline.kill();
          });
          pointerCleanups.forEach(function (cleanup) { cleanup(); });
        };
      });
    });
    contexts.push({
      revert: function () {
        if (mmRef) mmRef.revert();
        ctx.revert();
      }
    });
  }

  function refresh() {
    if (!isDestroyed && ScrollTrigger) ScrollTrigger.refresh();
  }

  addClipReveals();
  addParallaxScenes();
  window.addEventListener('load', refresh, { once: true });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(refresh);

  window.ROOPIXEffects = {
    refresh: refresh,
    destroy: function () {
      if (isDestroyed) return;
      isDestroyed = true;
      contexts.slice().reverse().forEach(function (context) { context.revert(); });
      contexts = [];
      window.removeEventListener('load', refresh);
    }
  };
})();
