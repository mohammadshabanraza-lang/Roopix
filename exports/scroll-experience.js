/* ==========================================================
   ROOPIX EXPORTS — scroll-controlled bird-feeder image study
   Progressive enhancement: poster remains visible if GSAP,
   ScrollTrigger, Canvas, or any frame is unavailable.
   ========================================================== */
(function () {
  'use strict';

  var story = document.getElementById('feeder-story');
  var stage = document.getElementById('feederStoryStage');
  var canvas = document.getElementById('feederSequenceCanvas');
  if (!story || !stage || !canvas) return;

  var poster = stage.querySelector('.x-story__poster');
  var copies = {
    one: stage.querySelector('[data-story-copy="one"]'),
    two: stage.querySelector('[data-story-copy="two"]'),
    three: stage.querySelector('[data-story-copy="three"]')
  };
  var angleLabel = document.getElementById('feederAngle');
  var progress = document.getElementById('feederProgress');
  var progressFill = document.getElementById('feederProgressFill');
  var context = canvas.getContext('2d', { alpha: false, desynchronized: true });

  var angles = [45, 60, 75, 90, 105, 120, 135, 150, 165, 180];
  var basePath = '../assets/exports/bird-feeder-sequence/';
  var frames = angles.map(function (angle) {
    return { angle: angle, src: basePath + 'birdfeeder-' + String(angle).padStart(3, '0') + '.webp', image: null };
  });

  if (!context || !poster) return;

  var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canvasSupported = !!(window.HTMLCanvasElement && canvas.getContext);
  var gsapReady = !!(window.gsap && window.ScrollTrigger);

  function setCopyFallback() {
    if (copies.one) {
      copies.one.style.opacity = '1';
      copies.one.style.visibility = 'visible';
      copies.one.style.transform = 'none';
    }
    [copies.two, copies.three].forEach(function (item) {
      if (item) {
        item.style.opacity = '0';
        item.style.visibility = 'hidden';
      }
    });
  }

  function setCanvasSize() {
    var rect = stage.getBoundingClientRect();
    var width = Math.max(1, Math.round(rect.width));
    var height = Math.max(1, Math.round(rect.height));
    var pixelRatio = Math.min(window.devicePixelRatio || 1, window.matchMedia('(max-width: 700px)').matches ? 1.25 : 1.65);
    canvas.width = Math.round(width * pixelRatio);
    canvas.height = Math.round(height * pixelRatio);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = 'high';
    return { width: width, height: height };
  }

  var canvasSize = setCanvasSize();

  function paintImage(image, alpha) {
    if (!image || !image.naturalWidth) return;
    var size = canvasSize;
    var mobile = window.matchMedia('(max-width: 700px)').matches;
    var scale = mobile
      ? Math.min(size.width / image.naturalWidth, size.height / image.naturalHeight)
      : Math.max(size.width / image.naturalWidth, size.height / image.naturalHeight);
    var drawWidth = image.naturalWidth * scale;
    var drawHeight = image.naturalHeight * scale;
    var x = (size.width - drawWidth) / 2;
    var y = mobile
      ? Math.max(0, size.height - drawHeight)
      : (size.height - drawHeight) / 2;
    context.globalAlpha = alpha;
    context.drawImage(image, x, y, drawWidth, drawHeight);
  }

  var lastDrawnFrame = -1;
  var requestedFrame = 0;
  var drawPending = false;

  function renderNow(frameValue) {
    if (!frames.length) return;
    var frame = Math.max(0, Math.min(frames.length - 1, frameValue));
    var firstIndex = Math.floor(frame);
    var secondIndex = Math.min(frames.length - 1, firstIndex + 1);
    var blend = frame - firstIndex;
    var firstImage = frames[firstIndex].image;
    var secondImage = frames[secondIndex].image || firstImage;

    context.save();
    context.fillStyle = '#0b0e0d';
    context.fillRect(0, 0, canvasSize.width, canvasSize.height);
    paintImage(firstImage, 1);
    /* A restrained cross-dissolve softens the 15-degree steps between generated views. */
    if (secondIndex !== firstIndex && blend > 0.015 && secondImage) {
      paintImage(secondImage, Math.min(1, blend));
    }
    context.restore();

    var interpolatedAngle = angles[firstIndex] + (angles[secondIndex] - angles[firstIndex]) * blend;
    if (angleLabel) angleLabel.textContent = String(Math.round(interpolatedAngle)).padStart(3, '0') + '°';
    if (progress) {
      var percent = Math.round((frame / (frames.length - 1)) * 100);
      progress.setAttribute('aria-valuenow', String(percent));
    }
    lastDrawnFrame = frameValue;
  }

  function queueDraw(frameValue) {
    requestedFrame = frameValue;
    if (drawPending) return;
    drawPending = true;
    window.requestAnimationFrame(function () {
      drawPending = false;
      if (Math.abs(requestedFrame - lastDrawnFrame) > 0.003) renderNow(requestedFrame);
    });
  }

  function loadFrame(frame) {
    return new Promise(function (resolve) {
      var image = new Image();
      image.decoding = 'async';
      image.loading = 'eager';
      image.onload = function () {
        var decoded = image.decode ? image.decode().catch(function () {}) : Promise.resolve();
        decoded.then(function () {
          frame.image = image;
          resolve(true);
        });
      };
      image.onerror = function () { resolve(false); };
      image.src = frame.src;
      if (image.complete && image.naturalWidth) {
        image.onload();
      }
    });
  }

  function activateReducedMotion() {
    setCopyFallback();
    if (frames[0].image) renderNow(0);
    stage.classList.add('is-enhanced');
    if (progressFill) progressFill.style.transform = 'scaleX(0)';
  }

  function initialiseScrollStory() {
    if (!window.gsap || !window.ScrollTrigger || reducedMotion || !canvasSupported) {
      activateReducedMotion();
      return;
    }

    window.gsap.registerPlugin(window.ScrollTrigger);

    var mm = window.gsap.matchMedia();
    mm.add({
      isMobile: '(max-width: 700px)',
      reduceMotion: '(prefers-reduced-motion: reduce)'
    }, function (mediaContext) {
      var isMobile = mediaContext.conditions.isMobile;
      var prefersReduced = mediaContext.conditions.reduceMotion;

      if (prefersReduced) {
        activateReducedMotion();
        return;
      }

      var playhead = { frame: 0 };
      var scrollDistance = function () {
        return Math.round(window.innerHeight * (isMobile ? 1.45 : 2.35));
      };

      window.gsap.set(copies.one, { autoAlpha: 1, y: 0 });
      window.gsap.set(copies.two, { autoAlpha: 0, y: 24 });
      window.gsap.set(copies.three, { autoAlpha: 0, y: 24 });
      if (progressFill) window.gsap.set(progressFill, { scaleX: 0, transformOrigin: 'left center' });

      var timeline = window.gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: story,
          pin: stage,
          start: 'top top',
          end: function () { return '+=' + scrollDistance(); },
          scrub: 0.65,
          anticipatePin: 1,
          invalidateOnRefresh: true
        }
      });

      timeline.to(playhead, {
        frame: frames.length - 1,
        duration: 1,
        ease: 'none',
        onUpdate: function () { queueDraw(playhead.frame); }
      }, 0);

      timeline.to(copies.one, { autoAlpha: 0, y: -18, duration: 0.13 }, 0.24)
        .to(copies.two, { autoAlpha: 1, y: 0, duration: 0.13 }, 0.29)
        .to(copies.two, { autoAlpha: 0, y: -18, duration: 0.13 }, 0.64)
        .to(copies.three, { autoAlpha: 1, y: 0, duration: 0.13 }, 0.69);

      if (progressFill) {
        timeline.to(progressFill, { scaleX: 1, duration: 1 }, 0);
      }

      function handleResize() {
        canvasSize = setCanvasSize();
        renderNow(lastDrawnFrame < 0 ? 0 : lastDrawnFrame);
        if (window.ScrollTrigger) window.ScrollTrigger.refresh();
      }

      function handleLoad() {
        if (window.ScrollTrigger) window.ScrollTrigger.refresh();
      }

      window.addEventListener('resize', handleResize, { passive: true });
      window.addEventListener('load', handleLoad, { once: true });
      window.ScrollTrigger.refresh();

      return function () {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('load', handleLoad);
        timeline.scrollTrigger && timeline.scrollTrigger.kill();
        timeline.kill();
      };
    });
  }

  /* Show the first supplied view immediately; load the remaining frames in parallel. */
  loadFrame(frames[0]).then(function (ok) {
    if (!ok) return;
    renderNow(0);
    if (!gsapReady || reducedMotion) {
      activateReducedMotion();
      return;
    }

    var remaining = frames.slice(1).map(loadFrame);
    Promise.all(remaining).then(function (results) {
      var loadedCount = results.filter(Boolean).length + 1;
      if (loadedCount < 2) {
        activateReducedMotion();
        return;
      }
      stage.classList.add('is-enhanced');
      renderNow(0);
      initialiseScrollStory();
    });
  });

  /* If the animation library fails to load, the poster remains the visual fallback. */
  window.setTimeout(function () {
    if (!stage.classList.contains('is-enhanced') && (!window.gsap || !window.ScrollTrigger)) {
      setCopyFallback();
    }
  }, 4500);
})();
